# Charlie - Simple Dynamic Email Capture

Single landing template with dynamic slug routing.

Flow:
1. User opens `/<slug>`
2. Page fetches document from Supabase (`documents` table)
3. User enters email
4. API saves lead in Supabase (`leads` table)
5. User is redirected to `redirect_url`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (database only)

## File structure

```txt
.
├── app
│   ├── [slug]/page.tsx
│   ├── api/capture/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── lead-capture-form.tsx
├── lib
│   ├── config/branding.ts
│   ├── documents.ts
│   └── supabase/admin.ts
├── supabase
│   └── schema.sql
├── .env.example
└── README.md
```

## Dynamic route

- `/facebook`
- `/instagram`
- `/papers`

All use the same template: [`app/[slug]/page.tsx`](app/[slug]/page.tsx)

## Supabase schema

Run [`supabase/schema.sql`](supabase/schema.sql) in Supabase SQL Editor.

Tables:

- `documents`
  - `id` uuid pk
  - `slug` text unique
  - `name` text
  - `redirect_url` text
  - `created_at` timestamptz

- `leads`
  - `id` uuid pk
  - `email` text
  - `document_slug` text
  - `redirect_url` text
  - `source` text (optional)
  - `created_at` timestamptz

## Environment variables

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_OWNER_NAME`
- `NEXT_PUBLIC_OWNER_PHOTO_URL`
- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_BRAND_LOGO_URL`
- `NEXT_PUBLIC_SITE_URL`

## API route

`POST /api/capture`

Body:

```json
{
  "email": "user@example.com",
  "slug": "facebook",
  "redirect_url": "https://notion.so/...",
  "source": "linkedin"
}
```

Behavior:
- validates email + slug
- verifies slug exists in `documents`
- verifies redirect URL matches slug
- inserts into `leads`
- returns redirect URL on success

## Add a new document (no code change)

Only add a row in Supabase:

```sql
insert into public.documents (slug, name, redirect_url)
values ('guide', 'Guide', 'https://notion.so/your-guide-link');
```

Then your landing works instantly at:

- `https://your-domain.com/guide`

## Run

```bash
npm install
npm run dev
```
