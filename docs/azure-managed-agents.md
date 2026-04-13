# Azure data plane + managed agents (internal dogfood)

Pipeline Pantry is **dogfooded on Microsoft Azure** before we sell it broadly: **Azure SQL Database**, **Cosmos DB**, **Blob Storage**, **Container Apps** (or AKS), **Microsoft 365** / **Entra ID**, and **Key Vault** for secrets—not Supabase in production for our own tenant.

## Architecture sketch

```text
Browser (SPA) ──HTTPS──► API / Container Apps (gateway)
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   Azure SQL            Cosmos DB            Blob Storage
   (relational)         (events, profiles)  (assets, exports)
         │
         └── Key Vault (connection strings, API keys)
```

The **onboarding wizard** stores only:

- `primaryProviderId` (e.g. `azure-sql`, `cosmos-sql`)
- `gatewayBaseUrl` (HTTPS root of your gateway)
- `connectionNotes` (resource group, subscription id, etc.—no secrets)

## Managed agent team (launch target)

A **small fleet of agents** that share context and update the same systems—**orchestrator + workers**, all calling the **same gateway** with **service identity** (no user passwords in agents):

| Role | Responsibility |
|------|------------------|
| **Orchestrator** | Breaks goals into tasks, assigns workers, merges conflicting updates, enforces guardrails ($ caps, consent flags). |
| **Data / pipeline engineer** | Schema migrations (SQL + Cosmos containers), indexing, backfills, data quality checks. |
| **Integration engineer** | Twilio, Graph, Blob lifecycle, CI hooks, APIM policies. |
| **Research / competitive** | Briefs on pricing and gaps; does not touch prod without human approval. |

**Communication:** Agents post structured **events** to Cosmos or a queue (Service Bus); humans approve **destructive** or **customer-facing** motions in the UI or Teams.

**Contract for the SPA:** Gateway exposes `GET /health` (CORS-enabled for your app origin) so onboarding can probe reachability.

## Onboarding rule

If the operator selects an **Azure-primary** backend (`azure-sql`, `azure-sql-managed-instance`, `cosmos-sql`, `cosmos-mongodb`, `cosmos-cassandra`, `fabric-sql`), the SPA **does not** instantiate Supabase in the browser—even if `VITE_SUPABASE_*` exists in the build. Clear onboarding or change primary to re-enable Supabase for demos.

## Repo note

The `supabase/` directory remains for **open-source consumers** and **migration history**; our internal deployment path is **Azure + gateway**.
