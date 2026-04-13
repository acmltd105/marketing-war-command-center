# Pipeline Pantry

**Pipeline Pantry** is the product: pipelines to revenue, keep revenue, expand revenue. This repository is the **Pipeline Pantry** web app—a Vite + React 18 control surface for Twilio-powered marketing operations, build telemetry from Supabase, configuration flows for Twilio/Flex, a Supabase Edge function layer, and a Rust desktop companion.

Repository host name may remain `marketing-war-command-center` on GitHub; the shipped product name is **Pipeline Pantry**.

## Local development

```bash
npm install
npm run dev
```

The dev server listens on `http://localhost:8080` by default. Tailwind, shadcn UI, and React Fast Refresh are all prewired.

### Environment variables

The dashboard falls back to curated demo data when Supabase credentials are missing. For live telemetry, add to `.env.local`:

```bash
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"
```

Supabase migrations and Edge Functions live in [`supabase/`](supabase/README.md). Deploy with the Supabase CLI before wiring CI to `report-build`.

## Production deployment

GitHub Pages workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. **Settings → Pages** → source **GitHub Actions**.
2. Merge to `main` or run the workflow manually.
3. Use the workflow’s Pages URL, or a custom domain.

Set `VITE_BASE_PATH` before `npm run build` if the app is not hosted at the domain root.

## Consolidating related dashboards

[`docs/repo-consolidation.md`](docs/repo-consolidation.md) describes folding another dashboard into this repo with `git subtree` and shared Supabase artifacts.

## Financial command

**Financial Command** in the left rail (`/financials`): revenue and expense views backed by Supabase financial tables, with demo fallbacks when credentials are missing.

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: `desktop-companion/` for log forwarding to `report-build`.
- **Twilio credentials**: `supabase secrets set` per [`supabase/README.md`](supabase/README.md).
