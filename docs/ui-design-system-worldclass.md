# Pipeline Pantry — world-class UI system (minimal · functional · intuitive)

**Visual previews (SVG):** [`/public/design-preview/`](../public/design-preview/) — open `index.html` in a browser after `npm run dev` at **http://localhost:8080/design-preview/index.html** (or open the `.svg` files directly).

**Role:** Canonical design direction for **all** surfaces. Implements alongside [`ui-mockups-2026.md`](./ui-mockups-2026.md) (per-route) and [`guardrails-no-drift.md`](./guardrails-no-drift.md) (no fake metrics).

**North star:** *Calm power* — the UI feels **empty on purpose** until data earns ink; every control has **one obvious job**; errors are **recoverable in one click** where possible.

---

## 1. Principles (non-negotiable)

1. **One primary action per screen** — exactly one filled button (or link styled as primary) above the fold for the page’s main job.
2. **Progressive disclosure** — show **summary + density** first; drawers, accordions, or “Advanced” for the rest.
3. **Typography does hierarchy** — size and weight beat color and borders for structure.
4. **Semantic color only** — primary / destructive / muted / success / warning; **no** decorative rainbow KPIs in core chrome (retire “executive dashboard” candy in favor of **numbers that load or say “—”**).
5. **48px minimum touch** on mobile for primary actions; **8px** minimum gap between adjacent tap targets.
6. **Honest states** — loading, empty, error, partial success — each has **copy + one CTA** (see §9).
7. **`prefers-reduced-motion`** — respect always; motion is **optional polish**, never information-only.
8. **Keyboard first** — every flow completable without mouse; focus order = reading order.

---

## 2. Layout shell (top to bottom)

### 2.1 App frame

```
┌──────────┬────────────────────────────────────────────┐
│ Sidebar  │  Main (scroll)                              │
│ 272px    │  max-w-6xl mx-auto w-full px-6 py-8 lg:px-8 │
│ fixed h  │  (content column — never full-bleed text) │
│ screen   │                                             │
└──────────┴────────────────────────────────────────────┘
```

| Token | Value | Rule |
|-------|-------|------|
| Sidebar width | `w-72` (18rem) | Fixed; **do not** widen without breakpoint plan |
| Main padding | `p-6` default, `lg:p-8` for wide | Never `p-2` on page chrome |
| Content max | `max-w-6xl` (72rem) for prose-heavy; `max-w-4xl` for forms | Prevents unreadable line length |
| Vertical rhythm | `space-y-8` between major sections, `space-y-4` inside cards | Consistent breath |

### 2.2 Sidebar (navigation)

- **Top block:** product wordmark **Pipeline Pantry** + one line subtitle (**muted**, 12px) — no animated badges unless **live data**.
- **Nav items:** icon + label, **single** line; active = `bg-sidebar-accent` + **left 2px** border or `ring-1` — avoid full neon fill.
- **Bottom:** single **destructive** action max (e.g. emergency) — or move to **Settings** to reduce anxiety.
- **Collapse (future):** icon rail at `md` breakpoint; persist preference.

### 2.3 Page header (every route inside `Layout`)

Every page starts with the same **header block**:

```
[H1 title — text-2xl or text-3xl font-semibold tracking-tight]
[Optional subtitle — text-sm text-muted-foreground max-w-2xl mt-1]
[Optional toolbar row — flex gap-2 mt-6: primary CTA + secondary ghost]
────────────────────────────────────────────────── (border-b optional)
[Content]
```

- **No** random `mb-6` on first card — margin comes from header `mt-6` after toolbar.

---

## 3. Typography scale

| Role | Class pattern | Use |
|------|----------------|-----|
| Page title | `text-2xl sm:text-3xl font-semibold tracking-tight` | Once per page |
| Section title | `text-lg font-medium` | Card titles, panel headers |
| Body | `text-sm` default UI, `text-base` for long reading | Tables, forms |
| Meta / helper | `text-xs text-muted-foreground` | Hints, timestamps |
| Mono / data | `font-mono text-sm` | IDs, commit SHA, phone E.164 |

**Line height:** `leading-snug` for headings, `leading-relaxed` for paragraphs.

---

## 4. Color system (minimal application)

**Use semantic tokens from `:root`** (`background`, `foreground`, `primary`, `muted`, `destructive`, `border`, `card`).  

**De-emphasize** `corporate-*` and `revenue-*` in **default chrome** — reserve them for **data viz** and **alerts** only so the shell stays **quiet**.

