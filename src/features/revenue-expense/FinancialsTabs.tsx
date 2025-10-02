import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Briefcase,
  Gauge,
  PieChart,
  Radar,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { FinancialMetricCard } from "./FinancialMetricCard";
import {
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

  const projectionsTable = useMemo(() => data?.revenue.projections ?? [], [data]);
  const revenueTrend = useMemo(() => data?.revenue.mrrTrend ?? [], [data]);
  const spendTrend = useMemo(() => data?.expenses.spendTrend ?? [], [data]);
  const guardrails = useMemo(() => data?.predictability.guardrails ?? [], [data]);
  const scenarios = useMemo(() => data?.predictability.scenarios ?? [], [data]);
  const volumeDrivers = useMemo(() => data?.predictability.volumeDrivers ?? [], [data]);
  const channelMix = useMemo(() => data?.predictability.channelMix ?? [], [data]);
  const voiceSupport = useMemo(() => data?.predictability.voiceSupport ?? [], [data]);
  const safeLaunch = data?.predictability.safeLaunch;
  const modeling = data?.predictability.modeling;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Financial Command Center</h1>
          <p className="text-sm text-corporate-silver/80">
            Operate revenue acceleration and cost discipline from a unified glass dashboard.
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-revenue-green/40 text-revenue-green bg-revenue-green/10">
              <Activity className="mr-1 h-3 w-3" />
              {data.source === "supabase" ? "Live Supabase feed" : "Demo data"}
            </Badge>
            <Badge variant="outline" className="border-corporate-silver/40 text-corporate-silver">
              Updated {new Date(data.lastUpdated).toLocaleTimeString()}
            </Badge>
          </div>
        )}
      </header>

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
            <Wallet className="mr-2 h-4 w-4" /> Expenses
          </TabsTrigger>
          <TabsTrigger
            value="predictability"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-corporate-blue/20 data-[state=active]:to-emerald-500/20"
          >
            <Radar className="mr-2 h-4 w-4" /> Predictability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {isLoading &&
              new Array(3).fill(null).map((_, index) => (
                <Skeleton key={`rev-summary-${index}`} className="h-36 rounded-xl bg-white/5" />
              ))}
            {!isLoading && data?.revenue.summary.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <Target className="h-4 w-4 text-revenue-green" /> Pipeline momentum
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {new Array(3).fill(null).map((_, index) => (
                      <Skeleton key={`rev-pipeline-${index}`} className="h-32 rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {data?.revenue.pipeline.map((metric) => (
                      <FinancialMetricCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <TrendingUp className="h-4 w-4 text-corporate-blue" /> Recurring revenue trend
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <Skeleton className="h-60 rounded-xl bg-white/5" />
                ) : (
                  <ChartContainer config={revenueChartConfig} className="h-60">
                    <AreaChart data={revenueTrend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="recurringGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(150, 83%, 60%)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(150, 83%, 60%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(216, 88%, 68%)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(216, 88%, 68%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" />
                      <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${Math.round((value as number) / 1000)}k`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area
                        type="monotone"
                        dataKey="recurring"
                        stroke="hsl(150, 83%, 60%)"
                        fill="url(#recurringGradient)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="services"
                        stroke="hsl(216, 88%, 68%)"
                        fill="url(#servicesGradient)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <Gauge className="h-4 w-4 text-warning-amber" /> Revenue efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {new Array(2).fill(null).map((_, index) => (
                      <Skeleton key={`rev-efficiency-${index}`} className="h-32 rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data?.revenue.efficiency.map((metric) => (
                      <FinancialMetricCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <Users className="h-4 w-4 text-revenue-green" /> Revenue mix by segment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-40 rounded-xl bg-white/5" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5">
                        <TableHead className="text-corporate-silver">Segment</TableHead>
                        <TableHead className="text-corporate-silver">ARR</TableHead>
                        <TableHead className="text-corporate-silver">QoQ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.revenue.segments.map((segment) => (
                        <TableRow key={segment.id} className="border-white/5">
                          <TableCell className="text-white/90">{segment.label}</TableCell>
                          <TableCell className="text-white/90">{formatCurrency(segment.arr)}</TableCell>
                          <TableCell
                            className={cn(
                              "font-medium",
                              segment.change >= 0 ? "text-revenue-green" : "text-corporate-crimson"
                            )}
                          >
                            {formatPercent(segment.change)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                <Briefcase className="h-4 w-4 text-corporate-blue" /> Quarterly forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-40 rounded-xl bg-white/5" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead className="text-corporate-silver">Quarter</TableHead>
                      <TableHead className="text-corporate-silver">Forecast</TableHead>
                      <TableHead className="text-corporate-silver">Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectionsTable.map((projection) => (
                      <TableRow key={projection.quarter} className="border-white/5">
                        <TableCell className="text-white/90">{projection.quarter}</TableCell>
                        <TableCell className="text-white/90">{formatCurrency(projection.forecast)}</TableCell>
                        <TableCell
                          className={cn(
                            projection.variance >= 0 ? "text-revenue-green" : "text-corporate-crimson",
                            "font-medium"
                          )}
                        >
                          {formatPercent(projection.variance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {isLoading &&
              new Array(3).fill(null).map((_, index) => (
                <Skeleton key={`exp-summary-${index}`} className="h-36 rounded-xl bg-white/5" />
              ))}
            {!isLoading && data?.expenses.summary.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
          </section>

          <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                <PieChart className="h-4 w-4 text-warning-amber" /> Unit economics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {new Array(4).fill(null).map((_, index) => (
                    <Skeleton key={`exp-unit-${index}`} className="h-32 rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {data?.expenses.unitEconomics.map((metric) => (
                    <FinancialMetricCard key={metric.id} metric={metric} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <TrendingUp className="h-4 w-4 text-corporate-blue" /> Spend cadence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <Skeleton className="h-60 rounded-xl bg-white/5" />
                ) : (
                  <ChartContainer config={expenseChartConfig} className="h-60">
                    <BarChart data={spendTrend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" />
                      <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${Math.round((value as number) / 1000)}k`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="headcount" stackId="a" fill="hsl(217, 92%, 65%)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="marketing" stackId="a" fill="hsl(35, 92%, 60%)" />
                      <Bar dataKey="tooling" stackId="a" fill="hsl(286, 82%, 68%)" radius={[0, 0, 6, 6]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <ShieldCheck className="h-4 w-4 text-revenue-green" /> Runway & controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {isLoading ? (
                  <Skeleton className="h-48 rounded-xl bg-white/5" />
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-corporate-silver/80">Runway</p>
                      <p className="text-3xl font-semibold text-white">
                        {data?.expenses.runway.runwayMonths} months
                      </p>
                      <p className="text-sm text-corporate-silver/70">
                        Burn {formatCurrency(data?.expenses.runway.burnRate ?? 0)} / month · Cash {" "}
                        {formatCurrency(data?.expenses.runway.cashBalance ?? 0)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-corporate-blue/40 bg-corporate-blue/10 text-corporate-blue"
                    >
                      {data?.expenses.runway.nextMilestone}
                    </Badge>
                    <div className="space-y-3">
                      {data?.expenses.alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                        >
                          <AlertTriangle
                            className={cn(
                              "mt-0.5 h-4 w-4",
                              alert.severity === "critical"
                                ? "text-corporate-crimson"
                                : alert.severity === "warning"
                                ? "text-warning-amber"
                                : "text-corporate-blue"
                            )}
                          />
                          <p className="text-sm text-corporate-silver/90">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                <Briefcase className="h-4 w-4 text-warning-amber" /> Vendor spend radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 rounded-xl bg-white/5" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead className="text-corporate-silver">Vendor</TableHead>
                      <TableHead className="text-corporate-silver">Category</TableHead>
                      <TableHead className="text-corporate-silver">Monthly Spend</TableHead>
                      <TableHead className="text-corporate-silver">MoM</TableHead>
                      <TableHead className="text-corporate-silver text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.expenses.vendorSpend.map((vendor) => (
                      <TableRow key={vendor.id} className="border-white/5">
                        <TableCell className="text-white/90">{vendor.vendor}</TableCell>
                        <TableCell className="text-corporate-silver/90">{vendor.category}</TableCell>
                        <TableCell className="text-white/90">{formatCurrency(vendor.amount)}</TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            vendor.change >= 0 ? "text-warning-amber" : "text-revenue-green"
                          )}
                        >
                          {formatPercent(vendor.change)}
                        </TableCell>
                        <TableCell className="text-right text-corporate-silver/80">{vendor.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictability" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-corporate-blue/30 via-corporate-navy/30 to-black/30 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
              <CardHeader className="relative z-10">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-64 rounded-full bg-white/5" />
                    <Skeleton className="h-10 w-48 rounded-full bg-white/5" />
                    <Skeleton className="h-5 w-full rounded-full bg-white/5" />
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">Predictability &amp; Modeling Command</p>
                      <h2 className="text-3xl font-semibold text-white tracking-tight">PRO</h2>
                      <p className="text-sm text-white/70">
                        Model the safe launch envelope and automation reliability before scaling the war machine.
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <Badge
                        variant="outline"
                        className="border-white/30 bg-white/10 text-xs text-white backdrop-blur"
                      >
                        {safeLaunch ? formatNumber(safeLaunch.twilioVerified) : "--"} Twilio verified
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-revenue-green/40 bg-revenue-green/10 text-xs text-revenue-green"
                      >
                        {safeLaunch ? safeLaunch.interceptCoverage.toFixed(0) : "--"}% intercept coverage
                      </Badge>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                {isLoading ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-40 rounded-2xl bg-white/5" />
                    <Skeleton className="h-40 rounded-2xl bg-white/5" />
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Safe launch envelope</p>
                        <p className="mt-2 text-4xl font-semibold text-white">
                          {safeLaunch ? formatNumber(safeLaunch.qualifiedLeadLow) : "—"} - {" "}
                          {safeLaunch ? formatNumber(safeLaunch.qualifiedLeadHigh) : "—"}
                        </p>
                        <p className="text-sm text-white/70">
                          Qualified lead range anchored at {safeLaunch ? formatNumber(safeLaunch.qualifiedLeads) : "—"}.
                        </p>
                      </div>
                      <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-xs uppercase tracking-[0.18em] text-white/50">Activation window</dt>
                          <dd className="text-lg font-semibold text-white">
                            {safeLaunch ? `${safeLaunch.activationWindowDays} days` : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.18em] text-white/50">Automation confidence</dt>
                          <dd className="text-lg font-semibold text-white">
                            {safeLaunch ? `${safeLaunch.automationConfidence.toFixed(0)}%` : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.18em] text-white/50">Cost to scale</dt>
                          <dd className="text-lg font-semibold text-white">
                            {safeLaunch ? formatCurrency(safeLaunch.costToScale) : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.18em] text-white/50">Budget guardrail</dt>
                          <dd className="text-lg font-semibold text-white">
                            {safeLaunch ? formatCurrency(safeLaunch.budgetGuardrail) : "—"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Model reliability</p>
                          <p className="mt-2 text-4xl font-semibold text-white">
                            {modeling ? `${modeling.reliabilityScore.toFixed(0)}%` : "--"}
                          </p>
                          <p className="text-sm text-white/70">
                            {modeling
                              ? `Forecast accuracy ${modeling.forecastAccuracy.toFixed(1)}% with ${modeling.interceptMargin.toFixed(2)}x intercept margin.`
                              : "Forecast accuracy telemetry loading..."}
                          </p>
                        </div>
                        <Badge className="bg-revenue-green/20 text-xs text-revenue-green" variant="secondary">
                          {modeling ? `${modeling.scenarioConfidence.toFixed(0)}% scenario lock` : "Scenario pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60">{modeling?.notes ?? "Realtime guardrail telemetry pending."}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-card/80 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                  <ShieldCheck className="h-4 w-4 text-revenue-green" /> Enforcement guardrails
                </CardTitle>
                <p className="text-sm text-corporate-silver/70">
                  Live guardrail checks for compliance, budget, and support readiness.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading
                  ? new Array(3).fill(null).map((_, index) => (
                      <Skeleton key={`guardrail-${index}`} className="h-16 rounded-xl bg-white/5" />
                    ))
                  : guardrails.map((guardrail) => (
                      <div
                        key={guardrail.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{guardrail.label}</p>
                          <p className="text-xs text-white/70">{guardrail.detail}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("border px-3 py-1 text-xs font-semibold", guardrailStyles[guardrail.status])}
                        >
                          {guardrailLabels[guardrail.status]}
                        </Badge>
                      </div>
                    ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-white/10 bg-card/80 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-corporate-platinum text-lg">
                <Radar className="h-4 w-4 text-corporate-blue" /> Execution telemetry
              </CardTitle>
              <p className="text-sm text-corporate-silver/70">
                Switch across logistics, drivers, channel mix, and support load to calibrate go-live velocity.
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 rounded-xl bg-white/5" />
              ) : (
                <Tabs defaultValue="logistics" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-white/5 p-1 sm:grid-cols-4">
                    <TabsTrigger value="logistics" className="text-xs sm:text-sm">
                      Leads &amp; logistics
                    </TabsTrigger>
                    <TabsTrigger value="volume" className="text-xs sm:text-sm">
                      Volume drive
                    </TabsTrigger>
                    <TabsTrigger value="mix" className="text-xs sm:text-sm">
                      Channel mix
                    </TabsTrigger>
                    <TabsTrigger value="support" className="text-xs sm:text-sm">
                      Voice &amp; support
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="logistics">
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/5">
                            <TableHead className="text-white/70">Scenario</TableHead>
                            <TableHead className="text-white/70">Launch-ready leads</TableHead>
                            <TableHead className="text-white/70">Conversion</TableHead>
                            <TableHead className="text-white/70">Readiness</TableHead>
                            <TableHead className="text-white/70">Go-live confidence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scenarios.map((scenario) => (
                            <TableRow key={scenario.id} className="border-white/5">
                              <TableCell className="font-medium text-white">{scenario.scenario}</TableCell>
                              <TableCell className="text-white/80">{formatNumber(scenario.leadVolume)}</TableCell>
                              <TableCell className="text-white/80">{scenario.conversion.toFixed(1)}%</TableCell>
                              <TableCell className="text-white/70">{scenario.readiness}</TableCell>
                              <TableCell className="text-white/80">{scenario.goLive}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="volume">
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/5">
                            <TableHead className="text-white/70">Driver</TableHead>
                            <TableHead className="text-white/70">Readiness</TableHead>
                            <TableHead className="text-white/70">Modeled run rate</TableHead>
                            <TableHead className="text-white/70">Cost envelope</TableHead>
                            <TableHead className="text-white/70">Signal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {volumeDrivers.map((driver) => (
                            <TableRow key={driver.id} className="border-white/5">
                              <TableCell className="font-medium text-white">{driver.driver}</TableCell>
                              <TableCell className="text-white/70">{driver.readiness}</TableCell>
                              <TableCell className="text-white/80">{formatCurrency(driver.runRate)}</TableCell>
                              <TableCell className="text-white/80">{formatCurrency(driver.cost)}</TableCell>
                              <TableCell className={cn("text-sm font-semibold", signalStyles[driver.signal])}>
                                {signalLabels[driver.signal]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="mix">
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/5">
                            <TableHead className="text-white/70">Channel</TableHead>
                            <TableHead className="text-white/70">Mix</TableHead>
                            <TableHead className="text-white/70">CAC</TableHead>
                            <TableHead className="text-white/70">Payback</TableHead>
                            <TableHead className="text-white/70">Intercept</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {channelMix.map((row) => (
                            <TableRow key={row.id} className="border-white/5">
                              <TableCell className="font-medium text-white">{row.channel}</TableCell>
                              <TableCell className="text-white/80">{row.mix.toFixed(0)}%</TableCell>
                              <TableCell className="text-white/80">{formatCurrency(row.cac)}</TableCell>
                              <TableCell className="text-white/80">{row.payback.toFixed(1)} mo</TableCell>
                              <TableCell className="text-white/70">{row.intercept}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="support">
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/5">
                            <TableHead className="text-white/70">Metric</TableHead>
                            <TableHead className="text-white/70">Current</TableHead>
                            <TableHead className="text-white/70">Target</TableHead>
                            <TableHead className="text-white/70">Status</TableHead>
                            <TableHead className="text-white/70">Trend</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {voiceSupport.map((metric: PredictabilitySupportMetric) => (
                            <TableRow key={metric.id} className="border-white/5">
                              <TableCell className="font-medium text-white">{metric.label}</TableCell>
                              <TableCell className="text-white/80">{metric.value}</TableCell>
                              <TableCell className="text-white/80">{metric.target}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn("border px-3 py-1 text-xs font-semibold", supportStyles[metric.status])}
                                >
                                  {supportLabels[metric.status]}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    "text-sm font-semibold",
                                    metric.trend >= 0 ? "text-revenue-green" : "text-corporate-crimson"
                                  )}
                                >
                                  {formatPercent(metric.trend)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
