# Pipeline Pantry — UI Mockups & Motion Spec (2026)

Marketing war command center: minimal surfaces, high contrast, generous whitespace, subtle depth, motion only where it clarifies hierarchy or feedback.

**Global system (must align):** [`ui-design-system-worldclass.md`](./ui-design-system-worldclass.md) — layout shell, typography scale, semantic color, motion limits, empty/loading/error patterns.

---

## 1. Design principles

- **Minimalism** — One idea per region; typography and spacing do the work before chrome or color.
- **Accessibility** — WCAG-minded contrast on primary text and CTAs; visible focus rings; logical tab order; labels on all inputs.
- **Reduced motion** — Honor `prefers-reduced-motion: reduce`: shorten or disable transitions, no parallax, no decorative loops.
- **Mobile-first** — Touch targets ≥ 44px; single-column stacks that expand to multi-column at `md`/`lg`; sticky primary actions where appropriate.
- **One primary CTA per view** — A single dominant action (filled button); secondary actions as ghost or text links.
- **Generous whitespace** — Default section padding `p-6`–`p-8`; vertical rhythm with `gap-6`/`gap-8` between major blocks.
- **Subtle depth** — Thin borders (`border border-border/60`) plus soft shadow only on elevated surfaces (modals, cards on canvas).
- **Purposeful motion** — Enter/exit under ~300ms; hover micro-feedback (opacity/translate ≤ 2px); stagger only for short lists (≤ 8 items).

---

## 2. Tech notes

- **Framer Motion** — Use for route-level page transitions (fade + slight Y, e.g. 8px) and list stagger on dashboard tiles or pipeline rows. Prefer `AnimatePresence` with stable `key` per route segment.
- **`prefers-reduced-motion`** — Wrap motion defaults in a hook or CSS media query; when reduced, use `duration: 0` / `transition: none` and skip stagger delays.
- **Bundle impact** — Lazy-load motion: `const motion = await import('framer-motion')` or route-level code-splitting so marketing/static pages do not pay the cost until needed. Prefer CSS transitions for simple hovers where Framer Motion adds little value.

---

## 3. Route mockups

### `/login` — Entra-ready centered card

| Field | Spec |
|--------|------|
| **Purpose** | Authenticate operators into Pipeline Pantry; Entra ID (Microsoft) primary path with room for email fallback if product requires it. |
| **Layout** | Full viewport neutral canvas; centered card `max-w-md w-full p-8`, `mx-auto`, vertical stack `gap-6`. |

```
+----------------------------------------------------------+
|                                                          |
|              [ Pipeline Pantry wordmark ]                |
|                                                          |
|     +----------------------------------------------+     |
|     |  Sign in                                     |     |
|     |  Use your org account (Entra ID).            |     |
|     |                                              |     |
|     |  [ Continue with Microsoft ]  (primary)    |     |
|     |  [ Help / SSO issues ]        (text link)    |     |
|     +----------------------------------------------+     |
|                                                          |
|              Footer: privacy · status                  |
+----------------------------------------------------------+
```

| **Key components** | Wordmark, headline, body copy, Microsoft sign-in button, secondary help link, legal/footer row. |
| **Primary CTA** | **Continue with Microsoft** (single filled button). |
| **Motion** | **Enter:** card `opacity 0→1`, `y: 12→0`, 240ms ease-out. **Exit:** none (hard navigation). **Hover:** primary button slight scale `1 → 1.02` or shadow lift (disabled under reduced motion). |
| **Empty state** | N/A (auth-only). Optional inline error: alert below CTA with `role="alert"`. |
| **Notes for dev** | Card: `rounded-xl border bg-card shadow-sm`. Reserve `max-w-md` for future fields (MFA hint). Do not add secondary “create account” unless product ships it—keeps one primary CTA. |

---

### `/onboarding` — Four steps

| Field | Spec |
|--------|------|
| **Purpose** | Configure workspace: org profile, pipeline defaults, integrations teaser, confirmation. |
| **Layout** | `max-w-3xl mx-auto p-6 md:p-8`. Top: stepper (1–4). Body: step content. Footer: Back (ghost) + Continue (primary). |

