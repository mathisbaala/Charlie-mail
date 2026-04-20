# Charlie - Capture Email Dynamique

Une seule landing page dynamique via `/<slug>`.

Flow:
1. L'utilisateur ouvre `/<slug>`
2. La page charge le document depuis Supabase (`documents`)
3. L'utilisateur renseigne prénom et email (nom et métier optionnels)
4. L'API enregistre le lead dans Supabase (`leads`)
5. Redirection immédiate vers `redirect_url`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (database only)

## Structure

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

## Route dynamique

- `/facebook`
- `/instagram`
- `/papers`

Template unique: [`app/[slug]/page.tsx`](app/[slug]/page.tsx)

## Schéma Supabase

Exécuter [`supabase/schema.sql`](supabase/schema.sql) dans Supabase SQL Editor.

Tables:

- `documents`
  - `id` uuid pk
  - `slug` text unique
  - `name` text
  - `redirect_url` text
  - `created_at` timestamptz

- `leads`
  - `id` uuid pk
  - `first_name` text
  - `last_name` text
  - `email` text
  - `job_title` text
  - `document_slug` text
  - `redirect_url` text
  - `source` text (optionnel)
  - `created_at` timestamptz

## Variables d'environnement

Copier `.env.example` vers `.env.local`:

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
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@exemple.com",
  "job_title": "Conseiller en gestion de patrimoine",
  "slug": "facebook",
  "source": "linkedin"
}
```

Comportement:
- valide prénom + email + slug (`nom` et `métier` optionnels)
- vérifie que le slug existe dans `documents`
- valide `redirect_url` du document côté serveur (HTTP/HTTPS)
- insère dans `leads`
- retourne l'URL de redirection en succès

## Ajouter un nouveau document (sans code)

Ajouter uniquement une ligne dans Supabase:

```sql
insert into public.documents (slug, name, redirect_url)
values ('guide', 'Guide', 'https://notion.so/votre-guide');
```

La landing fonctionne ensuite directement sur:

- `https://votre-domaine.com/guide`

## Run

```bash
npm install
npm run dev
```
