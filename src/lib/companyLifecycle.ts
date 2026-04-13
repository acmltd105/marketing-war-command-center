/**
 * Company lifecycle — idea → entity → brand → web → press → revenue → IPO.
 * Task keys are stable for localStorage + future Supabase sync.
 */

export type LifecycleStage = "idea" | "formed" | "live_brand" | "revenue" | "scaling" | "pre_ipo";

export const LIFECYCLE_STAGES: readonly { id: LifecycleStage; label: string; hint: string }[] = [
  { id: "idea", label: "Idea", hint: "Shape the problem, name, and first hypothesis." },
  { id: "formed", label: "Entity formed", hint: "Legal shell, EIN/FEIN path, bank-ready basics." },
  { id: "live_brand", label: "Brand & surface", hint: "Identity kit + corporate site live." },
  { id: "revenue", label: "First revenue", hint: "First sale in a day — systems, not heroics." },
  { id: "scaling", label: "Scaling", hint: "5 → 10 → 1000 with unit economics visible." },
  { id: "pre_ipo", label: "IPO readiness", hint: "Governance, audit trail, IR narrative — counsel-led." },
] as const;

export type LifecycleLane =
  | "formation"
  | "brand"
  | "web"
  | "press"
  | "velocity"
  | "ipo"
  | "survival";

export type LifecycleTaskDef = {
  id: string;
  lane: LifecycleLane;
  label: string;
  detail: string;
};

export const LIFECYCLE_TASKS: readonly LifecycleTaskDef[] = [
  {
    id: "formation_entity_choice",
    lane: "formation",
    label: "Choose entity type",
    detail: "LLC vs C-Corp vs other — document the choice; confirm with counsel or CPA.",
  },
  {
    id: "formation_fein",
    lane: "formation",
    label: "EIN / FEIN path",
    detail: "IRS Form SS-4 or CPA filing — store last 4 digits only in-app; never full SSN/TIN in browser.",
  },
  {
    id: "formation_bank",
    lane: "formation",
    label: "Business banking",
    detail: "Operating account opened; card policy documented.",
  },
  {
    id: "brand_kit",
    lane: "brand",
    label: "Brand kit (colors, type, voice)",
    detail: "One-page voice + visual rules your agents and site can share.",
  },
  {
    id: "brand_assets",
    lane: "brand",
    label: "Logo & wordmark exports",
    detail: "PNG/SVG for web, email header, and favicon.",
  },
  {
    id: "web_domain",
    lane: "web",
    label: "Domain & DNS",
    detail: "Registrar, DNS to host, SSL active.",
  },
  {
    id: "web_site_launch",
    lane: "web",
    label: "Corporate site live",
    detail: "Privacy + terms pages (jurisdiction placeholders OK); contact or book flow.",
  },
  {
    id: "press_skeleton",
    lane: "press",
    label: "Press release skeleton",
    detail: "Facts, quote blocks, boilerplate — ship when you have a real story.",
  },
  {
    id: "press_list",
    lane: "press",
    label: "Media / analyst list",
    detail: "Who gets the embargo — even 10 names is a start.",
  },
  {
    id: "velocity_first_sale_day",
    lane: "velocity",
    label: "First sale in a day",
    detail: "Offer + payment + receipt path proven once end-to-end.",
  },
  {
    id: "velocity_5",
    lane: "velocity",
    label: "5 paying customers / orders",
    detail: "Cohort checkpoint — note segment if mixed.",
  },
  {
    id: "velocity_10",
    lane: "velocity",
    label: "10",
    detail: "Repeatability > hero deals.",
  },
  {
    id: "velocity_1000",
    lane: "velocity",
    label: "1000",
    detail: "Volume + support + infra — only celebrate if margins hold.",
  },
  {
    id: "ipo_readiness_finance",
    lane: "ipo",
    label: "Financial close readiness",
    detail: "GAAP-ish discipline, rev rec, segment reporting themes — your CFO/counsel.",
  },
  {
    id: "ipo_readiness_governance",
    lane: "ipo",
    label: "Board & governance cadence",
    detail: "Minutes, committees, D&O — checklist only here.",
  },
  {
    id: "ipo_readiness_ir",
    lane: "ipo",
    label: "IR narrative shell",
    detail: "Story arc, risk factors outline — not a filing.",
  },
  {
    id: "survival_runway",
    lane: "survival",
    label: "Runway vs burn",
    detail: "Months of cash at current burn — update monthly.",
  },
  {
    id: "survival_concentration",
    lane: "survival",
    label: "Customer concentration",
    detail: "Top 3 customers as % of revenue — flag if >50%.",
  },
] as const;

export const LANE_LABELS: Record<LifecycleLane, string> = {
  formation: "Formation & EIN",
  brand: "Brand identity",
  web: "Corporate website",
  press: "Press & narrative",
  velocity: "Revenue velocity",
  ipo: "IPO tracker",
  survival: "Survival radar",
};

export function tasksForLane(lane: LifecycleLane): readonly LifecycleTaskDef[] {
  return LIFECYCLE_TASKS.filter((t) => t.lane === lane);
}

export function defaultStageForProgress(completedIds: Set<string>): LifecycleStage {
  const has = (id: string) => completedIds.has(id);
  if (has("velocity_1000")) return "pre_ipo";
  if (has("velocity_10") || has("velocity_5")) return "scaling";
  if (has("velocity_first_sale_day")) return "revenue";
  if (has("web_site_launch") && has("brand_kit")) return "live_brand";
  if (has("formation_fein") && has("formation_entity_choice")) return "formed";
  return "idea";
}
