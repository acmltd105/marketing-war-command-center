-- Company workspace (Pipeline Pantry) — optional server-side mirror
-- v1: single row per Supabase project; multi-tenant adds workspace_id later

create table if not exists public.company_workspace (
  id text primary key default 'default',
  display_name text not null default '',
  legal_name text not null default '',
  lifecycle_stage text not null default 'idea',
  jurisdiction text not null default '',
  website_url text not null default '',
  fein_last_four text not null default '',
  press_notes text not null default '',
  milestone_notes text not null default '',
  tasks_done jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.company_workspace is 'Company lifecycle profile and checklist state; browser may mirror in localStorage until RLS and auth land.';
