# Agents — roles, inputs, outputs, handoffs

**Principle:** Small number of **named roles** with **clear contracts**. Same person can wear multiple hats; the **hat** must be declared in PR description.

---

## Core agents (always)

### A1 — Orchestrator

- **Inputs:** Business priority, risk tolerance, calendar of demos.  
- **Outputs:** Ordered backlog, merge approval, **stage** label on work, conflict resolution between lanes.  
- **Handoff to:** All agents.

### A2 — Spec / PM agent

- **Inputs:** Research notes, customer quotes, legal constraints.  
- **Outputs:** Updates to `spec-master.md`, `RALPH-BY-CATEGORY.md`, acceptance criteria per task.  
- **Handoff to:** Scaffolding (Stage 2), QA (acceptance).

### A3 — QA agent

- **Inputs:** Acceptance criteria, risk class (P0–P3).  
- **Outputs:** Test plan, automated tests where ROI clear, **block / ship** recommendation.  
- **Charter:** [`QA.md`](./QA.md).

---

## Build agents (by lane)

### B1 — Frontend team agent

- **Stack:** React, Vite, TanStack Query, MSAL, Tailwind/shadcn.  
- **Inputs:** `ui-mockups-2026.md`, OpenAPI or DTO types.  
- **Outputs:** PRs with screenshots for UI change; lazy routes for heavy pages.  
- **Handoff to:** Wiring (API client), QA.

### B2 — Backend / gateway team agent

- **Stack:** C# or Node on Container Apps, Azure SQL, Cosmos, Key Vault.  
- **Inputs:** ERD, idempotency rules, rate limits.  
- **Outputs:** OpenAPI fragment, migrations, `GET /health`.  
- **Handoff to:** Wiring, Runtime.

### B3 — AI team agent

- **Inputs:** Tool list, max $ at risk, PII policy.  
- **Outputs:** Prompt packs, eval logs, **human-in-the-loop** defaults.  
- **Handoff to:** Backend (tool endpoints), QA (safety cases).

### B4 — Wiring / integration team agent

- **Inputs:** Twilio, Microsoft Graph, webhooks, CI secrets.  
- **Outputs:** Signed webhook handlers, replay docs, APIM routes.  
- **Handoff to:** MAKE IT WORK for demo wiring.

### B5 — UI design team agent

- **Inputs:** Brand constraints, accessibility level.  
- **Outputs:** Updates to `ui-mockups-2026.md`, Figma links if any (optional).  
- **Handoff to:** Frontend (implementation PR).

### B6 — Runtime / SRE team agent

- **Inputs:** SLAs, regions, cost caps.  
- **Outputs:** IaC or portal checklist, alerts, runbooks.  
- **Handoff to:** Orchestrator (go-live).

### B7 — Contracts / “py/json” team agent

- **Inputs:** Domain events (Party created, Outcome recorded).  
- **Outputs:** JSON Schema, OpenAPI, fixture `.json`, CSV import maps — **not** tied to Python; name = “serialization & contracts.”  
- **Handoff to:** Backend + Frontend generators if used.

### B8 — MAKE IT WORK team agent

- **Inputs:** Demo date, env list.  
- **Outputs:** One script `docs/mvp-demo-script.md` executable; smoke checklist; hotfix PRs only.  
- **Handoff to:** Demo video agent.

### B9 — MVP finalized team agent

- **Inputs:** MVP checklist in `spec-master.md`.  
- **Outputs:** Signed “MVP done” note in changelog; freeze branch tag optional.

### B10 — Demo video team agent

- **Inputs:** MVP demo script, staging URL.  
- **Outputs:** Raw + edited video, chapter markers, **redacted** recording.

### B11 — Error testing / iteration team agent

- **Inputs:** Failure matrix from QA.  
- **Outputs:** Repro steps, fixes, regression tests.

---

## Managed agents (automation / LLM)

See **`azure-managed-agents.md`**. These are **workers** under orchestrator policy—not a replacement for human merge on risky changes.

---

## Rotation (optional)

Five-seat rotation from `mvp-problems-and-next-steps.md` can map to **A1 + B1–B4 + A3** weekly rotation so everyone touches gateway once per month.

---

*Add new agents only with orchestrator approval—otherwise headcount explodes.*
