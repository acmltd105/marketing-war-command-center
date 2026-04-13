# Orchestration — research → final plan → scaffold → code → wire → ship

This is the **single pipeline** for how work moves. Every PR should state **which stage** it advances.

---

## Stage 0 — Research (inputs only)

**Outputs:** competitive notes, user/job story, risk list, **no production code** unless spike is explicitly approved in `guardrails-no-drift.md`.

**Exit:** Orchestrator accepts a **one-page decision** (in PR description or `docs/` note): what we learn + what we are **not** doing.

---

## Stage 1 — Final / final-draft plan

**Outputs:** updates to `spec-master.md`, `RALPH-BY-CATEGORY.md`, `phases-roadmap.md`, relevant feature mini-spec under `docs/`.

**Exit:** MVP slice is **numbered** and **ordered**; each item has **owner lane** (see `agents.md`).

---

## Stage 2 — Building & code scaffolding

**Outputs:** empty modules, route shells, OpenAPI stub, `types/` or shared DTOs, **feature flags**, migration placeholders.

**Exit:** `npm run build` green; **no** user-visible regression without flag; README or doc points to **how to turn scaffold on**.

---

## Stage 3 — Coding within each scaffold

**Outputs:** real logic behind interfaces; unit tests for pure functions; **no** cross-cutting refactor unless orchestrator-approved.

**Exit:** Each scaffold has **one** primary integration test path (manual script in PR or automated).

---

## Stage 4 — Wiring

**Outputs:** gateway routes bound to SPA; env vars documented; CORS; webhooks; Twilio/Graph test keys in **Key Vault** only.

**Exit:** End-to-end **one** path (e.g. create Party → appears in UI) demoable from clean env with **documented** steps.

---

## Stage 5 — Lane-specific polish (parallel)

These lanes run **after** Stage 4 for the same slice, in parallel where possible:

| Lane | Responsibility |
|------|----------------|
| **Frontend team** | Routes, lazy loading, MSAL, UI vs `ui-mockups-2026.md` |
| **Backend team** | SQL, Cosmos, APIM policies, idempotency |
| **AI team** | Agent prompts, tools whitelist, logging, **no** silent sends |
| **Wiring team** | Webhooks, Segment-like events, CI → gateway |
| **UI design team** | Motion, a11y, empty states — **spec only** unless paired with FE PR |
| **Runtime team** | Containers, autoscale, health, dashboards, cost |
| **Contracts team** (“py/json”) | JSON Schemas, OpenAPI, fixture files, import/export — **language-agnostic** |
| **MAKE IT WORK team** | On-call for demo day: scripts, smoke, rollback |

---

## Stage 6 — MVP finalized

**Outputs:** MVP checklist in `spec-master.md` all checked; **demo video** script recorded; **QA.md** exit gate passed.

---

## Stage 7 — Demo video

**Outputs:** 10–20 min walkthrough + 90s cut; captions; **no** real PII; scrub keys.

---

## Stage 8 — Error testing iteration

**Outputs:** chaos/failure matrix (gateway down, SQL timeout, 401, CORS); tickets filed with **severity**; fixes merged with tests.

---

## Stage 9 — Phase 2, 3, 4, 5 = time to use

See **`phases-roadmap.md`**. “Time to use” means **internal default path** is production-shaped: login, data, sends, observability—not “works on my laptop.”

---

## Orchestrator checklist (every merge to `main`)

1. Does this PR **name its stage** (0–9)?  
2. Does it **violate guardrails**?  
3. Does it **update the living spec** if behavior or scope changed?  
4. Did **QA agent** minimums run (lint, build, manual script if marked)?

---

*Orchestrator = human lead + lead engineer; agents execute inside lanes.*
