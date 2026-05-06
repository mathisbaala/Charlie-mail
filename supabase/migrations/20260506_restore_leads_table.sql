begin;

create extension if not exists pgcrypto;

drop table if exists public.leads_new;

create table public.leads_new (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  job_title text,
  document_slug text not null,
  redirect_url text not null,
  source text,
  created_at timestamptz not null default now()
);

do $$
declare
  has_leads boolean := to_regclass('public.leads') is not null;
  has_newsletter boolean := to_regclass('public.newsletter_subscribers') is not null;
begin
  if has_leads then
    insert into public.leads_new (
      id,
      first_name,
      last_name,
      email,
      job_title,
      document_slug,
      redirect_url,
      source,
      created_at
    )
    select
      id,
      first_name,
      last_name,
      lower(email),
      job_title,
      document_slug,
      redirect_url,
      source,
      coalesce(created_at, now())
    from public.leads
    where email is not null
      and document_slug is not null
      and redirect_url is not null;
  end if;

  if has_newsletter and not exists (select 1 from public.leads_new) then
    insert into public.leads_new (
      first_name,
      last_name,
      email,
      job_title,
      document_slug,
      redirect_url,
      source,
      created_at
    )
    select
      newsletter_first_name,
      last_name,
      lower(newsletter_email),
      job_title,
      coalesce(document_slug, 'newsletter'),
      coalesce(redirect_url, 'https://charlie.app/newsletter'),
      coalesce(source, 'newsletter'),
      coalesce(created_at, inserted_at, now())
    from public.newsletter_subscribers
    where newsletter_email is not null;
  end if;
end
$$;

drop table if exists public.leads;
alter table public.leads_new rename to leads;

create index if not exists idx_leads_document_slug_created_at
  on public.leads (document_slug, created_at desc);

create index if not exists idx_leads_email_lower
  on public.leads ((lower(email)));

alter table public.leads enable row level security;

commit;
