import React, { useCallback, useMemo, useState } from "react";
import {
  Building2,
  HeartPulse,
  Landmark,
  Megaphone,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LANE_LABELS,
  LIFECYCLE_STAGES,
  type LifecycleLane,
  type LifecycleStage,
  tasksForLane,
  defaultStageForProgress,
} from "@/lib/companyLifecycle";
import {
  clearCompanyWorkspace,
  readCompanyWorkspace,
  writeCompanyWorkspace,
  type CompanyWorkspaceStateV1,
} from "@/lib/companyWorkspaceStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LANE_ICONS: Record<LifecycleLane, React.ReactNode> = {
  formation: <Landmark className="h-5 w-5" />,
  brand: <Sparkles className="h-5 w-5" />,
  web: <Building2 className="h-5 w-5" />,
  press: <Megaphone className="h-5 w-5" />,
  velocity: <TrendingUp className="h-5 w-5" />,
  ipo: <Rocket className="h-5 w-5" />,
  survival: <HeartPulse className="h-5 w-5" />,
};

const LANES_ORDER: LifecycleLane[] = [
  "formation",
  "brand",
  "web",
  "press",
  "velocity",
  "ipo",
  "survival",
];

function completedSet(tasksDone: Record<string, boolean>): Set<string> {
  return new Set(Object.keys(tasksDone).filter((id) => tasksDone[id]));
}

const CompanyPage = () => {
  const [state, setState] = useState<CompanyWorkspaceStateV1>(() => readCompanyWorkspace());

  const persist = useCallback((next: CompanyWorkspaceStateV1) => {
    setState(next);
    writeCompanyWorkspace(next);
  }, []);

  const suggestedStage = useMemo(
    () => defaultStageForProgress(completedSet(state.tasksDone)),
    [state.tasksDone],
  );

  const toggleTask = (taskId: string, checked: boolean) => {
    persist({
      ...state,
      tasksDone: { ...state.tasksDone, [taskId]: checked },
    });
  };

  const updateField = <K extends keyof CompanyWorkspaceStateV1>(key: K, value: CompanyWorkspaceStateV1[K]) => {
    persist({ ...state, [key]: value });
  };

  const doneCount = useMemo(
    () => Object.values(state.tasksDone).filter(Boolean).length,
    [state.tasksDone],
  );
  const totalTasks = 18;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="fortune-heading text-3xl font-bold tracking-tight">Company workspace</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Idea → entity → brand → site → press → revenue milestones → IPO readiness. Same pantry as your sales pipeline—check
          items off as you ship. Not legal or tax advice; use counsel and CPA for filings.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>EIN / FEIN</AlertTitle>
        <AlertDescription>
          Store only the <strong>last four</strong> of an EIN here if you need a reminder. Never put full SSN, full EIN, or
          incorporation documents in browser-only storage.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Company profile</CardTitle>
          <CardDescription>Shown across lifecycle checklists; syncs to Supabase in a later release.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="displayName">Working name</Label>
            <Input
              id="displayName"
              placeholder="Pipeline Pantry LLC"
              value={state.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal name (optional)</Label>
            <Input
              id="legalName"
              placeholder="Exact name on formation docs"
              value={state.legalName}
              onChange={(e) => updateField("legalName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Input
              id="jurisdiction"
              placeholder="Delaware, US"
              value={state.jurisdiction}
              onChange={(e) => updateField("jurisdiction", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Corporate website URL</Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://www.example.com"
              value={state.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fein">EIN last four (optional)</Label>
            <Input
              id="fein"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={state.feinLastFour}
              onChange={(e) => updateField("feinLastFour", e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Lifecycle stage (manual)</Label>
            <Select
              value={state.lifecycleStage}
              onValueChange={(v) => updateField("lifecycleStage", v as LifecycleStage)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {LIFECYCLE_STAGES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Suggested from checklists: <strong className="text-foreground">{suggestedStage}</strong> — override if you are
              ahead or behind the template.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pressNotes">Press & narrative notes</Label>
            <Textarea
              id="pressNotes"
              rows={3}
              placeholder="Embargo dates, key quotes, analyst targets…"
              value={state.pressNotes}
              onChange={(e) => updateField("pressNotes", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="milestoneNotes">Velocity / IPO notes</Label>
            <Textarea
              id="milestoneNotes"
              rows={2}
              placeholder="First sale day proof link, board dates, counsel handoffs…"
              value={state.milestoneNotes}
              onChange={(e) => updateField("milestoneNotes", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setState(readCompanyWorkspace())}
            >
              Reload from storage
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => {
                clearCompanyWorkspace();
                setState(readCompanyWorkspace());
              }}
            >
              Clear workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Checklist progress:</span>{" "}
        <strong>
          {doneCount} / {totalTasks}
        </strong>
      </div>

      <div className="space-y-6">
        {LANES_ORDER.map((lane) => {
          const tasks = tasksForLane(lane);
          return (
            <Card key={lane}>
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <div className="text-primary mt-0.5">{LANE_ICONS[lane]}</div>
                <div>
                  <CardTitle className="text-lg">{LANE_LABELS[lane]}</CardTitle>
                  <CardDescription>
                    {lane === "ipo" && "Checklist only — filings and securities work stay with counsel."}
                    {lane === "survival" && "Leading indicators, not doom — update as you learn."}
                    {lane !== "ipo" && lane !== "survival" && "Check off what is true today."}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex gap-3 rounded-md border border-border/60 p-3">
                    <Checkbox
                      id={task.id}
                      checked={Boolean(state.tasksDone[task.id])}
                      onCheckedChange={(c) => toggleTask(task.id, c === true)}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={task.id} className="cursor-pointer text-base font-medium leading-tight">
                        {task.label}
                      </Label>
                      <p className="text-muted-foreground mt-1 text-sm">{task.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyPage;
