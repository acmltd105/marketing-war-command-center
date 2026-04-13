-- Pipeline Pantry CRM spine: Party → Deal → Outcome (v1 minimal)
-- See docs/spec-pipeline-to-revenue-ralph-a-plus.md

create extension if not exists "pgcrypto";

DO $$
begin
  if not exists (select 1 from pg_type where typname = 'party_type') then
    create type public.party_type as enum ('person', 'org');
  end if;
end
$$;

DO $$
begin
  if not exists (select 1 from pg_type where typname = 'outcome_kind') then
    create type public.outcome_kind as enum (
      'won',
      'refund',
      'referral',
      'chargeback',
      'churn_avoided',
      'rating',
      'other'
    );
  end if;
end
$$;

create table if not exists public.party (
  id uuid primary key default gen_random_uuid(),
  type public.party_type not null,
  display_name text not null,
  primary_email text,
  primary_phone text,
  external_ref text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.deal (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.party (id) on delete restrict,
  stage text not null,
  amount_cents bigint,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.outcome (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deal (id) on delete restrict,
  party_id uuid references public.party (id) on delete restrict,
  kind public.outcome_kind not null,
  economics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  constraint outcome_parent_xor check (
    (deal_id is not null)::int + (party_id is not null)::int = 1
  )
);

create index if not exists party_type_display_name_idx on public.party (type, display_name);
create index if not exists deal_party_id_idx on public.deal (party_id);
create index if not exists deal_stage_idx on public.deal (stage);
create index if not exists outcome_deal_id_idx on public.outcome (deal_id) where deal_id is not null;
create index if not exists outcome_party_id_idx on public.outcome (party_id) where party_id is not null;
create index if not exists outcome_kind_created_at_idx on public.outcome (kind, created_at desc);

comment on table public.party is 'Pipeline Pantry: person or org you can message or bill.';
comment on table public.deal is 'Pipeline object tied to a party.';
comment on table public.outcome is 'Terminal or high-value state with economics JSON.';
