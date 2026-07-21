-- danem tour: аутентификация, роли, личный кабинет клиента (заявки/избранное), CRM админа

-- ============================================================================
-- 1. profiles — публичный профиль поверх auth.users, с ролью
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Триггер: при регистрации в auth.users автоматически создаём профиль (роль client).
-- full_name/phone читаем из raw_user_meta_data (передаются в signUp({ options: { data } }))
-- — так профиль заполняется сразу, независимо от того, включено ли подтверждение email
-- (пока email не подтверждён, у клиента ещё нет сессии, и написать в profiles с фронта
-- напрямую он не может — RLS это заблокирует).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Хелпер для RLS: проверка роли текущего пользователя без рекурсии в политиках profiles
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users read own profile" on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins read all profiles" on public.profiles for select
  using (public.is_admin());

create policy "Admins update all profiles" on public.profiles for update
  using (public.is_admin());

grant select, update on public.profiles to authenticated;

-- ============================================================================
-- 2. leads — привязка заявки к аккаунту (опционально) + доступ владельцу/админу
-- ============================================================================

alter table public.leads add column user_id uuid references auth.users (id) on delete set null;

create index leads_user_id_idx on public.leads (user_id);

create policy "Users read own leads" on public.leads for select
  using (auth.uid() = user_id);

create policy "Admins manage leads" on public.leads for all
  using (public.is_admin())
  with check (public.is_admin());

grant select, update on public.leads to authenticated;

-- ============================================================================
-- 3. favorites — избранные туры клиента
-- ============================================================================

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tour_id uuid not null references public.tours (id) on delete cascade,
  unique (user_id, tour_id)
);

alter table public.favorites enable row level security;

create policy "Users manage own favorites" on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index favorites_user_id_idx on public.favorites (user_id);

grant select, insert, delete on public.favorites to authenticated;

-- ============================================================================
-- 4. Admin CRUD на контент — tours / reviews / faq / blog_posts
--    (публичное чтение уже есть из init_schema.sql, здесь только права админа)
-- ============================================================================

create policy "Admins manage tours" on public.tours for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage reviews" on public.reviews for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage faq" on public.faq for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage blog posts" on public.blog_posts for all
  using (public.is_admin())
  with check (public.is_admin());

grant insert, update, delete on public.tours to authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant insert, update, delete on public.faq to authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

-- ============================================================================
-- 5. Назначение первого админа
--    Выполнить ПОСЛЕ того, как нужный человек зарегистрируется на сайте:
--
--    update public.profiles set role = 'admin' where email = 'you@example.com';
--
--    Самостоятельно назначить себе admin через фронт нельзя — политика
--    "Users update own profile" явно запрещает менять свою же role.
-- ============================================================================
