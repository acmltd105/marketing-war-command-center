import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Brain,
  CalendarCheck,
  CheckCircle2,
  CircuitBoard,
  ClipboardList,
  Cog,
  FlaskConical,
  Layers,
  LifeBuoy,
  MessageSquare,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StageStatus = "not-started" | "in-progress" | "complete" | "blocked";

type PipelineStage = {
  id: string;
  order: number;
  title: string;
  description: string;
  status: StageStatus;
  owner: string;
  dependencies?: string[];
  metrics?: { label: string; value: string; trend?: "up" | "down" | "flat" }[];
  toolStack?: string[];
  playbook?: string;
  icon: React.ElementType;
};

type BotBrain = {
  id: string;
  label: string;
  vectorStore: string;
  freshness: string;
  coverage: string[];
  health: {
    tokensIndexed: string;
    guardrails: string;
    drift: string;
  };
};

type ConversationTest = {
  id: string;
  title: string;
  persona: string;
  objective: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  script: { speaker: "Bot" | "Lead"; text: string }[];
};

type ClosingGap = {
  id: string;
  title: string;
  status: StageStatus;
  owner: string;
  description: string;
};

const statusStyles: Record<StageStatus, { badge: string; dot: string; label: string }> = {
  "not-started": {
    badge: "bg-muted text-muted-foreground border border-border",
    dot: "bg-muted-foreground/50",
    label: "Not Started",
  },
  "in-progress": {
    badge: "bg-corporate-blue/20 text-corporate-platinum border border-corporate-blue/60",
    dot: "bg-corporate-blue",
    label: "In Progress",
  },
  complete: {
    badge: "bg-revenue-green/20 text-revenue-green border border-revenue-green/50",
    dot: "bg-revenue-green",
    label: "Complete",
  },
  blocked: {
    badge: "bg-corporate-crimson/20 text-corporate-crimson border border-corporate-crimson/60",
    dot: "bg-corporate-crimson",
    label: "Blocked",
  },
};

