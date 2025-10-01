# Supabase Infrastructure

This directory contains the schema migrations and edge functions that power the build reporting pipeline.

## Migrations

Apply the migrations with the Supabase CLI:

```bash
supabase db push
```

The migrations create:

- `projects` — catalog of tracked repositories.
- `builds` — per-build execution snapshots.
- `project_latest_build` — helper view for the dashboard.
- Trigger `handle_failed_build_alert` that forwards failed builds to the Twilio alerting function.
- `financial_revenue_metrics`, `financial_revenue_projections`, and `financial_expense_metrics` — the Supabase tables that fuel
  the new revenue & expense command tabs. Seed rows keep the UI interactive even before data pipelines are connected.

## Edge functions

### `report-build`

Validates a shared bearer token (`BUILD_REPORT_TOKEN`) and upserts project/build rows. Configure the function and deploy it:

```bash
supabase functions deploy report-build
supabase secrets set BUILD_REPORT_TOKEN="<random-long-secret>"
```

Ensure the function has access to `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The CLI will prompt you for those values during deployment.

### `twilio-build-alert`

Sends SMS alerts through Twilio whenever a build transitions to the `failed` state. Required secrets:

- `TWILIO_ALERT_TOKEN` — bearer token expected from the Postgres trigger.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` — Twilio REST credentials.
- `TWILIO_FROM_NUMBER` — verified sender number.
- `TWILIO_TO_NUMBERS` — comma-separated list of recipients.

Deploy and configure:

```bash
supabase functions deploy twilio-build-alert
supabase secrets set \
  TWILIO_ALERT_TOKEN="<another-secret>" \
  TWILIO_ACCOUNT_SID="AC..." \
  TWILIO_AUTH_TOKEN="..." \
  TWILIO_FROM_NUMBER="+15555555555" \
  TWILIO_TO_NUMBERS="+15555555555,+15555555556"
```

Finally, expose the Twilio alert token inside Postgres so the trigger can sign HTTP requests:

```sql
alter database postgres set "app.twilio_alert_token" = '<another-secret>';
```

## Local testing

Use the Supabase CLI to run both functions locally while pointing at a remote project:

```bash
supabase functions serve --env-file ./supabase/.env.local
```

The desktop companion and CI pipelines can now target `http://localhost:54321/functions/v1/report-build` while iterating locally.
