import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { FinancialMetric } from "./useFinancialsData";

function formatCurrency(value: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    notation: Math.abs(value) >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

function formatPercent(value: number, precision = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(precision)}%`;
}

function formatNumber(value: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: precision,
  }).format(value);
}

function formatMetricValue(metric: FinancialMetric, value: number) {
  const precision = metric.precision ?? (metric.format === "percent" ? 1 : 0);
  switch (metric.format) {
    case "percent":
      return formatPercent(value, precision);
    case "ratio":
      return `${value.toFixed(precision)}${metric.suffix ?? "x"}`;
    case "duration": {
      const unit = metric.suffix ?? "days";
      return `${value.toFixed(precision)} ${unit}`;
    }
    case "number":
      return formatNumber(value, precision) + (metric.suffix ? ` ${metric.suffix}` : "");
    case "currency":
    default:
      return formatCurrency(value, precision);
  }
}

export function FinancialMetricCard({ metric }: { metric: FinancialMetric }) {
  const TrendIcon =
    metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;

  const deltaTone =
    metric.trend === "up"
      ? "bg-revenue-green/15 text-revenue-green"
      : metric.trend === "down"
      ? "bg-corporate-crimson/15 text-corporate-crimson"
      : "bg-corporate-silver/15 text-corporate-silver";

  return (
    <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-corporate-platinum">{metric.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-white">{formatMetricValue(metric, metric.amount)}</p>
          {metric.target !== undefined && (
            <p className="text-xs text-corporate-silver/70">
              Target: {formatMetricValue(metric, metric.target)}
            </p>
          )}
        </div>
        <div className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-xs", deltaTone)}>
          <TrendIcon className="h-3 w-3" />
          <span>
            {metric.format === "percent"
              ? formatPercent(metric.delta, metric.delta >= 10 || metric.delta <= -10 ? 0 : 1)
              : formatPercent(metric.delta)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
