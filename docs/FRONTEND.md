# Фронтенд

Справка по структуре `src/` для следующих сессий/разработчиков.

## Роуты (`src/app/router.tsx`)

Публичные (без изменений): `/`, `/tours`, `/tours/:slug`, `/about`, `/reviews`, `/faq`,
`/promotions`, `/blog`, `/blog/:slug`, `/contacts`.

Auth:
- `/login`, `/register` — публичные страницы входа/регистрации.
- `/account` (обёрнут в `<RequireAuth />`) — личный кабинет клиента, вложенные роуты:
  `index` (профиль), `requests` (мои заявки), `favorites` (избранное). Layout —
  `pages/account/AccountLayout.tsx`.
- `/admin` (обёрнут в `<RequireAdmin />`) — CRM, вложенные роуты: `leads`, `tours`,
  `reviews`, `faq`, `blog` (`index` редиректит на `leads`). Layout —
  `pages/admin/AdminLayout.tsx`.

`RequireAuth`/`RequireAdmin` (`src/app/auth/RouteGuards.tsx`) — редиректят на `/login`
(сохраняя `state.from` для возврата после логина) или на `/`, если залогинен, но не
админ.

## Auth-стейт

- `src/app/auth/AuthContext.ts` — контекст + типы + хук `useAuth()`. Импортировать хук
  именно отсюда (не из `AuthProvider.tsx`) — файлы разделены из-за правила Fast Refresh
  (`react-refresh/only-export-components`, файл с компонентом не должен экспортировать
  ещё и функции).
- `src/app/auth/AuthProvider.tsx` — сам провайдер, подключён в `app/providers.tsx`
  (внутри `QueryClientProvider` — профиль тянется через `useQuery`).
- `useAuth()` отдаёт `{ session, user, profile, isAdmin, isLoading, signIn, signUp, signOut }`.
- Простой React Context, без Zustand — состояния мало (сессия + профиль), стора на
  клиентские данные в проекте и так нет.

## Структура фич

- `features/auth/` — `model/schema.ts` (Zod: `loginSchema`, `registerSchema`),
  `ui/LoginForm.tsx`, `ui/RegisterForm.tsx`.
- `features/favorites/api/useFavorites.ts` — `useFavoriteIds()` (Set id туров для
  текущего пользователя), `useFavoriteTours()` (полные объекты Tour), `useToggleFavorite()`.
  Используется в `TourCard` (иконка-сердце) и `AccountFavoritesPage`.
- `features/leads/api/useCreateLead.ts` — при отправке заявки подставляет `user_id`
  залогиненного клиента (если есть сессия), иначе `null` — форма остаётся доступной
  без регистрации.

## CRM (`src/pages/admin/`)

Без общего generic-компонента таблицы — у заявок/туров/отзывов/faq/блога разная форма
данных, каждая страница рисует свою `<table>`/список тем же Tailwind-паттерном
(карточка `rounded-3xl border border-ink-100 bg-white`, шапка `text-xs uppercase
tracking-wide text-ink-400`). Формы создания/редактирования — в модалках
(`shared/ui/Dialog.tsx`, простой портал без сторонних библиотек): `TourFormDialog`,
`FaqFormDialog`, `BlogFormDialog`. Отзывы — только модерация (публикация/удаление), без
формы создания.

## Важно про RLS + публичные хуки

`useReviews`/`useBlogPosts` (публичные, `features/reviews`, `features/blog`) явно
фильтруют `is_published = true` на уровне запроса, а не полагаются только на RLS —
потому что залогиненный админ по политике `Admins manage *` видит и неопубликованные
строки, а эти хуки используются и на публичных страницах (админ тоже может их открыть).
