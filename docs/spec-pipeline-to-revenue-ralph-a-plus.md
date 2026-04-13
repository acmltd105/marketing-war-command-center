# Ralph loop × 3 — Pipeline to Revenue spec (C- → A+)

**Prompt applied each iteration:** Treat the prior spec as a **C-** plan. Upgrade **clarity, falsifiability, moat, and build order** until it is **A+**: every claim has a **test**, every module has a **money line**, and scope cannot hide behind vibes.

**Honest framing:** No honest vendor can prove “**nobody in the world has feature X**.” What we *can* do is specify **≥20 frontier capabilities** that are **almost impossible *as a shipped, integrated, compliant combo*** because they require **cross-domain crucible** (telecom + payments + CRM + ML + legal + UX). Those are **defensible** and **rarely all true in one product**.

---

## Iteration 0 — C- diagnosis (why the old plan was weak)

| Failure mode | Why it is C- |
|--------------|--------------|
| **Generic CRM story** | “Attio × Airtable” without **hard primitives** reads like positioning, not architecture. |
| **Strip-back without spine** | Removing filler without **replacing** with one **canonical object model** leaves a hollow shell. |
| **Value law as table only** | Good start, but no **instrumentation**: who verifies each row shipped in v1? |
| **Phases are linear** | Real risk: Phase 3 AI becomes **demo** if Phase 1–2 lack **event contracts** and **money objects**. |
| **Naming section** | Fun but **distracts** from **proof**: A+ plan leads with **differentiation proofs**, not names. |
| **No “impossibility budget”** | Hard problems need **explicit R&D lanes** (legal, ML, carrier, PCI) or they die in backlog. |

---

## Ralph iteration 1 — B-grade plan (make it *buildable*)

### 1.1 Lock the **three immutable primitives** (everything hangs here)

1. **`Party`** — person or org you can message or bill (identity + consent scope).  
2. **`Motion`** — anything that moves pipeline (task, message, play step, signature, payment).  
3. **`Outcome`** — terminal or high-value state with **economics** (won $, refund $, referral $, churn $ avoided, star rating, chargeback).

**Rule:** No new screen without mapping to **Party × Motion × Outcome**.

**Company lifecycle:** The same primitives apply to **the business you are building**—formation, brand, corporate site, press, revenue milestones (1 / 5 / 10 / 1000), IPO readiness—see [`company-lifecycle-pipeline.md`](./company-lifecycle-pipeline.md).

### 1.2 Replace “strip-back” with **spine-first routing**

- **One home:** **Pipeline** (all parties with open Motions), not dashboard chrome.  
- **One settings:** Data, channels, processors, compliance.  
- **Labs:** everything else behind `/labs` + feature flags + **no nav lies**.

### 1.3 Add **falsifiable exit criteria** per phase (examples)

| Phase | Exit is false if… |
|-------|---------------------|
| P1 spine | You cannot create Party → Deal → Outcome in **<10 clicks** cold. |
| P2 events | A Motion cannot be queried from **Party timeline** with **<2s p95** on demo data at N=10k rows. |
| P3 AI | Any AI Motion is missing **human gate** OR **max $ at risk** cap. |

### 1.4 **Impossibility budget** (new section)

Allocate **fixed % engineering** to “hard lanes”: **Compliance**, **Carrier**, **PCI**, **ML eval**, **Legal templates**. If zero allocation, **no A+**.

---

## Ralph iteration 2 — A-grade plan (make it *defensible*)

### 2.1 **Dual ledger** (CRM truth + money truth)

- **CRM ledger:** stages, owners, activities.  
- **Money ledger:** authorization, capture, refund, chargeback, processor route id.

**Invariant:** Every **Outcome** links **both** ledgers or explicitly `money_unknown` with SLA to resolve.

### 2.2 **Economics in the loop UI** (not BI export)

Every Motion shows **expected value delta (EVΔ)** and **confidence** band—even if v1 is heuristic. **A** means operators *feel* the product is **P&L-aware**, not “activity tracking.”

### 2.3 **Competitive moat sentence** (one, sharp)

> We are the **only** system that treats **refunds, referrals, and chargebacks** as **first-class pipeline outcomes** with **telecom + wallet + AI** in one **Party** graph—because we built for **high-velocity regulated outreach**, not for “opportunity hygiene.”

(Defensible if shipped; until then it is a **hypothesis** under test.)

### 2.4 **Integration posture**

- **v1:** Ingest + export webhooks; CSV; Supabase.  
- **v2:** Salesforce / HubSpot **read-heavy sync** (bi-directional is a program, not a checkbox).

### 2.5 **Kill criteria** (A-grade discipline)

If after 90 days **<40%** of weekly active workspaces emit **≥1 Outcome with economics**, the **Motion** model is wrong—pivot schema before adding AI.

---

## Ralph iteration 3 — A+ plan (make it *legendary*)

### 3.1 **A+ definition** (non-negotiable)

| Pillar | A+ means |
|--------|----------|
| **Simple** | One primary job per screen; **progressive disclosure** only. |
| **Powerful** | Every power feature has **default** + **safe** + **escape hatch**. |
| **Provable** | Every headline feature has **demo script + metric**. |
| **Unfair** | At least **5** capabilities competitors **cannot copy in <18 months** without **rebuilding** telecom + payments + CRM spine. |

### 3.2 **The “unfair five” (structural moats)**

