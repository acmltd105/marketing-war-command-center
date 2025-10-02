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

const DEMO_DATA: FinancialsData = {
  source: "demo",
  lastUpdated: new Date().toISOString(),
  revenue: {
    summary: [
      {
        id: "total-arr",
        label: "Total ARR",
        amount: 4_200_000,
        delta: 11.2,
        trend: "up",
        target: 5_000_000,
        format: "currency",
      },
      {
        id: "new-arr",
        label: "New ARR QTD",
        amount: 380_000,
        delta: 6.5,
        trend: "up",
        target: 450_000,
        format: "currency",
      },
      {
        id: "expansion-arr",
        label: "Expansion ARR",
        amount: 140_000,
        delta: 3.1,
        trend: "up",
        format: "currency",
      },
    ],
    pipeline: [
      {
        id: "pipeline-coverage",
        label: "Pipeline Coverage",
        amount: 4.2,
        delta: 0.4,
        trend: "up",
        target: 5,
        format: "ratio",
        precision: 1,
        suffix: "x",
      },
      {
        id: "committed-pipeline",
        label: "Committed Pipeline",
        amount: 910_000,
        delta: 5.6,
        trend: "up",
        format: "currency",
      },
      {
        id: "avg-contract",
        label: "Avg Contract Value",
        amount: 72_000,
        delta: 4.4,
        trend: "up",
        format: "currency",
      },
    ],
    efficiency: [
      {
        id: "win-rate",
        label: "Win Rate",
        amount: 31,
        delta: 1.7,
        trend: "up",
        target: 35,
        format: "percent",
        precision: 1,
      },
      {
        id: "sales-cycle",
        label: "Sales Cycle",
        amount: 32,
        delta: -2.1,
        trend: "down",
        format: "duration",
        suffix: "days",
      },
      {
        id: "lead-velocity",
        label: "Lead Velocity",
        amount: 18,
        delta: 2.4,
        trend: "up",
        format: "percent",
        precision: 1,
      },
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
      {
        id: "burn",
        label: "Monthly Burn",
        amount: 520_000,
        delta: -1.8,
        trend: "down",
        format: "currency",
      },
      {
        id: "operating",
        label: "Operating Expenses",
        amount: 310_000,
        delta: 0.9,
        trend: "up",
        format: "currency",
      },
      {
        id: "cash",
        label: "Cash on Hand",
        amount: 9_800_000,
        delta: 2.3,
        trend: "up",
        format: "currency",
      },
    ],
    unitEconomics: [
      {
        id: "cost-per-client",
        label: "Cost per Client",
        amount: 480,
        delta: -4.2,
        trend: "down",
        format: "currency",
      },
      {
        id: "cac-payback",
        label: "CAC Payback",
        amount: 9.4,
        delta: -0.6,
        trend: "down",
        format: "duration",
        precision: 1,
        suffix: "months",
      },
      {
        id: "support-cost",
        label: "Support Cost / Ticket",
        amount: 18,
        delta: 1.2,
        trend: "up",
        format: "currency",
      },
      {
        id: "ltv-cac",
        label: "LTV to CAC",
        amount: 4.2,
        delta: 0.3,
        trend: "up",
        format: "ratio",
        precision: 1,
        suffix: "x",
      },
    ],
    runway: {
      burnRate: 520_000,
      runwayMonths: 19,
      cashBalance: 9_800_000,
      nextMilestone: "Series C readiness in Q2 FY25",
    },
    alerts: [
      { id: "vendor-spend", severity: "warning", message: "Data enrichment renewal is trending +12% month over month." },
      { id: "hiring", severity: "info", message: "Hiring slowdown preserving headcount budget across sales." },
      { id: "support", severity: "critical", message: "Escalation volume has exceeded the support run rate by 8%." },
    ],
    vendorSpend: [
      {
        id: "clearbit",
        vendor: "Clearbit",
        category: "Data Enrichment",
        amount: 18_000,
        change: 12,
        status: "Renewal due",
      },
      {
        id: "segment",
        vendor: "Segment",
        category: "CDP",
        amount: 24_000,
        change: 4,
        status: "Active",
      },
      {
        id: "marketo",
        vendor: "Marketo",
        category: "Automation",
        amount: 32_000,
        change: -3,
        status: "Negotiating",
      },
      {
        id: "zendesk",
        vendor: "Zendesk",
        category: "Support",
        amount: 21_000,
        change: 6,
        status: "Active",
      },
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
      {
        id: "events",
        driver: "Field & events",
        readiness: "Playbook locked",
        runRate: 420_000,
        cost: 320_000,
        signal: "hot",
      },
      {
        id: "paid",
        driver: "Paid acquisition",
        readiness: "Budgets cleared",
        runRate: 310_000,
        cost: 260_000,
        signal: "warm",
      },
      {
        id: "partners",
        driver: "Partner co-selling",
        readiness: "Rev-share synced",
        runRate: 210_000,
        cost: 140_000,
        signal: "hot",
      },
    ],
    channelMix: [
      { id: "inbound", channel: "Inbound", mix: 38, cac: 420, payback: 7.5, intercept: "Full" },
      { id: "outbound", channel: "Outbound", mix: 22, cac: 510, payback: 9.2, intercept: "Partial" },
      { id: "partners", channel: "Partners", mix: 26, cac: 360, payback: 6.1, intercept: "Shared" },
      { id: "events", channel: "Events", mix: 14, cac: 540, payback: 8.6, intercept: "Full" },
    ],
    voiceSupport: [
      {
        id: "voice-sla",
        label: "Voice SLA",
        value: "92% within 45s",
        target: "90%",
        status: "on-track",
        trend: 1.4,
      },
      {
        id: "chat",
        label: "Chat concurrency",
        value: "3.1 avg",
        target: "3.0",
        status: "on-track",
        trend: 0.6,
      },
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

const TRENDS: TrendDirection[] = ["up", "down", "flat"];
const FORMATS: MetricFormat[] = ["currency", "percent", "number", "ratio", "duration"];
const GUARDRAIL_STATUSES: GuardrailStatus[] = ["stable", "watch", "breach"];
const SIGNAL_STATES: PredictabilityVolumeDriver["signal"][] = ["hot", "warm", "cool"];
const SUPPORT_STATUSES: SupportStatus[] = ["on-track", "at-risk", "breach"];

function isTrend(value: unknown): value is TrendDirection {
  return typeof value === "string" && TRENDS.includes(value as TrendDirection);
}

function isFormat(value: unknown): value is MetricFormat {
  return typeof value === "string" && FORMATS.includes(value as MetricFormat);
}

function isGuardrailStatus(value: unknown): value is GuardrailStatus {
  return typeof value === "string" && GUARDRAIL_STATUSES.includes(value as GuardrailStatus);
}

function isSignalState(value: unknown): value is PredictabilityVolumeDriver["signal"] {
  return typeof value === "string" && SIGNAL_STATES.includes(value as PredictabilityVolumeDriver["signal"]);
}

function isSupportStatus(value: unknown): value is SupportStatus {
  return typeof value === "string" && SUPPORT_STATUSES.includes(value as SupportStatus);
}

function toLabel(month: string | null | undefined) {
  if (!month) return "";
  const normalised = month.length === 7 ? `${month}-01` : month;
  const date = new Date(normalised);
  if (Number.isNaN(date.getTime())) {
    return month;
  }
  return date.toLocaleString("en-US", { month: "short" });
}

async function fetchFinancials(): Promise<FinancialsData> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return DEMO_DATA;
  }

  try {
    const [
      { data: revenueMetrics, error: revenueError },
      { data: expenseMetrics, error: expenseError },
      { data: projectionData, error: projectionError },
      { data: segmentData, error: segmentError },
      { data: mrrTrendData, error: mrrError },
      { data: vendorData, error: vendorError },
      { data: expenseTrendData, error: expenseTrendError },
      { data: safeLaunchData, error: safeLaunchError },
      { data: modelingData, error: modelingError },
      { data: guardrailData, error: guardrailError },
      { data: scenarioData, error: scenarioError },
      { data: driverData, error: driverError },
      { data: channelMixData, error: channelMixError },
      { data: supportData, error: supportError },
    ] = await Promise.all([
      client
        .from("financial_revenue_metrics")
        .select("id,label,amount,delta,trend,target,category,format,precision,suffix,section")
        .eq("active", true),
      client
        .from("financial_expense_metrics")
        .select(
          "id,label,amount,delta,trend,category,runway_burn,runway_months,next_milestone,severity,message,format,precision,suffix,section"
        )
        .eq("active", true),
      client
        .from("financial_revenue_projections")
        .select("quarter,forecast,variance")
        .order("quarter", { ascending: true }),
      client
        .from("financial_revenue_segments")
        .select("id,label,arr,change")
        .order("arr", { ascending: false }),
      client
        .from("financial_revenue_mrr_trends")
        .select("month,recurring,services")
        .order("month", { ascending: true }),
      client
        .from("financial_vendor_spend")
        .select("id,vendor,category,amount,change,status")
        .order("amount", { ascending: false }),
      client
        .from("financial_expense_trends")
        .select("month,marketing,headcount,tooling")
        .order("month", { ascending: true }),
      client
        .from("predictability_safe_launch")
        .select(
          "qualified_leads,qualified_lead_low,qualified_lead_high,activation_window_days,cost_to_scale,budget_guardrail,intercept_coverage,twilio_verified,automation_confidence"
        )
        .maybeSingle(),
      client
        .from("predictability_modeling")
        .select("forecast_accuracy,reliability_score,intercept_margin,scenario_confidence,notes")
        .maybeSingle(),
      client
        .from("predictability_guardrails")
        .select("id,label,status,detail")
        .order("display_order", { ascending: true }),
      client
        .from("predictability_scenarios")
        .select("id,scenario,lead_volume,conversion,readiness,go_live")
        .order("display_order", { ascending: true }),
      client
        .from("predictability_volume_drivers")
        .select("id,driver,readiness,run_rate,cost,signal")
        .order("display_order", { ascending: true }),
      client
        .from("predictability_channel_mix")
        .select("id,channel,mix,cac,payback,intercept")
        .order("mix", { ascending: false }),
      client
        .from("predictability_support_metrics")
        .select("id,label,value,target,status,trend")
        .order("display_order", { ascending: true }),
    ]);

    const queryError =
      revenueError ||
      expenseError ||
      projectionError ||
      segmentError ||
      mrrError ||
      vendorError ||
      expenseTrendError ||
      safeLaunchError ||
      modelingError ||
      guardrailError ||
      scenarioError ||
      driverError ||
      channelMixError ||
      supportError;
    if (queryError) {
      throw queryError;
    }

    const summaryMetrics: FinancialMetric[] = [];
    const pipelineMetrics: FinancialMetric[] = [];
    const efficiencyMetrics: FinancialMetric[] = [];

    revenueMetrics?.forEach((row) => {
      const metric: FinancialMetric = {
        id: row.id,
        label: row.label,
        amount: Number(row.amount ?? 0),
        delta: Number(row.delta ?? 0),
        trend: isTrend(row.trend) ? row.trend : "flat",
        target: row.target ?? undefined,
        format: isFormat(row.format) ? row.format : "currency",
        precision: typeof row.precision === "number" ? row.precision : undefined,
        suffix: row.suffix ?? undefined,
      };

      const bucket = row.section ?? row.category;
      if (bucket === "pipeline") {
        pipelineMetrics.push(metric);
      } else if (bucket === "efficiency") {
        efficiencyMetrics.push(metric);
      } else {
        summaryMetrics.push(metric);
      }
    });

    const summaryExpenses: FinancialMetric[] = [];
    const unitEconomics: FinancialMetric[] = [];
    const alerts: FinancialAlert[] = [];
    let runway: FinancialRunway | null = null;

    expenseMetrics?.forEach((row) => {
      const bucket = row.section ?? row.category;

      if (bucket === "alert" || row.category === "alert") {
        alerts.push({
          id: row.id,
          severity: (row.severity as FinancialAlert["severity"]) ?? "info",
          message: row.message ?? "",
        });
        return;
      }

      if (bucket === "runway") {
        runway = {
          burnRate: Number(row.runway_burn ?? row.amount ?? 0),
          runwayMonths: Number(row.runway_months ?? 0),
          cashBalance: Number(row.amount ?? DEMO_DATA.expenses.runway.cashBalance),
          nextMilestone: row.next_milestone ?? "",
        };
        return;
      }

      const metric: FinancialMetric = {
        id: row.id,
        label: row.label,
        amount: Number(row.amount ?? 0),
        delta: Number(row.delta ?? 0),
        trend: isTrend(row.trend) ? row.trend : "flat",
        format: isFormat(row.format) ? row.format : "currency",
        precision: typeof row.precision === "number" ? row.precision : undefined,
        suffix: row.suffix ?? undefined,
      };

      if (bucket === "unit") {
        unitEconomics.push(metric);
      } else {
        summaryExpenses.push(metric);
      }
    });

    const projections: FinancialProjection[] = projectionData?.map((row) => ({
      quarter: row.quarter,
      forecast: Number(row.forecast ?? 0),
      variance: Number(row.variance ?? 0),
    })) ?? [];

    const segments: RevenueSegment[] = segmentData?.map((row) => ({
      id: row.id,
      label: row.label,
      arr: Number(row.arr ?? 0),
      change: Number(row.change ?? 0),
    })) ?? [];

    const mrrTrend: RevenueTrendPoint[] = mrrTrendData?.map((row) => ({
      month: row.month,
      label: toLabel(row.month),
      recurring: Number(row.recurring ?? 0),
      services: Number(row.services ?? 0),
    })) ?? [];

    const vendorSpend: VendorSpend[] = vendorData?.map((row) => ({
      id: row.id,
      vendor: row.vendor,
      category: row.category,
      amount: Number(row.amount ?? 0),
      change: Number(row.change ?? 0),
      status: row.status,
    })) ?? [];

    const spendTrend: ExpenseTrendPoint[] = expenseTrendData?.map((row) => ({
      month: row.month,
      label: toLabel(row.month),
      marketing: Number(row.marketing ?? 0),
      headcount: Number(row.headcount ?? 0),
      tooling: Number(row.tooling ?? 0),
    })) ?? [];

    const safeLaunch = safeLaunchData
      ? {
          qualifiedLeads: Number(safeLaunchData.qualified_leads ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeads),
          qualifiedLeadLow: Number(safeLaunchData.qualified_lead_low ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeadLow),
          qualifiedLeadHigh: Number(safeLaunchData.qualified_lead_high ?? DEMO_DATA.predictability.safeLaunch.qualifiedLeadHigh),
          activationWindowDays: Number(
            safeLaunchData.activation_window_days ?? DEMO_DATA.predictability.safeLaunch.activationWindowDays
          ),
          costToScale: Number(safeLaunchData.cost_to_scale ?? DEMO_DATA.predictability.safeLaunch.costToScale),
          budgetGuardrail: Number(safeLaunchData.budget_guardrail ?? DEMO_DATA.predictability.safeLaunch.budgetGuardrail),
          interceptCoverage: Number(
            safeLaunchData.intercept_coverage ?? DEMO_DATA.predictability.safeLaunch.interceptCoverage
          ),
          twilioVerified: Number(safeLaunchData.twilio_verified ?? DEMO_DATA.predictability.safeLaunch.twilioVerified),
          automationConfidence: Number(
            safeLaunchData.automation_confidence ?? DEMO_DATA.predictability.safeLaunch.automationConfidence
          ),
        }
      : DEMO_DATA.predictability.safeLaunch;

    const modeling = modelingData
      ? {
          forecastAccuracy: Number(modelingData.forecast_accuracy ?? DEMO_DATA.predictability.modeling.forecastAccuracy),
          reliabilityScore: Number(modelingData.reliability_score ?? DEMO_DATA.predictability.modeling.reliabilityScore),
          interceptMargin: Number(modelingData.intercept_margin ?? DEMO_DATA.predictability.modeling.interceptMargin),
          scenarioConfidence: Number(
            modelingData.scenario_confidence ?? DEMO_DATA.predictability.modeling.scenarioConfidence
          ),
          notes: modelingData.notes ?? DEMO_DATA.predictability.modeling.notes,
        }
      : DEMO_DATA.predictability.modeling;

    const guardrails: PredictabilityGuardrail[] = guardrailData?.map((row) => ({
      id: row.id,
      label: row.label,
      status: isGuardrailStatus(row.status) ? row.status : DEMO_DATA.predictability.guardrails[0].status,
      detail: row.detail,
    })) ?? [];

    const scenarios: PredictabilityScenario[] = scenarioData?.map((row) => ({
      id: row.id,
      scenario: row.scenario,
      leadVolume: Number(row.lead_volume ?? 0),
      conversion: Number(row.conversion ?? 0),
      readiness: row.readiness,
      goLive: row.go_live,
    })) ?? [];

    const volumeDrivers: PredictabilityVolumeDriver[] = driverData?.map((row) => ({
      id: row.id,
      driver: row.driver,
      readiness: row.readiness,
      runRate: Number(row.run_rate ?? 0),
      cost: Number(row.cost ?? 0),
      signal: isSignalState(row.signal) ? row.signal : "warm",
    })) ?? [];

    const channelMix: PredictabilityChannelMix[] = channelMixData?.map((row) => ({
      id: row.id,
      channel: row.channel,
      mix: Number(row.mix ?? 0),
      cac: Number(row.cac ?? 0),
      payback: Number(row.payback ?? 0),
      intercept: row.intercept,
    })) ?? [];

    const voiceSupport: PredictabilitySupportMetric[] = supportData?.map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      target: row.target,
      status: isSupportStatus(row.status) ? row.status : "on-track",
      trend: Number(row.trend ?? 0),
    })) ?? [];

    return {
      source: "supabase",
      lastUpdated: new Date().toISOString(),
      revenue: {
        summary: summaryMetrics.length ? summaryMetrics : DEMO_DATA.revenue.summary,
        pipeline: pipelineMetrics.length ? pipelineMetrics : DEMO_DATA.revenue.pipeline,
        efficiency: efficiencyMetrics.length ? efficiencyMetrics : DEMO_DATA.revenue.efficiency,
        segments: segments.length ? segments : DEMO_DATA.revenue.segments,
        projections: projections.length ? projections : DEMO_DATA.revenue.projections,
        mrrTrend: mrrTrend.length ? mrrTrend : DEMO_DATA.revenue.mrrTrend,
      },
      expenses: {
        summary: summaryExpenses.length ? summaryExpenses : DEMO_DATA.expenses.summary,
        unitEconomics: unitEconomics.length ? unitEconomics : DEMO_DATA.expenses.unitEconomics,
        runway: runway ?? DEMO_DATA.expenses.runway,
        alerts: alerts.length ? alerts : DEMO_DATA.expenses.alerts,
        vendorSpend: vendorSpend.length ? vendorSpend : DEMO_DATA.expenses.vendorSpend,
        spendTrend: spendTrend.length ? spendTrend : DEMO_DATA.expenses.spendTrend,
      },
      predictability: {
        safeLaunch,
        modeling,
        guardrails: guardrails.length ? guardrails : DEMO_DATA.predictability.guardrails,
        scenarios: scenarios.length ? scenarios : DEMO_DATA.predictability.scenarios,
        volumeDrivers: volumeDrivers.length ? volumeDrivers : DEMO_DATA.predictability.volumeDrivers,
        channelMix: channelMix.length ? channelMix : DEMO_DATA.predictability.channelMix,
        voiceSupport: voiceSupport.length ? voiceSupport : DEMO_DATA.predictability.voiceSupport,
      },
    };
  } catch (error) {
    console.warn("Falling back to demo financial data", error);
    return {
      ...DEMO_DATA,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function useFinancialsData() {
  return useQuery({
    queryKey: ["financials", "dashboard"],
    queryFn: fetchFinancials,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
