# Marketing War Command Center

The Marketing War Command Center is a Vite + React 18 control surface for orchestrating Twilio-powered marketing operations. It
shows live build telemetry from Supabase, houses configuration flows for Twilio/Flex, and is paired with a Supabase Edge
function layer plus a Rust desktop companion.

## Local development

```bash
npm install
npm run dev
```

The dev server binds to `http://localhost:5173/` immediately (and to your LAN IP so other devices can test in real time). Tailwind,
shadcn UI, and React Fast Refresh are all prewired. Override the defaults with `DEV_HOST`/`DEV_PORT` env vars if you need to run on
another interface.

Need to review the production bundle locally? Run:

```bash
npm run build
npm run preview
```

`vite preview` serves the contents of `dist/` at `http://localhost:4173/` (customisable via `PREVIEW_HOST`/`PREVIEW_PORT`).

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

### Vercel

Prefer a fully managed, CDN-backed deploy? Follow the step-by-step [Vercel deployment playbook](docs/vercel-deployment.md) to
import the repository, wire up environment variables, and publish the SPA with automatic rewrites for client-side routing.

### GitHub Pages

This repository includes an automated GitHub Pages workflow (`.github/workflows/deploy.yml`). Once GitHub Pages is enabled for
the repository:

1. Go to **Settings → Pages** and choose **GitHub Actions** as the source.
2. Merge to `main` (or trigger the workflow manually via **Actions → Deploy marketing war command center → Run workflow**). The
   action builds the Vite site with the GitHub Pages base path and publishes it.
3. Grab the live URL from the job summary (e.g., `https://<org>.github.io/<repo>/`) and share it with stakeholders for instant
   smoke testing.

Assets are built with a relative base path, so the site works on both GitHub Pages and custom domains without further
configuration. If you host elsewhere, set `VITE_BASE_PATH` to the appropriate subdirectory before running `npm run build`.

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: build the Rust project in `desktop-companion/` for deep Twilio runtime introspection.
- **Twilio credentials**: store secrets via `supabase secrets set` as outlined in `supabase/README.md`.

Keeping these guardrails in place ensures the command center stays error-proof, self-healing, and production ready.
