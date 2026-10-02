import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export type TrendDirection = "up" | "down" | "flat";
export type MetricFormat = "currency" | "percent" | "number" | "ratio" | "duration";

export type FinancialMetric = {
  id: string;
  label: string;
  amount: number;
  delta: number;
  trend: TrendDirection;
  target?: number;
  format: MetricFormat;
  precision?: number;
  suffix?: string;
};

export type FinancialRunway = {
  burnRate: number;
  runwayMonths: number;
  cashBalance: number;
  nextMilestone: string;
};

export type FinancialProjection = {
  quarter: string;
  forecast: number;
  variance: number;
};

export type FinancialAlert = {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
};

export type RevenueSegment = {
  id: string;
  label: string;
  arr: number;
  change: number;
};

export type RevenueTrendPoint = {
  month: string;
  label: string;
  recurring: number;
  services: number;
};

export type VendorSpend = {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  change: number;
  status: string;
};

export type ExpenseTrendPoint = {
  month: string;
  label: string;
  marketing: number;
  headcount: number;
  tooling: number;
};

export type PredictabilitySafeLaunch = {
  qualifiedLeads: number;
  qualifiedLeadLow: number;
  qualifiedLeadHigh: number;
  activationWindowDays: number;
  costToScale: number;
  budgetGuardrail: number;
  interceptCoverage: number;
  twilioVerified: number;
  automationConfidence: number;
};

export type PredictabilityModeling = {
  forecastAccuracy: number;
  reliabilityScore: number;
  interceptMargin: number;
  scenarioConfidence: number;
  notes: string;
};

export type GuardrailStatus = "stable" | "watch" | "breach";

export type PredictabilityGuardrail = {
  id: string;
  label: string;
  status: GuardrailStatus;
  detail: string;
};

export type PredictabilityScenario = {
  id: string;
  scenario: string;
  leadVolume: number;
  conversion: number;
  readiness: string;
  goLive: string;
};

export type PredictabilityVolumeDriver = {
  id: string;
  driver: string;
  readiness: string;
  runRate: number;
  cost: number;
  signal: "hot" | "warm" | "cool";
};

export type PredictabilityChannelMix = {
  id: string;
  channel: string;
  mix: number;
  cac: number;
  payback: number;
  intercept: string;
};

export type SupportStatus = "on-track" | "at-risk" | "breach";

export type PredictabilitySupportMetric = {
  id: string;
  label: string;
  value: string;
  target: string;
  status: SupportStatus;
  trend: number;
};

export type PredictabilityData = {
  safeLaunch: PredictabilitySafeLaunch;
  modeling: PredictabilityModeling;
  guardrails: PredictabilityGuardrail[];
  scenarios: PredictabilityScenario[];
  volumeDrivers: PredictabilityVolumeDriver[];
  channelMix: PredictabilityChannelMix[];
  voiceSupport: PredictabilitySupportMetric[];
};

export type FinancialsData = {
  source: "supabase" | "demo";
  lastUpdated: string;
  revenue: {
    summary: FinancialMetric[];
    pipeline: FinancialMetric[];
    efficiency: FinancialMetric[];
    segments: RevenueSegment[];
    projections: FinancialProjection[];
    mrrTrend: RevenueTrendPoint[];
  };
  expenses: {
    summary: FinancialMetric[];
    unitEconomics: FinancialMetric[];
    runway: FinancialRunway;
    alerts: FinancialAlert[];
    vendorSpend: VendorSpend[];
    spendTrend: ExpenseTrendPoint[];
  };
  predictability: PredictabilityData;
};


