# Phase 1 — launch 3 Cursor agents now

**Use this file:** Open **three** Cursor chats (Composer or Agent), paste **one** block per chat, set each agent’s branch as listed, then run in parallel. **Orchestrator merges in order:** P1‑A → P1‑B → P1‑C (see [`cursor-claude-agent-split.md`](./cursor-claude-agent-split.md)).

**Read first (all agents):** [`../guardrails-no-drift.md`](../guardrails-no-drift.md), [`phase-01-foundation.md`](./phase-01-foundation.md), [`../spec-master.md`](../spec-master.md).

---

## Agent P1‑A — Systems / gateway

**Branch:** `cursor/p1-gateway-e628` (create from `main`)

```text
You are Cursor Agent P1-A (Systems / runtime) for Pipeline Pantry Phase 1.

Read: docs/phases/phase-01-foundation.md, docs/guardrails-no-drift.md, docs/azure-managed-agents.md, docs/spec-master.md.

Mission: Ship a minimal HTTPS API gateway the SPA can call: GET /health returns 200 JSON { status, version, region }; CORS allows the Vite app origin(s) (localhost:8080 + your staging URL) without credentials wildcard abuse; no secrets in git (Key Vault + managed identity where applicable).

Out of scope: React/MSAL changes (that is P1-B); .gitignore/workflows (P1-C).

Deliver: Gateway code or infra/ as appropriate for this repo; if gateway lives outside repo, add docs/runbooks/gateway-staging.md with URL, CORS list, and how onboarding “Test health” should probe it. Handoff: staging base URL for VITE_GATEWAY_BASE_URL.

Before finish: document curl examples. If you add Node code, include a minimal README for run locally.
```

---

## Agent P1‑B — Product surface / Entra + gateway wiring

**Branch:** `cursor/p1-msal-fe-e628` (create from `main` after P1-A has a URL, or stub with env-only if gateway not ready)

```text
You are Cursor Agent P1-B (Product surface) for Pipeline Pantry Phase 1.

Read: docs/phases/phase-01-foundation.md, docs/ui-mockups-2026.md, docs/guardrails-no-drift.md, README.md.

Mission: Microsoft Entra ID SPA auth: login redirect, handleRedirectPromise, silent token acquisition, logout; gate app routes when Entra is configured; send Authorization Bearer to the gateway client for GET /health and /api/parties when not in mock mode. Keep VITE_USE_MOCK_AUTH=true path working for local dev. Document VITE_MSAL_* and VITE_GATEWAY_BASE_URL in README.

Out of scope: Deploying Azure Container Apps (P1-A); CI/workflows and untracking target/ (P1-C).

Deliver: src changes + env example; align /login with ui-mockups where practical. npm run lint && npm run build must pass.

Merge after P1-A if gateway URL is required for end-to-end testing; you may merge to a integration branch with mock gateway first.
```

---

## Agent P1‑C — Quality / hygiene / CI / demo script v0

**Branch:** `cursor/p1-hygiene-ci-e628` (create from `main`)

```text
You are Cursor Agent P1-C (Quality & closure) for Pipeline Pantry Phase 1.

Read: docs/phases/phase-01-foundation.md, docs/mvp-demo-script.md, docs/QA.md, docs/guardrails-no-drift.md.

Mission: (1) Stop tracking desktop-companion/target/ if tracked — git rm --cached, .gitignore. (2) Ensure one primary GitHub Pages path: prefer .github/workflows/deploy.yml; disable or document duplicate jekyll-gh-pages if redundant. (3) CI runs lint + build on PR. (4) Update docs/mvp-demo-script.md to v0: login → home → logout (match actual app: mock or Entra). (5) Optional: npm run test if tests exist.

Out of scope: Gateway deploy (P1-A); MSAL implementation (P1-B) except fixing conflicts at merge.

Deliver: PR-ready commits; list any secrets or org settings the human must toggle in GitHub UI.

Before finish: npm run lint && npm run build locally.
```

---

## After merge

Update [`../spec-master.md`](../spec-master.md) changelog and check Phase 1 exit criteria in [`phase-01-foundation.md`](./phase-01-foundation.md).
