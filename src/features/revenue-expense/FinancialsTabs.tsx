import { useMemo } from "react";
import { Activity, AlertTriangle, BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FinancialMetricCard } from "./FinancialMetricCard";
import { useFinancialsData } from "./useFinancialsData";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function FinancialsTabs() {
  const { data, isLoading } = useFinancialsData();

  const projectionsTable = useMemo(() => {
    if (!data) return null;
    return data.revenue.projections.map((projection) => ({
      quarter: projection.quarter,
      forecast: projection.forecast,
      variance: projection.variance,
    }));
  }, [data]);

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
          <CardTitle className="text-lg font-medium text-corporate-platinum flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-revenue-green" />
            Financial posture
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          {isLoading &&
            new Array(3).fill(null).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl bg-white/5" />
            ))}
          {!isLoading && data && data.revenue.headline.concat(data.expenses.headline).slice(0, 3).map((metric) => (
            <FinancialMetricCard key={metric.id} metric={metric} />
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/5 p-1">
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
        </TabsList>
        <TabsContent value="revenue" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {isLoading && new Array(3).fill(null).map((_, index) => <Skeleton key={index} className="h-36 rounded-xl bg-white/5" />)}
            {!isLoading && data?.revenue.headline.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            {!isLoading &&
              data?.revenue.pipeline.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
            {isLoading && new Array(3).fill(null).map((_, index) => <Skeleton key={index} className="h-36 rounded-xl bg-white/5" />)}
          </section>
          <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-corporate-platinum">
                <BarChart3 className="h-4 w-4 text-corporate-blue" /> Quarterly forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <Skeleton className="h-40 rounded-xl bg-white/5" />}
              {!isLoading && projectionsTable && (
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
                        <TableCell className={projection.variance >= 0 ? "text-revenue-green" : "text-corporate-crimson"}>
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
            {isLoading && new Array(3).fill(null).map((_, index) => <Skeleton key={index} className="h-36 rounded-xl bg-white/5" />)}
            {!isLoading && data?.expenses.headline.map((metric) => <FinancialMetricCard key={metric.id} metric={metric} />)}
          </section>
          {!isLoading && data && (
            <Card className="backdrop-blur-xl bg-card/80 border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-corporate-platinum">
                  <AlertTriangle className="h-4 w-4 text-warning-amber" /> Runway and controls
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/90">Runway</h3>
                  <p className="text-3xl font-semibold text-white">
                    {data.expenses.runway.runwayMonths} months
                  </p>
                  <p className="text-sm text-corporate-silver/80">
                    Burn rate {formatCurrency(data.expenses.runway.burnRate)} per month
                  </p>
                  <Badge variant="outline" className="w-fit border-corporate-blue/40 text-corporate-blue bg-corporate-blue/10">
                    {data.expenses.runway.nextMilestone}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white/90">Alerts</h3>
                  {data.expenses.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <AlertTriangle
                        className={`mt-0.5 h-4 w-4 ${
                          alert.severity === "critical"
                            ? "text-corporate-crimson"
                            : alert.severity === "warning"
                            ? "text-warning-amber"
                            : "text-corporate-blue"
                        }`}
                      />
                      <p className="text-sm text-corporate-silver/90">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
