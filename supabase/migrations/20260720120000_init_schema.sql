-- danem tour: начальная схема (каталог туров, заявки, отзывы, faq, блог, рассылка)

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  country text not null,
  description text not null,
  highlights text[] not null default '{}',
  price_from numeric not null,
  currency text not null default 'KZT',
  duration_days integer not null,
  image_url text,
  segment text not null check (segment in ('economy', 'standard', 'premium', 'mice')),
  is_hot boolean not null default false,
  rating numeric(2, 1),
  sort_order integer not null default 0
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  tour_id uuid references public.tours (id) on delete set null,
  tour_title text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  source text not null default 'website'
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  text text not null,
  tour_id uuid references public.tours (id) on delete set null,
  is_published boolean not null default true
);

create table public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  published_at timestamptz not null default now(),
  is_published boolean not null default true
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

-- RLS: включаем на каждой таблице
alter table public.tours enable row level security;
alter table public.leads enable row level security;
alter table public.reviews enable row level security;
alter table public.faq enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Каталог, отзывы, faq, блог — публичное чтение
create policy "Public read tours" on public.tours for select using (true);

create policy "Public read published reviews" on public.reviews for select
  using (is_published = true);

create policy "Public read faq" on public.faq for select using (true);

create policy "Public read published blog posts" on public.blog_posts for select
  using (is_published = true);

-- Заявки и подписка на рассылку — только вставка с anon-ключа, без чтения
-- (менеджер читает заявки через Supabase Studio под своей учёткой, минуя RLS)
create policy "Anyone can submit a lead" on public.leads for insert
  with check (true);

create policy "Anyone can subscribe to newsletter" on public.newsletter_subscribers for insert
  with check (true);

create index leads_created_at_idx on public.leads (created_at desc);
create index tours_segment_idx on public.tours (segment);
create index reviews_tour_id_idx on public.reviews (tour_id);

-- Базовые GRANT'ы: RLS ограничивает строки, но роли anon/authenticated
-- по умолчанию не имеют даже табличных привилегий — выдаём по минимуму.
grant usage on schema public to anon, authenticated;

grant select on public.tours to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant select on public.faq to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