```
+----------------------------------------------------------+
|  Step [1] [2] [3] [4]                                    |
|  --------------------------------------------------------|
|                                                          |
|  [ Step title ]                                          |
|  [ Description ]                                         |
|                                                          |
|  [ form fields in single column, gap-4 ]                |
|                                                          |
|  --------------------------------------------------------|
|  [ Back ]                         [ Continue ]           |
+----------------------------------------------------------+
```

| **Key components** | Horizontal stepper with labels, step panels, form controls, sticky footer bar on mobile. |
| **Primary CTA** | **Continue** (advances step); on step 4, **Finish & enter command center**. |
| **Motion** | **Enter:** step content cross-fade 200ms; optional `x: ±12` between steps (omit if reduced motion). **Hover:** step circles scale subtly on completed steps. **List stagger:** N/A unless checklist sub-steps. |
| **Empty state** | If a step has no integrations yet: illustration-free message + “Skip for now” as text link (secondary). |
| **Notes for dev** | Persist progress in URL query `?step=2` or session storage. Validate before advance; disable Continue while invalid. |

---

### `/` — Home / pipeline overview

| Field | Spec |
|--------|------|
| **Purpose** | At-a-glance pipeline health, alerts, and shortcuts into campaigns and war map. |
| **Layout** | App shell: sidebar `w-64` (collapsible), main `flex-1 p-6 lg:p-8`. Main: hero metrics row + two-column `lg:grid lg:grid-cols-12 lg:gap-8` (pipeline `col-span-7`, activity `col-span-5`). |

```
+--------+-----------------------------------------------+
| Nav    |  Pipeline Pantry · Overview                   |
|        |  [ KPI ] [ KPI ] [ KPI ] [ KPI ]              |
|        |  -------------------------------------------|
|        |  Pipeline stage breakdown    | Recent signal |
|        |  [ chart / funnel ]          | [ feed list ]  |
|        |                              |                |
|        |  [ Quick actions row ]                        |
+--------+-----------------------------------------------+
```

| **Key components** | KPI tiles, funnel or stage chart, activity feed, quick links (Campaigns, War Map, Create). |
| **Primary CTA** | **Open war map** or **Review pipeline** — pick one per product priority; recommend **Open war map** as the single hero CTA in the quick-actions row. |
| **Motion** | **Enter:** KPI row stagger 40ms/item max 4; chart fades in 260ms. **Hover:** KPI cards `translate-y-[-2px]` + border emphasis. |
| **Empty state** | “No pipeline data yet” + CTA **Connect data** or **Run first campaign** (one primary). |
| **Notes for dev** | Skeleton loaders for KPIs; defer heavy chart to dynamic import. |

---

### `/company`

| Field | Spec |
|--------|------|
| **Purpose** | Company profile, brand voice, compliance flags for outbound. |
| **Layout** | `max-w-4xl` form sections stacked `space-y-10`; each section: title, description, fields `gap-4`. |

```
+----------------------------------------------------------+
|  Company command profile                                 |
|  [ Section: Legal entity ]                               |
|  [ Section: Brand & voice ]                              |
|  [ Section: Compliance ]                                 |
|  [ Sticky bar: Save changes ]                            |
+----------------------------------------------------------+
```

| **Key components** | Text inputs, selects, toggles for DNC policy hints, read-only Entra org snippet. |
| **Primary CTA** | **Save changes** (sticky bottom on mobile). |
| **Motion** | **Enter:** sections fade up staggered. **Hover:** Save button standard. **Exit:** toast slide-up on success (respect reduced motion → instant). |
| **Empty state** | Placeholder copy in fields; banner if org not linked. |
| **Notes for dev** | Dirty-state guard on navigation; autosave optional but do not duplicate primary CTA. |

---

### `/financials`

| Field | Spec |
|--------|------|
| **Purpose** | Spend, burn, and ROI tied to campaigns and numbers inventory. |
| **Layout** | Filter bar + `grid gap-6` of summary cards; below, `tabs` for Overview | By campaign | By period; table `w-full` with horizontal scroll on mobile. |

