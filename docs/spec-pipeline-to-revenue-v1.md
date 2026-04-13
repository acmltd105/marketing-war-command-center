# Spec Plan v1 — Pipeline to Revenue (strip-back + full line of attack)

**Orchestrator role:** Product + platform design that stays **simple enough for a non-expert operator** (“idiot-proof” = **defaults, guardrails, one primary job per screen**) while remaining **powerful** under the hood (schema, APIs, AI tools, compliance).

**Research inputs:** Competitive brief (Attio, Airtable, HubSpot/Pipedrive/Close, Segment+CRM patterns) + codebase inventory (routes, sidebar drift, demo data).

---

## 1. North star (one sentence)

**Every lead becomes an outcome**—sale, upsell, cross-sell, downsell, fastest refund, referral, or star-rated service moment—tracked as **first-class pipeline economics**, not orphaned activities.

---

## 2. The value law (make money **or** save money — every scenario)

If a feature cannot be tied to **revenue ↑**, **cost ↓**, or **risk ↓** (which is $), it does not ship in core. Below: **scenario → client makes** vs **client saves** (both are valid; pick at least one per row).

| Scenario | Make money | Save money |
|----------|------------|------------|
| New inbound lead | Faster qualification → more won deals | Less rep time per qualified opp |
| Stale lead / no response | Reactivation campaign → revived revenue | Fewer wasted seats chasing dead rows |
| Won deal | Upsell/cross-sell plays → expansion ARR | Same CSM hours, more expansion yield |
| Lost deal | Downsell / alternate SKU → salvage revenue | Shorter sales cycles on smaller commit |
| Refund request | Good refund UX → referrals & reviews → LTV | Fewer chargebacks, less support escalations |
| Angry customer | Recovery play → save account | Lower churn; cheaper than new logo CAC |
| Happy customer | Referral prompt → net-new pipeline | Organic acquisition replaces paid lead $ |
| DNC / consent edge | — | Avoid fines, carrier suspension, brand loss |
| Duplicate / dirty data | Better targeting → conversion | Less wasted send $ and rep confusion |
| Slow handoffs (SDR→AE→CS) | Less leakage → more closes | Fewer meetings and tools |
| No-show / ghosting | Sequences + nudges → more held meetings | Rep time recaptured |
| Pricing confusion | Clear offer path → higher win rate | Fewer discounting cycles |
| Payment fail | Dunning + backup processor → recovered $ | Less manual finance work |
| Renewal at risk | Expansion + health plays → NRR | Cheaper than re-acquisition |
| “Just browsing” web visitor | Identity + trigger → pipeline | Cheaper than broad ads |
| Partner / affiliate lead | Attribution → scale channel | Pay only on real outcomes (by design) |

**Product implication:** Every screen ships with a **micro-line**: “This makes you money by ___” or “This saves you money by ___.” If you cannot fill the blank, the UI is **cut or demoted** to Labs.

---

## 3. What we are building (two layers, one brand)

### Layer A — **AI CRM** (Attio × Airtable ethos, **easier**)

- **Attio lesson:** Relationships + flexible objects **without** Salesforce admin tax; **fast UI**, honest schema.
- **Airtable lesson:** Familiar **grid + links** for ops people; **templates** that bootstrap in minutes.
- **Our twist (“easier than Attio”):** **Opinionated revenue graph** out of the box—Lead → Conversation → Outcome → Money—not a blank database. AI **proposes** fields and links; human **confirms**. **Reason-linked** suggestions (why this next step) for trust.

### Layer B — **Execution & measurement** (Twilio-class comms + Segment-class behavior + payments)

- Events → traits → audiences → **plays** (not “reports only”).
- **Stars on refunds** = **outcome objects** with sentiment + economics (refund speed, clawback avoided, review captured)—not “service only” CS metrics.

**Positioning line:** *Pipelines to revenue. Keep revenue. Expand revenue.* (Final marketing name TBD — see §8.)

---

## 4. Strip-back — remove filler that slows us down

### 4.1 Immediate cuts / fixes (high pain, low truth)

| Item | Action |
|------|--------|
| Sidebar links to **non-routes** (`/contacts`, `/analytics`, `/numbers`) | **Remove or implement** — dead nav reads as toy product |
| Hard-coded **badges/stats** (“47K”, “$2.4M”, “3 Active”) | **Delete** unless backed by queries in same release |
| `demoProjects` / `DEMO_DATA` as default | **Opt-in demo** only (onboarding flag); default = empty state + one CTA |
| Pages that do not serve **pipeline → money** in v1 | **Archive** behind feature flag or `/labs/*`: e.g. `WebDevelopment`, `ClientPreviewShowcase`, heavy **Flex/Workflow** if not core ICP |
| Build telemetry `Dashboard` as home | **Demote** to `/devops` or Settings tab unless ICP is engineering GTM |
| `desktop-companion/` | **Optional** package; not in critical path for CRM MVP |

### 4.2 Keep as core (v1 spine)

