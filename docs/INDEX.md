# Pipeline Pantry — documentation hub (living)

**Status:** Planning docs + **local dev** (`npm run dev` with `.env.development` mock auth/API — see README). Unpause execution when orchestrator says go.

Read in this order:

| Order | Doc | Purpose |
|-------|-----|---------|
| 1 | [`spec-master.md`](./spec-master.md) | **Final-draft living spec** — vision, MVP scope, phases, team lanes, doc map |
| 2 | [`orchestration.md`](./orchestration.md) | How work flows from research → build → wire → ship |
| 3 | [`agents.md`](./agents.md) | Named agents, inputs/outputs, handoffs |
| 4 | [`guardrails-no-drift.md`](./guardrails-no-drift.md) | Non-negotiables; what “no drift” means in PRs |
| 5 | [`QA.md`](./QA.md) | QA agent charter, test layers, exit gates |
| 6 | [`RALPH-BY-CATEGORY.md`](./RALPH-BY-CATEGORY.md) | **Ralph loop** — category → subcategory → subtask → world-class target |
| 7 | [`phases-roadmap.md`](./phases-roadmap.md) | Phases 1–5 summary + links to **detailed** phase docs |
| 8 | [`conversation-closure-checklist.md`](./conversation-closure-checklist.md) | **Frozen** thread → plan alignment + execution gap list |
| 9 | [`swarm-phase1-mock-launch-pack.md`](./swarm-phase1-mock-launch-pack.md) | **5-agent swarm** — copy-paste prompts, mocks, CEO merge order |
| 10 | [`ui-design-system-worldclass.md`](./ui-design-system-worldclass.md) | **UI constitution** — minimal, functional, intuitive (global) |
| — | [`phases/README.md`](./phases/README.md) | Index: `phase-01` … `phase-05`, **ERROR-TESTING** |
| — | [`phases/cursor-claude-agent-split.md`](./phases/cursor-claude-agent-split.md) | **3 Cursor Claude agents per phase** — lanes, owns, merge order, prompts |

**Supporting specs (already in repo):**

- [`spec-pipeline-to-revenue-ralph-a-plus.md`](./spec-pipeline-to-revenue-ralph-a-plus.md) — Party / Motion / Outcome, frontier list
- [`company-lifecycle-pipeline.md`](./company-lifecycle-pipeline.md) — Idea → IPO lifecycle
- [`azure-managed-agents.md`](./azure-managed-agents.md) — Azure dogfood + gateway + agents
- [`mvp-problems-and-next-steps.md`](./mvp-problems-and-next-steps.md) — Known problems + first 10 steps
- [`ui-mockups-2026.md`](./ui-mockups-2026.md) — Per-route UI/motion mockups

**Repo root:** [`../README.md`](../README.md) — product pitch + dev quickstart; links here for **planning mode**.

**Root stubs (same content, shorter path):** [`../agents.md`](../agents.md), [`../orchestration.md`](../orchestration.md), [`../QA.md`](../QA.md), [`../guardrails-no-drift.md`](../guardrails-no-drift.md) → point into `docs/`.