1. **Outcome-native money graph** — refunds/chargebacks/referrals as **equal citizens** to wins.  
2. **Regulated send + wallet** in one **Party** consent scope (not bolted Marketing Cloud + Stripe).  
3. **Play compiler** — natural language → **Motion DAG** with **automatic** compliance checks on edges.  
4. **Processor cognition** — routing is **policy-as-code** with **live** risk + margin feedback.  
5. **Proof replay** — any customer journey **byte-replayable** for litigation/regulator (see frontier list).

### 3.3 **Product name**

**Pipeline Pantry** — shipped product name. Repository slug may stay `marketing-war-command-center` on GitHub until a rename is worth the churn.

---

## Frontier capabilities — ≥20 “almost impossible” (integrated + rare)

**Legend:** **★** = requires **multi-domain crucible** (why market rarely ships *all* of it together).

| # | Capability | Why “almost impossible” |
|---|------------|------------------------|
| 1 | **Refund-star coupling** — NPS/refund reason captured **in same session** as money movement, written to **Outcome** | ★ CRM + payments + UX + timing guarantees |
| 2 | **Outcome EVΔ on every Motion** — live expected value delta + confidence on send/click/call | ★ ML + product economics + latency |
| 3 | **Play DAG compiler** — NL brief → executable graph with **per-edge** compliance predicates | ★ NLP + rules engine + telecom law |
| 4 | **Dual-ledger invariant checker** — background job proves CRM $ ↔ wallet $ within tolerance | ★ Finance + data eng + alerts |
| 5 | **Chargeback precursor model** — trajectory from **conversation features** → risk score gates routing | ★ NLP + payments + privacy |
| 6 | **Sub-second suppression mesh** — global DNC/consent **read-your-writes** for sends (target SLO) | ★ Distributed systems + carrier reality |
| 7 | **Consent provenance graph** — immutable chain: which policy version authorized which Motion | ★ Legal + cryptography + UX |
| 8 | **Processor envelope AI** — agents cannot exceed **$ / hour / channel** caps set by finance | ★ Policy-as-code + AI tooling |
| 9 | **Referral attribution lattice** — multi-touch + partial payouts without double-spend disputes | ★ Marketplace + graph + payouts |
| 10 | **Journey byte-replay** — deterministic replay for **audit** (what was shown, said, approved) | ★ Storage + versioning + privacy |
| 11 | **Geo-regulatory mode flip** — same org, **jurisdiction packs** auto-switch rules on Party | ★ Legal product + eng |
| 12 | **Voice closer with margin HUD** — live **gross margin / quota burn** on rep screen during call | ★ Telephony + ERP-lite + UX |
| 13 | **Pipeline thermodynamics** — entropy / leakage metrics per stage (where money dies) | ★ Novel metrics + teaching + action |
| 14 | **Lead half-life pricing** — marketplace lists priced by **decay model** per source | ★ Data science + marketplace ethics |
| 15 | **Self-healing schema** — new SKU line adds objects/fields with **governance** + rollback | ★ Migrations + AI + admin UX |
| 16 | **Opponent simulator** — “if competitor discounts X, your win prob / margin” sandbox | ★ Game theory + private data |
| 17 | **Swarm-first-response** — parallel **human + agent** race to first qualified meeting with **rules** | ★ Realtime + fairness + compliance |
| 18 | **Watermark proof of human** — cryptographic proof a human approved each **bulk** Motion | ★ Crypto + ops + liability |
| 19 | **Immutable click→refund star chain** — marketing touch to terminal sentiment **hash-chained** | ★ Attribution + integrity + retention |
| 20 | **Signed negotiation envelope** — AI offers constrained by **pre-legal** numeric/text bounds | ★ Legal workflow + AI safety |
| 21 | **Federated objection library** — learn patterns **without** raw PII leaving tenant (target architecture) | ★ Privacy tech + ML ops |
| 22 | **Carrier-aware content doctor** — auto-fix RCS/SMS segments for **deliverability** before send | ★ Content + telecom heuristics |
| 23 | **Affiliate fraud graph** — graph detection on **collusive** lead farming | ★ Graph ML + marketplace |
| 24 | **Renewal arbitration engine** — competing plays (save vs expand) judged by **NRR simulator** | ★ Optimization + CRM |
| 25 | **“Fastest refund” SLA engine** — routes refund path by **processor + bank bin** latency model | ★ Payments data + UX promise |

**Market honesty:** Individual ingredients exist (CDPs, CPQ, refund portals, etc.). The **A+ bet** is **tight integration + proofs + economics-first UX**—that combo is what incumbents **struggle** to ship without **rewriting** their chassis.

---

## Execution order after Ralph (revised)

1. **Spine UI** (Pipeline home) + **Party/Deal/Outcome** schema.  
2. **Kill nav lies** + **opt-in demo**.  
3. **Money ledger stub** + link to Outcome.  
4. **Events** with timeline.  
5. Pick **two** frontier items from the table as **hero bets** (recommend: **#1 Refund-star** + **#4 Dual-ledger invariant**).  
6. AI only after **#8 envelope** exists.

---

## Subagents (unchanged, sharper charter)

| Agent | Iteration output |
|-------|------------------|
| **Competitive** | Each sprint: “who ships ingredient X; who lacks combo Y; pricing trick Z.” |
| **Systems / pipeline** | Each sprint: schema diff, migration risk, **kill criteria** metrics. |
| **Orchestrator** | Holds **A+ definition**; rejects PRs without **money line** + **test**. |
| **Designer** | One job per screen; power in drawers; **never** orphan nav. |

---

*Ralph complete: 3 passes applied in this document. Prior baseline: `docs/spec-pipeline-to-revenue-v1.md` on branch `cursor/spec-pipeline-to-revenue-e628` (remote). This file is the **A+ supersession** draft for merge or replace.*
