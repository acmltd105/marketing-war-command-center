# Phase 1 — Foundation

**Goal:** Internal team can **log in**, hit a **live gateway**, and trust **repo + CI + bundle** basics.  
**Time to use:** Developers only.  
**Depends on:** Secrets (Entra SPA, gateway URL); see conversation closure §A.11.

---

## 1.1 Objectives

| ID | Objective | Done when |
|----|-----------|-----------|
| P1.1 | **Entra ID (MSAL)** in SPA — `/login`, silent renew, logout | Demo user completes full loop on staging |
| P1.2 | **Gateway** deployed: `GET /health` = 200, CORS allows app origin | Browser onboarding “Test health” passes |
| P1.3 | **Repo hygiene** | `desktop-companion/target/` not tracked; `.gitignore` correct |
| P1.4 | **Single Pages workflow** | Only Vite `deploy.yml` active; Jekyll workflow removed or disabled |
| P1.5 | **Route code-splitting** | LCP acceptable on `/` + `/contacts` per budget in `mvp-problems-and-next-steps` |
| P1.6 | **CI** | `lint` + `build` required; optional bundle report artifact |

---

## 1.2 Work breakdown (assign to agents.md lanes)

- **Backend / gateway:** Container Apps (or APIM) + health + CORS + **no** secrets in repo.  
- **Frontend:** MSAL config, `/login` per `ui-mockups-2026.md`, lazy routes.  
- **Runtime:** Key Vault references, managed identity on gateway.  
- **QA:** Auth smoke + health smoke in checklist.  
- **MAKE IT WORK:** Staging URL documented for demo v0.

---

## 1.3 Exit criteria (all required)

- [ ] `docs/mvp-demo-script.md` **v0** runnable unassisted (login → home → logout).  
- [ ] No P0 security issues (secrets, CORS `*` with credentials).  
- [ ] Orchestrator sign-off on **Phase 1 complete** in `spec-master.md` changelog.

---

## 1.4 Risks

| Risk | Mitigation |
|------|------------|
| CORS blocks health test | APIM policy or ACA ingress CORS explicit list |
| Entra redirect mismatch | Document exact redirect URIs in runbook |

---

*Next phase:* [`phase-02-mvp-spine.md`](./phase-02-mvp-spine.md)
