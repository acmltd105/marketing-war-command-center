# Cursor Claude agent split — three agents per phase

**Purpose:** Run **three parallel Cursor agents** (Claude in Cursor) per phase without overlap or drift. Each agent owns a **lane**; the orchestrator merges and resolves conflicts. Read [`../guardrails-no-drift.md`](../guardrails-no-drift.md) and the phase doc before starting.

**Naming:** Per phase, use **Agent 1 / 2 / 3** in prompts. Below they map to **Systems**, **Product surface**, **Quality & closure** so roles stay consistent across phases.

**Global rules for every agent**

- Branch: `cursor/<phase-short>-<lane>-e628` (or your team’s suffix).
- Before coding: open the phase `.md`, `docs/spec-master.md`, and `docs/INDEX.md`.
- After coding: `npm run lint`, `npm run test` (if applicable), `npm run build`; paste results in the handoff note.
- Do not edit another agent’s “owns” files unless blocked—then leave a `TODO(agent-X)` comment and message orchestrator.

---

## Phase 1 — Foundation (remaining work)

**Phase doc:** [`phase-01-foundation.md`](./phase-01-foundation.md)

| Agent | Lane | Mission | Owns / delivers |
|-------|------|---------|-----------------|
| **P1‑A** | Systems / runtime | Live **gateway** on Azure-shaped infra: `GET /health`, CORS for app origins, managed identity, Key Vault refs, **no secrets in repo**. | Gateway repo or `infra/`; runbook for URL + CORS; staging health URL for onboarding probe. |
| **P1‑B** | Product surface | **Entra MSAL** end-to-end on staging: login, silent token, logout, redirect URIs documented; align `/login` with [`../ui-mockups-2026.md`](../ui-mockups-2026.md). | `src/lib/msalConfig.ts`, `LoginPage`, `AppAuthGate` / MSAL shell; env template for SPA. |
| **P1‑C** | Quality & closure | **Repo + CI hygiene**, bundle/LCP sanity: untrack `desktop-companion/target/`, single Pages workflow, CI `lint`+`build`, optional bundle artifact; demo script **v0** runnable. | `.gitignore`, workflows, `docs/mvp-demo-script.md` updates, checklist in `spec-master.md` changelog. |

**Merge order:** P1‑A (gateway) → P1‑B (FE consumes real URLs) → P1‑C (CI + docs).

**Launch now (copy-paste prompts):** [`phase-01-cursor-launch-now.md`](./phase-01-cursor-launch-now.md)

---

## Phase 2 — MVP spine

**Phase doc:** [`phase-02-mvp-spine.md`](./phase-02-mvp-spine.md)

| Agent | Lane | Mission | Owns / delivers |
|-------|------|---------|-----------------|
| **P2‑A** | Systems / backend | **OpenAPI or REST contract**, **Azure SQL** migrations (`party`, optional `deal`), gateway routes `GET/POST /api/parties`, optional `GET/PATCH /api/company-workspace`, structured errors, PII-safe logging. | SQL migrations, gateway handlers, example payloads in `docs/contracts/examples/` if present. |
| **P2‑B** | Product surface | Wire **Contacts** + **Company** to gateway when Azure-primary; loading/error states; feature-flag **Financials** if needed. | `ContactsPage`, `CompanyPage`, `gatewayClient.ts`, onboarding credential path. |
| **P2‑C** | Quality & closure | **One sandbox send** server-side (Twilio or email provider), idempotency key; **CRUD + send** smoke tests; demo script **v1** snippet for create Party + send. | Send route/service, sandbox-only tests, doc updates. |

**Merge order:** P2‑A (API + DB) → P2‑B (FE) → P2‑C (send + tests + script).

---

## Phase 3 — Demo hardening

**Phase doc:** [`phase-03-demo-hardening.md`](./phase-03-demo-hardening.md) · **Error:** [`ERROR-TESTING-AND-HARDENING.md`](./ERROR-TESTING-AND-HARDENING.md)

