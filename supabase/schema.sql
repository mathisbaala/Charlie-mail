create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  redirect_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  document_slug text not null,
  redirect_url text not null,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_slug
  on public.documents (slug);

create index if not exists idx_leads_document_slug_created_at
  on public.leads (document_slug, created_at desc);

create index if not exists idx_leads_email_lower
  on public.leads ((lower(email)));

alter table public.documents enable row level security;
alter table public.leads enable row level security;

-- Server-side writes/reads use SUPABASE_SERVICE_ROLE_KEY from Next.js API/server.
-- No anon policies needed for this implementation.

insert into public.documents (slug, name, redirect_url)
values
  ('facebook', 'Facebook Guide', 'https://notion.so/facebook-guide'),
  ('instagram', 'Instagram Guide', 'https://notion.so/instagram-guide'),
  ('papers', 'Papers', 'https://notion.so/papers')
on conflict (slug) do nothing;