const pipelineStages: PipelineStage[] = [
  {
    id: "1",
    order: 1,
    title: "Lead Ingestion",
    description: "Aggregate inbound leads from CRM, web forms, data marketplaces, and channel partners.",
    status: "complete",
    owner: "Data Engineering",
    metrics: [
      { label: "Today", value: "12,480 Leads", trend: "up" },
      { label: "Integrity", value: "98.6%" },
    ],
    toolStack: ["Supabase Edge", "Segment", "S3 Intake"],
    icon: Users,
  },
  {
    id: "2",
    order: 2,
    title: "Sanitize + Enrich",
    description: "Standardize, dedupe, and enrich leads with firmographics, persona scoring, and compliance flags.",
    status: "in-progress",
    owner: "Data Quality Guild",
    dependencies: ["1"],
    metrics: [
      { label: "Match Rate", value: "93%", trend: "up" },
      { label: "Avg. Cost", value: "$0.18" },
    ],
    toolStack: ["Clearbit", "Apollo", "Custom Rust Pipelines"],
    icon: ShieldCheck,
  },
  {
    id: "3",
    order: 3,
    title: "Twilio Segmentation",
    description: "Route enriched leads into dynamic Twilio segments aligned to lifecycle intent stages.",
    status: "in-progress",
    owner: "Lifecycle Ops",
    dependencies: ["1", "2"],
    metrics: [
      { label: "Segments", value: "18 Active" },
      { label: "Sync Lag", value: "12s" },
    ],
    toolStack: ["Twilio Segment", "Supabase Functions"],
    icon: Layers,
  },
  {
    id: "4",
    order: 4,
    title: "Engagement Routing",
    description: "Personalize outreach with Twilio Engage automations, voice drops, and Flex agent assignments.",
    status: "in-progress",
    owner: "RevOps Automation",
    dependencies: ["3"],
    metrics: [
      { label: "Journeys", value: "9 Live", trend: "up" },
      { label: "Contacts", value: "47K" },
    ],
    toolStack: ["Twilio Engage", "Flex", "Programmable Messaging"],
    icon: MessageSquare,
  },
  {
    id: "5",
    order: 5,
    title: "Tooling Alignment",
    description: "Select marketing systems, align cadences, and govern orchestration SLAs across stakeholders.",
    status: "in-progress",
    owner: "Marketing Engineering",
    dependencies: ["4"],
    metrics: [
      { label: "Cadences", value: "5 Finalized" },
      { label: "Vetoes", value: "0" },
    ],
    toolStack: ["Asana", "Notion Playbooks", "Supabase Ops"],
    icon: Cog,
  },
  {
    id: "6",
    order: 6,
    title: "Asset Production",
    description: "Produce templates, scripts, landing collateral, and AI-ready prompt libraries feeding the journeys.",
    status: "in-progress",
    owner: "Creative Strike Team",
    dependencies: ["5"],
    metrics: [
      { label: "Templates", value: "32 / 40", trend: "up" },
      { label: "QA", value: "76%" },
    ],
    toolStack: ["Figma", "Notion", "Supabase Storage"],
    icon: ClipboardList,
  },
  {
    id: "7",
    order: 7,
    title: "Journey Finalization",
    description: "Lock entry/exit rules, AI guardrails, and fallback paths for each Twilio-powered journey.",
    status: "not-started",
    owner: "Lifecycle Strategy",
    dependencies: ["4", "6"],
    metrics: [
      { label: "Ready", value: "0 / 9" },
      { label: "Approvals", value: "0" },
    ],
    toolStack: ["Journey Builder", "QA Hub"],
    icon: CalendarCheck,
  },
  {
    id: "7b",
    order: 7.1,
    title: "AI Bots Deployment",
    description: "Configure conversational AI copilots, compliance monitors, and self-healing automations.",
    status: "not-started",
    owner: "AI Automation Squad",
    dependencies: ["7"],
    metrics: [
      { label: "Bots", value: "0 / 4" },
      { label: "Test Coverage", value: "0%" },
    ],
    toolStack: ["Twilio Autopilot", "Rust Desktop Companion"],
    icon: Sparkles,
  },
  {
    id: "8",
    order: 8,
    title: "System Testing",
    description: "Validate cross-channel orchestration, error recovery, and guardrail performance before launch.",
    status: "not-started",
    owner: "QA Command",
    dependencies: ["7", "7b"],
    metrics: [
      { label: "Suites", value: "0 / 18" },
      { label: "Auto-heals", value: "0" },
    ],
    toolStack: ["Playwright", "Supabase Edge Functions"],
    icon: FlaskConical,
  },
  {
    id: "9",
    order: 9,
    title: "Predictable Test Orchestration",
    description: "Run progressive test batteries A → B → C with telemetry capture and rollback automation.",
    status: "not-started",
    owner: "Test Strategy Guild",
    dependencies: ["8"],
    metrics: [
      { label: "Battery", value: "Queued" },
      { label: "Signals", value: "--" },
    ],
    toolStack: ["Twilio Test Lab", "Supabase Telemetry"],
    icon: CircuitBoard,
  },
  {
    id: "10",
    order: 10,
    title: "Predictability Scoring",
    description: "Model revenue impact, channel lift, and risk windows using Supabase predictive pipelines.",
    status: "not-started",
    owner: "Revenue Science",
    dependencies: ["9"],
    metrics: [
      { label: "Score", value: "--" },
      { label: "Revenue", value: "$0" },
    ],
    toolStack: ["Supabase ML", "dbt Models"],
    icon: TrendingUp,
  },
  {
    id: "11",
    order: 11,
    title: "Campaign Launch",
    description: "Greenlight all channels, sync budgets, and initiate live attribution once risk gates clear.",
    status: "not-started",
    owner: "Command Center",
    dependencies: ["10"],
    metrics: [
      { label: "Channels", value: "0 Live" },
      { label: "Budget", value: "$0" },
    ],
    toolStack: ["Twilio Engage", "Meta Ads", "HubSpot"],
    icon: Rocket,
  },
  {
    id: "12",
    order: 12,
    title: "Realtime Tracking",
    description: "Monitor telemetry, rollback triggers, and executive dashboards while celebrating wins.",
    status: "not-started",
    owner: "Mission Control",
    dependencies: ["11"],
    metrics: [
      { label: "Latency", value: "--" },
      { label: "Alerts", value: "--" },
    ],
    toolStack: ["Supabase Realtime", "Datadog", "Executive HUD"],
    icon: Activity,
  },
];