interface SupabaseMetricRow {
  id: string;
  label: string;
  amount: number | null;
  delta: number | null;
  trend: string | null;
  target: number | null;
  section: string;
  format: string | null;
  precision: number | null;
  suffix: string | null;
  runway_burn?: number | null;
  runway_months?: number | null;
  next_milestone?: string | null;
  severity?: string | null;
  message?: string | null;
}
const DEMO_DATA: FinancialsData = {
  source: "demo",
  lastUpdated: new Date().toISOString(),
  revenue: {
    summary: [
      { id: "arr", label: "ARR", amount: 2_400_000, delta: 12.4, trend: "up", target: 3_000_000, format: "currency" },
      { id: "net-retention", label: "Net Revenue Retention", amount: 134, delta: 4.1, trend: "up", target: 140, format: "percent" },
      { id: "gross-margin", label: "Gross Margin", amount: 78, delta: 1.2, trend: "up", target: 80, format: "percent" },
    ],
    pipeline: [
      { id: "pipeline", label: "Pipeline Coverage", amount: 3.4, delta: -0.3, trend: "down", target: 4, format: "ratio", precision: 1 },
      { id: "avg-deal", label: "Average Deal Size", amount: 58_000, delta: 2.6, trend: "up", format: "currency" },
      { id: "cycle", label: "Sales Cycle", amount: 34, delta: -1.7, trend: "up", format: "duration", suffix: "days" },
    ],
    efficiency: [
      { id: "cac", label: "Blended CAC", amount: 480, delta: -5.2, trend: "up", target: 500, format: "currency" },
      { id: "payback", label: "CAC Payback", amount: 8.4, delta: -0.6, trend: "up", target: 8, format: "duration", precision: 1, suffix: "months" },
      { id: "ltv", label: "LTV:CAC", amount: 4.8, delta: 0.2, trend: "up", target: 4.5, format: "ratio", precision: 1 },
    ],
    segments: [
      { id: "enterprise", label: "Enterprise", arr: 1_150_000, change: 9.5 },
      { id: "midmarket", label: "Mid-Market", arr: 780_000, change: 6.2 },
      { id: "smb", label: "SMB", arr: 470_000, change: 3.1 },
    ],
    projections: [
      { quarter: "Q1", forecast: 2_550_000, variance: 3.2 },
      { quarter: "Q2", forecast: 2_720_000, variance: 2.1 },
      { quarter: "Q3", forecast: 2_940_000, variance: -1.4 },
      { quarter: "Q4", forecast: 3_120_000, variance: 4.6 },
    ],
    mrrTrend: [
      { month: "2024-01", label: "Jan", recurring: 430_000, services: 120_000 },
      { month: "2024-02", label: "Feb", recurring: 452_000, services: 122_000 },
      { month: "2024-03", label: "Mar", recurring: 468_000, services: 128_000 },
      { month: "2024-04", label: "Apr", recurring: 481_000, services: 131_000 },
      { month: "2024-05", label: "May", recurring: 498_000, services: 134_000 },
      { month: "2024-06", label: "Jun", recurring: 512_000, services: 139_000 },
    ],
  },
  expenses: {
    summary: [
      { id: "opex", label: "Operating Expenses", amount: 1_320_000, delta: 4.2, trend: "down", format: "currency" },
      { id: "headcount", label: "Headcount", amount: 168, delta: 3.1, trend: "up", format: "number" },
      { id: "tooling", label: "Tooling Spend", amount: 210_000, delta: 1.8, trend: "up", format: "currency" },
    ],
    unitEconomics: [
      { id: "unit-gross", label: "Unit Gross Margin", amount: 68, delta: 1.4, trend: "up", format: "percent" },
      { id: "unit-cost", label: "Unit Cost", amount: 142, delta: -2.3, trend: "up", format: "currency" },
      { id: "support-resolve", label: "Support Resolve", amount: 92, delta: 0.6, trend: "up", format: "percent" },
    ],
    runway: {
      burnRate: 312_000,
      runwayMonths: 18,
      cashBalance: 5_840_000,
      nextMilestone: "Series C readiness review",
    },
    alerts: [
      { id: "vendor-overrun", severity: "warning", message: "Conversational AI spend tracking 9% over target." },
      { id: "headcount", severity: "info", message: "Sales hiring plan extended by two sprints." },
    ],
    vendorSpend: [
      { id: "twilio", vendor: "Twilio", category: "Communications", amount: 128_000, change: 6.5, status: "scaling" },
      { id: "meta", vendor: "Meta Ads", category: "Acquisition", amount: 84_000, change: -3.2, status: "optimizing" },
      { id: "hubspot", vendor: "HubSpot", category: "Platform", amount: 46_000, change: 1.4, status: "steady" },
    ],
    spendTrend: [
      { month: "2024-01", label: "Jan", marketing: 240_000, headcount: 560_000, tooling: 120_000 },
      { month: "2024-02", label: "Feb", marketing: 252_000, headcount: 568_000, tooling: 118_000 },
      { month: "2024-03", label: "Mar", marketing: 261_000, headcount: 574_000, tooling: 121_000 },
      { month: "2024-04", label: "Apr", marketing: 255_000, headcount: 582_000, tooling: 123_000 },
      { month: "2024-05", label: "May", marketing: 268_000, headcount: 590_000, tooling: 126_000 },
      { month: "2024-06", label: "Jun", marketing: 274_000, headcount: 598_000, tooling: 128_000 },
    ],
  },
  predictability: {
    safeLaunch: {
      qualifiedLeads: 420,
      qualifiedLeadLow: 360,
      qualifiedLeadHigh: 480,
      activationWindowDays: 21,
      costToScale: 185_000,
      budgetGuardrail: 220_000,
      interceptCoverage: 0.86,
      twilioVerified: 0.94,
      automationConfidence: 0.91,
    },
    modeling: {
      forecastAccuracy: 0.92,
      reliabilityScore: 0.88,
      interceptMargin: 0.17,
      scenarioConfidence: 0.81,
      notes: "Forecast tracking within acceptable variance. Push retention campaign to maintain coverage.",
    },
    guardrails: [
      { id: "pipeline-health", label: "Pipeline health", status: "stable", detail: "3.4x coverage on next quarter quota." },
      { id: "lead-sla", label: "Lead SLA", status: "watch", detail: "SLA response slipped to 17 minutes." },
      { id: "twilio-spend", label: "Twilio spend", status: "stable", detail: "Messaging margin within guardrails." },
    ],
    scenarios: [
      { id: "aggressive", scenario: "Aggressive", leadVolume: 520, conversion: 0.19, readiness: "Crewed", goLive: "2024-08-15" },
      { id: "base", scenario: "Base", leadVolume: 440, conversion: 0.17, readiness: "Ready", goLive: "2024-07-01" },
      { id: "defensive", scenario: "Defensive", leadVolume: 320, conversion: 0.15, readiness: "Staged", goLive: "2024-09-10" },
    ],
    volumeDrivers: [
      { id: "ads", driver: "Paid social", readiness: "Scaling", runRate: 180, cost: 62_000, signal: "hot" },
      { id: "referrals", driver: "Member referrals", readiness: "Running", runRate: 96, cost: 14_000, signal: "warm" },
      { id: "events", driver: "Partner events", readiness: "Piloting", runRate: 58, cost: 28_000, signal: "cool" },
    ],
    channelMix: [
      { id: "sms", channel: "SMS", mix: 0.31, cac: 142, payback: 6.5, intercept: "Verified" },
      { id: "email", channel: "Email", mix: 0.27, cac: 118, payback: 7.2, intercept: "In QA" },
      { id: "voice", channel: "Voice", mix: 0.19, cac: 164, payback: 8.6, intercept: "Routing" },
      { id: "rcs", channel: "RCS", mix: 0.11, cac: 132, payback: 5.9, intercept: "Green" },
      { id: "web", channel: "Web", mix: 0.12, cac: 96, payback: 4.8, intercept: "Full" },
    ],
    voiceSupport: [
      { id: "fcr", label: "First contact resolution", value: "87%", target: "85%", status: "on-track", trend: 1.3 },
      { id: "asa", label: "Average speed to answer", value: "42s", target: "45s", status: "on-track", trend: -3.4 },
      { id: "nps", label: "Member NPS", value: "64", target: "60", status: "on-track", trend: 2.1 },
      { id: "escalations", label: "Escalations", value: "14", target: "12", status: "at-risk", trend: 0.8 },
    ],
  },
};

