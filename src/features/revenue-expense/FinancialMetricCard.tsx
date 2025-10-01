import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FinancialMetric } from "./useFinancialsData";

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
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
        <CardTitle className="text-sm font-medium text-corporate-platinum">
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">
            {metric.id === "net-retention" || metric.id === "gross-margin" || metric.id === "unit"
              ? `${metric.amount.toFixed(1)}%`
              : metric.id === "sales-cycle"
              ? `${metric.amount.toFixed(0)} days`
              : formatCurrency(metric.amount)}
          </p>
          {metric.target && (
            <p className="text-xs text-corporate-silver/70">Target: {formatCurrency(metric.target)}</p>
          )}
        </div>
        <div className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-xs", deltaTone)}>
          <TrendIcon className="h-3 w-3" />
          <span>{formatPercent(metric.delta)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
