# Ralph loop — by category, subcategory, subtask (world-class targets)

**How to use this doc**

1. Pick a **category** below.  
2. Run **Ralph × 3** on that category only:  
   - **Pass 1 (C-):** list gaps honestly.  
   - **Pass 2 (B):** add measurable acceptance + owners.  
   - **Pass 3 (A+):** add **world-class target** — what best-in-class looks like *for a Series B infra + GTM team*.  
3. Log outcomes in **Changelog** at bottom of this file (date + category + final targets).  
4. Update **`spec-master.md`** if MVP scope or architecture changes.

**World-class definition (global):** *Fast, safe, observable, boring at 3am* — clear runbooks, small blast radius, honest UX, no secret sprawl.

---

## Category A — Research → finalized plan

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| A1 Market | Competitive matrix (SF → down-market) | Single table: wedge, TCO, time-to-value, **honest** “we lose when…” |
| A2 User | Jobs-to-be-done interviews (internal) | 10 verbatim quotes → **3** non-negotiable product laws |
| A3 Legal/compliance | Data map (PII, PCI, TCPA) | One-page **data flow** diagram + **retention** defaults |
| A4 Output | Lock MVP v1.1 | `spec-master.md` diff approved by orchestrator; **no** silent scope add |

---

## Category B — Building & code scaffolding

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| B1 Repo | Feature flags per surface | Every half-built route behind `VITE_FEATURE_*` or route-level lazy + “Soon” |
| B2 API | OpenAPI stub for gateway | `/openapi.json` generated in CI; **breaking** = semver |
| B3 Data | SQL migrations idempotent | `supabase db push` **or** Flyway-style Azure equivalent with rollback tested |
| B4 FE | Route skeletons match `ui-mockups-2026.md` | Empty states **match** copy in mockups; no orphan nav |

---

## Category C — Coding within scaffold

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| C1 Domain | Party/Deal/Outcome invariants | DB constraints + app validation **match**; fuzz tests on economics JSON |
| C2 Auth | MSAL token lifecycle | Silent renew; **logout** clears all caches; session timeout policy documented |
| C3 Comms | One channel “golden path” | Idempotent send; webhook signature verify; **DLQ** on failure |
| C4 Agents | Tool allowlist | Static list in repo; **deny-by-default** for new URLs |

---

## Category D — Wiring (integration spine)

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| D1 Gateway | CORS + APIM | Explicit allowed origins; **no** `*` with credentials |
| D2 Twilio | 10DLC / A2P evidence pack | Links to console proofs stored in **internal** wiki, not repo |
| D3 Graph | M365 send (if used) | Least-privilege app registration; audit log export |
| D4 CI | Build → gateway ping | Non-blocking notify + **blocking** on contract tests |

---

## Category E — Frontend team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| E1 Perf | Route code-split | LCP under budget on 4G for **home + contacts** |
| E2 A11y | Keyboard + focus | Zero critical axe issues on primary paths |
| E3 Motion | Framer Motion per `ui-mockups-2026.md` | `prefers-reduced-motion` honored; bundle impact measured |
| E4 State | React Query keys | Stable keys; **invalidation map** in doc for each mutation |

---

## Category F — Backend team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| F1 SQL | Index plan for Party queries | p95 read < 50ms at 10k rows on **prod SKU** |
| F2 Cosmos | Partition key + TTL | Hot partition test; TTL for ephemeral agent logs |
| F3 Vault | Secret rotation | Rotation runbook; **no** plain text in App Service settings |
| F4 API | Rate limits + abuse | Per-tenant token bucket; **429** with `Retry-After` |

---

## Category G — AI team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| G1 Safety | Prompt injection suite | Fixed **50** adversarial strings; pass rate published |
| G2 Economics | Max $ / hour caps | Enforced server-side; UI shows **remaining budget** |
| G3 Eval | Trace storage | Every agent call → structured log (no raw PAN/SSN) |
| G4 Human | HITL queue | SLA for human approval; **escalation** if queue depth > N |

