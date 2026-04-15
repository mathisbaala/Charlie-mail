alter table public.leads
  add column if not exists job_title text;
