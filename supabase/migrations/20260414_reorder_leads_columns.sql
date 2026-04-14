begin;

create table public.leads_new (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  document_slug text not null,
  redirect_url text not null,
  source text,
  created_at timestamptz not null default now()
);

insert into public.leads_new (
  id,
  first_name,
  last_name,
  email,
  document_slug,
  redirect_url,
  source,
  created_at
)
select
  id,
  first_name,
  last_name,
  email,
  document_slug,
  redirect_url,
  source,
  created_at
from public.leads;

drop table public.leads;
alter table public.leads_new rename to leads;

create index if not exists idx_leads_document_slug_created_at
  on public.leads (document_slug, created_at desc);

create index if not exists idx_leads_email_lower
  on public.leads ((lower(email)));

alter table public.leads enable row level security;

commit;
