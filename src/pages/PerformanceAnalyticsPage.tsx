import React from "react";
import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceAnalyticsPage = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="fortune-heading text-3xl font-bold tracking-tight">Performance analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pipeline economics and motion metrics will land here—wired to real events, not vanity charts.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Coming next</CardTitle>
          <CardDescription>
            Connect Supabase and your gateway in onboarding, then we surface send → reply → outcome funnels here.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
};

export default PerformanceAnalyticsPage;
