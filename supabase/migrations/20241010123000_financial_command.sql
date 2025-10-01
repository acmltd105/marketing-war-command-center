-- Financial command center tables for revenue & expense intelligence
create table if not exists public.financial_revenue_metrics (
  id text primary key,
  label text not null,
  amount numeric not null,
  delta numeric default 0,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
  target numeric,
  category text not null default 'headline',
  active boolean not null default true,
  updated_at timestamp with time zone default now()
);

create table if not exists public.financial_revenue_projections (
  id uuid primary key default gen_random_uuid(),
  quarter text not null,
  forecast numeric not null,
  variance numeric default 0,
  created_at timestamp with time zone default now()
);

create unique index if not exists financial_revenue_projections_quarter_key on public.financial_revenue_projections (quarter);

create table if not exists public.financial_expense_metrics (
  id text primary key,
  label text not null,
  amount numeric,
  delta numeric,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
  category text not null default 'headline',
  runway_burn numeric,
  runway_months numeric,
  next_milestone text,
  severity text default 'info' check (severity in ('info', 'warning', 'critical')),
  message text,
  active boolean not null default true,
  updated_at timestamp with time zone default now()
);

comment on table public.financial_revenue_metrics is 'Live revenue KPIs powering the financial command tab.';
comment on table public.financial_revenue_projections is 'Forward-looking revenue projections used in the forecast grid.';
comment on table public.financial_expense_metrics is 'Expense, runway, and alert telemetry for the financial command experience.';

-- Seed defaults for demo environments
insert into public.financial_revenue_metrics (id, label, amount, delta, trend, target, category)
values
  ('arr', 'ARR', 2400000, 12.4, 'up', 3000000, 'headline'),
  ('net-retention', 'Net Revenue Retention', 134, 4.1, 'up', 140, 'headline'),
  ('gross-margin', 'Gross Margin', 78, 1.2, 'up', 80, 'headline'),
  ('pipeline', 'Pipeline Coverage', 3.4, -0.3, 'down', 4, 'pipeline'),
  ('avg-deal', 'Avg Deal Size', 58000, 2.6, 'up', null, 'pipeline'),
  ('sales-cycle', 'Sales Cycle', 34, -1.7, 'down', null, 'pipeline')
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  target = excluded.target,
  category = excluded.category,
  active = true,
  updated_at = now();

insert into public.financial_revenue_projections (quarter, forecast, variance)
values
  ('Q1', 620000, 4.8),
  ('Q2', 710000, 3.1),
  ('Q3', 810000, -1.5),
  ('Q4', 920000, 0.6)
on conflict (quarter) do update set
  forecast = excluded.forecast,
  variance = excluded.variance,
  created_at = now();

insert into public.financial_expense_metrics (id, label, amount, delta, trend, category, runway_burn, runway_months, next_milestone, severity, message)
values
  ('burn', 'Monthly Burn', 480000, -2.3, 'down', 'headline', 480000, 19, 'Series C readiness in 2 quarters', 'info', null),
  ('opex', 'OpEx', 220000, 1.1, 'up', 'headline', null, null, null, 'info', null),
  ('unit', 'Unit Economics', 42, 6.2, 'up', 'headline', null, null, null, 'info', null),
  ('runway', 'Cash Runway', null, null, 'flat', 'runway', 480000, 19, 'Series C readiness in 2 quarters', 'info', null),
  ('vendor-spend', 'Vendor Spend Alert', null, null, 'flat', 'alert', null, null, null, 'warning', 'Martech vendor costs spiked 11% MoM'),
  ('hiring-freeze', 'Hiring Freeze', null, null, 'flat', 'alert', null, null, null, 'info', 'Hiring slowdown preserving runway')
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  category = excluded.category,
  runway_burn = excluded.runway_burn,
  runway_months = excluded.runway_months,
  next_milestone = excluded.next_milestone,
  severity = excluded.severity,
  message = excluded.message,
  active = true,
  updated_at = now();
