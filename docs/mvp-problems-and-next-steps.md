# MVP: full problem list + next 10 steps (5-agent operating model)

**Audience:** Core team dogfooding on **Azure** (see [`azure-managed-agents.md`](./azure-managed-agents.md)). This doc lists **current technical problems** and the **next 10 steps** to an MVP, using **five rotating roles** so ownership stays clear.

---

## Part A — Problems & recommendations (inventory)

### Build & performance

| ID | Problem / risk | Evidence | Recommendation |
|----|----------------|----------|----------------|
| P1 | **Single huge JS bundle** (~1.6MB+ gzipped path warning) | Vite build warns chunk > 500kb | **Route-based `import()`** for heavy pages (Financials, Journey, Flex, Template gallery, Lead intel); set `manualChunks` for `recharts` / `reactflow` if still large. |
| P2 | **No production bundle budget in CI** | No size gate in workflow | Add **rollup-plugin-visualizer** or `vite build --report` artifact + soft cap in GitHub Actions. |
| P3 | **Browserslist DB stale** | Build warns caniuse-lite age | `npx update-browserslist-db@latest` in maintenance PR. |

### Quality & security

| ID | Problem / risk | Evidence | Recommendation |
|----|----------------|----------|----------------|
| P4 | **ESLint warnings** (react-refresh on shadcn primitives) | 8 warnings in `src/components/ui/*`, `useSkin.tsx` | **Option A:** eslint-disable scoped for `components/ui`; **Option B:** split non-component exports to `*.ts` sidecars (larger diff). |
| P5 | **npm audit** findings | `@babel/runtime`, `@eslint/plugin-kit`, etc. | `npm audit fix`; triage **xlsx** / transitive highs manually. |
| P6 | **No automated tests** | No `*.test.*` in repo | **Vitest** for `lib/` (onboarding, dataPlane, company workspace); smoke test for critical routes. |
| P7 | **No auth on SPA** | Onboarding is localStorage-only | **Entra ID (MSAL)** for internal; public demo stays read-only or feature-flagged. |

### Infra & repo hygiene

| ID | Problem / risk | Evidence | Recommendation |
|----|----------------|----------|----------------|
| P8 | **`desktop-companion/target/` tracked** | ~1k+ files under git | **Remove from index**, add `desktop-companion/target/` to `.gitignore`, one-time `git rm -r --cached`. |
| P9 | **Duplicate GitHub Pages workflows** | `deploy.yml` + `jekyll-gh-pages.yml` both on `main` push | **Disable or delete** Jekyll workflow; single source = Vite `deploy.yml`. |
| P10 | **Legacy `supabase/` in tree** while Azure dogfood | Strategic | Keep for OSS; document **gateway** as source of truth for internal MVP (already in README). |

### Product & data plane

| ID | Problem / risk | Evidence | Recommendation |
|----|----------------|----------|----------------|
| P11 | **Gateway is URL-only** | No CRUD from SPA to Azure SQL/Cosmos | Ship **BFF** with `GET/POST /api/parties` (or Graph) + **managed identity**; replace demo lists. |
| P12 | **Supabase vs Azure split** | Financials still assume Supabase tables | For Azure profile: **fetch gateway** for financials or hide tab until API exists. |
| P13 | **Onboarding `/health` probe** | CORS may fail in browser | Document **APIM CORS**; allow “skip test” only with explicit demo flag. |
| P14 | **Many pages are shells** | Contacts, analytics, numbers, parts of settings | MVP scope: **finish 3 surfaces** (Contacts, Pipeline home, Company) before expanding. |
| P15 | **Framer Motion not in deps** | User asked for 2026 motion polish | Add **`framer-motion`** intentionally; use **layout** + **reduced-motion** prefers. |

### Design & UX consistency

| ID | Problem / risk | Evidence | Recommendation |
|----|----------------|----------|----------------|
| P16 | **Mixed visual language** | NotFound gray vs rest of app | Align **NotFound**, **Onboarding**, **Layout** under one shell (design agent output). |
| P17 | **No dedicated login screen** | Entra not wired | Login route + centered card per design mockups. |

---

## Part B — Five rotating agents (roles change each sprint)

| Seat | Sprint focus (example) | Always delivers |
|------|-------------------------|-------------------|
| **1 — Orchestrator / PM** | Scope, MVP cut-line, unblocks others | Written acceptance for each step below |
| **2 — Systems / Data** | Azure SQL schema, Cosmos events, migrations | ADR + migration or OpenAPI fragment |
| **3 — Gateway / Backend** | Container Apps, APIM, Key Vault, health | Runnable `GET /health` + one CRUD route |
| **4 — Frontend / UX** | SPA routes, lazy loading, MSAL | PR with screenshots + perf note |
| **5 — Quality / Sec / DevEx** | Lint policy, audit, CI, git hygiene | Green CI + checklist sign-off |

**Rotation rule:** each sprint, agents **shift one seat clockwise** so everyone touches infra once per month.

---

## Part C — Next 10 steps to MVP (ordered)

1. **Repo hygiene (P8, P9)** — Untrack `desktop-companion/target/`; remove or disable `jekyll-gh-pages.yml`; confirm only Vite Pages deploy runs.
2. **Gateway v0 (P11, P13)** — Deploy minimal API: `GET /health`, `GET /api/meta` (build/version), CORS for app origin; document env in `docs/azure-managed-agents.md`.
3. **Entra login (P7, P17)** — Add `/login` + MSAL redirect; protect routes or show “demo mode” banner when anonymous.
4. **Contacts MVP (P14)** — `GET/POST /api/parties` backed by Azure SQL; wire `ContactsPage` to gateway when `primaryProviderId` is Azure; keep local fallback for offline demo.
5. **Pipeline home (P14)** — Replace or slim build-centric `Index` for Azure dogfood: **open Motions / deals** from gateway (even if read-only list).
6. **Code-splitting (P1, P2)** — Lazy-load heaviest routes; add CI bundle report (soft fail).
7. **Financials path (P12)** — Either gateway aggregates or **hide Financial Command** until API exists (feature flag per plane).
8. **Tests + lint (P4, P6)** — Vitest for onboarding/dataPlane; eslint policy for `components/ui`; `npm audit fix` pass (P5).
9. **Motion + polish (P15, P16)** — Add `framer-motion`; unify NotFound/onboarding chrome with Layout tokens (see design mockups doc when ready).
10. **MVP demo script (Orchestrator)** — 15-minute script: login → company workspace → contacts → one campaign view → logout; file in `docs/mvp-demo-script.md`.

---

## Part D — Background: UI / motion design agent

A separate agent run produces **page-level mockup specs** (structure, motion, components) in:

**[`docs/ui-mockups-2026.md`](./ui-mockups-2026.md)** (~564 lines — login, onboarding, every nav route, 404; Framer Motion + a11y notes)

Use that doc as the single source for **login, onboarding, and every menu route** before large UI rewrites.

---

*Last updated: generated as engineering backlog; revise after each sprint review.*