async function fetchSupabaseFinancials(): Promise<FinancialsData | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return null;
  }

  const [
    revenueMetrics,
    revenueProjections,
    revenueSegments,
    revenueTrend,
    expenseMetrics,
    vendorSpend,
    expenseTrend,
    safeLaunch,
    modeling,
    guardrails,
    scenarios,
    volumeDrivers,
    channelMix,
    supportMetrics,
  ] = await Promise.all([
    supabase.from("financial_revenue_metrics").select("*"),
    supabase.from("financial_revenue_projections").select("quarter, forecast, variance").order("quarter", { ascending: true }),
    supabase.from("financial_revenue_segments").select("id, label, arr, change"),
    supabase.from("financial_revenue_mrr_trends").select("month, recurring, services").order("month", { ascending: true }),
    supabase.from("financial_expense_metrics").select("*"),
    supabase.from("financial_vendor_spend").select("*"),
    supabase.from("financial_expense_trends").select("month, marketing, headcount, tooling").order("month", { ascending: true }),
    supabase.from("predictability_safe_launch").select("*").maybeSingle(),
    supabase.from("predictability_modeling").select("*").maybeSingle(),
    supabase.from("predictability_guardrails").select("*").order("id"),
    supabase.from("predictability_scenarios").select("*").order("id"),
    supabase.from("predictability_volume_drivers").select("*").order("id"),
    supabase.from("predictability_channel_mix").select("*").order("id"),
    supabase.from("predictability_support_metrics").select("*").order("id"),
  ]);

  const responses = [
    revenueMetrics,
    revenueProjections,
    revenueSegments,
    revenueTrend,
    expenseMetrics,
    vendorSpend,
    expenseTrend,
    safeLaunch,
    modeling,
    guardrails,
    scenarios,
    volumeDrivers,
    channelMix,
    supportMetrics,
  ];

  const hasTableMissing = responses.some((result) => {
    const error = "error" in result ? result.error : null;
    return error && typeof error.code === "string" && ["42P01", "PGRST301", "PGRST116", "42501"].includes(error.code);
  });

  if (hasTableMissing) {
    return null;
  }

  const firstError = responses.find((result) => {
    const error = "error" in result ? result.error : null;
    return error && !["42P01", "PGRST301", "PGRST116", "42501"].includes(error.code ?? "");
  });

  if (firstError && "error" in firstError && firstError.error) {
    throw firstError.error;
  }

  if (!revenueMetrics.data || !expenseMetrics.data) {
    return null;
  }

  const mapMetrics = (metrics: SupabaseMetricRow[] | null, section: string): FinancialMetric[] =>
    (metrics ?? [])
      .filter((metric) => metric.section === section)
      .map((metric) => ({
        id: metric.id,
        label: metric.label,
        amount: Number(metric.amount ?? 0),
        delta: Number(metric.delta ?? 0),
        trend: (metric.trend as TrendDirection) ?? "flat",
        target: metric.target != null ? Number(metric.target) : undefined,
        format: (metric.format as MetricFormat) ?? "currency",
        precision: metric.precision ?? undefined,
        suffix: metric.suffix ?? undefined,
      }));

  const revenueSummary = mapMetrics(revenueMetrics.data as SupabaseMetricRow[] | null, "summary");
  const revenuePipeline = mapMetrics(revenueMetrics.data as SupabaseMetricRow[] | null, "pipeline");
  const revenueEfficiency = mapMetrics(revenueMetrics.data as SupabaseMetricRow[] | null, "efficiency");

  const expenseSummary = mapMetrics(expenseMetrics.data as SupabaseMetricRow[] | null, "summary");
  const expenseUnit = mapMetrics(expenseMetrics.data as SupabaseMetricRow[] | null, "unit");

  const runwayRow = expenseMetrics.data.find((metric) => metric.section === "runway");

  const runway: FinancialRunway = {
    burnRate: Number(runwayRow?.runway_burn ?? 0),
    runwayMonths: Number(runwayRow?.runway_months ?? 0),
    cashBalance: Number(runwayRow?.amount ?? 0),
    nextMilestone: runwayRow?.next_milestone ?? "",
  };

  const alerts: FinancialAlert[] = expenseMetrics.data
    .filter((metric) => metric.section === "alerts")
    .map((metric) => ({
      id: metric.id,
      severity: (metric.severity as FinancialAlert["severity"]) ?? "info",
      message: metric.message ?? metric.label,
    }));

  return {
    source: "supabase",
    lastUpdated: new Date().toISOString(),
    revenue: {
      summary: revenueSummary,
      pipeline: revenuePipeline,
      efficiency: revenueEfficiency,
      segments: (revenueSegments.data ?? []).map((segment) => ({
        id: segment.id,
        label: segment.label,
        arr: Number(segment.arr ?? 0),
        change: Number(segment.change ?? 0),
      })),
      projections: (revenueProjections.data ?? []).map((projection) => ({
        quarter: projection.quarter,
        forecast: Number(projection.forecast ?? 0),
        variance: Number(projection.variance ?? 0),
      })),
      mrrTrend: (revenueTrend.data ?? []).map((row) => ({
        month: row.month,
        label: row.month,
        recurring: Number(row.recurring ?? 0),
        services: Number(row.services ?? 0),
      })),
    },
    expenses: {
      summary: expenseSummary,
      unitEconomics: expenseUnit,
      runway,
      alerts,
      vendorSpend: (vendorSpend.data ?? []).map((vendor) => ({
        id: vendor.id,
        vendor: vendor.vendor,
        category: vendor.category,
        amount: Number(vendor.amount ?? 0),
        change: Number(vendor.change ?? 0),
        status: vendor.status ?? "",
      })),
      spendTrend: (expenseTrend.data ?? []).map((row) => ({
        month: row.month,
        label: row.month,
        marketing: Number(row.marketing ?? 0),
        headcount: Number(row.headcount ?? 0),
        tooling: Number(row.tooling ?? 0),
      })),
    },
    predictability: {
      safeLaunch: {
        qualifiedLeads: Number(safeLaunch.data?.qualified_leads ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeads),
        qualifiedLeadLow: Number(safeLaunch.data?.qualified_lead_low ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeadLow),
        qualifiedLeadHigh: Number(safeLaunch.data?.qualified_lead_high ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeadHigh),
        activationWindowDays: Number(
          safeLaunch.data?.activation_window_days ?? DEMO_DATA.predictability.safeLaunch.activationWindowDays,
        ),
        costToScale: Number(safeLaunch.data?.cost_to_scale ?? DEMO_DATA.predictability.safeLaunch.costToScale),
        budgetGuardrail: Number(
          safeLaunch.data?.budget_guardrail ?? DEMO_DATA.predictability.safeLaunch.budgetGuardrail,
        ),
        interceptCoverage: Number(
          safeLaunch.data?.intercept_coverage ?? DEMO_DATA.predictability.safeLaunch.interceptCoverage,
        ),
        twilioVerified: Number(safeLaunch.data?.twilio_verified ?? DEMO_DATA.predictability.safeLaunch.twilioVerified),
        automationConfidence: Number(
          safeLaunch.data?.automation_confidence ?? DEMO_DATA.predictability.safeLaunch.automationConfidence,
        ),
      },
      modeling: {
        forecastAccuracy: Number(
          modeling.data?.forecast_accuracy ?? DEMO_DATA.predictability.modeling.forecastAccuracy,
        ),
        reliabilityScore: Number(
          modeling.data?.reliability_score ?? DEMO_DATA.predictability.modeling.reliabilityScore,
        ),
        interceptMargin: Number(
          modeling.data?.intercept_margin ?? DEMO_DATA.predictability.modeling.interceptMargin,
        ),
        scenarioConfidence: Number(
          modeling.data?.scenario_confidence ?? DEMO_DATA.predictability.modeling.scenarioConfidence,
        ),
        notes: modeling.data?.notes ?? DEMO_DATA.predictability.modeling.notes,
      },
      guardrails: (guardrails.data ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        status: (row.status as GuardrailStatus) ?? "stable",
        detail: row.detail ?? "",
      })),
      scenarios: (scenarios.data ?? []).map((row) => ({
        id: row.id,
        scenario: row.scenario,
        leadVolume: Number(row.lead_volume ?? 0),
        conversion: Number(row.conversion ?? 0),
        readiness: row.readiness ?? "",
        goLive: row.go_live ?? "",
      })),
      volumeDrivers: (volumeDrivers.data ?? []).map((row) => ({
        id: row.id,
        driver: row.driver,
        readiness: row.readiness ?? "",
        runRate: Number(row.run_rate ?? 0),
        cost: Number(row.cost ?? 0),
        signal: (row.signal as PredictabilityVolumeDriver["signal"]) ?? "warm",
      })),
      channelMix: (channelMix.data ?? []).map((row) => ({
        id: row.id,
        channel: row.channel,
        mix: Number(row.mix ?? 0),
        cac: Number(row.cac ?? 0),
        payback: Number(row.payback ?? 0),
        intercept: row.intercept ?? "",
      })),
      voiceSupport: (supportMetrics.data ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        value: row.value,
        target: row.target,
        status: (row.status as SupportStatus) ?? "on-track",
        trend: Number(row.trend ?? 0),
      })),
    },
  };
}

async function fetchFinancials(): Promise<FinancialsData> {
  try {
    const supabaseData = await fetchSupabaseFinancials();
    if (supabaseData) {
      return supabaseData;
    }
  } catch (error) {
    console.error("Falling back to demo financial dataset", error);
  }

  return { ...DEMO_DATA, lastUpdated: new Date().toISOString() };
}

export function useFinancialsData() {
  return useQuery({
    queryKey: ["financials"],
    queryFn: fetchFinancials,
    staleTime: 60_000,
  });
}
