import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Briefcase,
  Gauge,
  PieChart,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { FinancialMetricCard } from "./FinancialMetricCard";
import {
  FALLBACK_FINANCIALS,
  type FinancialMetric,
  type GuardrailStatus,
  type PredictabilitySupportMetric,
  type PredictabilityVolumeDriver,
  type SupportStatus,
  useFinancialsData,
} from "./useFinancialsData";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: value >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

function formatPercent(value: number, precision = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(precision)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatMetric(metric: FinancialMetric) {
  switch (metric.format) {
    case "percent":
      return formatPercent(metric.amount, metric.precision ?? 1);
    case "ratio":
      return `${metric.amount.toFixed(metric.precision ?? 1)}${metric.suffix ?? "x"}`;
    case "duration":
      return `${metric.amount.toFixed(metric.precision ?? 0)} ${metric.suffix ?? "days"}`;
    case "number":
      return formatNumber(metric.amount);
    case "currency":
    default:
      return formatCurrency(metric.amount);
  }
}

const revenueChartConfig = {
  recurring: { label: "Recurring MRR", color: "hsl(150, 83%, 60%)" },
  services: { label: "Services", color: "hsl(216, 88%, 68%)" },
};

const expenseChartConfig = {
  headcount: { label: "Headcount", color: "hsl(217, 92%, 65%)" },
  marketing: { label: "Marketing", color: "hsl(35, 92%, 60%)" },
  tooling: { label: "Tooling", color: "hsl(286, 82%, 68%)" },
};

const guardrailStyles: Record<GuardrailStatus, string> = {
  stable: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  watch: "border-warning-amber/40 bg-warning-amber/10 text-warning-amber",
  breach: "border-corporate-crimson/40 bg-corporate-crimson/10 text-corporate-crimson",
};

const guardrailLabels: Record<GuardrailStatus, string> = {
  stable: "Stable",
  watch: "Watch",
  breach: "Breach",
};

const signalStyles: Record<PredictabilityVolumeDriver["signal"], string> = {
  hot: "text-revenue-green",
  warm: "text-warning-amber",
  cool: "text-corporate-silver",
};

const signalLabels: Record<PredictabilityVolumeDriver["signal"], string> = {
  hot: "Hot",
  warm: "Warm",
  cool: "Cooling",
};

const supportStyles: Record<SupportStatus, string> = {
  "on-track": "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  "at-risk": "border-warning-amber/40 bg-warning-amber/10 text-warning-amber",
  breach: "border-corporate-crimson/40 bg-corporate-crimson/10 text-corporate-crimson",
};

const supportLabels: Record<SupportStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  breach: "Breach",
};

