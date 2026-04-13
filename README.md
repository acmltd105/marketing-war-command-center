# Pipeline Pantry

> **Planning mode (pause):** Execution follows the **living plan** in [`docs/INDEX.md`](docs/INDEX.md) — master spec, orchestration, agents, QA, guardrails, Ralph-by-category, phases. **Do not drift** from [`docs/guardrails-no-drift.md`](docs/guardrails-no-drift.md).

**You are building AI agents—are you using them to market?** **Pipeline Pantry** is the product: **pipelines to revenue, keep revenue, expand revenue**—and the **company lifecycle** that makes revenue possible: **idea → entity → brand → site → story → first sale → scale → IPO readiness** (see [`docs/company-lifecycle-pipeline.md`](docs/company-lifecycle-pipeline.md)). This repo is the Pipeline Pantry web app: Vite + React 18, Twilio-leaning operations. **Internal dogfood** runs on **Azure** (SQL, Cosmos, Blobs, containers, Microsoft 365) via a **gateway**—see [`docs/azure-managed-agents.md`](docs/azure-managed-agents.md). The `supabase/` tree remains for OSS demos and migration history; choosing an **Azure-primary** backend in onboarding **disables** the Supabase browser client for that browser profile.

The GitHub repo may remain `marketing-war-command-center` until you rename it; the shipped product name is **Pipeline Pantry**.

## Product vision (where we are going)

The full platform is aimed at teams who want **scale and closure**, not one-off campaigns—and operators who want **one spine** from formation to liquidity narrative:

- **Company creation**: Setup flows, **EIN/FEIN** checklists (with partner/CPA handoffs—no legal advice in the UI), entity profile, cap-table stubs where useful.
- **Brand & surface**: **Brand identity tools** (kit, voice, assets), **corporate website** launch checklist and deploy hooks.
- **Narrative**: **Press release** drafting blocks, embargo dates, IR-facing page patterns when you go public.
- **Velocity milestones**: **First sale in a day**, then **5 → 10 → 1000** (or your cohort numbers) as **explicit checkpoints** tied to economics—not vanity counters.
- **IPO tracker**: Readiness checklist (governance, audit trail density, reporting themes)—**progress + education**, not brokerage; your counsel owns filings.
- **Survival / risk context**: Industry **failure-rate** context and **your** leading risk signals (runway, consent, chargebacks)—framed as **radar**, not a goal. Details in the lifecycle doc.
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

A **Vite + React 18** app (Tailwind, shadcn UI): campaign and journey UIs, Flex/workflow surfaces, template galleries, lead intelligence, **Company workspace** (`/company`) for idea→IPO checklists, financial command tabs, **live build telemetry** from **Supabase**, **migrations**, **Edge Functions** (`report-build`, `twilio-build-alert`), and a **Rust desktop companion** for build logs.

## Local development

```bash
npm install
npm run dev
```

Dev server: `http://localhost:8080` by default.

**Local dev (mock auth + API):** `.env.development` in the repo enables `VITE_USE_MOCK_AUTH`, `VITE_USE_MOCK_API`, and `VITE_DEV_SKIP_ONBOARDING` so `npm run dev` → **`/login`** → mock session → **`/contacts`** with in-memory parties (no Azure required). Remove or edit that file for full onboarding.

### Environment variables

**Supabase (optional, demos / OSS path):**

```bash
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"
```

**Azure dogfood:** leave `VITE_SUPABASE_*` unset, or set `VITE_REQUIRE_ONBOARDING=true` so CI can still inject Supabase for public builds while **forcing** your team through `/onboarding` to pick **Azure SQL** / **Cosmos** and enter the **gateway** URL.

Supabase folder: [`supabase/README.md`](supabase/README.md).

### First-run onboarding (no `.env` required)

If `VITE_SUPABASE_*` are **not** set at build time (e.g. public GitHub Pages), the app opens **`/onboarding`**: pick a primary backend. **Azure-primary** choices require an **HTTPS gateway** (SQL + Cosmos + Blob behind Key Vault—never secrets in the SPA). Optional Supabase test for other backends. Credentials live in **`localStorage`**. CI builds that inject Supabase env vars **skip** the wizard unless `VITE_REQUIRE_ONBOARDING=true`.

## Production deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): **Settings → Pages** → **GitHub Actions**, merge to `main` or dispatch. Set `VITE_BASE_PATH` if not hosted at domain root.

## Consolidating related dashboards

[`docs/repo-consolidation.md`](docs/repo-consolidation.md) — `git subtree`, shared Supabase artifacts, tabs in this shell.

## Financial command

**Financial Command** (`/financials`): dual-tab revenue/expense views, Supabase-backed financial tables, demo fallbacks when credentials are missing.

## Product strategy (A+ spec)

[`docs/spec-pipeline-to-revenue-ralph-a-plus.md`](docs/spec-pipeline-to-revenue-ralph-a-plus.md) — Party / Motion / Outcome primitives, strip-back discipline, frontier capabilities.

## Planning hub (living docs)

| Doc | Role |
|-----|------|
| [`docs/INDEX.md`](docs/INDEX.md) | **Start here** — full map of all planning MDs |
| [`docs/spec-master.md`](docs/spec-master.md) | Master spec, MVP definition, architecture |
| [`docs/orchestration.md`](docs/orchestration.md) | Research → scaffold → code → wire → ship |
| [`docs/agents.md`](docs/agents.md) | Agent roles & handoffs |
| [`docs/guardrails-no-drift.md`](docs/guardrails-no-drift.md) | Anti-drift rules |
| [`docs/QA.md`](docs/QA.md) | QA agent charter |
| [`docs/RALPH-BY-CATEGORY.md`](docs/RALPH-BY-CATEGORY.md) | **Ralph loop** per category + world-class targets |
| [`docs/phases-roadmap.md`](docs/phases-roadmap.md) | Phases 1–5 → time to use (summary) |
| [`docs/phases/README.md`](docs/phases/README.md) | **Detailed** phase 1–5 + error-testing plans |
| [`docs/conversation-closure-checklist.md`](docs/conversation-closure-checklist.md) | **Frozen** conversation ↔ plan + execution gaps |
| [`docs/mvp-demo-script.md`](docs/mvp-demo-script.md) | Demo script outline (fill at MVP close) |
| [`docs/templates/SPEC-TEMPLATE.md`](docs/templates/SPEC-TEMPLATE.md) | Copy for new feature specs |

## MVP backlog & UI (execution hints)

- [`docs/mvp-problems-and-next-steps.md`](docs/mvp-problems-and-next-steps.md) — Known problems + first 10 engineering steps + 5-seat rotation.
- [`docs/ui-mockups-2026.md`](docs/ui-mockups-2026.md) — Per-route UI/motion mockups.
- [`docs/ui-design-system-worldclass.md`](docs/ui-design-system-worldclass.md) — **Global UI system** (layout, type, color, motion, a11y).

## Quality checklist

- **Supabase**: `supabase db push`, `supabase functions deploy report-build`, `supabase functions deploy twilio-build-alert`.
- **Frontend**: `npm run lint`, `npm run build`.
- **Desktop companion**: `desktop-companion/` → `report-build`.
- **Twilio**: `supabase secrets set` per [`supabase/README.md`](supabase/README.md).
