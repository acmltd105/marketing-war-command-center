# Marketing War Command Center

The Marketing War Command Center is a Vite + React 18 control surface for orchestrating Twilio-powered marketing operations. It
shows live build telemetry from Supabase, houses configuration flows for Twilio/Flex, and is paired with a Supabase Edge
function layer plus a Rust desktop companion.

## Local development

```bash
npm install
npm run dev
```

The dev server listens on `http://localhost:8080` by default. Tailwind, shadcn UI, and React Fast Refresh are all prewired.

### Environment variables

The dashboard automatically falls back to curated demo data when Supabase credentials are missing, keeping the UI interactive.
Provide the following variables in a `.env.local` file to light up realtime telemetry:

```bash
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"
```

The Supabase schema, triggers, and edge functions live in [`supabase/`](supabase/README.md). Deploy them with the Supabase CLI
before pointing CI to the `report-build` endpoint.

## Production deployment

This repository now includes an automated GitHub Pages workflow (`.github/workflows/deploy.yml`). Once GitHub Pages is enabled
for the repository:

1. Go to **Settings → Pages** and choose **GitHub Actions** as the source.
2. Merge to `main` (or trigger the workflow manually). The action builds the Vite site and publishes it to Pages.
3. The workflow outputs a ready-to-share URL (e.g., `https://<org>.github.io/<repo>/`) so stakeholders can click and test the UI
   immediately.

Assets are built with a relative base path, so the site works on both GitHub Pages and custom domains without further
configuration. If you host elsewhere, set `VITE_BASE_PATH` to the appropriate subdirectory before running `npm run build`.

## Consolidating related dashboards

Need to pull the revenue & expense UI into this monorepo? Follow the step-by-step playbook in
[`docs/repo-consolidation.md`](docs/repo-consolidation.md) to graft the smaller repo with `git subtree`, harmonize Supabase
artifacts, and expose the new tabs inside the command center shell.

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: build the Rust project in `desktop-companion/` for deep Twilio runtime introspection.
- **Twilio credentials**: store secrets via `supabase secrets set` as outlined in `supabase/README.md`.

Keeping these guardrails in place ensures the command center stays error-proof, self-healing, and production ready.