```
+----------------------------------------------------------+
|  Financials                         [ date range ]       |
|  [ cards: spend | pipeline value | cost per lead ]       |
|  [ Tabs: Overview | By campaign | By period ]            |
|  [ Data table / chart area ]                             |
+----------------------------------------------------------+
```

| **Key components** | Date range picker, summary cards, tabs, table or chart, export (secondary ghost). |
| **Primary CTA** | **Adjust date range** is contextual; default primary: **Export report** OR **Refresh data** — choose **Refresh data** as the single filled control in the toolbar. |
| **Motion** | **Enter:** cards stagger; tab panel cross-fade 180ms. **Hover:** row highlight `bg-muted/50`. |
| **Empty state** | “No billing data for this range” + **Connect billing** (if applicable) as sole filled CTA. |
| **Notes for dev** | Virtualize long tables; lazy chart library. |

---

### `/campaigns`

| Field | Spec |
|--------|------|
| **Purpose** | List, filter, and launch Pipeline Pantry campaigns. |
| **Layout** | Page header + **New campaign** area; filters row; responsive card grid `sm:grid-cols-2 xl:grid-cols-3 gap-6`. |

```
+----------------------------------------------------------+
|  Campaigns                         [ filters........ ]   |
|  [ ============================================== ]    |
|  | Card | Card | Card |                                 |
|  | Card | Card | ... |                                 |
+----------------------------------------------------------+
```

| **Key components** | Search, status chips, campaign cards (name, stage, owner, last run). |
| **Primary CTA** | **New campaign** (top-right, filled). |
| **Motion** | **Enter:** card grid stagger 50ms cap total ~400ms. **Hover:** card lift + shadow. |
| **Empty state** | Headline + short copy + **New campaign** only. |
| **Notes for dev** | Infinite scroll or pagination; preserve filters in URL. |

---

### `/war-map`

| Field | Spec |
|--------|------|
| **Purpose** | Spatial / nodal view of competitive terrain, accounts, and campaign pressure. |
| **Layout** | Full-bleed canvas region `min-h-[60vh]` with floating tool palette `absolute`/`fixed` bottom on mobile; legend drawer. |

```
+----------------------------------------------------------+
|  War map                    [ layers ] [ legend ]       |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |            [ graph / map canvas ]                  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|  [ Selected node detail panel - slide-over ]           |
+----------------------------------------------------------+
```

| **Key components** | Canvas/graph, layer toggles, node inspector (slide-over `max-w-md`), zoom controls. |
| **Primary CTA** | **Focus selection** or **Sync latest intel** — recommend **Sync latest intel** in the toolbar. |
| **Motion** | **Enter:** canvas fade-in; inspector `x` slide 280ms from right. **Hover:** nodes scale 1.05 max. Reduced motion: inspector appears without slide. |
| **Empty state** | “No terrain data” + **Import accounts** (primary). |
| **Notes for dev** | WebGL/canvas behind dynamic import; throttle sync. |

---

### `/create`

| Field | Spec |
|--------|------|
| **Purpose** | Guided creation flow for campaigns, journeys, or assets (context from query or tabs). |
| **Layout** | `max-w-2xl mx-auto p-6`; wizard or single long form with progressive disclosure. |

```
+----------------------------------------------------------+
|  Create                                                  |
|  [ Type: Campaign | Journey | Asset ]                  |
|  --------------------------------------------------------|
|  [ fields ]                                              |
|  [ Back ]                         [ Create draft ]       |
+----------------------------------------------------------+
```

| **Key components** | Type selector, dynamic fields, validation summary. |
| **Primary CTA** | **Create draft** (or **Launch** if policy allows one-shot). |
| **Motion** | **Enter:** type selector segments animate width/underline 200ms. **Hover:** segment background. |
| **Empty state** | Prompt to pick a type first; disabled primary until valid. |
| **Notes for dev** | Deep-link `?type=campaign`; autosave draft optional. |

---

### `/dnc-upload`

| Field | Spec |
|--------|------|
| **Purpose** | Upload and validate Do-Not-Contact lists for compliant dialing. |
| **Layout** | `max-w-3xl` centered column: dropzone, file meta, validation log, actions. |