| Semantic | When |
|----------|------|
| `primary` | One primary CTA, links that perform the main action |
| `destructive` | Irreversible or stop actions |
| `muted` | Secondary text, disabled, table zebra subtle |
| `border` | 1px dividers; prefer `border-border/60` for softness |
| Success | `text-emerald-600` + icon — **only** with real success state |

**Dark mode (if enabled):** mirror contrast; never rely on “light gray on white” alone.

---

## 5. Surfaces & elevation

| Level | Style |
|-------|--------|
| Page | `bg-background` only — **no** second full-page gradient behind main (optional: **one** subtle radial in `body` max) |
| Card | `rounded-lg border bg-card shadow-sm` — `shadow-md` only on hover for interactive cards |
| Modal / sheet | `shadow-lg` + `border` |
| Input | `h-10` default; `h-9` compact tables only |

**Glass / “fortune” effects:** use **sparingly** on **marketing** pages only; **operational** pages stay **flat** for trust.

---

## 6. Components (shadcn alignment)

| Pattern | Rule |
|---------|------|
| **Button** | Primary = default variant; secondary = `outline`; tertiary = `ghost`. **Never** two `default` in one row. |
| **Input + Label** | Always `Label` with `htmlFor`; errors `text-sm text-destructive` under field. |
| **Select** | Prefer over free text when **< 12** options. |
| **Table** | Sticky header optional; row hover `hover:bg-muted/50`; numeric **right-align**. |
| **Toast** | Success short; errors include **action** (“Retry”) when idempotent. |
| **Dialog** | Title = outcome (“Discard changes?”); primary = clearest safe action. |

---

## 7. Motion (2026, restrained)

- **Page enter:** `opacity 0→1`, `translateY(4px→0)`, **200–240ms**, `ease-out`.  
- **List stagger:** max **6 items**, **40ms** delay, **skip** if `prefers-reduced-motion`.  
- **Hover:** `transition-colors` only on nav rows — **no** scale on sidebar.  
- **Loading:** Prefer **skeleton** over spinners for content blocks; **one** global spinner for short mutations only.

**Implementation:** `framer-motion` when in bundle; otherwise **CSS** `transition` — never block interaction during animation.

---

## 8. Forms & wizards (onboarding, settings)

- **One column** on mobile; **two** only when second field is **dependent** (e.g. city after country).  
- **Step indicator:** text “Step 2 of 4” + **linear** `Progress` — no gamified icons.  
- **Back** = `ghost` left; **Continue** = `default` right — **same position** every step.

---

## 9. Empty, loading, error (intuitive trio)

| State | Pattern |
|-------|---------|
| **Loading** | Skeleton rows **matching** final layout (not generic pulse blobs). |
| **Empty** | Illustration **optional**; **required:** headline + one sentence + **primary CTA**. |
| **Error** | `Alert variant="destructive"` + **Retry** if retryable + **support link** if not. |

**Copy tone:** short, active voice, no blame (“We couldn’t load contacts” not “Error 500”).

---

## 10. Data density

| Mode | When |
|------|------|
| **Comfortable** (default) | `py-3` table rows, `gap-4` in lists |
| **Compact** | User toggle in settings — `py-2` rows, persist in `localStorage` |

---

## 11. Accessibility checklist (ship gate)

- [ ] Focus visible on all interactive elements  
- [ ] `aria-current="page"` on active nav  
- [ ] Form errors linked with `aria-describedby`  
- [ ] Color contrast ≥ 4.5:1 for body text on `background`  
- [ ] No **information** by color alone (icon + text for success/error)

---

## 12. Anti-patterns (do not ship)

- Two competing “primary” colors in one view (e.g. bright gold **and** bright blue CTAs).  
- Fake metrics or badges without data (`47K`, `Live` unless wired).  
- Full-page **404** that looks like a different product — use **same** `Layout` shell with minimal message.  
- **Infinite** scroll without “load more” or total count for heavy tables.

---

## 13. Implementation order (for engineers)

1. **Layout + Sidebar** — apply §2–§4 (quiet chrome, semantic color).  
2. **Page headers** — normalize all routes to §2.3.  
3. **Empty/loading/error** — §9 across Contacts, Company, Financials.  
4. **Motion** — §7 after `framer-motion` dependency decision.  
5. **Dark** — optional pass after light is stable.

---

## 14. Relation to other docs

| Doc | Relation |
|-----|----------|
| `ui-mockups-2026.md` | **Per-route** wire + motion notes — must **not** contradict this system |
| `swarm-phase1-mock-launch-pack.md` | Mock UI uses **this** system for new surfaces |

---

*This file is the **design constitution**. Changes require orchestrator + one-line changelog at bottom.*

### Changelog

| Date | Note |
|------|------|
| Initial | World-class minimal UI system for Pipeline Pantry |
