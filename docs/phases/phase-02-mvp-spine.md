# Phase 2 — MVP spine

**Goal:** **Party** list/create via **gateway → Azure SQL**; **Company workspace** read/write via gateway (or read-only + sync job); **one** outbound **sandbox** motion (SMS or email) **server-side only**.  
**Time to use:** Internal GTM + founders.  
**Depends on:** Phase 1 complete; SQL schema deployed; Twilio (or Graph) sandbox creds if doing send.

---

## 2.1 Objectives

| ID | Objective | Done when |
|----|-----------|-----------|
| P2.1 | **OpenAPI** (or minimal REST contract) for `GET/POST /api/parties` | FE consumes typed client or fetch wrapper |
| P2.2 | **Azure SQL** tables aligned with app (`party` minimum; optional `deal`) | Migrations applied in dogfood sub |
| P2.3 | **Contacts page** uses gateway when `primaryProviderId` is Azure | Create + list works without Supabase |
| P2.4 | **Company workspace** | `GET/PATCH /api/company-workspace` or equivalent; or nightly sync from `localStorage` |
| P2.5 | **One send** | Server route calls Twilio (or SendGrid) with test numbers; idempotent id header |
| P2.6 | **Financials** | Either gateway aggregates **or** feature-flag hide for Azure until P2.7 |

---

## 2.2 Work breakdown

- **Backend:** SQL + routes + Key Vault + structured errors (`problem+json` optional).  
- **Frontend:** Wire `ContactsPage`, optional `CompanyPage` sync, error states.  
- **Contracts:** JSON schema for Party in `docs/contracts/examples/` (stub OK).  
- **AI:** Not required for MVP spine unless “draft reply” is in scope — default **off**.  
- **QA:** CRUD tests + send smoke in sandbox only.

---

## 2.3 Exit criteria

- [ ] `spec-master.md` **MVP checklist** (six bullets) all checked.  
- [ ] Demo script **v1** includes create Party + optional send.  
- [ ] No P0/P1 open on spine path.

---

## 2.4 Risks

| Risk | Mitigation |
|------|------------|
| SQL connection from gateway | Managed identity; no password in ACA settings |
| PII in logs | Redact phone/email in gateway logs |

---

*Next:* [`phase-03-demo-hardening.md`](./phase-03-demo-hardening.md)