```
+----------------------------------------------------------+
|  DNC upload                                              |
|  +----------------------------------------------------+  |
|  |   Drag CSV here  or  [ Browse ]                    |  |
|  +----------------------------------------------------+  |
|  [ Validation summary: errors | warnings | OK rows ]   |
|  [ Primary: Process & apply ]                          |
+----------------------------------------------------------+
```

| **Key components** | Dropzone, file list, validation table, conflict policy radio (if needed). |
| **Primary CTA** | **Process & apply** (enabled only when file valid). |
| **Motion** | **Enter:** dropzone border pulse once on drag-over (CSS); success checkmark scale 0→1 200ms. |
| **Empty state** | Idle dropzone with concise compliance copy. |
| **Notes for dev** | Chunked upload for large files; server-side validation before apply. |

---

### `/contacts`

| Field | Spec |
|--------|------|
| **Purpose** | Searchable directory of contacts with segments and tags. |
| **Layout** | Split view `lg:flex`: list `lg:w-96 border-r`, detail `flex-1 p-6`. Mobile: list full width, detail as full-screen overlay. |

```
+--------------+-----------------------------------------+
| Search       |  Contact detail                         |
| [ filters ]  |  [ header actions ]                     |
| ------------ |  [ fields / timeline ]                  |
| list item    |                                         |
| list item    |                                         |
+--------------+-----------------------------------------+
```

| **Key components** | Search input, filter chips, virtualized list, detail header, activity timeline. |
| **Primary CTA** | **Add contact** (header) as the sole filled action. |
| **Motion** | **Enter:** list stagger; detail fade when selection changes. **Hover:** list row `bg-muted`. |
| **Empty state** | “No contacts match” + **Clear filters** (text) and **Add contact** (filled) if org allows. |
| **Notes for dev** | Debounce search; URL-sync selected `?id=`. |

---

### `/leads`

| Field | Spec |
|--------|------|
| **Purpose** | Pipeline stages for leads: qualify, assign, progress. |
| **Layout** | Kanban `overflow-x-auto` columns `min-w-[280px] gap-4 p-2` or compact table toggle. |

```
+----------------------------------------------------------+
|  Leads                    [ view: Board | Table ]        |
|  [ New | column1 ] [ column2 ] [ column3 ] [ ... ]     |
+----------------------------------------------------------+
```

| **Key components** | View toggle, column headers with counts, draggable cards (if product supports), SLA badges. |
| **Primary CTA** | **New lead**. |
| **Motion** | **Enter:** columns stagger. **Drag:** use library spring sparingly; disable drag animations if reduced motion. |
| **Empty state** | Empty column placeholder “Drop leads here” / **New lead** in first column. |
| **Notes for dev** | Optimistic updates with rollback toast. |

---

### `/analytics`

| Field | Spec |
|--------|------|
| **Purpose** | Funnels, conversion, and channel performance across Pipeline Pantry. |
| **Layout** | Dashboard grid `gap-6`; widgets in `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`. |

```
+----------------------------------------------------------+
|  Analytics                    [ saved views v ]        |
|  [ widget ] [ widget ] [ widget ]                        |
|  [ large chart spanning 2 cols ]      [ widget ]         |
+----------------------------------------------------------+
```

| **Key components** | Saved views dropdown, widget chrome, charts, comparison toggles. |
| **Primary CTA** | **Save view** OR **New insight** — recommend **Save view** when filters dirty; otherwise **New insight** as default primary in header. |
| **Motion** | **Enter:** widget stagger; resize reflow with CSS `transition-layout` where supported. |
| **Empty state** | “No events in range” + **Expand date range** (primary). |
| **Notes for dev** | Widget registry for lazy chart modules. |

---

### `/numbers`

| Field | Spec |
|--------|------|
| **Purpose** | Phone number inventory, carrier, and assignment to campaigns. |
| **Layout** | Toolbar + data table; side drawer for number detail. |

