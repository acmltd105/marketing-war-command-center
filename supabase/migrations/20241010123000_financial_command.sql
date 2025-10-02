-- Financial command center tables for revenue & expense intelligence
codex/integrate-revenue-and-expense-tabs-ugnmqm
create extension if not exists pgcrypto;
 main
create table if not exists public.financial_revenue_metrics (
  id text primary key,
  label text not null,
  amount numeric not null,
  delta numeric default 0,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
  target numeric,
codex/integrate-revenue-and-expense-tabs-ugnmqm
  category text not null default 'headline',

  category text not null default 'summary',
  section text not null default 'summary',
  format text not null default 'currency' check (format in ('currency', 'percent', 'number', 'ratio', 'duration')),
  precision integer default 0,
  suffix text,
 main
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

codex/integrate-revenue-and-expense-tabs-ugnmqm
create unique index if not exists financial_revenue_projections_quarter_key on public.financial_revenue_projections (quarter);
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
main
create table if not exists public.financial_expense_metrics (
  id text primary key,
  label text not null,
  amount numeric,
  delta numeric,
  trend text default 'flat' check (trend in ('up', 'down', 'flat')),
codex/integrate-revenue-and-expense-tabs-ugnmqm
  category text not null default 'headline',
=======
  category text not null default 'summary',
  section text not null default 'summary',
  format text not null default 'currency' check (format in ('currency', 'percent', 'number', 'ratio', 'duration')),
  precision integer default 0,
  suffix text,
main
  runway_burn numeric,
  runway_months numeric,
  next_milestone text,
  severity text default 'info' check (severity in ('info', 'warning', 'critical')),
  message text,
  active boolean not null default true,
  updated_at timestamp with time zone default now()
);

 codex/integrate-revenue-and-expense-tabs-ugnmqm
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

comment on table public.financial_revenue_metrics is 'Live revenue KPIs powering the financial command tab.';
comment on table public.financial_revenue_projections is 'Forward-looking revenue projections used in the forecast grid.';
comment on table public.financial_revenue_segments is 'Segmented ARR mix leveraged for revenue planning.';
comment on table public.financial_revenue_mrr_trends is 'Monthly recurring revenue deltas split by recurring vs services.';
comment on table public.financial_expense_metrics is 'Expense, runway, and alert telemetry for the financial command experience.';
comment on table public.financial_vendor_spend is 'Operating vendor run-rate telemetry surfaced in the expense tab.';
comment on table public.financial_expense_trends is 'Stacked expense cadence for marketing, headcount, and tooling spend.';

create table if not exists public.predictability_safe_launch (
  id text primary key default 'safe-launch',
  qualified_leads numeric not null,
  qualified_lead_low numeric not null,
  qualified_lead_high numeric not null,
  activation_window_days integer not null,
  cost_to_scale numeric not null,
  budget_guardrail numeric not null,
  intercept_coverage numeric not null,
  twilio_verified integer not null,
  automation_confidence numeric not null,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_modeling (
  id text primary key default 'modeling',
  forecast_accuracy numeric not null,
  reliability_score numeric not null,
  intercept_margin numeric not null,
  scenario_confidence numeric not null,
  notes text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_guardrails (
  id text primary key,
  label text not null,
  status text not null check (status in ('stable', 'watch', 'breach')),
  detail text not null,
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_scenarios (
  id text primary key,
  scenario text not null,
  lead_volume numeric not null,
  conversion numeric not null,
  readiness text not null,
  go_live text not null,
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_volume_drivers (
  id text primary key,
  driver text not null,
  readiness text not null,
  run_rate numeric not null,
  cost numeric not null,
  signal text not null check (signal in ('hot', 'warm', 'cool')),
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_channel_mix (
  id text primary key,
  channel text not null,
  mix numeric not null,
  cac numeric not null,
  payback numeric not null,
  intercept text not null,
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.predictability_support_metrics (
  id text primary key,
  label text not null,
  value text not null,
  target text not null,
  status text not null check (status in ('on-track', 'at-risk', 'breach')),
  trend numeric not null,
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

comment on table public.predictability_safe_launch is 'Safe launch envelope inputs for the predictability & modeling command.';
comment on table public.predictability_modeling is 'Forecast reliability telemetry backing the predictability command hero card.';
comment on table public.predictability_guardrails is 'Compliance, budget, and readiness guardrails that gate safe launches.';
comment on table public.predictability_scenarios is 'Scenario planning data for lead logistics modeling.';
comment on table public.predictability_volume_drivers is 'Modeled pipeline drivers with run rate, cost, and readiness signals.';
comment on table public.predictability_channel_mix is 'Channel distribution and economics powering the predictability mix view.';
comment on table public.predictability_support_metrics is 'Voice and support readiness telemetry for predictability enforcement.';

-- Seed defaults for demo environments
insert into public.financial_revenue_metrics
  (id, label, amount, delta, trend, target, category, section, format, precision, suffix)
values
  ('total-arr', 'Total ARR', 4200000, 11.2, 'up', 5000000, 'summary', 'summary', 'currency', 0, null),
  ('new-arr', 'New ARR QTD', 380000, 6.5, 'up', 450000, 'summary', 'summary', 'currency', 0, null),
  ('expansion-arr', 'Expansion ARR', 140000, 3.1, 'up', null, 'summary', 'summary', 'currency', 0, null),
  ('pipeline-coverage', 'Pipeline Coverage', 4.2, 0.4, 'up', 5, 'pipeline', 'pipeline', 'ratio', 1, 'x'),
  ('committed-pipeline', 'Committed Pipeline', 910000, 5.6, 'up', null, 'pipeline', 'pipeline', 'currency', 0, null),
  ('avg-contract', 'Avg Contract Value', 72000, 4.4, 'up', null, 'pipeline', 'pipeline', 'currency', 0, null),
  ('win-rate', 'Win Rate', 31, 1.7, 'up', 35, 'efficiency', 'efficiency', 'percent', 1, null),
  ('sales-cycle', 'Sales Cycle', 32, -2.1, 'down', null, 'efficiency', 'efficiency', 'duration', 0, 'days'),
  ('lead-velocity', 'Lead Velocity', 18, 2.4, 'up', null, 'efficiency', 'efficiency', 'percent', 1, null)
 main
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  target = excluded.target,
  category = excluded.category,
 codex/integrate-revenue-and-expense-tabs-ugnmqm
=======
  section = excluded.section,
  format = excluded.format,
  precision = excluded.precision,
  suffix = excluded.suffix,
 main
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

 codex/integrate-revenue-and-expense-tabs-ugnmqm
insert into public.financial_expense_metrics (id, label, amount, delta, trend, category, runway_burn, runway_months, next_milestone, severity, message)
values
  ('burn', 'Monthly Burn', 480000, -2.3, 'down', 'headline', 480000, 19, 'Series C readiness in 2 quarters', 'info', null),
  ('opex', 'OpEx', 220000, 1.1, 'up', 'headline', null, null, null, 'info', null),
  ('unit', 'Unit Economics', 42, 6.2, 'up', 'headline', null, null, null, 'info', null),
  ('runway', 'Cash Runway', null, null, 'flat', 'runway', 480000, 19, 'Series C readiness in 2 quarters', 'info', null),
  ('vendor-spend', 'Vendor Spend Alert', null, null, 'flat', 'alert', null, null, null, 'warning', 'Martech vendor costs spiked 11% MoM'),
  ('hiring-freeze', 'Hiring Freeze', null, null, 'flat', 'alert', null, null, null, 'info', 'Hiring slowdown preserving runway')

insert into public.financial_revenue_segments (id, label, arr, change)
values
  ('enterprise', 'Enterprise', 2200000, 8.4),
  ('midmarket', 'Mid-Market', 1400000, 5.1),
  ('smb', 'SMB', 600000, 3.7)
on conflict (id) do update set
  label = excluded.label,
  arr = excluded.arr,
  change = excluded.change,
  updated_at = now();

insert into public.financial_revenue_mrr_trends (month, recurring, services)
values
  ('2024-04', 320000, 140000),
  ('2024-05', 332000, 150000),
  ('2024-06', 345000, 152000),
  ('2024-07', 356000, 149000),
  ('2024-08', 368000, 155000),
  ('2024-09', 381000, 160000)
on conflict (month) do update set
  recurring = excluded.recurring,
  services = excluded.services,
  created_at = now();

insert into public.financial_expense_metrics
  (id, label, amount, delta, trend, category, section, format, precision, suffix, runway_burn, runway_months, next_milestone, severity, message)
values
  ('burn', 'Monthly Burn', 520000, -1.8, 'down', 'summary', 'summary', 'currency', 0, null, 520000, 19, 'Series C readiness in Q2 FY25', 'info', null),
  ('operating', 'Operating Expenses', 310000, 0.9, 'up', 'summary', 'summary', 'currency', 0, null, null, null, null, 'info', null),
  ('cash', 'Cash on Hand', 9800000, 2.3, 'up', 'summary', 'summary', 'currency', 0, null, null, null, null, 'info', null),
  ('cost-per-client', 'Cost per Client', 480, -4.2, 'down', 'unit', 'unit', 'currency', 0, null, null, null, null, 'info', null),
  ('cac-payback', 'CAC Payback', 9.4, -0.6, 'down', 'unit', 'unit', 'duration', 1, 'months', null, null, null, 'info', null),
  ('support-cost', 'Support Cost / Ticket', 18, 1.2, 'up', 'unit', 'unit', 'currency', 0, null, null, null, null, 'warning', 'Escalation volume trending up.'),
  ('ltv-cac', 'LTV to CAC', 4.2, 0.3, 'up', 'unit', 'unit', 'ratio', 1, 'x', null, null, null, 'info', null),
  ('runway', 'Cash Runway', 9800000, null, 'flat', 'runway', 'runway', 'currency', 0, null, 520000, 19, 'Series C readiness in Q2 FY25', 'info', null),
  ('vendor-spend', 'Vendor Cost Spike', null, 12, 'up', 'alert', 'alert', 'number', 1, '%', null, null, null, 'warning', 'Data enrichment renewal is trending +12% month over month.'),
  ('hiring', 'Hiring Discipline', null, 0, 'flat', 'alert', 'alert', 'number', 0, null, null, null, null, 'info', 'Hiring slowdown preserving headcount budget across sales.'),
  ('support-alert', 'Support Pressure', null, 8, 'up', 'alert', 'alert', 'number', 0, null, null, null, null, 'critical', 'Escalation volume has exceeded the support run rate by 8%.')
main
on conflict (id) do update set
  amount = excluded.amount,
  delta = excluded.delta,
  trend = excluded.trend,
  category = excluded.category,
 codex/integrate-revenue-and-expense-tabs-ugnmqm
  section = excluded.section,
  format = excluded.format,
  precision = excluded.precision,
  suffix = excluded.suffix,
 main
  runway_burn = excluded.runway_burn,
  runway_months = excluded.runway_months,
  next_milestone = excluded.next_milestone,
  severity = excluded.severity,
  message = excluded.message,
  active = true,
  updated_at = now();
codex/integrate-revenue-and-expense-tabs-ugnmqm


insert into public.financial_vendor_spend (id, vendor, category, amount, change, status)
values
  ('clearbit', 'Clearbit', 'Data Enrichment', 18000, 12, 'Renewal due'),
  ('segment', 'Segment', 'CDP', 24000, 4, 'Active'),
  ('marketo', 'Marketo', 'Automation', 32000, -3, 'Negotiating'),
  ('zendesk', 'Zendesk', 'Support', 21000, 6, 'Active')
on conflict (id) do update set
  vendor = excluded.vendor,
  category = excluded.category,
  amount = excluded.amount,
  change = excluded.change,
  status = excluded.status,
  updated_at = now();

insert into public.financial_expense_trends (month, marketing, headcount, tooling)
values
  ('2024-04', 180000, 260000, 120000),
  ('2024-05', 172000, 258000, 118000),
  ('2024-06', 168000, 254000, 117000),
  ('2024-07', 166000, 250000, 119000),
  ('2024-08', 162000, 246000, 118000),
  ('2024-09', 158000, 243000, 116000)
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
)
values (
  'safe-launch',
  1000000,
  920000,
  1050000,
  45,
  1000000,
  2000000,
  96,
  120,
  94
)
on conflict (id) do update set
  qualified_leads = excluded.qualified_leads,
  qualified_lead_low = excluded.qualified_lead_low,
  qualified_lead_high = excluded.qualified_lead_high,
  activation_window_days = excluded.activation_window_days,
  cost_to_scale = excluded.cost_to_scale,
  budget_guardrail = excluded.budget_guardrail,
  intercept_coverage = excluded.intercept_coverage,
  twilio_verified = excluded.twilio_verified,
  automation_confidence = excluded.automation_confidence,
  updated_at = now();

insert into public.predictability_modeling (
  id,
  forecast_accuracy,
  reliability_score,
  intercept_margin,
  scenario_confidence,
  notes
)
values (
  'modeling',
  96.4,
  92,
  0.82,
  88,
  'Intercept margin and reliability remain within the safe launch envelope.'
)
on conflict (id) do update set
  forecast_accuracy = excluded.forecast_accuracy,
  reliability_score = excluded.reliability_score,
  intercept_margin = excluded.intercept_margin,
  scenario_confidence = excluded.scenario_confidence,
  notes = excluded.notes,
  updated_at = now();

insert into public.predictability_guardrails (id, label, status, detail, display_order)
values
  ('compliance', 'Compliance verified', 'stable', 'All 120 Twilio numbers validated and mapped to enforcement scripts.', 1),
  ('budget', 'Budget guardrail', 'watch', 'Scaling plan consumes 48% of the $2M cap. Procurement sign-off pending.', 2),
  ('support', 'Support readiness', 'stable', 'Voice and chat staffed 24/7 with surge playbooks activated.', 3)
on conflict (id) do update set
  label = excluded.label,
  status = excluded.status,
  detail = excluded.detail,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.predictability_scenarios (id, scenario, lead_volume, conversion, readiness, go_live, display_order)
values
  ('base', 'Base launch', 920000, 3.2, 'Pods staffed, QA complete', '92%', 1),
  ('aggressive', 'Aggressive capture', 1050000, 3.6, 'Additional SDR pod pending', '88%', 2),
  ('defensive', 'Defensive floor', 780000, 2.8, 'Automation only', '97%', 3)
on conflict (id) do update set
  scenario = excluded.scenario,
  lead_volume = excluded.lead_volume,
  conversion = excluded.conversion,
  readiness = excluded.readiness,
  go_live = excluded.go_live,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.predictability_volume_drivers (id, driver, readiness, run_rate, cost, signal, display_order)
values
  ('events', 'Field & events', 'Playbook locked', 420000, 320000, 'hot', 1),
  ('paid', 'Paid acquisition', 'Budgets cleared', 310000, 260000, 'warm', 2),
  ('partners', 'Partner co-selling', 'Rev-share synced', 210000, 140000, 'hot', 3)
on conflict (id) do update set
  driver = excluded.driver,
  readiness = excluded.readiness,
  run_rate = excluded.run_rate,
  cost = excluded.cost,
  signal = excluded.signal,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.predictability_channel_mix (id, channel, mix, cac, payback, intercept, display_order)
values
  ('inbound', 'Inbound', 38, 420, 7.5, 'Full', 1),
  ('outbound', 'Outbound', 22, 510, 9.2, 'Partial', 2),
  ('partners', 'Partners', 26, 360, 6.1, 'Shared', 3),
  ('events', 'Events', 14, 540, 8.6, 'Full', 4)
on conflict (id) do update set
  channel = excluded.channel,
  mix = excluded.mix,
  cac = excluded.cac,
  payback = excluded.payback,
  intercept = excluded.intercept,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.predictability_support_metrics (id, label, value, target, status, trend, display_order)
values
  ('voice-sla', 'Voice SLA', '92% within 45s', '90%', 'on-track', 1.4, 1),
  ('chat', 'Chat concurrency', '3.1 avg', '3.0', 'on-track', 0.6, 2),
  ('deflection', 'Self-serve deflection', '38%', '40%', 'at-risk', -1.1, 3)
on conflict (id) do update set
  label = excluded.label,
  value = excluded.value,
  target = excluded.target,
  status = excluded.status,
  trend = excluded.trend,
  display_order = excluded.display_order,
  updated_at = now();
main
