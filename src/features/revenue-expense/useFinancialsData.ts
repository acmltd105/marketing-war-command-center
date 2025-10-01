import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export type TrendDirection = "up" | "down" | "flat";

export type FinancialMetric = {
  id: string;
  label: string;
  amount: number;
  delta: number;
  trend: TrendDirection;
  target?: number;
};

export type FinancialRunway = {
  burnRate: number;
  runwayMonths: number;
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

export type FinancialsData = {
  source: "supabase" | "demo";
  lastUpdated: string;
  revenue: {
    headline: FinancialMetric[];
    pipeline: FinancialMetric[];
    projections: FinancialProjection[];
  };
  expenses: {
    headline: FinancialMetric[];
    runway: FinancialRunway;
    alerts: FinancialAlert[];
  };
};

const DEMO_DATA: FinancialsData = {
  source: "demo",
  lastUpdated: new Date().toISOString(),
  revenue: {
    headline: [
      { id: "arr", label: "ARR", amount: 2400000, delta: 12.4, trend: "up", target: 3000000 },
      { id: "net-retention", label: "Net Revenue Retention", amount: 134, delta: 4.1, trend: "up", target: 140 },
      { id: "gross-margin", label: "Gross Margin", amount: 78, delta: 1.2, trend: "up", target: 80 },
    ],
    pipeline: [
      { id: "pipeline", label: "Pipeline Coverage", amount: 3.4, delta: -0.3, trend: "down", target: 4 },
      { id: "avg-deal", label: "Avg Deal Size", amount: 58000, delta: 2.6, trend: "up" },
      { id: "sales-cycle", label: "Sales Cycle", amount: 34, delta: -1.7, trend: "down" },
    ],
    projections: [
      { quarter: "Q1", forecast: 620000, variance: 4.8 },
      { quarter: "Q2", forecast: 710000, variance: 3.1 },
      { quarter: "Q3", forecast: 810000, variance: -1.5 },
      { quarter: "Q4", forecast: 920000, variance: 0.6 },
    ],
  },
  expenses: {
    headline: [
      { id: "burn", label: "Monthly Burn", amount: 480000, delta: -2.3, trend: "down" },
      { id: "opex", label: "OpEx", amount: 220000, delta: 1.1, trend: "up" },
      { id: "unit", label: "Unit Economics", amount: 42, delta: 6.2, trend: "up" },
    ],
    runway: {
      burnRate: 480000,
      runwayMonths: 19,
      nextMilestone: "Series C readiness in 2 quarters",
    },
    alerts: [
      { id: "vendor-spend", severity: "warning", message: "Martech vendor costs spiked 11% MoM" },
      { id: "hiring-freeze", severity: "info", message: "Hiring slowdown preserving runway" },
    ],
  },
};

async function fetchFinancials(): Promise<FinancialsData> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return DEMO_DATA;
  }

  try {
    const [{ data: revenueData, error: revenueError }, { data: expenseData, error: expenseError }] = await Promise.all([
      client
        .from("financial_revenue_metrics")
        .select("id,label,amount,delta,trend,target,category")
        .eq("active", true),
      client
        .from("financial_expense_metrics")
        .select("id,label,amount,delta,trend,category,runway_burn,runway_months,next_milestone,severity,message")
        .eq("active", true),
    ]);

    if (revenueError || expenseError) {
      throw revenueError ?? expenseError;
    }

    const revenueHeadline: FinancialMetric[] = [];
    const revenuePipeline: FinancialMetric[] = [];

    revenueData?.forEach((row) => {
      const metric: FinancialMetric = {
        id: row.id,
        label: row.label,
        amount: row.amount ?? 0,
        delta: row.delta ?? 0,
        trend: (row.trend as TrendDirection) ?? "flat",
        target: row.target ?? undefined,
      };
      if (row.category === "headline") {
        revenueHeadline.push(metric);
      } else {
        revenuePipeline.push(metric);
      }
    });

    let runway: FinancialRunway | null = null;
    const alerts: FinancialAlert[] = [];
    const expenseHeadline: FinancialMetric[] = [];

    expenseData?.forEach((row) => {
      if (row.category === "headline") {
        expenseHeadline.push({
          id: row.id,
          label: row.label,
          amount: row.amount ?? 0,
          delta: row.delta ?? 0,
          trend: (row.trend as TrendDirection) ?? "flat",
        });
      }
      if (row.category === "alert") {
        alerts.push({
          id: row.id,
          severity: (row.severity as FinancialAlert["severity"]) ?? "info",
          message: row.message ?? "",
        });
      }
      if (row.category === "runway" && !runway) {
        runway = {
          burnRate: row.runway_burn ?? 0,
          runwayMonths: row.runway_months ?? 0,
          nextMilestone: row.next_milestone ?? "",
        };
      }
    });

    const { data: projectionData, error: projectionError } = await client
      .from("financial_revenue_projections")
      .select("quarter,forecast,variance")
      .order("quarter", { ascending: true });

    if (projectionError) {
      throw projectionError;
    }

    return {
      source: "supabase",
      lastUpdated: new Date().toISOString(),
      revenue: {
        headline: revenueHeadline.length ? revenueHeadline : DEMO_DATA.revenue.headline,
        pipeline: revenuePipeline.length ? revenuePipeline : DEMO_DATA.revenue.pipeline,
        projections: projectionData?.length
          ? projectionData.map((row) => ({
              quarter: row.quarter,
              forecast: row.forecast,
              variance: row.variance,
            }))
          : DEMO_DATA.revenue.projections,
      },
      expenses: {
        headline: expenseHeadline.length ? expenseHeadline : DEMO_DATA.expenses.headline,
        runway: runway ?? DEMO_DATA.expenses.runway,
        alerts: alerts.length ? alerts : DEMO_DATA.expenses.alerts,
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