---

## Category H — UI design team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| H1 System | Token audit (spacing, radius) | One **theme file** source of truth; dark mode parity if in scope |
| H2 Motion | Page transitions | Under 300ms; **no** layout shift on route change |
| H3 Content | Microcopy pass | Every empty state has **one** CTA + **one** sentence “why” |
| H4 Brand | Pipeline Pantry voice | Tone guide: confident, plain, **no** hype adjectives without proof |

---

## Category I — Runtime team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| I1 Deploy | Blue/green or slot swap | Rollback < 5 min; health checks **before** traffic shift |
| I2 Observe | Dashboards | RED metrics: rate, errors, duration; **SLO** per gateway route |
| I3 Cost | Budget alerts | Monthly cap alert at 50/80/100%; **owner** on-call |
| I4 DR | Backup test | Quarterly restore drill documented |

---

## Category J — Contracts / JSON / “py/json” team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| J1 Schema | JSON Schema for Party | CI validates fixtures; **semver** on schema |
| J2 Import | CSV column map | Versioned map file; invalid row report **downloadable** |
| J3 Export | GDPR export | One-click **ZIP** spec (even stub) with manifest |
| J4 Interop | Webhook payload examples | **Golden** samples in `docs/contracts/examples/` |

---

## Category K — MAKE IT WORK team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| K1 Demo | One script `docs/mvp-demo-script.md` | New hire runs demo **unassisted** in ≤ 30 min |
| K2 Smoke | 5-minute smoke | Automated in CI for **staging** URL |
| K3 Hotfix | Rollback decision tree | If P0, **revert first** then fix forward |
| K4 War room | Incident template | Roles, comms channel, customer comms template |

---

## Category L — MVP finalized team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| L1 Checklist | All MVP bullets in `spec-master.md` | Each item has **owner + date done** |
| L2 Sign-off | Orchestrator sign | Written “MVP closed” in changelog |
| L3 Freeze | Tag `mvp-1.0` | Optional git tag; **branch** protection on `main` rules reviewed |

---

## Category M — Demo video team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| M1 Script | Chapter markers | 8 chapters max; each maps to **value prop** |
| M2 Redact | PII scrub | Automated blur on emails/phones in post |
| M3 Short cut | 90s teaser | Autoplay-safe; captions; **no** sound required for value |
| M4 Host | CDN + access | Signed URL or unlisted; **expiry** policy |

---

## Category N — Error testing / iteration team

| Subcategory | Subtask | World-class target |
|-------------|---------|---------------------|
| N1 Matrix | Gateway down / SQL timeout / 401 | Each cell has **expected UX** + **log line** |
| N2 Load | k6 or Azure Load Testing | **p95** SLO documented; failure mode non-destructive |
| N3 Chaos | Random pod kill (staging) | Recovery < 2 min without human for stateless tier |
| N4 Regression | Bug → test | Every P0/P1 gets **linked** test in same sprint |

---

## Category O — Phase 2 / 3 / 4 / 5 (time to use expansion)

| Phase | Subcategory | Subtask | World-class target |
|-------|-------------|---------|---------------------|
| P2 | Beta | Onboarding self-serve | Tenant provisioning **< 5 min** with **clear** limits |
| P3 | GA | Billing + entitlements | Stripe/Azure Marketplace; **invoice** correctness 99.99% |
| P4 | Scale | Multi-region read | RPO/RTO numbers published |
| P5 | Ecosystem | Partner API keys | Scoped keys; **revocation** < 1 min propagate |

---

## Changelog (Ralph outcomes — append only)

| Date | Category | Summary |
|------|----------|---------|
| Planning pause | ALL | Initialized Ralph-by-category table with world-class targets; execution deferred. |

---

*Next Ralph cycle: pick **Category B** first (scaffolding) after orchestrator unpauses.*