```
+----------------------------------------------------------+
|  Numbers                          [ Acquire numbers ]  |
|  [ search | status | pool ]                              |
|  --------------------------------------------------------|
|  | DID | Pool | Campaign | Health | ... |              |
+----------------------------------------------------------+
```

| **Key components** | Filters, table, health indicators, assignment modal. |
| **Primary CTA** | **Acquire numbers** (opens flow/modal). |
| **Motion** | **Enter:** rows fade in batches (stagger). **Hover:** row highlight. Drawer: slide + backdrop fade. |
| **Empty state** | “No numbers in pool” + **Acquire numbers**. |
| **Notes for dev** | Poll or websocket for provisioning status. |

---

### `/templates`

| Field | Spec |
|--------|------|
| **Purpose** | Message and email templates with versioning and approvals. |
| **Layout** | Two-pane: list `w-full lg:w-80`, editor `flex-1` with monospace-friendly body. |

```
+------------------+---------------------------------------+
| Template library | Editor                                |
| [ search ]       | [ name ] [ channel tags ]             |
| - item           | ------------------------------------- |
| - item           | [ rich text / code toggle ]           |
+------------------+---------------------------------------+
```

| **Key components** | List, search, editor, variables inserter, preview toggle. |
| **Primary CTA** | **Save template** (editor toolbar). |
| **Motion** | **Enter:** list stagger; editor fade. **Hover:** list selection slide indicator. |
| **Empty state** | “No templates” + **Create from scratch** (primary). |
| **Notes for dev** | Conflict resolution on concurrent edit; autosave indicator secondary. |

---

### `/client-previews`

| Field | Spec |
|--------|------|
| **Purpose** | Client-facing preview links for landing pages, sequences, or proofs. |
| **Layout** | Card list + preview iframe panel `aspect-video bg-muted` when URL selected. |

```
+----------------------------------------------------------+
|  Client previews              [ Generate preview ]     |
|  [ card ] [ card ]   |   [ iframe / device frame ]     |
|  [ card ]            |                                 |
+----------------------------------------------------------+
```

| **Key components** | Preview cards (slug, expiry, status), device width toggle, copy link. |
| **Primary CTA** | **Generate preview**. |
| **Motion** | **Enter:** cards stagger; iframe content fade when URL changes. |
| **Empty state** | “No active previews” + **Generate preview**. |
| **Notes for dev** | Sandboxed iframe; short-lived tokens in UI only masked. |

---

### `/web-dev`

| Field | Spec |
|--------|------|
| **Purpose** | Track web properties, snippets, and deployment status tied to marketing. |
| **Layout** | Project cards `gap-6` + status timeline per expanded card. |

```
+----------------------------------------------------------+
|  Web dev                           [ New property ]      |
|  [ Card: prod site ]  [ Card: staging ]                 |
|  [ expanded: commits / deploy pipeline ]               |
+----------------------------------------------------------+
```

| **Key components** | Repo/URL fields, build status badges, env chips, logs link (secondary). |
| **Primary CTA** | **New property**. |
| **Motion** | **Enter:** cards stagger; expand/collapse height animation max 300ms (replace with instant if reduced motion). |
| **Empty state** | “No properties connected” + **New property**. |
| **Notes for dev** | Link to CI provider via OAuth; never expose secrets in UI. |

---

### `/settings`

| Field | Spec |
|--------|------|
| **Purpose** | Workspace, users, integrations, notifications. |
| **Layout** | Settings shell: vertical nav `w-56` + content `flex-1 p-6 lg:p-8 max-w-3xl`. |

```
+------------+---------------------------------------------+
| General    |  Section title                            |
| Members    |  [ settings forms ]                       |
| Integrations|                                            |
| Notifications| [ Save ]                                  |
+------------+---------------------------------------------+
```

| **Key components** | Subnav, forms per section, danger zone at bottom of Account. |
| **Primary CTA** | Per section: **Save** (one per view; avoid duplicate saves in sidebar). |
| **Motion** | **Enter:** content cross-fade on subnav change. |
| **Empty state** | Integrations: “None connected” + one **Connect** per row as outline; page-level primary remains **Save** only when form dirty — prefer first integration **Connect Slack** as hero only on empty integrations hub. |
| **Notes for dev** | Clarify in implementation: default subroute `/settings/general` with a single visible primary CTA at a time. |

