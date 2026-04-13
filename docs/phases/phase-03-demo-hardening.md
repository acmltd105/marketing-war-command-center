# Phase 3 — Demo polish, video, first hardening pass

**Goal:** **Ship the story** — polished demo, **recorded video**, first **error-testing** pass (see also [`ERROR-TESTING-AND-HARDENING.md`](./ERROR-TESTING-AND-HARDENING.md)).  
**Time to use:** Trusted design partners / pilot prep.

---

## 3.1 Objectives

| ID | Objective | Done when |
|----|-----------|-----------|
| P3.1 | **UI polish** vs `ui-mockups-2026.md` | Primary paths match mockups (login, onboarding, contacts, company, home) |
| P3.2 | **`framer-motion`** | Added dep; page transitions + `prefers-reduced-motion` |
| P3.3 | **Demo script v2** | `docs/mvp-demo-script.md` matches actual UI; 15 min dry-run recorded |
| P3.4 | **Video** | Raw + 90s teaser; captions; PII scrubbed |
| P3.5 | **Error matrix v1** | At least gateway down + 401 + SQL timeout rows filled with **expected UX** |
| P3.6 | **Bug bash** | P0/P1 list empty or explicitly waived by orchestrator |

---

## 3.2 Work breakdown

- **UI design + FE:** Motion, empty states, NotFound alignment.  
- **MAKE IT WORK + Demo video agents:** Recording, hosting policy.  
- **Error testing agent:** Matrix in ERROR doc; file bugs with severity.  
- **QA:** Sign-off doc for Phase 3.

---

## 3.3 Exit criteria

- [ ] Published demo link (internal).  
- [ ] `QA.md` checklist for release candidate passed.  
- [ ] ERROR doc matrix ≥ 6 cells with expected behavior.

---

*Next:* [`phase-04-beta.md`](./phase-04-beta.md)
