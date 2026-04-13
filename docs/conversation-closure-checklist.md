# Conversation closure — frozen checklist

**Frozen as of:** planning close (pre–MVP execution)  
**Purpose:** Single artifact that **locks** what the full thread decided vs what remains **execution** work. Update only when orchestrator **unfreezes** with a dated note.

---

## A. What the conversation fully decided (frozen)

| # | Decision |
|---|----------|
| 1 | Product name: **Pipeline Pantry**; repo slug may stay `marketing-war-command-center`. |
| 2 | **Pipeline** = revenue motion **+** company lifecycle (idea → IPO); not “CRM tabs only.” |
| 3 | Internal dogfood: **Azure** (SQL, Cosmos, Blob, containers, M365) + **gateway**; **no** Supabase in browser when onboarding = **Azure-primary**. |
| 4 | Primitives: **Party / Motion / Outcome** (+ company workspace profile/checklists). |
| 5 | **Value law:** features tie to make $, save $, or risk $. |
| 6 | **Ralph** + **world-class targets** live in `RALPH-BY-CATEGORY.md`; iterate by category when unpaused. |
| 7 | **Pause:** execution follows `INDEX.md`, `guardrails-no-drift.md`, `spec-master.md` until secrets + orchestrator say go. |
| 8 | **Orchestration** stages 0–9 and **agent lanes** are canonical in `orchestration.md` + `agents.md`. |
| 9 | **QA** and **no-drift** rules are canonical in `QA.md` + `guardrails-no-drift.md`. |
|10 | **UI** direction and per-route mockups: `ui-mockups-2026.md`. |
|11 | **Unblock list** for fast ship: Entra IDs, gateway URL, SQL path, optional Twilio, choice **A (Azure)** vs **B (Supabase demo)** — see README / team handoff. |

---

## B. Planning docs = complete (aligned with conversation)

| Doc | Role |
|-----|------|
| `docs/INDEX.md` | Hub |
| `docs/spec-master.md` | MVP definition, architecture, changelog |
| `docs/orchestration.md` | Pipeline |
| `docs/agents.md` | Lanes |
| `docs/QA.md` | QA charter |
| `docs/guardrails-no-drift.md` | Anti-drift |
| `docs/RALPH-BY-CATEGORY.md` | Ralph + targets |
| `docs/phases-roadmap.md` | Summary + **links to `docs/phases/*`** |
| `docs/phases/README.md` | Phase index |
| `docs/phases/phase-01` … `phase-05` | Detailed phases |
| `docs/phases/ERROR-TESTING-AND-HARDENING.md` | Error / failure / regression program |
| `docs/conversation-closure-checklist.md` | **This file** |

---

## C. MVP execution still open (not frozen — work backlog)

| # | Gap |
|---|-----|
| 1 | **MSAL + `/login`** |
| 2 | **Gateway** implementation (`/health`, API, CORS) |
| 3 | **Contacts** (and optionally financials) via gateway → Azure SQL |
| 4 | **`framer-motion`** dependency + selective use |
| 5 | **Untrack** `desktop-companion/target/` (if still in index) |
| 6 | **One** GitHub Pages workflow (remove/disable Jekyll duplicate) |
| 7 | **Vitest** + audit / eslint triage |
| 8 | **Firestorm** merge (post-MVP unless reprioritized) |
| 9 | Vision-only: Closer Bot, Lead Faucet, full Segment/payments — **after** MVP spine |

---

## D. Unfreeze protocol

1. Orchestrator posts **date + reason** at bottom of this file.  
2. First PR after unfreeze must **reference** `spec-master.md` MVP section.  
3. Any scope change to section **A** requires **orchestrator + changelog** in `spec-master.md`.

---

## Changelog (this file only)

| Date | Note |
|------|------|
| Freeze | Initial conversation closure + phase doc split created. |
