# Supabase Infrastructure

Schema migrations and Edge Functions for **Pipeline Pantry** (build telemetry, financial command, lead ingestion, user preferences).

## Migrations

```bash
supabase db push
```

Creates and seeds (among others):

- **`projects`**, **`builds`**, **`project_latest_build`** — CI/build dashboard.
- **Financial command** — `financial_revenue_metrics`, `financial_revenue_projections`, `financial_revenue_segments`, `financial_revenue_mrr_trends`, `financial_expense_metrics`, `financial_vendor_spend`, `financial_expense_trends`, plus predictability tables.
- **Pipeline Pantry spine** — `party`, `deal`, `outcome` (see `20260413000000_pipeline_pantry_spine.sql`).
- **Lead ingestion**, **user preferences / skin**, **failed build alerts** — see migration filenames in `supabase/migrations/`.

## Edge functions

### `report-build`

Bearer token `BUILD_REPORT_TOKEN`. Deploy:

```bash
supabase functions deploy report-build
supabase secrets set BUILD_REPORT_TOKEN="<random-long-secret>"
```

Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the function runtime.

### `twilio-build-alert`

Secrets: `TWILIO_ALERT_TOKEN`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `TWILIO_TO_NUMBERS`. Deploy with `supabase functions deploy twilio-build-alert` and set secrets per your Twilio project.

Expose the alert token to Postgres for the trigger if you use DB-initiated alerts:

```sql
alter database postgres set "app.twilio_alert_token" = '<another-secret>';
```

## Local testing

```bash
supabase functions serve --env-file ./supabase/.env.local
```