- **Onboarding** + Supabase resolution (tenant connection).
- **Pipeline / deal / account / contact** (to be consolidated—today: `LeadIntelligence`, campaigns, partial routes).
- **Campaigns + journeys + templates** only as far as they attach to **contacts and outcomes**.
- **Financials**: **Labs** until CRM spine ships—or keep if ICP is founder-led RevOps from day one (decision in Phase 0).

### 4.3 Archive (content, not code path)

- Large static vertical copy in `docs/*`, `src/data/*` → **sales enablement / template packs**, not loaded in default bundle.

---

## 5. Full line of attack (phased, spec-driven)

### Phase 0 — Inventory & ADR (1 week of thinking, 1 doc)

- **ADR:** Default ICP (e.g. high-velocity SMB + Twilio-native), **in / out** feature list, demo policy.
- **Route map:** Every URL ↔ owner ↔ data table ↔ “make/save $” line.
- **Exit:** No orphan nav; signed **v1 scope** paragraph.

### Phase 1 — Core data model + CRM shell

- Entities: **Workspace, User, Account, Person, Pipeline, Stage, Deal, Activity, Outcome** (sale, refund, referral, review, cross-sell…), **Message** (channel-agnostic), **Payment** (optional stub).
- Supabase: migrations + **RLS** story; kill reliance on `DEMO_DATA` for primary views.
- **Exit:** CRUD/read for **people + pipeline** from real DB; AI can only attach to **real rows**.

### Phase 2 — Events + plays (Segment-class, inside our CRM)

- Ingest: webhooks + SDK contract; **identity stitching** rules.
- **Plays:** trigger → audience → action (message, task, e-sign request)—one channel depth first (e.g. SMS).
- **Exit:** Closed loop: **event → visible on record → next action suggested**.

### Phase 3 — AI layer (bounded, observable)

- KB per workspace; tools whitelist; **human-in-the-loop** send by default.
- **Exit:** Logs + eval hooks; no silent mass-send without caps.

### Phase 4 — Money rails

- Processor abstraction (NMI, Stripe, Square…); **routing** (spread, risk score); refund UX + **star/refund outcome** metric.
- **Exit:** Refund path is timed; outcome row written.

---

## 6. Competitive stance (summary from research)

- **Do not** headline “replace Salesforce” day one. Headline **revenue execution + AI CRM** in **weeks**, with optional **SF/HubSpot sync** later.
- **Own:** behavior-in-the-loop CRM, refund/referral as outcomes, Twilio-depth, transparent unit economics (messages, AI minutes, enrichment credits).
- **Watch:** stripping too much → “toy pipeline” perception; answer with **data + compliance + audit** in Phase 1–2.

---

## 7. Subagents (ongoing ritual)

| Agent | Role |
|-------|------|
| **Competitive research** | Deep dives on 2–3 competitors per sprint; naming collisions; pricing/packaging patterns. |
| **Systems / pipeline engineer** | Route↔schema integrity, strip-back PRs, migration safety, perf budgets. |
| **Orchestrator (you + lead PM)** | ADR, scope cuts, UX copy for “one job per screen,” value law review on every PR. |
| **Futuristic designer** | **Progressive disclosure**: simple surface, power in drawers—Attio-grade clarity without Attio-grade blank slate. |

---

## 8. Naming — working codename + shortlists

### 8.1 Ten names that **synergize pipeline + revenue + “recipe”** (playbook / motion)

1. **Pipeline Recipes**  
2. **Revenue Recipes**  
3. **Recipe Pipeline**  
4. **PipeRecipe** (compound; check trademark)  
5. **Revenue Rite** (play on “recipe” sound; check trademark)  
6. **Deal Kitchen** (recipe metaphor)  
7. **Playbook Pipe**  
8. **Pipeline Pantry**  
9. **Revenue Runbook**  
10. **Closing Cookbook**

### 8.2 Twenty additional / blended candidates (broader; still on-brand)

1. **Pipeline Ledger**  
2. **Revenue Motion**  
3. **Outcome Pipe**  
4. **Lead Ledger**  
5. **ExpandFlow**  
6. **KeepFlow**  
7. **Revenue Rails**  
8. **Pipeline Press**  
9. **EveryLead**  
10. **MaxLead**  
11. **Referral Rail**  
12. **Refund Star** (literal differentiator)  
13. **ThreadMoney**  
14. **PipeProfit**  
15. **Revenue Prism**  
16. **Cadence CRM**  
17. **Flux Revenue**  
18. **NorthPipe**  
19. **Yieldline**  
20. **Recipe Revenue Co.** (descriptive; long—better as tagline)

**Recommendation:** Pick a **boring legal entity** + **memorable product codename** for the repo (e.g. codename **“RecipePipe”** internally) until trademark search clears.

---

## 9. Next actions (concrete)

1. Approve **Phase 0 ADR** (ICP + in/out list).  
2. Open **strip-back PR**: fix/remove sidebar orphans; gate demo data.  
3. Draft **entity diagram** for Phase 1 (one page).  
4. Run **trademark screen** on top 3 names from §8.

---

*Document owner: orchestrator. Revise after Phase 0 sign-off.*