const botBrains: BotBrain[] = [
  {
    id: "mission-control",
    label: "Mission Control Revenue Memory",
    vectorStore: "Supabase pgvector · OpenAI ada v3 embeddings",
    freshness: "Streaming sync every 5 minutes",
    coverage: ["Pricing objections", "Playbooks", "Closed-won transcripts"],
    health: {
      tokensIndexed: "1.8M tokens indexed",
      guardrails: "SOC2 + PII masking",
      drift: "Drift risk: Low",
    },
  },
  {
    id: "field-intelligence",
    label: "Field Intelligence Brain",
    vectorStore: "Supabase hybrid (pgvector + keyword fallback)",
    freshness: "Daily post-mortem ingestion",
    coverage: ["Battle cards", "Competitive intel", "Escalation macros"],
    health: {
      tokensIndexed: "940K tokens indexed",
      guardrails: "Legal pre-approved snippets",
      drift: "Drift risk: Medium",
    },
  },
  {
    id: "compliance-core",
    label: "Compliance Core Brain",
    vectorStore: "Supabase edge · Azure OpenAI text-embedding-3-large",
    freshness: "Live sync via Supabase Functions",
    coverage: ["TCPA", "Brand tone", "Escalation policies"],
    health: {
      tokensIndexed: "520K tokens indexed",
      guardrails: "Redaction + auto-retention",
      drift: "Drift risk: Under review",
    },
  },
];

const conversationTests: ConversationTest[] = [
  {
    id: "demo-qualification",
    title: "Inbound Demo Qualification",
    persona: "Marketing Director (warm)",
    objective: "Book demo and capture budget authority",
    outcome: "Pass — Handoff to AE",
    metrics: [
      { label: "Close Proxy", value: "92% conversion" },
      { label: "Cadence Fit", value: "6 msg / 14 mins" },
    ],
    script: [
      { speaker: "Lead", text: "Hi, we need to launch SMS for our fall promos." },
      {
        speaker: "Bot",
        text: "Great! I can map the launch path. Are you the decision maker for budget approval?",
      },
      { speaker: "Lead", text: "Yes, I own it with our VP." },
      {
        speaker: "Bot",
        text: "Perfect — I'll schedule a 20 minute strategy call and send the deck with projected ROI before we meet.",
      },
      { speaker: "Lead", text: "Booked. Looking forward to it." },
    ],
  },
  {
    id: "objection-handle",
    title: "Pricing Objection Recovery",
    persona: "Operations Lead (lukewarm)",
    objective: "Neutralize price concern and secure pilot",
    outcome: "Needs Improvement",
    metrics: [
      { label: "Close Proxy", value: "64% conversion" },
      { label: "Escalation", value: "2 human assists" },
    ],
    script: [
      { speaker: "Lead", text: "Your pricing seems high for SMS." },
      {
        speaker: "Bot",
        text: "I can model total cost of ownership with our Supabase automation offsets. Want to review the breakdown?",
      },
      { speaker: "Lead", text: "Sure, send it." },
      {
        speaker: "Bot",
        text: "Sharing a dynamic calculator now. We can also launch a 14-day pilot that bills on performance only.",
      },
      { speaker: "Lead", text: "I'll review with finance." },
    ],
  },
];

const closingReadiness: ClosingGap[] = [
  {
    id: "realtime-quoting",
    title: "Realtime Revenue Quoting",
    status: "in-progress",
    owner: "RevOps Automation",
    description: "Wire Twilio Autopilot to Supabase pricing microservice so bots can return contract-ready offers.",
  },
  {
    id: "sentiment-escalation",
    title: "Sentiment Escalation Rules",
    status: "not-started",
    owner: "AI Safety Guild",
    description: "Train sentiment classifier + guardrails to auto-loop humans when tone slips below green threshold.",
  },
  {
    id: "compliance-audit",
    title: "Compliance Playback Audit",
    status: "in-progress",
    owner: "Legal Ops",
    description: "Review 100% of pilot transcripts for TCPA adherence and finalize retention automation.",
  },
  {
    id: "feedback-loop",
    title: "Continuous Learning Loop",
    status: "not-started",
    owner: "Data Science",
    description: "Ship nightly Supabase job to retrain embeddings on closed-won reasoning and failed rebuttals.",
  },
];

const statusSortWeight: Record<StageStatus, number> = {
  complete: 0,
  "in-progress": 1,
  "not-started": 2,
  blocked: 3,
};

const getPredictabilityScore = (stages: PipelineStage[]) => {
  const weighted = stages.reduce(
    (acc, stage) => {
      const weight = 1 / (stage.order + 1);
      switch (stage.status) {
        case "complete":
          return { achieved: acc.achieved + 1 * weight, total: acc.total + weight };
        case "in-progress":
          return { achieved: acc.achieved + 0.5 * weight, total: acc.total + weight };
        case "not-started":
          return { achieved: acc.achieved + 0.1 * weight, total: acc.total + weight };
        case "blocked":
          return { achieved: acc.achieved + 0, total: acc.total + weight };
        default:
          return acc;
      }
    },
    { achieved: 0, total: 0 }
  );
  if (!weighted.total) {
    return 0;
  }
  return Math.round((weighted.achieved / weighted.total) * 100);
};

