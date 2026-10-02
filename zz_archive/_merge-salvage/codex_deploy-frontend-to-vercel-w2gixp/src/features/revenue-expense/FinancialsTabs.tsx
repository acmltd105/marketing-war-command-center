import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, BarChart3, ShieldCheck, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FinancialMetricCard } from "./FinancialMetricCard";
import {
  type FinancialMetric,
  type GuardrailStatus,
  type PredictabilityVolumeDriver,
  type SupportStatus,
  useFinancialsData,
} from "./useFinancialsData";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

      <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-corporate-platinum">
            <ShieldCheck className="h-4 w-4 text-revenue-green" /> Executive posture
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          {isLoading && new Array(3).fill(null).map((_, index) => <Skeleton key={index} className="h-32 rounded-xl bg-white/5" />)}
          {!isLoading &&
            data?.revenue.summary.concat(data.expenses.summary).slice(0, 3).map((metric) => (
              <FinancialMetricCard key={metric.id} metric={metric} />
            ))}
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
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-warning-amber/20 data-[state=active]:to-corporate-crimson/20"
          >
            <AlertTriangle className="mr-2 h-4 w-4" /> Expenses
          </TabsTrigger>
          <TabsTrigger
            value="predictability"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-corporate-blue/20 data-[state=active]:to-kpi-purple/20"
          >
            <Target className="mr-2 h-4 w-4" /> Predictability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {(isLoading ? new Array(6).fill(null) : data?.revenue.summary ?? []).map((metric, index) => (
              <SkeletonOrCard key={metric ? metric.id : index} metric={metric} isLoading={isLoading} />
            ))}
          </div>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Pipeline intelligence</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[2fr,3fr]">
              <div className="grid gap-4">
                {(data?.revenue.pipeline ?? []).map((metric) => (
                  <FinancialMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
              <ChartContainer
                config={{
                  recurring: { label: "Recurring MRR", color: "hsl(150, 83%, 60%)" },
                  services: { label: "Services", color: "hsl(216, 88%, 68%)" },
                }}
              >
                <AreaChart data={revenueTrend}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="label" stroke="#fff9" tickLine={false} axisLine={false} />
                  <YAxis stroke="#fff6" tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" dataKey="recurring" stroke="var(--color-recurring)" fill="var(--color-recurring)" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="services" stroke="var(--color-services)" fill="var(--color-services)" fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Quarterly forecast</CardTitle>
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
                      <TableCell>{projection.quarter}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          projection.forecast,
                        )}
                      </TableCell>
                      <TableCell className={cn("text-right", projection.variance >= 0 ? "text-revenue-green" : "text-corporate-crimson") }>
                        {projection.variance >= 0 ? "+" : ""}
                        {projection.variance.toFixed(1)}%
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
            {(isLoading ? new Array(6).fill(null) : data?.expenses.summary ?? []).map((metric, index) => (
              <SkeletonOrCard key={metric ? metric.id : index} metric={metric} isLoading={isLoading} />
            ))}
          </div>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Spend trajectory</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  marketing: { label: "Marketing", color: "hsl(35, 92%, 60%)" },
                  headcount: { label: "Headcount", color: "hsl(217, 92%, 65%)" },
                  tooling: { label: "Tooling", color: "hsl(286, 82%, 68%)" },
                }}
              >
                <BarChart data={spendTrend}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="label" stroke="#fff9" tickLine={false} axisLine={false} />
                  <YAxis stroke="#fff6" tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="marketing" fill="var(--color-marketing)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="headcount" fill="var(--color-headcount)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tooling" fill="var(--color-tooling)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Vendor spotlight</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Δ</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.expenses.vendorSpend ?? []).map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.vendor}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                          vendor.amount,
                        )}
                      </TableCell>
                      <TableCell className={cn("text-right", vendor.change >= 0 ? "text-revenue-green" : "text-corporate-crimson") }>
                        {vendor.change >= 0 ? "+" : ""}
                        {vendor.change.toFixed(1)}%
                      </TableCell>
                      <TableCell>{vendor.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictability" className="space-y-6">
          {safeLaunch && modeling && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border border-white/10 bg-card/80">
                <CardHeader>
                  <CardTitle className="text-corporate-platinum">Safe launch guardrails</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-corporate-platinum">
                  <div className="grid grid-cols-2 gap-2">
                    <Stat label="Qualified leads" value={safeLaunch.qualifiedLeads.toLocaleString()} />
                    <Stat
                      label="Cost to scale"
                      value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                        safeLaunch.costToScale,
                      )}
                    />
                    <Stat label="Activation window" value={`${safeLaunch.activationWindowDays} days`} />
                    <Stat
                      label="Budget guardrail"
                      value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                        safeLaunch.budgetGuardrail,
                      )}
                    />
                  </div>
                  <p className="text-xs text-corporate-silver">
                    Twilio verification {Math.round(safeLaunch.twilioVerified * 100)}% · Automation confidence {Math.round(
                      safeLaunch.automationConfidence * 100,
                    )}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-card/80">
                <CardHeader>
                  <CardTitle className="text-corporate-platinum">Modeling accuracy</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm text-corporate-platinum">
                  <Stat label="Forecast accuracy" value={`${Math.round(modeling.forecastAccuracy * 100)}%`} />
                  <Stat label="Reliability score" value={`${Math.round(modeling.reliabilityScore * 100)}%`} />
                  <Stat label="Intercept margin" value={`${Math.round(modeling.interceptMargin * 100)}%`} />
                  <Stat label="Scenario confidence" value={`${Math.round(modeling.scenarioConfidence * 100)}%`} />
                  <p className="text-xs text-corporate-silver/80">{modeling.notes}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Guardrails & scenarios</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[2fr,3fr]">
              <div className="grid gap-3">
                {guardrails.map((guardrail) => (
                  <div
                    key={guardrail.id}
                    className={cn("rounded-xl border p-4", guardrailStyles[guardrail.status])}
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide">{guardrailLabels[guardrail.status]}</p>
                    <p className="text-lg font-semibold">{guardrail.label}</p>
                    <p className="text-xs opacity-80">{guardrail.detail}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scenario</TableHead>
                      <TableHead className="text-right">Lead volume</TableHead>
                      <TableHead className="text-right">Conversion</TableHead>
                      <TableHead>Readiness</TableHead>
                      <TableHead>Go-live</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell>{scenario.scenario}</TableCell>
                        <TableCell className="text-right">{scenario.leadVolume.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{(scenario.conversion * 100).toFixed(1)}%</TableCell>
                        <TableCell>{scenario.readiness}</TableCell>
                        <TableCell>{scenario.goLive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Volume drivers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {volumeDrivers.map((driver) => (
                <div key={driver.id} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">{driver.driver}</p>
                  <p className="text-xs text-corporate-silver">{driver.readiness}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-corporate-platinum">
                    <span>Run rate</span>
                    <span>{driver.runRate.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-corporate-platinum">
                    <span>Cost</span>
                    <span>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                        driver.cost,
                      )}
                    </span>
                  </div>
                  <span className={cn("mt-3 block text-xs font-semibold uppercase", signalStyles[driver.signal])}>
                    {signalLabels[driver.signal]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle className="text-corporate-platinum">Channel mix & support</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[3fr,2fr]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead className="text-right">Mix</TableHead>
                      <TableHead className="text-right">CAC</TableHead>
                      <TableHead className="text-right">Payback</TableHead>
                      <TableHead>Intercept</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channelMix.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell>{channel.channel}</TableCell>
                        <TableCell className="text-right">{(channel.mix * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                            channel.cac,
                          )}
                        </TableCell>
                        <TableCell className="text-right">{channel.payback.toFixed(1)} mo</TableCell>
                        <TableCell>{channel.intercept}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid gap-3">
                {voiceSupport.map((metric) => (
                  <div key={metric.id} className={cn("rounded-xl border p-4", supportStyles[metric.status])}>
                    <p className="text-sm font-semibold uppercase tracking-wide">{supportLabels[metric.status]}</p>
                    <p className="text-lg font-semibold">{metric.label}</p>
                    <p className="text-sm">{metric.value}</p>
                    <p className="text-xs opacity-80">Target {metric.target} · Trend {metric.trend >= 0 ? "+" : ""}{metric.trend.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SkeletonOrCard({ metric, isLoading }: { metric?: FinancialMetric | null; isLoading: boolean }) {
  if (isLoading || !metric) {
    return <Skeleton className="h-32 rounded-xl bg-white/5" />;
  }
  return <FinancialMetricCard metric={metric} />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-corporate-silver">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
