# Phase 5 — General availability (GA)

**Goal:** **Self-serve** (if product-led), **billing**, **compliance pack**, **public status** / trust page.  
**Time to use:** Broad market.

---

## 5.1 Objectives

| ID | Objective | Done when |
|----|-----------|-----------|
| P5.1 | **Signup / billing** | Stripe or Azure Marketplace; invoices correct in sandbox → prod checklist |
| P5.2 | **Compliance pack** | DPA, subprocessors, data retention page; export/delete request path documented |
| P5.3 | **Status page** | Public or authenticated status for gateway + dependencies |
| P5.4 | **On-call** | Rotation + incident commander role + customer comms template |
| P5.5 | **GA comms** | Release notes, migration guide from beta, pricing page |

---

## 5.2 Work breakdown

- **Legal / counsel:** Owns DPA and securities-adjacent copy (IPO tracker remains educational).  
- **Runtime + Backend:** HA review, backup/restore drill.  
- **QA:** Full regression suite for GA tag.  
- **Orchestrator:** Go / no-go meeting.

---

## 5.3 Exit criteria

- [ ] GA tag + announcement.  
- [ ] SLOs published.  
- [ ] Runbooks + on-call live.

---

## After GA

**Phase 6+** — Firestorm merge, lead marketplace, multi-region, deeper IPO tooling — document in new `phase-06-*.md` when Phase 5 closes.

---

*Error program continues:* [`ERROR-TESTING-AND-HARDENING.md`](./ERROR-TESTING-AND-HARDENING.md)
