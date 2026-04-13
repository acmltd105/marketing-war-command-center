# Swarm launch pack — Phase 1 (mock data) | CEO = Orchestrator

**Mode:** Parallel **5 agents** + **you (Orchestrator CEO)** merge, resolve conflicts, and accept/reject work.  
**Assumption:** No real Azure / Entra secrets — **mocks only** (`MSW`, in-memory handlers, or `import.meta.env.VITE_USE_MOCK_API=true`).

**Mock tenant:** `tenantId: "mock-tenant-acme"`  
**Mock user:** `user@mock.pipelinepantry.test` · displayName **Alex Orch**

---

## CEO pre-flight (you, 10 minutes)

1. Create branch: `cursor/swarm-phase1-mock-e628` from `main`.  
2. Post in each agent channel: **one** prompt block below + “branch + open `docs/guardrails-no-drift.md`”.  
3. Merge order: **Delta → Beta → Alpha → Gamma → Epsilon** (contracts first, then API shape, then UI, then tests, then docs).  
4. If two agents touch the same file: **CEO resolves**; agents must **pull before push**.

---

## Global guardrails (all agents)

| # | Rule |
|---|------|
| G1 | **No real secrets** in code, fixtures, or logs. Use placeholders from §Mock catalog below. |
| G2 | **No `fetch` to real** `*.azurecontainerapps.io` / production URLs in tests or default dev path. |
| G3 | **Feature flag** `VITE_USE_MOCK_API=true` gates all mock paths; default **off** until CEO merges flag doc. |
| G4 | **Max 8 files touched** per agent unless CEO approves expansion in writing. |
| G5 | **PR title prefix:** `[swarm-mock]` + agent codename. |
| G6 | **Lint + build green** before PR; no `@ts-nocheck` unless pre-existing file. |

---

## Global trip-ups (pre-brief every agent)

| Trip-up | Symptom | Prevention |
|---------|---------|------------|
| T1 | MSAL **double init** | Single `MsalProvider` at root; no second `PublicClientApplication` in leaf |
| T2 | **Redirect URI** mismatch | Mock mode skips real MSAL; use “Mock sign-in” button only |
| T3 | **Vite env** undefined | Only `VITE_*` keys; document in PR body |
| T4 | **MSW** swallows real future calls | `worker.stop()` in teardown; bypass when `VITE_USE_MOCK_API` false |
| T5 | **Merge conflict** in `App.tsx` | CEO merge order; agents avoid editing same hunks |
| T6 | **Bundle bloat** | Do not import full `lodash`; tree-shake |

---

## Mock data catalog (shared — copy verbatim)

```json
{
  "tenantId": "mock-tenant-acme",
  "user": {
    "oid": "00000000-0000-0000-0000-000000000001",
    "email": "user@mock.pipelinepantry.test",
    "name": "Alex Orch"
  },
  "parties": [
    { "id": "party-001", "type": "person", "displayName": "Jamie Deal", "primaryEmail": "jamie@example.test", "primaryPhone": "+15550000001" },
    { "id": "party-002", "type": "org", "displayName": "Acme Dental Co", "primaryEmail": "ops@acmedental.test", "primaryPhone": null }
  ],
  "gatewayHealth": { "status": "ok", "version": "0.0.0-mock", "region": "mock-east" }
}
```

---

## Output quality bars (wall-clock = one focused session each)

| Grade | Meaning | Rough time |
|-------|---------|----------------|
| **Great** | Mergable PR + README snippet + **screenshot or test output** in PR description | 45–90 min |
| **Good** | Mergable PR, tests or types pass, **minor** CEO follow-up | 30–45 min |
| **Below bar** | Lint/build fail, secrets leak, or >8 files without approval | **Do not merge** |

---

# Agent Delta — Contracts & fixtures (go first)

## Mission
Publish **golden JSON** + TypeScript types (or Zod schemas) for `Party`, `GatewayHealth`, and `AuthSession` so other agents do not invent shapes.

## Copy-paste prompt

```
You are Agent DELTA (Contracts). Branch: cursor/swarm-phase1-mock-e628. Read docs/guardrails-no-drift.md and docs/swarm-phase1-mock-launch-pack.md §Mock catalog.

Tasks:
1. Add docs/fixtures/mock-gateway/parties.json and gateway-health.json matching the catalog (pretty-printed).
2. Add src/lib/contracts/party.ts (or party.schema.ts) with Zod or TS types matching JSON.
3. Export a getMockParties(): Party[] for dev-only import from a single file.

Constraints: G1–G6. Max 8 files. No MSW here.

PR: [swarm-mock] delta — mock contracts + fixtures
```

## Trip-ups
- Schema drift vs Alpha’s UI — **freeze** field names: `id`, `type`, `displayName`, `primaryEmail`, `primaryPhone`.

## Great vs Good
- **Great:** Zod parse of fixtures in a test proves JSON matches schema.  
- **Good:** TS interfaces only, no runtime validation.

---

# Agent Beta — Mock gateway layer (second)

## Mission
**Mock HTTP** for `GET /health` and `GET /api/parties` when `VITE_USE_MOCK_API=true` — either **MSW** in `src/mocks/` or a tiny `fetch` wrapper in `src/lib/gatewayClient.ts` that returns catalog JSON.