| Agent | Lane | Mission | Owns / delivers |
|-------|------|---------|-----------------|
| **P3‑A** | Systems / platform | **Error matrix v1** for gateway: down, 401, timeout; document expected UX; optional gateway `Retry-After` / correlation id. | `ERROR-TESTING-AND-HARDENING.md` filled cells; small FE utilities for mapped errors if needed. |
| **P3‑B** | Product surface | **UI polish** vs [`../ui-mockups-2026.md`](../ui-mockups-2026.md); **`framer-motion`** with `prefers-reduced-motion`; primary paths (login, onboarding, contacts, company, home). | Motion wrapper, page transitions, empty states, NotFound. |
| **P3‑C** | Quality & closure | **Demo script v2**, **recorded dry-run** notes, **video** (raw + 90s teaser checklist), **bug bash** P0/P1 triage; `QA.md` Phase 3 sign-off. | `docs/mvp-demo-script.md`, QA doc, hosting policy for video (links only in repo if needed). |

**Merge order:** P3‑A and P3‑B can start in parallel; P3‑C last (depends on stable UI + errors).

---

## Phase 4 — Beta (limited external)

**Phase doc:** [`phase-04-beta.md`](./phase-04-beta.md)

| Agent | Lane | Mission | Owns / delivers |
|-------|------|---------|-----------------|
| **P4‑A** | Systems / runtime | **Tenant provisioning**, autoscale, staging vs prod, **budget alerts**, **per-tenant metrics** and error-rate alerts; **RLS / tenant_id** on tenant tables in DB + gateway enforcement. | Infra as code or runbooks; gateway middleware for tenant context. |
| **P4‑B** | Product surface | **Entitlements** (feature flags per tenant), **kill switch** UX + admin doc; **feedback** entry points in app (structured form or deep link). | FE flags, optional minimal admin surface; links to support runbook. |
| **P4‑C** | Quality & closure | **Support runbook** (reset onboarding, rotate gateway, on-call); **soak test** checklist; pilot **N** tracking template; exit criteria checklist. | `docs/` runbooks, soak checklist, orchestrator-facing sign-off list. |

**Merge order:** P4‑A (tenant + data plane) → P4‑B (product) → P4‑C (ops + QA artifacts).

---

## Phase 5 — General availability

**Phase doc:** [`phase-05-ga.md`](./phase-05-ga.md)

| Agent | Lane | Mission | Owns / delivers |
|-------|------|---------|-----------------|
| **P5‑A** | Systems / runtime | **HA / backup-restore** drill, gateway hardening, **status page** data source (health aggregation); dependency checks for status. | Status API or static generator; infra checklist. |
| **P5‑B** | Product surface | **Signup + billing** path (Stripe or Azure Marketplace sandbox → prod checklist); **GA comms** in product: release notes, pricing surfacing, migration from beta copy in UI. | Checkout or marketplace links, in-app billing state, copy. |
| **P5‑C** | Quality & closure | **Compliance pack** placeholders in repo (links to counsel-owned DPA/subprocessors/retention/export-delete **process**); **on-call** rotation doc + incident comms template; **full regression** gate for GA tag. | Docs + `QA.md` GA bar; go/no-go checklist. |

**Merge order:** P5‑A and P5‑B parallel where possible; P5‑C owns final regression + tag process.

---

## Optional: ERROR program as three continuous agents

**Doc:** [`ERROR-TESTING-AND-HARDENING.md`](./ERROR-TESTING-AND-HARDENING.md)

| Agent | Mission |
|-------|---------|
| **ERR‑1** | Failure matrix ownership: new rows, severity, expected UX. |
| **ERR‑2** | Load / performance baselines; budget alerts tied to tests. |
| **ERR‑3** | Chaos + regression cadence; security regression subsection. |

Run across P2–P5; do not block phase merges on ERR unless orchestrator elevates a row to P0.

---

## Copy-paste prompt stub (per agent)

```text
You are Cursor Agent <P#-A|B|C> for Pipeline Pantry.
Read: docs/phases/<phase-file>.md, docs/guardrails-no-drift.md, docs/spec-master.md.
Lane: <Systems | Product surface | Quality & closure> per docs/phases/cursor-claude-agent-split.md.
Branch: cursor/<short>-<lane>-e628.
Owns: <paste row from table>.
Out of scope: <other two agents’ rows>.
Deliver: code + docs updates + lint/test/build results.
```

---

*Orchestrator merges branches in the merge order listed; updates [`../spec-master.md`](../spec-master.md) changelog when a phase closes.*
