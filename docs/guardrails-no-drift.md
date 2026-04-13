# Guardrails — no drift

**Purpose:** Prevent the codebase from becoming a **grab bag** of unrelated features, secret leaks, or unbounded scope.

---

## 1. Scope drift

| Rule | Detail |
|------|--------|
| **One PR = one stage** | From `orchestration.md`: state stage (0–9). Mixed stages → split PRs. |
| **MVP freeze** | `spec-master.md` MVP section changes only via **orchestrator + dated changelog** entry. |
| **No drive-by refactors** | Refactors must be **their own PR** with measured benefit (bundle, type safety, a11y). |

---

## 2. Security drift

| Rule | Detail |
|------|--------|
| **No secrets in repo** | No keys, tokens, connection strings, full EIN in code or MD examples (use placeholders). |
| **Browser boundary** | SPA never holds SQL/Cosmos credentials; only **gateway URL** + **Entra** tokens. |
| **Dependency drift** | `npm audit` triage on a **cadence**; critical CVEs block merge. |

---

## 3. Product / narrative drift

| Rule | Detail |
|------|--------|
| **Money line** | User-facing feature must tie to **make $** or **save $** or **risk $** in one sentence (see `spec-pipeline-to-revenue-ralph-a-plus.md`). |
| **No fake metrics** | No hard-coded “47K users” unless backed by query or clearly labeled **demo**. |
| **Legal** | No “we guarantee IPO” or tax/legal **advice**; use “checklist / handoff to counsel.” |

---

## 4. Architecture drift

| Rule | Detail |
|------|--------|
| **Single data plane per env** | Internal = Azure + gateway; do not silently reintroduce Supabase reads for Azure profile. |
| **API contracts** | Breaking gateway contract requires **version bump** or **feature flag** + doc update. |

---

## 5. Doc drift

| Rule | Detail |
|------|--------|
| **Living docs** | If behavior changes, update **`spec-master.md`** or the relevant spec the same PR—or open a **doc debt** ticket with owner. |
| **INDEX** | New canonical doc → add row to `docs/INDEX.md`. |

---

## 6. AI drift

| Rule | Detail |
|------|--------|
| **Tool whitelist** | Agents cannot call arbitrary HTTP; only approved routes. |
| **Human gate** | Bulk customer-facing sends require explicit human confirm in v1. |

---

## 7. When drift is suspected

1. Orchestrator labels issue **drift-risk**.  
2. Spec agent proposes **revert or narrow**.  
3. If disagree, **ADR** in `docs/` before proceeding.

---

*“No drift” is a culture rule enforced at merge time—not a linter.*
