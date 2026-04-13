# Error testing, failure modes & hardening

**Runs across:** Phase 2 (first matrix), Phase 3 (full matrix + video-safe), Phase 4+ (load/soak), **continuously** after GA.  
**Owner:** Error testing / iteration agent (`agents.md` B11) + QA (`QA.md`).

---

## 1. Failure matrix (living table)

Fill cells with: **User-visible behavior**, **log signature**, **auto-retry?**, **owner**.

| Scenario | Gateway | SQL | Cosmos | Entra | SPA |
|----------|---------|-----|--------|-------|-----|
| Timeout |  |  |  |  |  |
| 401 / 403 |  |  |  |  |  |
| 429 rate limit |  |  |  |  |  |
| 5xx |  |  |  |  |  |
| CORS failure |  | — | — | — |  |
| Partial write / idempotency |  |  |  |  | — |

*Minimum before Phase 3 exit: **gateway down**, **401**, **SQL timeout** rows complete.*

---

## 2. Load & performance (staging)

| Gate | Target |
|------|--------|
| Gateway p95 | Document SLO (e.g. < 300ms health, < 800ms read list) |
| Concurrent users | k6 or Azure Load Testing script in `docs/qa/` (add when exists) |

---

## 3. Chaos (staging only)

| Experiment | Blast radius | Rollback |
|--------------|--------------|----------|
| Kill gateway pod | SPA shows friendly error + retry | Auto-restart ACA |
| Revoke SQL identity temporarily | 503 with message | Restore MI binding |

---

## 4. Regression discipline

- Every **P0/P1** bug gets a **linked** automated or scripted test within same sprint (`guardrails-no-drift.md`).  
- Weekly **smoke** on staging URL (5 min) — owner in `agents.md` MAKE IT WORK.

---

## 5. Security regression

- Secret scan on CI.  
- Dependency audit on cadence.  
- OWASP ZAP or equivalent on gateway **quarterly** post-GA.

---

*Update this file as matrix rows close; do not delete history—append dated sections.*
