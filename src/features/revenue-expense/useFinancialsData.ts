import { useQuery } from "@tanstack/react-query";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

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

type SupabaseMetricRow = {
  id: string;
  label: string;
  amount?: number | null;
  delta?: number | null;
  trend?: string | null;
  target?: number | null;
  target_value?: number | null;
  target_amount?: number | null;
  format?: string | null;
  precision?: number | null;
  decimals?: number | null;
  suffix?: string | null;
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

const DEMO_DATA: FinancialsData = {
  source: "demo",
  lastUpdated: new Date().toISOString(),
  revenue: {
    summary: [
      { id: "arr", label: "ARR", amount: 2_400_000, delta: 12.4, trend: "up", target: 3_000_000, format: "currency" },
      { id: "net-retention", label: "Net Revenue Retention", amount: 134, delta: 4.1, trend: "up", target: 140, format: "percent", precision: 0 },
      { id: "gross-margin", label: "Gross Margin", amount: 78, delta: 1.2, trend: "up", target: 80, format: "percent", precision: 0 },
    ],
    pipeline: [
      { id: "pipeline", label: "Pipeline Coverage", amount: 3.4, delta: -0.3, trend: "down", target: 4, format: "ratio", precision: 1, suffix: "x" },
      { id: "avg-deal", label: "Avg Deal Size", amount: 58_000, delta: 2.6, trend: "up", format: "currency" },
      { id: "sales-cycle", label: "Sales Cycle", amount: 34, delta: -1.7, trend: "down", format: "duration", precision: 0, suffix: "days" },
    ],
    efficiency: [
      { id: "win-rate", label: "Win Rate", amount: 28, delta: 1.4, trend: "up", format: "percent" },
      { id: "partner-sourced", label: "Partner Sourced", amount: 32, delta: 2.2, trend: "up", format: "percent" },
      { id: "upsell", label: "Expansion ARR", amount: 420_000, delta: 6.5, trend: "up", format: "currency" },
    ],
    segments: [
      { id: "enterprise", label: "Enterprise", arr: 2_200_000, change: 8.4 },
      { id: "midmarket", label: "Mid-Market", arr: 1_400_000, change: 5.1 },
      { id: "smb", label: "SMB", arr: 600_000, change: 3.7 },
    ],
    projections: [
      { quarter: "Q1", forecast: 620_000, variance: 4.8 },
      { quarter: "Q2", forecast: 710_000, variance: 3.1 },
      { quarter: "Q3", forecast: 810_000, variance: -1.5 },
      { quarter: "Q4", forecast: 920_000, variance: 0.6 },
    ],
    mrrTrend: [
      { month: "2024-04", label: "Apr", recurring: 320_000, services: 140_000 },
      { month: "2024-05", label: "May", recurring: 332_000, services: 150_000 },
      { month: "2024-06", label: "Jun", recurring: 345_000, services: 152_000 },
      { month: "2024-07", label: "Jul", recurring: 356_000, services: 149_000 },
      { month: "2024-08", label: "Aug", recurring: 368_000, services: 155_000 },
      { month: "2024-09", label: "Sep", recurring: 381_000, services: 160_000 },
    ],
  },
  expenses: {
    summary: [
      { id: "burn", label: "Monthly Burn", amount: 520_000, delta: -1.8, trend: "down", format: "currency" },
      { id: "operating", label: "Operating Expenses", amount: 310_000, delta: 0.9, trend: "up", format: "currency" },
      { id: "cash", label: "Cash on Hand", amount: 9_800_000, delta: 2.3, trend: "up", format: "currency" },
    ],
    unitEconomics: [
      { id: "cost-per-client", label: "Cost per Client", amount: 480, delta: -4.2, trend: "down", format: "currency" },
      { id: "cac-payback", label: "CAC Payback", amount: 9.4, delta: -0.6, trend: "down", format: "duration", precision: 1, suffix: "months" },
      { id: "ltv-cac", label: "LTV to CAC", amount: 4.2, delta: 0.3, trend: "up", format: "ratio", precision: 1, suffix: "x" },
    ],
    runway: {
      burnRate: 520_000,
      runwayMonths: 19,
      cashBalance: 9_800_000,
      nextMilestone: "Series C readiness in Q2 FY25",
    },
    alerts: [
      { id: "vendor-spend", severity: "warning", message: "Data enrichment renewal is trending +12% month over month." },
      { id: "support-alert", severity: "critical", message: "Escalation volume has exceeded the support run rate by 8%." },
      { id: "hiring", severity: "info", message: "Hiring slowdown preserving headcount budget across sales." },
    ],
    vendorSpend: [
      { id: "clearbit", vendor: "Clearbit", category: "Data Enrichment", amount: 18_000, change: 12, status: "Renewal due" },
      { id: "segment", vendor: "Segment", category: "CDP", amount: 24_000, change: 4, status: "Active" },
      { id: "marketo", vendor: "Marketo", category: "Automation", amount: 32_000, change: -3, status: "Negotiating" },
      { id: "zendesk", vendor: "Zendesk", category: "Support", amount: 21_000, change: 6, status: "Active" },
    ],
    spendTrend: [
      { month: "2024-04", label: "Apr", marketing: 180_000, headcount: 260_000, tooling: 120_000 },
      { month: "2024-05", label: "May", marketing: 172_000, headcount: 258_000, tooling: 118_000 },
      { month: "2024-06", label: "Jun", marketing: 168_000, headcount: 254_000, tooling: 117_000 },
      { month: "2024-07", label: "Jul", marketing: 166_000, headcount: 250_000, tooling: 119_000 },
      { month: "2024-08", label: "Aug", marketing: 162_000, headcount: 246_000, tooling: 118_000 },
      { month: "2024-09", label: "Sep", marketing: 158_000, headcount: 243_000, tooling: 116_000 },
    ],
  },
  predictability: {
    safeLaunch: {
      qualifiedLeads: 1_000_000,
      qualifiedLeadLow: 920_000,
      qualifiedLeadHigh: 1_050_000,
      activationWindowDays: 45,
      costToScale: 1_000_000,
      budgetGuardrail: 2_000_000,
      interceptCoverage: 96,
      twilioVerified: 120,
      automationConfidence: 94,
    },
    modeling: {
      forecastAccuracy: 96.4,
      reliabilityScore: 92,
      interceptMargin: 0.82,
      scenarioConfidence: 88,
      notes: "Intercept margin and reliability remain within the safe launch envelope.",
    },
    guardrails: [
      {
        id: "compliance",
        label: "Compliance verified",
        status: "stable",
        detail: "All 120 Twilio numbers validated and mapped to enforcement scripts.",
      },
      {
        id: "budget",
        label: "Budget guardrail",
        status: "watch",
        detail: "Scaling plan consumes 48% of the $2M cap. Procurement sign-off pending.",
      },
      {
        id: "support",
        label: "Support readiness",
        status: "stable",
        detail: "Voice and chat staffed 24/7 with surge playbooks activated.",
      },
    ],
    scenarios: [
      {
        id: "base",
        scenario: "Base launch",
        leadVolume: 920_000,
        conversion: 3.2,
        readiness: "Pods staffed, QA complete",
        goLive: "92%",
      },
      {
        id: "aggressive",
        scenario: "Aggressive capture",
        leadVolume: 1_050_000,
        conversion: 3.6,
        readiness: "Additional SDR pod pending",
        goLive: "88%",
      },
      {
        id: "defensive",
        scenario: "Defensive floor",
        leadVolume: 780_000,
        conversion: 2.8,
        readiness: "Automation only",
        goLive: "97%",
      },
    ],
    volumeDrivers: [
      { id: "events", driver: "Field & events", readiness: "Playbook locked", runRate: 420_000, cost: 320_000, signal: "hot" },
      { id: "paid", driver: "Paid acquisition", readiness: "Budgets cleared", runRate: 310_000, cost: 260_000, signal: "warm" },
      { id: "partners", driver: "Partner co-selling", readiness: "Rev-share synced", runRate: 210_000, cost: 140_000, signal: "hot" },
    ],
    channelMix: [
      { id: "inbound", channel: "Inbound", mix: 38, cac: 420, payback: 7.5, intercept: "Full" },
      { id: "outbound", channel: "Outbound", mix: 22, cac: 510, payback: 9.2, intercept: "Partial" },
      { id: "partners", channel: "Partners", mix: 26, cac: 360, payback: 6.1, intercept: "Shared" },
      { id: "events", channel: "Events", mix: 14, cac: 540, payback: 8.6, intercept: "Full" },
    ],
    voiceSupport: [
      { id: "voice-sla", label: "Voice SLA", value: "92% within 45s", target: "90%", status: "on-track", trend: 1.4 },
      { id: "chat", label: "Chat concurrency", value: "3.1 avg", target: "3.0", status: "on-track", trend: 0.6 },
      {
        id: "deflection",
        label: "Self-serve deflection",
        value: "38%",
        target: "40%",
        status: "at-risk",
        trend: -1.1,
      },
    ],
  },
};

function mapMetric(row: SupabaseMetricRow): FinancialMetric {
  const amount = Number(row.amount ?? 0);
  const delta = Number(row.delta ?? 0);
  const targetValue = row.target ?? row.target_value ?? row.target_amount;
  const precisionValue = row.precision ?? row.decimals;
  return {
    id: row.id,
    label: row.label,
    amount,
    delta,
    trend: (row.trend as TrendDirection) ?? "flat",
    target: targetValue === null || targetValue === undefined ? undefined : Number(targetValue),
    format: (row.format as MetricFormat) ?? "currency",
    precision: precisionValue === null || precisionValue === undefined ? undefined : Number(precisionValue),
    suffix: row.suffix ?? undefined,
  };
}

function coerceMonthLabel(month: string): string {
  if (!month) return "";
  const parsed = new Date(month);
  if (Number.isNaN(parsed.valueOf())) {
    return month;
  }
  return parsed.toLocaleDateString(undefined, { month: "short" });
}

function collectSupabaseErrors(results: Array<{ error: PostgrestError | null } | undefined>) {
  return results
    .map((result) => result?.error)
    .filter((error): error is PostgrestError => Boolean(error));
}

async function loadFinancialsFromSupabase(client: SupabaseClient): Promise<FinancialsData | null> {
  const [
    revenueMetrics,
    expenseMetrics,
    projections,
    segments,
    revenueTrend,
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
    client.from("financial_revenue_metrics").select("*", { head: false }).eq("active", true),
    client.from("financial_expense_metrics").select("*", { head: false }).eq("active", true),
    client.from("financial_revenue_projections").select("quarter, forecast, variance").order("quarter"),
    client.from("financial_revenue_segments").select("id, label, arr, change"),
    client.from("financial_revenue_mrr_trends").select("month, recurring, services").order("month"),
    client.from("financial_vendor_spend").select("id, vendor, category, amount, change, status"),
    client.from("financial_expense_trends").select("month, marketing, headcount, tooling").order("month"),
    client.from("predictability_safe_launch").select("*").maybeSingle(),
    client.from("predictability_modeling").select("*").maybeSingle(),
    client.from("predictability_guardrails").select("id, label, status, detail").order("display_order"),
    client.from("predictability_scenarios").select("id, scenario, lead_volume, conversion, readiness, go_live").order("display_order"),
    client.from("predictability_volume_drivers").select("id, driver, readiness, run_rate, cost, signal").order("display_order"),
    client.from("predictability_channel_mix").select("id, channel, mix, cac, payback, intercept").order("display_order"),
    client.from("predictability_support_metrics").select("id, label, value, target, status, trend").order("display_order"),
  ]);

  const errors = collectSupabaseErrors([
    revenueMetrics,
    expenseMetrics,
    projections,
    segments,
    revenueTrend,
    vendorSpend,
    expenseTrend,
    safeLaunch,
    modeling,
    guardrails,
    scenarios,
    volumeDrivers,
    channelMix,
    supportMetrics,
  ]);

  if (errors.length) {
    errors.forEach((error) => {
      console.warn("Falling back to demo financial data due to Supabase error", error);
    });
    return null;
  }

  const revenueSummary: FinancialMetric[] = [];
  const revenuePipeline: FinancialMetric[] = [];
  const revenueEfficiency: FinancialMetric[] = [];

  (revenueMetrics.data ?? []).forEach((row) => {
    const metric = mapMetric(row);
    const section = String(row.section ?? row.category ?? "summary");
    if (section === "pipeline") {
      revenuePipeline.push(metric);
    } else if (section === "efficiency" || section === "unit") {
      revenueEfficiency.push(metric);
    } else {
      revenueSummary.push(metric);
    }
  });

  const expenseSummary: FinancialMetric[] = [];
  const unitEconomics: FinancialMetric[] = [];
  const alerts: FinancialAlert[] = [];
  let runway: FinancialRunway = {
    burnRate: DEMO_DATA.expenses.runway.burnRate,
    runwayMonths: DEMO_DATA.expenses.runway.runwayMonths,
    cashBalance: DEMO_DATA.expenses.runway.cashBalance,
    nextMilestone: DEMO_DATA.expenses.runway.nextMilestone,
  };

  (expenseMetrics.data ?? []).forEach((row) => {
    const section = String(row.section ?? row.category ?? "summary");
    const metric = mapMetric(row);

    if (section === "summary") {
      expenseSummary.push(metric);
    } else if (section === "unit") {
      unitEconomics.push(metric);
    } else if (section === "runway") {
      runway = {
        burnRate: Number(row.runway_burn ?? metric.amount ?? 0),
        runwayMonths: Number(row.runway_months ?? 0),
        cashBalance: metric.amount ?? 0,
        nextMilestone: row.next_milestone ?? DEMO_DATA.expenses.runway.nextMilestone,
      };
    } else if (section === "alert" && row.message) {
      alerts.push({
        id: row.id,
        severity: (row.severity as FinancialAlert["severity"]) ?? "info",
        message: row.message,
      });
    }
  });

  const projectionsData: FinancialProjection[] = (projections.data ?? []).map((row) => ({
    quarter: row.quarter,
    forecast: Number(row.forecast ?? 0),
    variance: Number(row.variance ?? 0),
  }));

  const segmentsData: RevenueSegment[] = (segments.data ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    arr: Number(row.arr ?? 0),
    change: Number(row.change ?? 0),
  }));

  const revenueTrendData: RevenueTrendPoint[] = (revenueTrend.data ?? []).map((row) => ({
    month: row.month,
    label: coerceMonthLabel(row.month),
    recurring: Number(row.recurring ?? 0),
    services: Number(row.services ?? 0),
  }));

  const vendorSpendData: VendorSpend[] = (vendorSpend.data ?? []).map((row) => ({
    id: row.id,
    vendor: row.vendor,
    category: row.category,
    amount: Number(row.amount ?? 0),
    change: Number(row.change ?? 0),
    status: row.status,
  }));

  const expenseTrendData: ExpenseTrendPoint[] = (expenseTrend.data ?? []).map((row) => ({
    month: row.month,
    label: coerceMonthLabel(row.month),
    marketing: Number(row.marketing ?? 0),
    headcount: Number(row.headcount ?? 0),
    tooling: Number(row.tooling ?? 0),
  }));

  const safeLaunchRow = safeLaunch.data;
  const modelingRow = modeling.data;

  const predictability: PredictabilityData = {
    safeLaunch: safeLaunchRow
      ? {
          qualifiedLeads: Number(safeLaunchRow.qualified_leads ?? 0),
          qualifiedLeadLow: Number(safeLaunchRow.qualified_lead_low ?? 0),
          qualifiedLeadHigh: Number(safeLaunchRow.qualified_lead_high ?? 0),
          activationWindowDays: Number(safeLaunchRow.activation_window_days ?? 0),
          costToScale: Number(safeLaunchRow.cost_to_scale ?? 0),
          budgetGuardrail: Number(safeLaunchRow.budget_guardrail ?? 0),
          interceptCoverage: Number(safeLaunchRow.intercept_coverage ?? 0),
          twilioVerified: Number(safeLaunchRow.twilio_verified ?? 0),
          automationConfidence: Number(safeLaunchRow.automation_confidence ?? 0),
        }
      : DEMO_DATA.predictability.safeLaunch,
    modeling: modelingRow
      ? {
          forecastAccuracy: Number(modelingRow.forecast_accuracy ?? 0),
          reliabilityScore: Number(modelingRow.reliability_score ?? 0),
          interceptMargin: Number(modelingRow.intercept_margin ?? 0),
          scenarioConfidence: Number(modelingRow.scenario_confidence ?? 0),
          notes: modelingRow.notes ?? "",
        }
      : DEMO_DATA.predictability.modeling,
    guardrails: (guardrails.data ?? []).map((row) => ({
      id: row.id,
      label: row.label,
      status: row.status as GuardrailStatus,
      detail: row.detail,
    })),
    scenarios: (scenarios.data ?? []).map((row) => ({
      id: row.id,
      scenario: row.scenario,
      leadVolume: Number(row.lead_volume ?? 0),
      conversion: Number(row.conversion ?? 0),
      readiness: row.readiness,
      goLive: row.go_live,
    })),
    volumeDrivers: (volumeDrivers.data ?? []).map((row) => ({
      id: row.id,
      driver: row.driver,
      readiness: row.readiness,
      runRate: Number(row.run_rate ?? 0),
      cost: Number(row.cost ?? 0),
      signal: row.signal as PredictabilityVolumeDriver["signal"],
    })),
    channelMix: (channelMix.data ?? []).map((row) => ({
      id: row.id,
      channel: row.channel,
      mix: Number(row.mix ?? 0),
      cac: Number(row.cac ?? 0),
      payback: Number(row.payback ?? 0),
      intercept: row.intercept,
    })),
    voiceSupport: (supportMetrics.data ?? []).map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      target: row.target,
      status: row.status as SupportStatus,
      trend: Number(row.trend ?? 0),
    })),
  };

  return {
    source: "supabase",
    lastUpdated: new Date().toISOString(),
    revenue: {
      summary: revenueSummary.length ? revenueSummary : DEMO_DATA.revenue.summary,
      pipeline: revenuePipeline.length ? revenuePipeline : DEMO_DATA.revenue.pipeline,
      efficiency: revenueEfficiency.length ? revenueEfficiency : DEMO_DATA.revenue.efficiency,
      segments: segmentsData.length ? segmentsData : DEMO_DATA.revenue.segments,
      projections: projectionsData.length ? projectionsData : DEMO_DATA.revenue.projections,
      mrrTrend: revenueTrendData.length ? revenueTrendData : DEMO_DATA.revenue.mrrTrend,
    },
    expenses: {
      summary: expenseSummary.length ? expenseSummary : DEMO_DATA.expenses.summary,
      unitEconomics: unitEconomics.length ? unitEconomics : DEMO_DATA.expenses.unitEconomics,
      runway,
      alerts: alerts.length ? alerts : DEMO_DATA.expenses.alerts,
      vendorSpend: vendorSpendData.length ? vendorSpendData : DEMO_DATA.expenses.vendorSpend,
      spendTrend: expenseTrendData.length ? expenseTrendData : DEMO_DATA.expenses.spendTrend,
    },
    predictability,
  };
}

async function fetchFinancials(): Promise<FinancialsData> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ...DEMO_DATA, lastUpdated: new Date().toISOString() };
  }

  try {
    const result = await loadFinancialsFromSupabase(supabase as SupabaseClient);
    if (!result) {
      return { ...DEMO_DATA, lastUpdated: new Date().toISOString() };
    }
    return result;
  } catch (error) {
    console.error("Failed to load financials from Supabase", error);
    return { ...DEMO_DATA, lastUpdated: new Date().toISOString() };
  }
}

export function useFinancialsData() {
  return useQuery<FinancialsData>({
    queryKey: ["financials"],
    queryFn: fetchFinancials,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
export { DEMO_DATA as FALLBACK_FINANCIALS };
