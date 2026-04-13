# Pipeline Pantry — master spec (living / final-draft)

**Version:** 1.0-planning  
**Nature:** This document is the **canonical product + engineering contract** for pause/planning. It **supersedes ad-hoc README detail** for scope; README stays the public front door and links here.

---

## 1. One-liner

**Pipeline Pantry** turns **idea → company → revenue → retention → expansion** into a **single operable spine**—with **Azure** as internal system of record (SQL, Cosmos, Blob, containers, M365), **gateway-first** security, and **managed agents** for velocity—without pretending the browser is a database.

---

## 2. Non-goals (explicit)

- Not a law firm, broker, or CPA substitute (no legal/tax **advice** in UI; handoffs only).
- Not “replace Salesforce” in one release; **wedge** is revenue execution + lifecycle spine.
- Not storing **secrets** (SQL passwords, Cosmos keys, full EIN) in `localStorage` or static builds.

---

## 3. MVP definition (frozen until master spec v1.1)

**MVP = internal dogfood “time to use” for one real workspace:**

1. Operator completes **onboarding** (Azure-primary + gateway URL).
2. **Entra login** gates the app (or explicit demo mode with banner).
3. **Contacts** (Party) list + create via **gateway → Azure SQL**.
4. **Company workspace** checklist + profile persisted (gateway sync optional v1.1).
5. **One outbound motion** (e.g. test SMS or email) from a **server-side** path—not anonymous bulk from browser.
6. **15-minute demo script** passes without manual DB hacks.

Anything else is **Phase 2+** unless it unblocks the six above.

---

## 4. System architecture (target)

```text
Browser (Vite SPA) ──HTTPS──► Azure API (Container Apps / APIM)
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   Azure SQL                Cosmos DB              Blob Storage
   (Party, Deal, …)         (events, agent jobs)     (assets, exports)
         │
         └── Key Vault + Managed Identity + Entra ID
```

**Agents** (see `agents.md`, `azure-managed-agents.md`) call the **same gateway** with **service identity**—never end-user passwords.

---

## 5. Doc map (all MDs that matter for “path forward”)

| Path | Role |
|------|------|
| `docs/spec-master.md` | This file — scope, MVP, architecture |
| `docs/RALPH-BY-CATEGORY.md` | Ralph iterations per work category |
| `docs/orchestration.md` | Pipeline from idea to merged code |
| `docs/agents.md` | Roles and contracts |
| `docs/guardrails-no-drift.md` | Anti-drift |
| `docs/QA.md` | Quality agent |
| `docs/phases-roadmap.md` | Phases 1–5 |
| `docs/spec-pipeline-to-revenue-ralph-a-plus.md` | Deep product/engine moat spec |
| `docs/company-lifecycle-pipeline.md` | Formation → IPO narrative |
| `docs/azure-managed-agents.md` | Azure + agents |
| `docs/mvp-problems-and-next-steps.md` | Known issues + first 10 engineering steps |
| `docs/ui-mockups-2026.md` | UI/motion per route |
| `supabase/README.md` | OSS / legacy telemetry path |
| `docs/ci-integration.md` | CI → report-build |

---

## 6. Changelog (living)

| Date | Change |
|------|--------|
| Planning pause | Created master spec + hub + orchestration + agents + QA + guardrails + Ralph-by-category + phases |
| Planning pause | Added `docs/INDEX.md`, `mvp-demo-script.md`, `templates/SPEC-TEMPLATE.md`; README planning banner + table |

---

*Bump **Version** and **Changelog** when MVP definition or architecture materially changes.*
