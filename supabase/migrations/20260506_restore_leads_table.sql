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
  leads_row_count bigint := 0;
  should_copy_from_leads boolean := false;
  should_copy_from_newsletter boolean := false;
  has_newsletter boolean := to_regclass('public.newsletter_subscribers') is not null;
  expr_first_name text;
  expr_last_name text;
  expr_email text;
  expr_job_title text;
  expr_document_slug text;
  expr_redirect_url text;
  expr_source text;
  expr_created_at text;
  expr_id text;
  where_email text;
  where_document_slug text;
  where_redirect_url text;
begin
  if has_leads then
    execute 'select count(*) from public.leads' into leads_row_count;
  end if;

  should_copy_from_leads := has_leads and leads_row_count > 0;
  should_copy_from_newsletter := (not should_copy_from_leads) and has_newsletter;

  if should_copy_from_leads then
    expr_first_name := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'first_name'
    ) then 'first_name::text' else 'NULL::text' end;

    expr_last_name := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'last_name'
    ) then 'last_name::text' else 'NULL::text' end;

    expr_email := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'email'
    ) then 'email::text' else 'NULL::text' end;

    expr_job_title := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'job_title'
    ) then 'job_title::text' else 'NULL::text' end;

    expr_document_slug := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'document_slug'
    ) then 'document_slug::text' else 'NULL::text' end;

    expr_redirect_url := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'redirect_url'
    ) then 'redirect_url::text' else 'NULL::text' end;

    expr_source := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'source'
    ) then 'source::text' else 'NULL::text' end;

    expr_created_at := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'created_at'
    ) then 'coalesce(created_at::timestamptz, now())' else 'now()' end;

    expr_id := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'id'
    ) then 'id::uuid' else 'gen_random_uuid()' end;

    where_email := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'email'
    ) then 'email is not null' else 'false' end;

    where_document_slug := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'document_slug'
    ) then 'document_slug is not null' else 'false' end;

    where_redirect_url := case when exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'redirect_url'
    ) then 'redirect_url is not null' else 'false' end;

    execute format(
      'insert into public.leads_new (
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
        %s,
        %s,
        %s,
        %s,
        %s,
        %s,
        %s,
        %s,
        %s
      from public.leads
      where %s and %s and %s',
      expr_id,
      expr_first_name,
      expr_last_name,
      expr_email,
      expr_job_title,
      expr_document_slug,
      expr_redirect_url,
      expr_source,
      expr_created_at,
      where_email,
      where_document_slug,
      where_redirect_url
    );
  end if;

  if should_copy_from_newsletter then
    select
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['first_name', 'firstname', 'given_name', 'name'])
         order by array_position(array['first_name', 'firstname', 'given_name', 'name']::text[], c.column_name)
         limit 1),
        'NULL::text'
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['last_name', 'lastname', 'family_name', 'surname'])
         order by array_position(array['last_name', 'lastname', 'family_name', 'surname']::text[], c.column_name)
         limit 1),
        'NULL::text'
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['email', 'email_address', 'mail'])
         order by array_position(array['email', 'email_address', 'mail']::text[], c.column_name)
         limit 1),
        'NULL::text'
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['job_title', 'job', 'title', 'profession'])
         order by array_position(array['job_title', 'job', 'title', 'profession']::text[], c.column_name)
         limit 1),
        'NULL::text'
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['document_slug', 'slug', 'campaign_slug'])
         order by array_position(array['document_slug', 'slug', 'campaign_slug']::text[], c.column_name)
         limit 1),
        '''newsletter'''
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['redirect_url', 'redirect', 'target_url', 'url'])
         order by array_position(array['redirect_url', 'redirect', 'target_url', 'url']::text[], c.column_name)
         limit 1),
        '''https://charlie.app/newsletter'''
      ),
      coalesce(
        (select quote_ident(c.column_name) || '::text'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['source', 'utm_source', 'channel', 'origin'])
         order by array_position(array['source', 'utm_source', 'channel', 'origin']::text[], c.column_name)
         limit 1),
        '''newsletter'''
      ),
      coalesce(
        (select 'coalesce(' || quote_ident(c.column_name) || '::timestamptz, now())'
         from information_schema.columns c
         where c.table_schema = 'public'
           and c.table_name = 'newsletter_subscribers'
           and c.column_name = any(array['created_at', 'createdon', 'subscribed_at', 'inserted_at'])
         order by array_position(array['created_at', 'createdon', 'subscribed_at', 'inserted_at']::text[], c.column_name)
         limit 1),
        'now()'
      )
    into
      expr_first_name,
      expr_last_name,
      expr_email,
      expr_job_title,
      expr_document_slug,
      expr_redirect_url,
      expr_source,
      expr_created_at;

    where_email := case when expr_email = 'NULL::text' then 'false' else format('%s is not null', expr_email) end;
    where_document_slug := case when expr_document_slug = '''newsletter''' then 'true' else format('%s is not null', expr_document_slug) end;
    where_redirect_url := case when expr_redirect_url = '''https://charlie.app/newsletter''' then 'true' else format('%s is not null', expr_redirect_url) end;

    execute format(
      'insert into public.leads_new (
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
        %s,
        %s,
        lower(%s),
        %s,
        %s,
        %s,
        %s,
        %s
      from public.newsletter_subscribers
      where %s and %s and %s',
      expr_first_name,
      expr_last_name,
      expr_email,
      expr_job_title,
      expr_document_slug,
      expr_redirect_url,
      expr_source,
      expr_created_at,
      where_email,
      where_document_slug,
      where_redirect_url
    );
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
