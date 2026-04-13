# Pipeline Pantry

**You are building AI agents—are you using them to market?** **Pipeline Pantry** is the product: **pipelines to revenue, keep revenue, expand revenue.** This repository is the Pipeline Pantry web app—a Vite + React 18 control surface for Twilio-powered marketing operations, build telemetry from Supabase, configuration flows for Twilio/Flex, a Supabase Edge function layer, and a Rust desktop companion.

The GitHub repo may remain `marketing-war-command-center` until you rename it; the shipped product name is **Pipeline Pantry**.

## Product vision (where we are going)

The full platform is aimed at teams who want **scale and closure**, not one-off campaigns:

- **Volume + agents**: Serious throughput (for example **~1M outbound touches in a day** when numbers, compliance, and carrier limits support it), with **AI agents** on **SMS and voice**. Operators bring their **knowledge base**.
- **Closer Bot program**: **Canon of sales training**, **Closer Bots** tuned to **their** methodology, optional **voice**.
- **Omnichannel**: **SMS**, **email**, **RCS**, **MMS**, and coordinated journeys.
- **Segment-class engine**: **Behavior triggers**, **enrichment**, profiles—Twilio Segment–style—integrated with this stack.
- **Payments**: **Stripe**, **Square**, and other processors, **routing** (spread, risk, failover).
- **Templates**: Growing **email**, **RCS**, **SMS** libraries and vertical packs (see `docs/` and `src/data/`).
- **Lead marketplace**: Lists, buyers, affiliates—**Lead Faucet** and related repos plug in over APIs.
- **Verification**: **E-sign** over text and email.
- **Acquisition**: **High-converting landing pages** from the same shell.

*Companion initiatives*: **Closer Bot** and **Lead Faucet** connect as APIs and subtrees as they mature.

## What ships in this repository today

A **Vite + React 18** app (Tailwind, shadcn UI): campaign and journey UIs, Flex/workflow surfaces, template galleries, lead intelligence, financial command tabs, **live build telemetry** from **Supabase**, **migrations**, **Edge Functions** (`report-build`, `twilio-build-alert`), and a **Rust desktop companion** for build logs.

## Local development

```bash
npm install
npm run dev
```

Dev server: `http://localhost:8080` by default.

### Environment variables

For live telemetry, add to `.env.local`:

```bash
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"
```

Supabase: [`supabase/README.md`](supabase/README.md).

### First-run onboarding (no `.env` required)

If `VITE_SUPABASE_*` are **not** set at build time (e.g. public GitHub Pages), the app opens **`/onboarding`**: pick a data vendor catalog, optional Supabase test against `projects`, optional **gateway URL**. Credentials live in **`localStorage`**. CI builds that inject env vars **skip** the wizard.

## Production deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): **Settings → Pages** → **GitHub Actions**, merge to `main` or dispatch. Set `VITE_BASE_PATH` if not hosted at domain root.

## Consolidating related dashboards

[`docs/repo-consolidation.md`](docs/repo-consolidation.md) — `git subtree`, shared Supabase artifacts, tabs in this shell.

## Financial command

**Financial Command** (`/financials`): dual-tab revenue/expense views, Supabase-backed financial tables, demo fallbacks when credentials are missing.

## Product strategy (A+ spec)

[`docs/spec-pipeline-to-revenue-ralph-a-plus.md`](docs/spec-pipeline-to-revenue-ralph-a-plus.md) — Party / Motion / Outcome primitives, strip-back discipline, frontier capabilities.

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: `desktop-companion/` → `report-build`.
- **Twilio**: `supabase secrets set` per [`supabase/README.md`](supabase/README.md).
