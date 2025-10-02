-- Financial command center tables for revenue & expense intelligence
create extension if not exists pgcrypto;

create table if not exists public.financial_revenue_metrics (
  id text primary key,
  label text not null,
  amount numeric not null,
  delta numeric default 0,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
  target numeric,
  section text not null,
  format text not null default 'currency' check (format in ('currency', 'percent', 'number', 'ratio', 'duration')),
  precision integer default 0,
  suffix text,
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

create unique index if not exists financial_revenue_projections_quarter_key
  on public.financial_revenue_projections (quarter);

create table if not exists public.financial_revenue_segments (
  id text primary key,
  label text not null,
  arr numeric not null,
  change numeric default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.financial_revenue_mrr_trends (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  recurring numeric not null,
  services numeric not null,
  created_at timestamp with time zone default now()
);

create unique index if not exists financial_revenue_mrr_trends_month_key
  on public.financial_revenue_mrr_trends (month);

create table if not exists public.financial_expense_metrics (
  id text primary key,
  label text not null,
  amount numeric,
  delta numeric,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
  section text not null,
  format text not null default 'currency' check (format in ('currency', 'percent', 'number', 'ratio', 'duration')),
  precision integer default 0,
  suffix text,
  runway_burn numeric,
  runway_months numeric,
  next_milestone text,
  severity text default 'info' check (severity in ('info', 'warning', 'critical')),
  message text,
  active boolean not null default true,
  updated_at timestamp with time zone default now()
);

create table if not exists public.financial_vendor_spend (
  id text primary key,
  vendor text not null,
  category text not null,
  amount numeric not null,
  change numeric default 0,
  status text not null,
  updated_at timestamp with time zone default now()
);

create table if not exists public.financial_expense_trends (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  marketing numeric not null,
  headcount numeric not null,
  tooling numeric not null,
  created_at timestamp with time zone default now()
);

create unique index if not exists financial_expense_trends_month_key
  on public.financial_expense_trends (month);

create table if not exists public.predictability_safe_launch (
  id uuid primary key default gen_random_uuid(),
  qualified_leads numeric,
  qualified_lead_low numeric,
  qualified_lead_high numeric,
  activation_window_days numeric,
  cost_to_scale numeric,
  budget_guardrail numeric,
  intercept_coverage numeric,
  twilio_verified numeric,
  automation_confidence numeric,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_modeling (
  id uuid primary key default gen_random_uuid(),
  forecast_accuracy numeric,
  reliability_score numeric,
  intercept_margin numeric,
  scenario_confidence numeric,
  notes text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_guardrails (
  id text primary key,
  label text not null,
  status text not null check (status in ('stable', 'watch', 'breach')),
  detail text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_scenarios (
  id text primary key,
  scenario text not null,
  lead_volume numeric,
  conversion numeric,
  readiness text,
  go_live text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_volume_drivers (
  id text primary key,
  driver text not null,
  readiness text,
  run_rate numeric,
  cost numeric,
  signal text not null check (signal in ('hot', 'warm', 'cool')),
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_channel_mix (
  id text primary key,
  channel text not null,
  mix numeric,
  cac numeric,
  payback numeric,
  intercept text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_support_metrics (
  id text primary key,
  label text not null,
  value text not null,
  target text not null,
  status text not null check (status in ('on-track', 'at-risk', 'breach')),
  trend numeric default 0,
  updated_at timestamp with time zone default now()
);

comment on table public.financial_revenue_metrics is 'Live revenue KPIs powering the financial command tab.';
comment on table public.financial_revenue_projections is 'Forward-looking revenue projections used in the forecast grid.';
comment on table public.financial_revenue_segments is 'Segmented ARR mix leveraged for revenue planning.';
comment on table public.financial_revenue_mrr_trends is 'Recurring revenue telemetry rendered in the MRR area chart.';
comment on table public.financial_expense_metrics is 'Expense, runway, and alert telemetry for the financial command experience.';
comment on table public.financial_vendor_spend is 'Vendor level spend spotlight for procurement and finance teams.';
comment on table public.financial_expense_trends is 'Historical expense breakdown for the stacked bar visualization.';
comment on table public.predictability_safe_launch is 'Guardrail snapshot for safe launch modelling.';
comment on table public.predictability_modeling is 'Forecast accuracy and reliability data for the predictability tab.';
comment on table public.predictability_guardrails is 'Alerting guardrails displayed in the predictability tab.';
comment on table public.predictability_scenarios is 'Scenario planning dataset for go-to-market readiness.';
comment on table public.predictability_volume_drivers is 'Lead volume driver telemetry surfaced in the predictability tab.';
comment on table public.predictability_channel_mix is 'Channel mix distribution with CAC and payback metrics.';
comment on table public.predictability_support_metrics is 'Voice support guardrails summarised in the predictability tab.';

-- Seed defaults for demo environments
insert into public.financial_revenue_metrics (id, label, amount, delta, trend, target, section, format, precision)
values
  ('arr', 'ARR', 2400000, 12.4, 'up', 3000000, 'summary', 'currency', 0),
  ('net-retention', 'Net Revenue Retention', 134, 4.1, 'up', 140, 'summary', 'percent', 0),
  ('gross-margin', 'Gross Margin', 78, 1.2, 'up', 80, 'summary', 'percent', 0),
  ('pipeline', 'Pipeline Coverage', 3.4, -0.3, 'down', 4, 'pipeline', 'ratio', 1),
  ('avg-deal', 'Average Deal Size', 58000, 2.6, 'up', null, 'pipeline', 'currency', 0),
  ('cycle', 'Sales Cycle', 34, -1.7, 'up', null, 'pipeline', 'duration', 0),
  ('cac', 'Blended CAC', 480, -5.2, 'up', 500, 'efficiency', 'currency', 0),
  ('payback', 'CAC Payback', 8.4, -0.6, 'up', 8, 'efficiency', 'duration', 1, 'months'),
  ('ltv', 'LTV:CAC', 4.8, 0.2, 'up', 4.5, 'efficiency', 'ratio', 1, 'x')
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  target = excluded.target,
  section = excluded.section,
  format = excluded.format,
  precision = excluded.precision,
  suffix = excluded.suffix,
  updated_at = now();

insert into public.financial_revenue_projections (quarter, forecast, variance)
values
  ('Q1', 2550000, 3.2),
  ('Q2', 2720000, 2.1),
  ('Q3', 2940000, -1.4),
  ('Q4', 3120000, 4.6)
on conflict (quarter) do update set
  forecast = excluded.forecast,
  variance = excluded.variance,
  created_at = now();

insert into public.financial_revenue_segments (id, label, arr, change)
values
  ('enterprise', 'Enterprise', 1150000, 9.5),
  ('midmarket', 'Mid-Market', 780000, 6.2),
  ('smb', 'SMB', 470000, 3.1)
on conflict (id) do update set
  arr = excluded.arr,
  change = excluded.change,
  updated_at = now();

insert into public.financial_revenue_mrr_trends (month, recurring, services)
values
  ('2024-01', 430000, 120000),
  ('2024-02', 452000, 122000),
  ('2024-03', 468000, 128000),
  ('2024-04', 481000, 131000),
  ('2024-05', 498000, 134000),
  ('2024-06', 512000, 139000)
on conflict (month) do update set
  recurring = excluded.recurring,
  services = excluded.services,
  created_at = now();

insert into public.financial_expense_metrics (id, label, amount, delta, trend, section, format, precision, runway_burn, runway_months, next_milestone)
values
  ('opex', 'Operating Expenses', 1320000, 4.2, 'down', 'summary', 'currency', 0, null, null, null),
  ('headcount', 'Headcount', 168, 3.1, 'up', 'summary', 'number', 0, null, null, null),
  ('tooling', 'Tooling Spend', 210000, 1.8, 'up', 'summary', 'currency', 0, null, null, null),
  ('unit-gross', 'Unit Gross Margin', 68, 1.4, 'up', 'unit', 'percent', 0, null, null, null),
  ('unit-cost', 'Unit Cost', 142, -2.3, 'up', 'unit', 'currency', 0, null, null, null),
  ('support-resolve', 'Support Resolve', 92, 0.6, 'up', 'unit', 'percent', 0, null, null, null),
  ('runway', 'Runway Cash', 5840000, 0, 'flat', 'runway', 'currency', 0, 312000, 18, 'Series C readiness review')
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  section = excluded.section,
  format = excluded.format,
  precision = excluded.precision,
  runway_burn = excluded.runway_burn,
  runway_months = excluded.runway_months,
  next_milestone = excluded.next_milestone,
  updated_at = now();

insert into public.financial_expense_metrics (id, label, message, severity, section)
values
  ('vendor-overrun', 'Vendor Overrun', 'Conversational AI spend tracking 9% over target.', 'warning', 'alerts'),
  ('headcount-alert', 'Headcount Plan', 'Sales hiring plan extended by two sprints.', 'info', 'alerts')
on conflict (id) do update set
  message = excluded.message,
  severity = excluded.severity,
  section = excluded.section,
  updated_at = now();

insert into public.financial_vendor_spend (id, vendor, category, amount, change, status)
values
  ('twilio', 'Twilio', 'Communications', 128000, 6.5, 'scaling'),
  ('meta', 'Meta Ads', 'Acquisition', 84000, -3.2, 'optimizing'),
  ('hubspot', 'HubSpot', 'Platform', 46000, 1.4, 'steady')
on conflict (id) do update set
  vendor = excluded.vendor,
  category = excluded.category,
  amount = excluded.amount,
  change = excluded.change,
  status = excluded.status,
  updated_at = now();

insert into public.financial_expense_trends (month, marketing, headcount, tooling)
values
  ('2024-01', 240000, 560000, 120000),
  ('2024-02', 252000, 568000, 118000),
  ('2024-03', 261000, 574000, 121000),
  ('2024-04', 255000, 582000, 123000),
  ('2024-05', 268000, 590000, 126000),
  ('2024-06', 274000, 598000, 128000)
on conflict (month) do update set
  marketing = excluded.marketing,
  headcount = excluded.headcount,
  tooling = excluded.tooling,
  created_at = now();

insert into public.predictability_safe_launch (
  id,
  qualified_leads,
  qualified_lead_low,
  qualified_lead_high,
  activation_window_days,
  cost_to_scale,
  budget_guardrail,
  intercept_coverage,
  twilio_verified,
  automation_confidence
) values (
  gen_random_uuid(),
  420,
  360,
  480,
  21,
  185000,
  220000,
  0.86,
  0.94,
  0.91
) on conflict do nothing;

insert into public.predictability_modeling (
  id,
  forecast_accuracy,
  reliability_score,
  intercept_margin,
  scenario_confidence,
  notes
) values (
  gen_random_uuid(),
  0.92,
  0.88,
  0.17,
  0.81,
  'Forecast tracking within acceptable variance. Push retention campaign to maintain coverage.'
) on conflict do nothing;

insert into public.predictability_guardrails (id, label, status, detail)
values
  ('pipeline-health', 'Pipeline health', 'stable', '3.4x coverage on next quarter quota.'),
  ('lead-sla', 'Lead SLA', 'watch', 'SLA response slipped to 17 minutes.'),
  ('twilio-spend', 'Twilio spend', 'stable', 'Messaging margin within guardrails.')
on conflict (id) do update set
  label = excluded.label,
  status = excluded.status,
  detail = excluded.detail,
  updated_at = now();

insert into public.predictability_scenarios (id, scenario, lead_volume, conversion, readiness, go_live)
values
  ('aggressive', 'Aggressive', 520, 0.19, 'Crewed', '2024-08-15'),
  ('base', 'Base', 440, 0.17, 'Ready', '2024-07-01'),
  ('defensive', 'Defensive', 320, 0.15, 'Staged', '2024-09-10')
on conflict (id) do update set
  scenario = excluded.scenario,
  lead_volume = excluded.lead_volume,
  conversion = excluded.conversion,
  readiness = excluded.readiness,
  go_live = excluded.go_live,
  updated_at = now();

insert into public.predictability_volume_drivers (id, driver, readiness, run_rate, cost, signal)
values
  ('ads', 'Paid social', 'Scaling', 180, 62000, 'hot'),
  ('referrals', 'Member referrals', 'Running', 96, 14000, 'warm'),
  ('events', 'Partner events', 'Piloting', 58, 28000, 'cool')
on conflict (id) do update set
  driver = excluded.driver,
  readiness = excluded.readiness,
  run_rate = excluded.run_rate,
  cost = excluded.cost,
  signal = excluded.signal,
  updated_at = now();

insert into public.predictability_channel_mix (id, channel, mix, cac, payback, intercept)
values
  ('sms', 'SMS', 0.31, 142, 6.5, 'Verified'),
  ('email', 'Email', 0.27, 118, 7.2, 'In QA'),
  ('voice', 'Voice', 0.19, 164, 8.6, 'Routing'),
  ('rcs', 'RCS', 0.11, 132, 5.9, 'Green'),
  ('web', 'Web', 0.12, 96, 4.8, 'Full')
on conflict (id) do update set
  channel = excluded.channel,
  mix = excluded.mix,
  cac = excluded.cac,
  payback = excluded.payback,
  intercept = excluded.intercept,
  updated_at = now();

insert into public.predictability_support_metrics (id, label, value, target, status, trend)
values
  ('fcr', 'First contact resolution', '87%', '85%', 'on-track', 1.3),
  ('asa', 'Average speed to answer', '42s', '45s', 'on-track', -3.4),
  ('nps', 'Member NPS', '64', '60', 'on-track', 2.1),
  ('escalations', 'Escalations', '14', '12', 'at-risk', 0.8)
on conflict (id) do update set
  label = excluded.label,
  value = excluded.value,
  target = excluded.target,
  status = excluded.status,
  trend = excluded.trend,
  updated_at = now();
