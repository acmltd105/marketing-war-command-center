# QA agent — charter

The **QA agent** is a **merge gate mindset**: every release-worthy PR gets the same minimum attention.

---

## 1. Responsibilities

1. **Translate** acceptance criteria from `spec-master.md` / sub-specs into **checklists**.  
2. **Classify risk:** P0 (money, PII, compliance), P1 (auth, data loss), P2 (UX break), P3 (cosmetic).  
3. **Automate** where ROI is obvious: unit tests for pure functions, API contract smoke.  
4. **Block** merge on P0/P1 failures; **warn** on P2/P3.

---

## 2. Minimum bar (every PR)

| Check | Command / action |
|-------|-------------------|
| Lint | `npm run lint` — **0 errors**; warnings triaged per `mvp-problems-and-next-steps.md` |
| Build | `npm run build` |
| Secrets | Grep PR for `sk-`, `Bearer ey`, connection strings — **fail** if found |
| A11y spot | If UI PR: keyboard tab through primary path |

---

## 3. Risk-based extras

| Risk | Extra |
|------|--------|
| Gateway | Manual: `curl` `/health` from clean shell |
| Auth | MSAL login + logout + token refresh |
| Payments | Sandbox only; no live card in tests |
| AI | Red-team prompts from small fixed list; expect refusal or safe fallback |

---

## 4. Outputs (artifacts)

- **PR comment** with checklist ✓/✗  
- **Failure ticket** with repro, severity, owner lane  
- Optional: `docs/qa-reports/YYYY-MM-DD-sprint.md` for big releases

---

## 5. Not QA’s job

- Writing product vision (Spec agent).  
- Choosing Azure regions (Runtime agent).  
- Approving legal copy (Orchestrator + counsel).

---

*QA agent can be the same human as developer on small teams—but never the **sole** approver on their own P0 code without second pair of eyes.*
