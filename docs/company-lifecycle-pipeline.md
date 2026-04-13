# Company lifecycle pipeline (Pipeline Pantry)

**Core idea:** The “pipeline” is not only **sales stages**. It is the **full arc from idea to operating company to repeatable revenue to liquidity event**—same primitives (**Party**, **Motion**, **Outcome**) stretched across **entity** (the company you are building) and **people** (customers, investors, press).

---

## One sentence

**Idea → legal entity → brand & presence → narrative → first dollar → N dollars/day → IPO readiness**—with tooling and telemetry at every hop, not a pile of disconnected SaaS tabs.

---

## Lanes (what “full stack” means here)

| Lane | Examples (tools / artifacts) | Outcome examples |
|------|-------------------------------|-------------------|
| **Formation** | Company setup wizard, cap table stub, **EIN (FEIN)** workflow (checklist + handoff to filing partner or CPA API—not legal advice in-app), registered agent reminders | `Outcome`: entity formed, EIN received |
| **Brand identity** | Logo/wordmark variants, color system, voice/tone sheet, asset export, “brand kit” URL | `Outcome`: brand v1 approved |
| **Corporate web** | Site generator / deploy hook, DNS checklist, privacy & terms templates (jurisdiction-aware placeholders) | `Outcome`: site live, analytics pixel verified |
| **Press & narrative** | Press release drafts (facts + quotes blocks), media list, embargo dates, link to **IR** page when public | `Outcome`: release published, pickup tracked |
| **Revenue (existing)** | Comms, CRM spine, payments, leads, Closer Bots | `Outcome`: first sale, Nth sale, refund handled, referral |
| **Scale milestones** | **1 sale in a day**, **5 / 10 / 1000** customers or orders as **explicit cohort checkpoints** (not vanity—tied to unit economics) | `Outcome`: milestone badge + ledger row |
| **IPO / liquidity tracker** | Readiness checklist (SOX-ish themes, audit trail density, segment reporting, D&O, lockup calendar)—**education + progress**, not a broker | `Motion`: next board/IR task |

---

## “Death rate” (read carefully)

In mature markets, **startup failure is common**. Product stance should be **survival intelligence**, not gloating:

- **Cohort survival** — time-to-revenue, runway vs burn, concentration risk.
- **Industry churn** — optional context (“x% of seed companies fail to reach Series A in y months”) from **public statistics**, not invented fear.
- **Your** “death risk” = **leading indicators** (consent debt, carrier suspension, chargeback spike, key vendor single-source)—surfaced as **Motions** with clear **save-money** lines.

If the product ever shows “death rate,” label it **risk / mortality context** or **survival rate** so operators read it as **radar**, not nihilism.

---

## Mapping to primitives (implementation north star)

- **`Party`** — person **or** **organization** (customer, vendor, **your_subsidiary**, investor contact).
- **`Motion`** — any time-bound move (file EIN, publish press, send campaign, board prep).
- **`Outcome`** — **terminal or milestone** with economics or legal meaning (incorporated, **$ first revenue**, **milestone_10_customers**, S-1 filed, etc.).

“IPO tracker” is a **structured checklist + dates + owners** generating **Motions** and **Outcomes**, same as a deal pipeline—so the UI stays **one metaphor**.

---

## Build order (suggested)

1. **Workspace / company profile** object (name, jurisdiction, stage enum: `idea | formed | revenue | scaling | pre_ipo_public`).
2. **Checklist templates** per stage (formation, brand, web, press, first sale).
3. Hook **existing** comms + CRM + financials to the same workspace.
4. **IPO readiness** as a **read-only template pack** + export for counsel (no securities advice in-app).

---

*This doc aligns narrative with `docs/spec-pipeline-to-revenue-ralph-a-plus.md`. Update both when scope changes.*
