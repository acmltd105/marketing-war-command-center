# Marketing War Command Center

**You are building AI agents—are you using them to market?** This project is the control surface for that story: high-volume outreach, agent-assisted closing, and the data plane that makes both measurable.

## Product vision (where we are going)

The full platform is aimed at teams who want **scale and closure**, not one-off campaigns:

- **Volume + agents**: Campaign infrastructure designed for serious throughput (for example **~1M outbound touches in a day** when your numbers, compliance, and carrier limits support it), with **AI agents** handling follow-up by **SMS and voice**. Operators bring their **knowledge base** so agents stay on-brand.
- **Closer Bot program**: Buyers pick a **canon of sales training** and deploy **Closer Bots**—smarter agents tuned to **their** methodology—with optional **voice** add-ons.
- **Omnichannel**: **SMS**, **email**, **RCS**, **MMS**, and coordinated journeys—not SMS-only.
- **Segment-class engine**: **Behavior triggers**, **enrichment**, and profiles to lift **close rate** and **retention** (Twilio Segment–style identity and events, integrated with this stack).
- **Payments**: **Stripe**, **Square**, and other major processors, with **routing controls** (spread volume, risk scoring, failover) so checkout matches your risk posture.
- **Templates**: Large, growing libraries of **email**, **RCS**, and **SMS** templates, including **vertical packs** (dental, pet care, and more—see `docs/` and `src/data/`).
- **Lead marketplace**: Sourcing and moving leads—**lists**, **buyers**, **affiliates**, **generators**—with integrations (see **Lead Faucet** and lead-intelligence work across related repos in your org).
- **Verification & trust**: **E-sign** flows delivered over **text and email** so deals close inside the thread.
- **Acquisition**: **High-converting landing pages** launched from the same command center.

*Companion initiatives*: **Closer Bot** (trainable closing agents + voice) and **Lead Faucet** / lead-graph repos are expected to plug into this shell as APIs and subtrees mature.

## What ships in this repository today

This repo is a **Vite + React 18** app (Tailwind, shadcn UI) that orchestrates **Twilio-leaning** marketing operations: campaign and journey UIs, Flex/workflow surfaces, template galleries, lead intelligence screens, financial command tabs, and **live build telemetry** from **Supabase**. It ships with **Supabase migrations**, **Edge Functions** (`report-build`, `twilio-build-alert`), and a **Rust desktop companion** that forwards build logs to Supabase.

The sections below describe how to run and deploy **this** codebase. Roadmap items above land as they are implemented and wired.

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

### First-run onboarding (no `.env` required)

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are **not** set at build time (for example on a public GitHub Pages build),
the app opens **`/onboarding`**. Operators pick a primary data vendor from a catalog (Supabase, Neon, Azure SQL, Cosmos DB, and
dozens of common warehouses and document stores), optionally test a Supabase project against the `projects` table, and can
record a **custom HTTPS gateway** URL for non-Supabase sync. Credentials are stored in **`localStorage`** in this browser only.
CI deployments that inject Supabase env vars skip the wizard automatically.

## Production deployment

This repository includes an automated GitHub Pages workflow (`.github/workflows/deploy.yml`). Once GitHub Pages is enabled
for the repository:

1. Go to **Settings → Pages** and choose **GitHub Actions** as the source.
2. Merge to `main` (or trigger the workflow manually). The action builds the Vite site and publishes it to Pages.
3. The workflow outputs a ready-to-share URL (e.g., `https://<org>.github.io/<repo>/`) so stakeholders can click and test the UI
   immediately.

Assets are built with a relative base path, so the site works on both GitHub Pages and custom domains without further
configuration. If you host elsewhere, set `VITE_BASE_PATH` to the appropriate subdirectory before running `npm run build`.

## Consolidating related dashboards

Need to pull another dashboard into this monorepo? Follow the step-by-step playbook in
[`docs/repo-consolidation.md`](docs/repo-consolidation.md) to graft a smaller repo with `git subtree`, harmonize Supabase
artifacts, and expose new areas inside the command center shell.

## Financial command module

Navigate to **Financial Command** in the left rail (or visit `/financials`) for revenue and expense intelligence: dual-tab views,
Supabase-backed metrics from the financial tables (with demo fallbacks when credentials are missing), and runway-style signals
alongside Twilio operations tooling.

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: build the Rust project in `desktop-companion/` for build log forwarding to `report-build`.
- **Twilio credentials**: store secrets via `supabase secrets set` as outlined in `supabase/README.md`.

Keeping these guardrails in place keeps the command center deployable and easier to harden for production.
