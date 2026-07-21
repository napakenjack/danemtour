# danem tour — сайт турагентства

Vite + React 19 + TypeScript + Tailwind CSS v4 + Supabase. MVP на русском языке.

## Стек

- **Frontend:** React 19, React Router, TanStack Query, React Hook Form + Zod, Tailwind CSS v4, motion (framer-motion), lucide-react.
- **Backend:** Supabase (Postgres + RLS, без кастомного бэкенда) + одна Edge Function для email-уведомлений.
- **Деплой:** Cloudflare Pages, автодеплой из GitHub (`main`).

## Локальный запуск

```bash
npm install
cp .env.example .env   # заполнить своими значениями (см. ниже)
npm run dev
```

Дальше:
- `npm run build` — прод-сборка (проверяется typecheck + vite build).
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — только typecheck.

## 1. Supabase

### Вариант А — быстрый (через Dashboard, без CLI)

1. Создать проект на [supabase.com](https://supabase.com) (регион ближе к Алматы — Singapore).
2. В **SQL Editor** выполнить по порядку файлы из `supabase/migrations/`:
   - `20260720120000_init_schema.sql` — таблицы и RLS.
   - `20260720120005_seed_content.sql` — туры-заглушки, отзывы, FAQ, статьи блога (замените на реальные данные, когда клиент их пришлёт).
3. **Settings → API** → скопировать `Project URL` и `anon public` ключ в `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

### Вариант Б — через Supabase CLI (миграции воспроизводимы из репозитория)

```bash
npx supabase login
npx supabase link --project-ref <ваш-project-ref>
npx supabase db push          # применит все миграции из supabase/migrations
npx supabase gen types typescript --project-id <ваш-project-ref> > src/shared/types/database.types.ts
```

`src/shared/types/database.types.ts` сейчас написан вручную по схеме миграций — после первого `gen types` замените его сгенерированным (он будет идентичен по структуре).

### Локальная разработка с Docker (опционально)

```bash
npx supabase start   # поднимет Postgres/Studio локально, применит миграции
```

Studio будет на `http://127.0.0.1:54323`, URL и anon key для `.env` покажет команда `npx supabase status`.

## 2. Email-уведомления о заявках (Resend + Edge Function)

Заявки с сайта всегда сохраняются в таблицу `leads` — это основной канал. Письмо на
`danemtour@gmail.com` — дублирующее уведомление через Database Webhook + Edge Function.

1. Зарегистрироваться на [resend.com](https://resend.com) (бесплатный тариф достаточен), получить API-ключ.
2. Задеплоить функцию:
   ```bash
   npx supabase functions deploy notify-lead --project-ref <ваш-project-ref>
   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx --project-ref <ваш-project-ref>
   ```
3. В Supabase Dashboard → **Database → Webhooks** → Create a new hook:
   - Table: `leads`, Events: `Insert`.
   - Type: `Supabase Edge Functions` → выбрать `notify-lead`.
   - Добавить заголовок `Authorization: Bearer <anon key>` (функция по умолчанию проверяет JWT).
4. Проверить: оставить тестовую заявку на сайте → письмо должно прийти на `danemtour@gmail.com`.

Пока используется тестовый отправитель `onboarding@resend.dev` — доставляемость ограничена.
Для продакшена стоит подключить домен клиента в Resend (когда появится домен, см. ниже) и
поменять `LEAD_FROM_EMAIL` секретом.

## 3. Деплой: GitHub → Cloudflare Pages (автодеплой)

Репозиторий уже подключён: `git@github.com:napakenjack/danemtour.git`, ветка `main` — прод.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Выбрать репозиторий `danemtour`, ветку `main`.
3. Build settings: framework preset **Vite**, build command `npm run build`, output directory `dist`.
4. **Settings → Environment variables** — добавить для Production и Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. После этого каждый `git push` в `main` — новый прод-деплой, каждый PR — preview-ссылка.

Кастомный домен (когда клиент его купит): Pages → **Custom domains** → добавить домен.

## 4. Фото сайта — как называть файлы

Дизайн сайта использует фото-плейсхолдеры (сейчас — сгенерированные картинки с подписью прямо
на изображении, лежат в `public/images/`). Чтобы подставить реальные фото, положите файл
**с точно таким же именем** в `public/images/` — код менять не нужно, картинка подхватится сама.

| Имя файла | Размер | Где на сайте |
|---|---|---|
| `hero-cover-1.png`, `hero-cover-2.png`, `hero-cover-3.png`, ... | 1920×1280 | Главная страница — карусель фото на фоне первого экрана. Нумерация подряд с 1, без пропусков — можно добавлять сколько угодно фото, просто продолжая номер. Если ни одного нет, используется `hero-cover.png` (одна статичная картинка). |
| `journey-cover.jpg` | 1000×1250 | Главная — блок «Всё начинается с вас» |
| `experience-cover.jpg` | 1600×900 | Главная — блок «Впечатления, ради которых стоит лететь» |
| `faq-cover.jpg` | 1000×1250 | Главная — блок вопросов-ответов |
| `cta-cover-1.jpg`, `cta-cover-2.jpg` | 700×900 | Главная — финальный блок с формой заявки |

Полное описание (что именно снять/подобрать для каждого файла) — в
[`docs/IMAGES.md`](docs/IMAGES.md). Фото туров и блога — отдельный механизм, через Supabase
(`tours.image_url`, `blog_posts.cover_image_url`), см. там же.

## Документация для разработчиков

В папке [`docs/`](docs/) — техническая документация для следующих сессий/разработчиков:

- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — журнал изменений по сессиям (что и почему сделано).
  Обновляйте новой записью сверху при каждой значимой сессии работы над проектом.
- [`docs/DESIGN.md`](docs/DESIGN.md) — дизайн-система: токены, компоненты, паттерны секций.
- [`docs/IMAGES.md`](docs/IMAGES.md) — полный список фото-плейсхолдеров с описанием.

## Что уже сделано (MVP)

- Разделы: Главная, Каталог туров, Карточка тура, О компании, Отзывы, FAQ, Акции, Блог, Контакты.
- Форма заявки (сохраняется в Supabase, дублируется письмом через Resend).
- Подписка на рассылку (таблица `newsletter_subscribers`).
- Кнопки WhatsApp/Instagram, плавающая кнопка WhatsApp.
- 7 туров-заглушек (Турция, ОАЭ, Египет, Вьетнам, Сингапур, Сейшелы, Европа) — фото со стоков Unsplash.

## Что осталось (сознательно вне MVP, см. договорённости с клиентом)

- **Онлайн-оплата (Kaspi Pay)** — отложена до получения API от Kaspi.
- **Цифры статистики на главной** (блок «Как мы держим доверие клиентов», компонент
  `src/pages/home/Stats.tsx`) — сейчас правдоподобные, но не подтверждённые клиентом значения
  (`2 500+` туристов, `98%`, рейтинг `4.9`). Согласовать реальные цифры перед продакшен-деплоем.
- **Реальные логотип и фото** — сейчас текстовый логотип-плейсхолдер и сгенерированные
  фото-заглушки. Логотип, favicon и OG-картинка для превью в WhatsApp/соцсетях — тоже файлом в
  `public/images/` (`public/` для favicon), код менять не нужно, см.
  [`docs/IMAGES.md`](docs/IMAGES.md). Статичные фото интерфейса — положить файлы в `public/images/`
  под именами из [`docs/IMAGES.md`](docs/IMAGES.md). Фото туров/блога — через
  `image_url`/`cover_image_url` в таблицах `tours`/`blog_posts` (Supabase).
- **Мультиязычность (каз/англ)** — сайт сейчас только на русском, структура позволяет добавить
  i18n позже без переделки компонентов.
- **Интеграция с Tourvisor** — туры сейчас вручную в таблице `tours`, синхронизацию с Tourvisor
  API нужно проектировать отдельно (скорее всего — через Edge Function по расписанию).
- **CRM** — заявки сейчас в Supabase + email, подключение amoCRM/Bitrix24 и т.п. — когда клиент
  определится с системой.
- Реальный адрес офиса, часы работы — уточнить у клиента и добавить в `ContactsPage.tsx`.