## Copy-paste prompt

```
You are Agent BETA (Mock gateway). Branch: cursor/swarm-phase1-mock-e628. Pull latest after Delta merges.

Tasks:
1. Add src/lib/gatewayClient.ts with:
   - getGatewayBaseUrl()
   - fetchHealth(): Promise<GatewayHealth> — if VITE_USE_MOCK_API, return mock; else fetch(`${base}/health`)
   - listParties(): Promise<Party[]> — same pattern
2. If using MSW: src/mocks/browser.ts + register in main.tsx ONLY when VITE_USE_MOCK_API (dev).
3. Document env in README snippet in PR body.

Constraints: G1–G6. No real URLs. Max 8 files.

PR: [swarm-mock] beta — mock gateway client (+ optional MSW)
```

## Trip-ups
- **Hydration:** MSW must start before first `fetch` — init order in `main.tsx`.  
- **Production build:** MSW must **not** bundle to prod default — dynamic import or strip via `import.meta.env.DEV &&`.

## Great vs Good
- **Great:** Works with flag on/off; Vitest unit test for mock path.  
- **Good:** Mock path only; real path throws clear “not configured”.

---

# Agent Alpha — Frontend (third)

## Mission
**Mock sign-in** UI + wire **Contacts** page to `listParties()`; optional skeleton for `/login` with “Use mock session” button (no real MSAL in this swarm).

## Copy-paste prompt

```
You are Agent ALPHA (Frontend). Branch: cursor/swarm-phase1-mock-e628. Pull after Beta merges.

Tasks:
1. Add src/pages/LoginPage.tsx (or MockLoginPage.tsx): button “Continue as mock user” sets sessionStorage key mwcc:mock-session = JSON from swarm pack user object; redirect to /contacts.
2. Route /login in App.tsx (behind feature or always for mock sprint).
3. Update ContactsPage to call listParties() and render table; loading + empty states per docs/ui-mockups-2026.md tone.

Constraints: G1–G6. Max 8 files. No framer-motion unless already in package.json (skip if not).

PR: [swarm-mock] alpha — mock login + contacts wired to gatewayClient
```

## Trip-ups
- **Infinite redirect** — OnboardingGate: ensure mock session counts as “logged in” OR bypass gate when mock flag — coordinate with CEO.  
- **PII** — Use `.test` emails only from catalog.

## Great vs Good
- **Great:** Loading skeleton + error banner if `listParties` rejects.  
- **Good:** Basic list render only.

---

# Agent Gamma — QA (fourth)

## Mission
**Vitest** tests for `gatewayClient` mock path and optional contract test parsing Delta’s JSON.

## Copy-paste prompt

```
You are Agent GAMMA (QA). Branch: cursor/swarm-phase1-mock-e628. Pull after Alpha merges.

Tasks:
1. Add vitest + config if missing; npm script test:unit.
2. Tests: gatewayClient with VITE_USE_MOCK_API true returns 2 parties + health ok.
3. Optional: parse fixtures with Zod from Delta.

Constraints: G1–G6. Max 8 files. No network in CI tests.

PR: [swarm-mock] gamma — vitest for mock gateway + contracts
```

## Trip-ups
- **Vitest + Vite env** — `vi.stubEnv('VITE_USE_MOCK_API', 'true')` pattern.  
- **ESM** — use `vitest.config.ts` aligned with Vite.

## Great vs Good
- **Great:** Coverage on happy + error branch (mock throws).  
- **Good:** Happy path only.

---

# Agent Epsilon — Docs & demo script (last)

## Mission
Update **`docs/mvp-demo-script.md`** for **mock path**; add **`docs/swarm-runbook-mock.md`** one-pager: flags, merge order, how to record 2-min Loom.

## Copy-paste prompt

```
You are Agent EPSILON (Docs). Branch: cursor/swarm-phase1-mock-e628. Pull after Gamma merges.

Tasks:
1. docs/mvp-demo-script.md — add “Mock path” section: open /login → mock user → contacts shows Jamie + Acme.
2. docs/swarm-runbook-mock.md — CEO merge order, env vars, troubleshooting T1–T6 from swarm pack.
3. README: one bullet under planning linking swarm pack.

Constraints: G1–G6. Max 8 files.

PR: [swarm-mock] epsilon — mock demo script + runbook
```

## Trip-ups
- **Doc drift** — Link to `conversation-closure-checklist.md` §C for “what’s still real MVP”.

## Great vs Good
- **Great:** Screenshots placeholders + exact env block copy-paste.  
- **Good:** Text only.

---

## CEO merge checklist (after all PRs)

- [ ] Single feature flag story (`VITE_USE_MOCK_API`).  
- [ ] `npm run lint` + `npm run build` + `npm run test:unit` (if added).  
- [ ] No secrets in diff (`git grep -i sk-` empty).  
- [ ] Update `conversation-closure-checklist.md` changelog: “Mock swarm Phase 1 landed”.

---

*Orchestrator CEO: you are the only merge authority. Agents do not merge to `main` without you.*