const GoToMarketPipeline = () => {
  const [selectedBrainId, setSelectedBrainId] = useState<string>(botBrains[0].id);
  const selectedBrain = useMemo(
    () => botBrains.find((brain) => brain.id === selectedBrainId) ?? botBrains[0],
    [selectedBrainId]
  );

  const sortedStages = useMemo(
    () =>
      [...pipelineStages].sort((a, b) => {
        if (a.order === b.order) {
          return statusSortWeight[a.status] - statusSortWeight[b.status];
        }
        return a.order - b.order;
      }),
    []
  );

  const progress = useMemo(() => {
    const total = pipelineStages.length;
    const completeStages = pipelineStages.filter((stage) => stage.status === "complete").length;
    const inProgressStages = pipelineStages.filter((stage) => stage.status === "in-progress").length;
    return {
      total,
      completeStages,
      inProgressStages,
      percent: Math.round(((completeStages + inProgressStages * 0.5) / total) * 100),
    };
  }, []);

  const predictabilityScore = useMemo(() => getPredictabilityScore(pipelineStages), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-corporate-silver">Command Sequencer</p>
          <h1 className="mt-2 text-3xl font-bold fortune-heading">Go-To-Market War Map</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Full-stack observability for lead-to-launch execution. Review the operational readiness of each stage,
            expose blockers, and ensure Twilio + Supabase automations stay self-healing.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-corporate-navy bg-sidebar/60 p-4 backdrop-blur">
          <div className="text-right">
            <p className="text-xs uppercase text-corporate-silver">Predictability Score</p>
            <p className="text-3xl font-bold text-revenue-green">{predictabilityScore}</p>
          </div>
          <Separator orientation="vertical" className="h-12 bg-corporate-navy" />
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs uppercase text-corporate-silver">Projected Revenue</p>
            <span className="revenue-indicator glow-revenue inline-flex items-center rounded-md px-3 py-1.5 text-base font-semibold tracking-tight text-background">
              $4.8M
            </span>
          </div>
        </div>
      </div>

      <Card className="border border-corporate-navy/60 bg-card/60 backdrop-blur">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Radar className="h-5 w-5 text-corporate-blue" />
            Operational Telemetry
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-revenue-green" /> Complete
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-corporate-blue" /> In Progress
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Not Started
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-corporate-crimson" /> Blocked
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-silver">Global Progress</span>
              <span className="font-semibold text-corporate-platinum">{progress.percent}% Readiness</span>
            </div>
            <Progress value={progress.percent} className="mt-2 h-3" />
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Complete: {progress.completeStages}</span>
              <span>In Motion: {progress.inProgressStages}</span>
              <span>Pending: {progress.total - (progress.completeStages + progress.inProgressStages)}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-revenue-green/40 bg-revenue-green/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-revenue-green">Automation Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-corporate-platinum">
                <p>Supabase edge functions: <span className="font-semibold text-revenue-green">Nominal</span></p>
                <p>Twilio webhook latency: <span className="font-semibold">312ms</span></p>
                <p>Rust desktop sentries: <span className="font-semibold">Online</span></p>
              </CardContent>
            </Card>
            <Card className="border border-corporate-blue/40 bg-corporate-blue/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-corporate-blue">Lead Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-corporate-platinum">
                <p>Cost per enriched lead: <span className="font-semibold">$42.80</span></p>
                <p>Pipeline velocity: <span className="font-semibold">3.4 hrs</span></p>
                <p>Sanitization backlog: <span className="font-semibold">2.1%</span></p>
              </CardContent>
            </Card>
            <Card className="border border-corporate-gold/40 bg-corporate-gold/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-corporate-gold">Executive Watch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-corporate-platinum">
                <p>Revenue variance window: <span className="font-semibold">±$180K</span></p>
                <p>Compliance flags: <span className="font-semibold text-revenue-green">0</span></p>
                <p>Green-light ETA: <span className="font-semibold">T-5 Days</span></p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {sortedStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card
              key={stage.id}
              className={cn(
                "border border-corporate-navy/50 bg-card/70 backdrop-blur",
                stage.status === "blocked" && "border-corporate-crimson/70",
                stage.status === "complete" && "border-revenue-green/50",
                stage.status === "in-progress" && "border-corporate-blue/50"
              )}
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className={cn("mt-1 flex h-10 w-10 items-center justify-center rounded-full border", statusStyles[stage.status].badge)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={cn("h-2.5 w-2.5 rounded-full", statusStyles[stage.status].dot)} />
                        <Badge className={cn("text-xs font-semibold", statusStyles[stage.status].badge)}>
                          {statusStyles[stage.status].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Stage {stage.id}</span>
                        {stage.dependencies && stage.dependencies.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            Dependencies: {stage.dependencies.join(", ")}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-corporate-platinum">{stage.title}</h2>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <p className="text-xs uppercase tracking-wide text-corporate-silver">Owner: {stage.owner}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="border-corporate-blue/60 text-corporate-platinum">
                      Open Playbook
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-corporate-blue/30 text-corporate-platinum">
                      Assign Squad
                    </Button>
                  </div>
                </div>

                {stage.metrics && stage.metrics.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-3">
                    {stage.metrics.map((metric) => (
                      <div
                        key={`${stage.id}-${metric.label}`}
                        className="rounded-lg border border-border/60 bg-secondary/40 p-3 text-xs text-corporate-platinum"
                      >
                        <p className="text-muted-foreground">{metric.label}</p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-lg font-semibold">{metric.value}</span>
                          {metric.trend && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] uppercase tracking-wide",
                                metric.trend === "up" && "bg-revenue-green/20 text-revenue-green",
                                metric.trend === "down" && "bg-corporate-crimson/20 text-corporate-crimson",
                                metric.trend === "flat" && "bg-muted text-muted-foreground"
                              )}
                            >
                              {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {stage.toolStack && stage.toolStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[11px] text-corporate-silver">
                    {stage.toolStack.map((tool) => (
                      <span key={`${stage.id}-${tool}`} className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border border-corporate-navy/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <Brain className="h-5 w-5 text-kpi-purple" />
            Next 3 Critical Upgrades
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-corporate-blue/40 bg-secondary/40 p-4 text-sm">
            <h3 className="font-semibold text-corporate-platinum">Predictive QA Harness</h3>
            <p className="mt-2 text-muted-foreground">
              Deploy Supabase edge harness to auto-provision Twilio test data, collect telemetry, and auto-heal failed flows.
            </p>
            <Button variant="link" className="mt-3 px-0 text-corporate-blue">
              View Blueprint
            </Button>
          </div>
          <div className="rounded-lg border border-revenue-green/40 bg-secondary/40 p-4 text-sm">
            <h3 className="font-semibold text-corporate-platinum">AI Bot Certification</h3>
            <p className="mt-2 text-muted-foreground">
              Run security and compliance playbooks on conversational bots with deterministic fallback rules and human-in-loop.
            </p>
            <Button variant="link" className="mt-3 px-0 text-revenue-green">
              Initiate Audit
            </Button>
          </div>
          <div className="rounded-lg border border-corporate-gold/40 bg-secondary/40 p-4 text-sm">
            <h3 className="font-semibold text-corporate-platinum">Launch Room Simulation</h3>
            <p className="mt-2 text-muted-foreground">
              Simulate launch-day escalations, bandwidth spikes, and revenue scenarios to stress test command workflows.
            </p>
            <Button variant="link" className="mt-3 px-0 text-corporate-gold">
              Schedule Drill
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-corporate-navy/60 bg-card/60 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Sparkles className="h-5 w-5 text-revenue-green" />
            AI Bot Deployment Control Room
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the live knowledge base, run conversational dry runs, and track the final lifts required to close deals via
            SMS with 100% confidence.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-corporate-silver">Vector Store Selection</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Point the bots at the correct Supabase brain to guarantee responses are sourced from the freshest intelligence.
                </p>
              </div>
              <Select value={selectedBrainId} onValueChange={setSelectedBrainId}>
                <SelectTrigger className="border-corporate-blue/50 bg-sidebar/60 text-sm text-corporate-platinum">
                  <SelectValue placeholder="Choose knowledge base" />
                </SelectTrigger>
                <SelectContent className="border-corporate-blue/50 bg-card/95">
                  {botBrains.map((brain) => (
                    <SelectItem key={brain.id} value={brain.id} className="text-corporate-platinum">
                      {brain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="rounded-lg border border-corporate-blue/40 bg-secondary/40 p-4 text-xs text-muted-foreground">
                <p className="text-sm font-semibold text-corporate-platinum">{selectedBrain.label}</p>
                <div className="mt-3 space-y-2">
                  <p>
                    <span className="font-semibold text-corporate-platinum">Vector Store:</span> {selectedBrain.vectorStore}
                  </p>
                  <p>
                    <span className="font-semibold text-corporate-platinum">Freshness:</span> {selectedBrain.freshness}
                  </p>
                  <div>
                    <p className="font-semibold text-corporate-platinum">Knowledge Coverage</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedBrain.coverage.map((item) => (
                        <span
                          key={`${selectedBrain.id}-${item}`}
                          className="rounded-full border border-corporate-blue/40 bg-sidebar/60 px-3 py-1 text-[11px] text-corporate-silver"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2 pt-2 text-[11px] text-corporate-silver">
                    <span>• {selectedBrain.health.tokensIndexed}</span>
                    <span>• {selectedBrain.health.guardrails}</span>
                    <span>• {selectedBrain.health.drift}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-corporate-silver">Conversation Proving Ground</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Replay golden-path transcripts and identify where the bot still needs escalation support before we promise
                  100% text-based closes.
                </p>
              </div>
              <div className="grid gap-4">
                {conversationTests.map((test) => (
                  <div
                    key={test.id}
                    className="rounded-lg border border-corporate-navy/50 bg-sidebar/60 p-4 text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-semibold text-corporate-platinum">{test.title}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-corporate-silver">
                          {test.persona} • {test.objective}
                        </p>
                      </div>
                      <Badge className={cn("text-xs", test.outcome === "Pass — Handoff to AE" ? statusStyles["complete"].badge : statusStyles["in-progress"].badge)}>
                        {test.outcome}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-corporate-silver">
                      {test.metrics.map((metric) => (
                        <span
                          key={`${test.id}-${metric.label}`}
                          className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1"
                        >
                          {metric.label}: {metric.value}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2 text-xs leading-relaxed">
                      {test.script.map((line, index) => (
                        <li key={`${test.id}-line-${index}`} className="flex gap-2">
                          <span className="font-semibold text-corporate-platinum">{line.speaker}:</span>
                          <span>{line.text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button variant="outline" className="border-corporate-blue/60 bg-background/60 text-xs text-corporate-blue">
                        Launch Twilio Simulation
                      </Button>
                      <Button variant="ghost" className="text-xs text-corporate-platinum">
                        Export Supabase Transcript
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-corporate-navy" />

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-corporate-silver">Closing Confidence Uplift Plan</p>
            <div className="grid gap-3 md:grid-cols-2">
              {closingReadiness.map((gap) => (
                <div
                  key={gap.id}
                  className="rounded-lg border border-corporate-navy/50 bg-secondary/40 p-4 text-xs text-muted-foreground"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-corporate-platinum">{gap.title}</p>
                    <Badge className={cn("text-[10px]", statusStyles[gap.status].badge)}>
                      {statusStyles[gap.status].label}
                    </Badge>
                  </div>
                  <p className="mt-2 leading-relaxed">{gap.description}</p>
                  <p className="mt-3 text-[11px] text-corporate-silver">Owner: {gap.owner}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-corporate-blue/40 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <LifeBuoy className="h-5 w-5 text-corporate-blue" />
            Risk and Blocker Radar
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-corporate-crimson/40 bg-corporate-crimson/10 p-4 text-sm">
            <h3 className="font-semibold text-corporate-platinum">Critical Blockers</h3>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• Awaiting enrichment API credit refresh — ETA 6 hrs</li>
              <li>• Twilio Engage sandbox limit reached — requesting expansion</li>
            </ul>
          </div>
          <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-4 text-sm">
            <h3 className="font-semibold text-corporate-platinum">Watch List</h3>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• AI guardrail training data requires additional legal review</li>
              <li>• Predictability scoring pipeline pending data science sync</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 rounded-xl border border-corporate-navy/60 bg-sidebar/70 p-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 text-corporate-platinum">
          <CheckCircle2 className="h-5 w-5 text-revenue-green" />
          <h2 className="text-lg font-semibold">Launch Gate Checklist</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-corporate-blue/60 bg-background" />
            Supabase build webhooks streaming without errors
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-corporate-blue/60 bg-background" />
            Twilio Segment audiences syncing in under 30 seconds
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-corporate-blue/60 bg-background" />
            AI bots certification signed and logged in Supabase vault
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-corporate-blue/60 bg-background" />
            Predictability scoring run completed with variance &lt; 5%
          </label>
        </div>
      </div>
    </div>
  );
};

export default GoToMarketPipeline;
