# Phase 4 — Limited external (beta)

**Goal:** **Invited** workspaces, predictable **SLOs**, **support playbook**, cost visibility.  
**Time to use:** Paying design partners / pilot customers (small N).

---

## 4.1 Objectives

| ID | Objective | Done when |
|----|-----------|-----------|
| P4.1 | **Tenant provisioning** | New workspace < 5 min with clear limits (rate, seats) |
| P4.2 | **Entitlements** | Feature flags per tenant; kill switch documented |
| P4.3 | **Observability** | Per-tenant metrics dashboard; alert on error rate |
| P4.4 | **Support** | Runbook: how to reset onboarding, rotate gateway, contact on-call |
| P4.5 | **Feedback loop** | Structured feedback form + weekly review with pilot N |

---

## 4.2 Work breakdown

- **Runtime:** Autoscale, budget alerts, staging vs prod separation.  
- **Backend:** Row-level security / tenant_id on all tenant tables.  
- **Orchestrator:** NDA + pilot agreement template (outside repo if legal).  
- **QA:** Soak test checklist for beta.

---

## 4.3 Exit criteria

- [ ] N ≥ 3 pilot workspaces (or orchestrator-defined N) with signed feedback.  
- [ ] No undisclosed P0 for 2 consecutive weeks.  
- [ ] Cost per tenant within budget.

---

*Next:* [`phase-05-ga.md`](./phase-05-ga.md)