export function FinancialsTabs() {
  const { data, isLoading } = useFinancialsData();
  const dataset = useMemo(
    () => data ?? { ...FALLBACK_FINANCIALS, lastUpdated: FALLBACK_FINANCIALS.lastUpdated },
    [data],
  );

  const projectionsTable = useMemo(() => dataset.revenue.projections, [dataset]);
  const revenueTrend = useMemo(() => dataset.revenue.mrrTrend, [dataset]);
  const spendTrend = useMemo(() => dataset.expenses.spendTrend, [dataset]);
  const guardrails = useMemo(() => dataset.predictability.guardrails, [dataset]);
  const scenarios = useMemo(() => dataset.predictability.scenarios, [dataset]);
  const volumeDrivers = useMemo(() => dataset.predictability.volumeDrivers, [dataset]);
  const channelMix = useMemo(() => dataset.predictability.channelMix, [dataset]);
  const voiceSupport = useMemo(() => dataset.predictability.voiceSupport, [dataset]);
  const safeLaunch = dataset.predictability.safeLaunch;
  const modeling = dataset.predictability.modeling;

  const topMetrics = useMemo(() => {
    const combined = [...dataset.revenue.summary, ...dataset.expenses.summary];
    return combined.slice(0, 3);
  }, [dataset]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Financial Command Center</h1>
          <p className="text-sm text-corporate-silver/80">
            Operate revenue acceleration and cost discipline from a unified glass dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-revenue-green/40 bg-revenue-green/10 text-revenue-green">
            <Activity className="mr-1 h-3 w-3" />
            {data?.source === "supabase" ? "Live Supabase feed" : "Demo data"}
          </Badge>
          <Badge variant="outline" className="border-corporate-silver/40 text-corporate-silver">
            Updated {new Date(dataset.lastUpdated).toLocaleTimeString()}
          </Badge>
        </div>
      </header>

      <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-corporate-platinum">
            <ShieldCheck className="h-4 w-4 text-revenue-green" /> Financial posture
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          {isLoading && !data
            ? new Array(3).fill(null).map((_, index) => (
                <Skeleton key={`financial-skeleton-${index}`} className="h-32 rounded-xl bg-white/5" />
              ))
            : topMetrics.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
        </CardContent>
      </Card>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1">
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-revenue-green/20 data-[state=active]:to-corporate-blue/20"
          >
            <BarChart3 className="mr-2 h-4 w-4" /> Revenue
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-corporate-crimson/20 data-[state=active]:to-warning-amber/20"
          >
            <Briefcase className="mr-2 h-4 w-4" /> Expenses
          </TabsTrigger>
          <TabsTrigger
            value="predictability"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kpi-purple/20 data-[state=active]:to-revenue-green/20"
          >
            <Gauge className="mr-2 h-4 w-4" /> Predictability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {dataset.revenue.summary.map((metric) => (
              <FinancialMetricCard key={`rev-summary-${metric.id}`} metric={metric} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <TrendingUp className="h-4 w-4 text-revenue-green" /> Monthly recurring revenue trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-72">
                  {(chartWidth, chartHeight) => (
                    <AreaChart
                      width={chartWidth}
                      height={chartHeight}
                      data={revenueTrend}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <defs>
                        <linearGradient id="recurring" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-recurring)" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="var(--color-recurring)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="services" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-services)" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="var(--color-services)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.25} />
                      <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} width={80} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area type="monotone" dataKey="recurring" stroke="var(--color-recurring)" fill="url(#recurring)" />
                      <Area type="monotone" dataKey="services" stroke="var(--color-services)" fill="url(#services)" />
                    </AreaChart>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <Target className="h-4 w-4 text-primary" /> Pipeline & efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {dataset.revenue.pipeline.map((metric) => (
                    <div key={`pipeline-${metric.id}`} className="flex items-center justify-between text-sm">
                      <span className="text-corporate-silver/80">{metric.label}</span>
                      <span className="font-semibold text-white">{formatMetric(metric)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {dataset.revenue.efficiency.map((metric) => (
                    <div key={`efficiency-${metric.id}`} className="flex items-center justify-between text-xs text-corporate-silver/70">
                      <span>{metric.label}</span>
                      <span>{formatPercent(metric.amount, metric.precision ?? 1)}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-corporate-silver/70">
                  <p className="font-semibold text-corporate-platinum">Segment ARR mix</p>
                  <div className="mt-2 space-y-1">
                    {dataset.revenue.segments.map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between">
                        <span>{segment.label}</span>
                        <span>
                          {formatCurrency(segment.arr)} ({formatPercent(segment.change)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                <Users className="h-4 w-4 text-primary" /> Forward projections
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quarter</TableHead>
                    <TableHead className="text-right">Forecast</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectionsTable.map((projection) => (
                    <TableRow key={projection.quarter}>
                      <TableCell className="font-medium text-corporate-platinum">{projection.quarter}</TableCell>
                      <TableCell className="text-right text-white">{formatCurrency(projection.forecast)}</TableCell>
                      <TableCell className="text-right text-corporate-silver">
                        {formatPercent(projection.variance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {dataset.expenses.summary.map((metric) => (
              <FinancialMetricCard key={`expense-summary-${metric.id}`} metric={metric} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <PieChart className="h-4 w-4 text-corporate-gold" /> Expense trend by category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={expenseChartConfig} className="h-72">
                  {(chartWidth, chartHeight) => (
                    <BarChart
                      width={chartWidth}
                      height={chartHeight}
                      data={spendTrend}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.25} />
                      <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} width={80} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="marketing" fill="var(--color-marketing)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="headcount" fill="var(--color-headcount)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="tooling" fill="var(--color-tooling)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <Briefcase className="h-4 w-4 text-primary" /> Vendor spend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataset.expenses.vendorSpend.map((vendor) => (
                  <div key={vendor.id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                    <div className="flex items-center justify-between text-corporate-platinum">
                      <span className="font-semibold">{vendor.vendor}</span>
                      <span>{formatCurrency(vendor.amount)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-corporate-silver/70">
                      <span>{vendor.category}</span>
                      <span className={cn(vendor.change >= 0 ? "text-revenue-green" : "text-corporate-crimson")}>
                        {formatPercent(vendor.change)}
                      </span>
                    </div>
                    <div className="mt-1 text-corporate-silver/60">Status: {vendor.status}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <AlertTriangle className="h-4 w-4 text-warning-amber" /> Runway & alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-corporate-silver/80">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-corporate-silver/60">Burn rate</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(dataset.expenses.runway.burnRate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-corporate-silver/60">Runway</p>
                    <p className="text-lg font-semibold text-white">{dataset.expenses.runway.runwayMonths} months</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-corporate-silver/60">Cash balance</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(dataset.expenses.runway.cashBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-corporate-silver/60">Next milestone</p>
                    <p className="text-sm font-semibold text-white">{dataset.expenses.runway.nextMilestone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {dataset.expenses.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
                        alert.severity === "critical"
                          ? "border-corporate-crimson/40 bg-corporate-crimson/10 text-corporate-crimson"
                          : alert.severity === "warning"
                          ? "border-warning-amber/40 bg-warning-amber/10 text-warning-amber"
                          : "border-corporate-silver/30 bg-white/5 text-corporate-silver",
                      )}
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                      <span>{alert.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <Target className="h-4 w-4 text-primary" /> Unit economics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataset.expenses.unitEconomics.map((metric) => (
                  <div key={`unit-${metric.id}`} className="flex items-center justify-between text-sm">
                    <span className="text-corporate-silver/80">{metric.label}</span>
                    <span className="font-semibold text-white">
                      {formatMetric(metric)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictability" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <ShieldCheck className="h-4 w-4 text-revenue-green" /> Safe launch envelope
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-xs text-corporate-silver/80">
                <div className="flex items-center justify-between">
                  <span>Qualified lead window</span>
                  <span className="font-semibold text-white">
                    {formatNumber(safeLaunch.qualifiedLeadLow)} – {formatNumber(safeLaunch.qualifiedLeadHigh)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Activation window</span>
                  <span className="font-semibold text-white">{safeLaunch.activationWindowDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Budget guardrail</span>
                  <span className="font-semibold text-white">{formatCurrency(safeLaunch.budgetGuardrail)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Automation confidence</span>
                  <span className="font-semibold text-white">{safeLaunch.automationConfidence}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <Gauge className="h-4 w-4 text-primary" /> Forecast modeling
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-xs text-corporate-silver/80">
                <div className="flex items-center justify-between">
                  <span>Forecast accuracy</span>
                  <span className="font-semibold text-white">{modeling.forecastAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reliability score</span>
                  <span className="font-semibold text-white">{modeling.reliabilityScore.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Intercept margin</span>
                  <span className="font-semibold text-white">{(modeling.interceptMargin * 100).toFixed(0)}%</span>
                </div>
                <p className="mt-2 text-[0.7rem] italic text-corporate-silver/70">{modeling.notes}</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <Users className="h-4 w-4 text-primary" /> Guardrails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {guardrails.map((guardrail) => (
                  <div
                    key={guardrail.id}
                    className={cn("rounded-lg border px-3 py-2 text-xs", guardrailStyles[guardrail.status])}
                  >
                    <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide">
                      <span>{guardrail.label}</span>
                      <span>{guardrailLabels[guardrail.status]}</span>
                    </div>
                    <p className="mt-1 text-[0.7rem] text-corporate-platinum/90">{guardrail.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                <Target className="h-4 w-4 text-primary" /> Launch scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-right">Lead volume</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                    <TableHead>Readiness</TableHead>
                    <TableHead className="text-right">Go-live</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenarios.map((scenario) => (
                    <TableRow key={scenario.id}>
                      <TableCell className="font-medium text-corporate-platinum">{scenario.scenario}</TableCell>
                      <TableCell className="text-right text-white">{formatNumber(scenario.leadVolume)}</TableCell>
                      <TableCell className="text-right text-corporate-silver">{scenario.conversion.toFixed(1)}%</TableCell>
                      <TableCell className="text-corporate-silver/80">{scenario.readiness}</TableCell>
                      <TableCell className="text-right text-corporate-silver">{scenario.goLive}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <TrendingUp className="h-4 w-4 text-revenue-green" /> Volume drivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {volumeDrivers.map((driver) => (
                  <div key={driver.id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                    <div className="flex items-center justify-between text-corporate-platinum">
                      <span className="font-semibold">{driver.driver}</span>
                      <span className={cn("font-semibold", signalStyles[driver.signal])}>
                        {signalLabels[driver.signal]}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-corporate-silver/70">
                      <span>{driver.readiness}</span>
                      <span>
                        {formatCurrency(driver.runRate)} / {formatCurrency(driver.cost)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-corporate-platinum">
                  <PieChart className="h-4 w-4 text-primary" /> Channel mix & support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-corporate-silver/80">
                <div className="space-y-1">
                  {channelMix.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between">
                      <span>{channel.channel}</span>
                      <span className="font-semibold text-white">
                        {channel.mix.toFixed(0)}% · CAC {formatCurrency(channel.cac)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2">
                  {voiceSupport.map((metric: PredictabilitySupportMetric) => (
                    <div
                      key={metric.id}
                      className={cn("rounded-lg border px-3 py-2", supportStyles[metric.status])}
                    >
                      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide">
                        <span>{metric.label}</span>
                        <span>{supportLabels[metric.status]}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[0.7rem]">
                        <span>{metric.value}</span>
                        <span>Target {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
