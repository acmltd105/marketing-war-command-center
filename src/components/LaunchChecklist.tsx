import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles, Users, Route } from "lucide-react";
import { cn } from "@/lib/utils";

type ChecklistStatus = "complete" | "current" | "upcoming";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: ChecklistStatus;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const statusConfig: Record<
  ChecklistStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    descriptionClass: string;
    iconWrapperClass: string;
    iconClass: string;
  }
> = {
  complete: {
    label: "Complete",
    badgeClass: "bg-tactical-green/80 text-background border border-tactical-green/60",
    dotClass: "bg-tactical-green shadow-[0_0_12px_rgba(74,222,128,0.45)]",
    descriptionClass: "text-muted-foreground",
    iconWrapperClass: "border-tactical-green/70 bg-tactical-green/10 text-tactical-green",
    iconClass: "text-tactical-green",
  },
  current: {
    label: "In Progress",
    badgeClass: "bg-corporate-blue/80 text-background border border-corporate-blue/60",
    dotClass: "bg-corporate-blue animate-pulse shadow-[0_0_14px_rgba(59,130,246,0.55)]",
    descriptionClass: "text-foreground",
    iconWrapperClass: "border-corporate-blue/70 bg-corporate-blue/10 text-corporate-blue",
    iconClass: "text-corporate-blue",
  },
  upcoming: {
    label: "Queued",
    badgeClass: "bg-muted text-muted-foreground border border-border/60",
    dotClass: "bg-muted-foreground/40",
    descriptionClass: "text-muted-foreground",
    iconWrapperClass: "border-border/60 bg-background/60 text-muted-foreground",
    iconClass: "text-muted-foreground",
  },
};

const LaunchChecklist: React.FC = () => {
  const items: ChecklistItem[] = [
    {
      id: "lead-ingestion",
      title: "Lead Ingestion",
      description: "Capture raw leads from every inbound channel and sync to Supabase staging tables.",
      status: "complete",
      icon: Upload,
    },
    {
      id: "data-sanitization",
      title: "Sanitization",
      description: "Normalize, dedupe, and score incoming leads with automated quality guards.",
      status: "complete",
      icon: Sparkles,
    },
    {
      id: "audience-segmentation",
      title: "Segment",
      description: "Auto-build mission-ready cohorts using playbook rules and predictive signals.",
      status: "current",
      icon: Users,
    },
    {
      id: "journey-selection",
      title: "Choose Journey",
      description: "Assign the winning nurture journey and deploy to Twilio orchestration.",
      status: "upcoming",
      icon: Route,
    },
  ];

  const completedCount = items.filter((item) => item.status === "complete").length;
  const progressPercentage = Math.round((completedCount / items.length) * 100);

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg shadow-primary/5">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-semibold text-primary">
            Launch Readiness Checklist
          </CardTitle>
          <Badge className="bg-primary/10 text-primary border border-primary/40">
            {progressPercentage}% ready for launch
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground/90">
          Stay on mission. Execute each phase to unlock the launch deployment.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {items.map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = item.icon;
            const isLast = index === items.length - 1;
            return (
              <div key={item.id} className="relative flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-300",
                      config.iconWrapperClass,
                    )}
                  >
                    <Icon className={cn("h-6 w-6", config.iconClass)} />
                  </div>
                  {!isLast && (
                    <div className="mt-2 h-full w-px flex-1 bg-gradient-to-b from-border/70 via-border/40 to-transparent" />
                  )}
                </div>
                <div className="flex-1 rounded-xl border border-border/70 bg-background/60 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", config.dotClass)} />
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <Badge variant="secondary" className={cn("uppercase tracking-wide text-xs", config.badgeClass)}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className={cn("mt-2 text-sm leading-relaxed", config.descriptionClass)}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchChecklist;