---

### `/flex`

| Field | Spec |
|--------|------|
| **Purpose** | Flexible workspace for experiments, scratch dashboards, or ad-hoc views. |
| **Layout** | Empty canvas with optional widget picker `bottom-24` FAB area (use one primary in picker, not duplicate on page). |

```
+----------------------------------------------------------+
|  Flex workspace                    [ Add widget v ]      |
|  [ draggable grid / freeform optional ]                 |
|                                                          |
+----------------------------------------------------------+
```

| **Key components** | Widget palette, layout grid, reset layout control (ghost). |
| **Primary CTA** | **Add widget** (opens palette with one default highlighted). |
| **Motion** | **Enter:** widgets stagger from palette drop. **Drag:** opacity 0.9 on drag ghost. |
| **Empty state** | Large muted canvas copy + **Add widget** centered. |
| **Notes for dev** | Persist layout JSON per user; version migrations for widget types. |

---

### `/journeys`

| Field | Spec |
|--------|------|
| **Purpose** | Visual journey builder (steps, branches, waits). |
| **Layout** | Full-width builder: palette left `w-64`, canvas center, inspector right `w-80` (collapsible). |

```
+--------+--------------------------------+--------------+
| Steps  |  Canvas (nodes & edges)        | Inspector    |
| palette|                                |              |
|        |                                |              |
+--------+--------------------------------+--------------+
```

| **Key components** | Node types, canvas controls zoom/fit, validation panel. |
| **Primary CTA** | **Publish journey** (top bar) when valid; else **Validate** as primary until fixed. |
| **Motion** | **Enter:** palette tools stagger. **Connect:** edge draw with short spring (disable if reduced motion). |
| **Empty state** | Canvas placeholder + **Start from template** as primary. |
| **Notes for dev** | Auto-layout optional; undo stack essential. |

---

### `/workflows`

| Field | Spec |
|--------|------|
| **Purpose** | Operational automations (approvals, routing, CRM hooks) distinct from customer journeys. |
| **Layout** | Table-first `max-w-6xl`: name, trigger, last run, health; row opens drawer. |

```
+----------------------------------------------------------+
|  Workflows                        [ New workflow ]       |
|  [ table .......................................... ]   |
+----------------------------------------------------------+
```

| **Key components** | Table, trigger badges, enable toggle, run-now (outline). |
| **Primary CTA** | **New workflow**. |
| **Motion** | **Enter:** rows stagger in groups of 10. **Hover:** row accent. |
| **Empty state** | “Automate handoffs” + **New workflow**. |
| **Notes for dev** | Toggle uses optimistic UI with error recovery. |

---

### `404` — Not found

| Field | Spec |
|--------|------|
| **Purpose** | Recover users who hit a bad URL within Pipeline Pantry. |
| **Layout** | Centered column `max-w-lg p-8 text-center space-y-6`. |

```
+----------------------------------------------------------+
|                                                          |
|            404 — This route is off the map               |
|            [ short copy ]                                |
|            [ Back to command center ]                    |
|                                                          |
+----------------------------------------------------------+
```

| **Key components** | Code display, friendly copy, single recovery CTA, optional search input (secondary). |
| **Primary CTA** | **Back to command center** (`/`). |
| **Motion** | **Enter:** headline fade + slight rise; no looping animation. |
| **Empty state** | N/A. |
| **Notes for dev** | Log 404 with path for analytics; keep response lightweight (no heavy charts). |

---

## 4. Global tokens (reference)

| Token | Usage |
|--------|--------|
| `p-6` / `p-8` | Page padding mobile / desktop |
| `max-w-3xl` | Long-form and onboarding |
| `max-w-md` | Modals, login card, inspectors |
| `gap-6` / `gap-8` | Major stacks and grids |
| `rounded-xl` | Cards and elevated panels |
| `border` + `shadow-sm` | Subtle depth on cards |

---

*Document version: 2026 aesthetic baseline for Pipeline Pantry marketing war command center.*
