import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LaunchChecklist from "@/components/LaunchChecklist";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  LineChart,
  Plus,
  Settings,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

const BUILD_STATUSES = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
  "unknown",
] as const;

type BuildStatus = (typeof BUILD_STATUSES)[number];

type SupabaseBuild = {
  id: string;
  status: BuildStatus | string | null;
  progress: number | string | null;
  branch: string | null;
  commit_sha: string | null;
  ci_provider: string | null;
  logs_url: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
  build_number: number | null;
  external_id: string;
};

type SupabaseProject = {
  id: string;
  slug: string;
  name: string;
  repo_url: string | null;
  ci_provider: string | null;
  builds: SupabaseBuild[] | null;
};

type UiBuild = Omit<SupabaseBuild, "status" | "progress" | "metadata"> & {
  status: BuildStatus;
  progress: number;
  metadata: Record<string, unknown>;
};

type UiProject = {
  id: string;
  slug: string;
  name: string;
  repo_url: string | null;
  ci_provider: string | null;
  builds: UiBuild[];
  latestBuild?: UiBuild;
};

const statusBadgeClass: Record<BuildStatus, string> = {
  queued: "bg-yellow-500/80 text-background font-semibold",
  running: "bg-corporate-blue text-white font-semibold",
  succeeded: "revenue-indicator text-background font-semibold",
  failed: "bg-corporate-crimson text-white font-semibold",
  cancelled: "bg-corporate-charcoal text-white font-semibold",
  unknown: "bg-muted text-foreground font-semibold",
};

const statusDotClass: Record<BuildStatus, string> = {
  queued: "bg-yellow-400",
  running: "bg-blue-400",
  succeeded: "bg-emerald-400",
  failed: "bg-red-500",
  cancelled: "bg-slate-500",
  unknown: "bg-slate-400",
};

const statusLabel: Record<BuildStatus, string> = {
  queued: "Queued",
  running: "Running",
  succeeded: "Succeeded",
  failed: "Failed",
  cancelled: "Cancelled",
  unknown: "Unknown",
};

const demoProjects: UiProject[] = [
  {
    id: "demo-1",
    slug: "command-center",
    name: "Marketing War Command Center",
    repo_url: "https://github.com/acme/marketing-war-command-center",
    ci_provider: "github-actions",
    builds: [
      {
        id: "demo-build-1",
        status: "running",
        progress: 58,
        branch: "main",
        commit_sha: "3b7f2d8",
        ci_provider: "github-actions",
        logs_url: "https://github.com/acme/marketing-war-command-center/actions",
        message: "Deploy container image",
        metadata: { source: "demo" },
        started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        completed_at: null,
        updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        build_number: 412,
        external_id: "demo-412",
      },
      {
        id: "demo-build-1-previous",
        status: "succeeded",
        progress: 100,
        branch: "main",
        commit_sha: "2f4c1a0",
        ci_provider: "github-actions",
        logs_url: "https://github.com/acme/marketing-war-command-center/actions",
        message: "Deployment succeeded",
        metadata: { source: "demo" },
        started_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        build_number: 411,
        external_id: "demo-411",
      },
    ],
    get latestBuild() {
      return this.builds[0];
    },
  },
  {
    id: "demo-2",
    slug: "revenue-api",
    name: "Revenue Intelligence API",
    repo_url: "https://github.com/acme/revenue-intelligence",
    ci_provider: "circleci",
    builds: [
      {
        id: "demo-build-2",
        status: "failed",
        progress: 100,
        branch: "release/2024.10",
        commit_sha: "9cf2214",
        ci_provider: "circleci",
        logs_url: "https://circleci.com/acme/revenue-intelligence",
        message: "Unit tests failing (payment-service.spec.ts)",
        metadata: { source: "demo" },
        started_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        build_number: 1298,
        external_id: "demo-1298",
      },
      {
        id: "demo-build-2-prev",
        status: "succeeded",
        progress: 100,
        branch: "release/2024.10",
        commit_sha: "a1b8d92",
        ci_provider: "circleci",
        logs_url: "https://circleci.com/acme/revenue-intelligence",
        message: "Green pipeline",
        metadata: { source: "demo" },
        started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
        build_number: 1297,
        external_id: "demo-1297",
      },
    ],
    get latestBuild() {
      return this.builds[0];
    },
  },
  {
    id: "demo-3",
    slug: "ml-ops",
    name: "Customer ML Ops",
    repo_url: "https://github.com/acme/customer-ml-ops",
    ci_provider: "gitlab-ci",
    builds: [
      {
        id: "demo-build-3",
        status: "queued",
        progress: 12,
        branch: "feature/segment-stream",
        commit_sha: "f11dd3c",
        ci_provider: "gitlab-ci",
        logs_url: "https://gitlab.com/acme/customer-ml-ops/-/pipelines",
        message: "Waiting for GPU runner",
        metadata: { source: "demo" },
        started_at: null,
        completed_at: null,
        updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        build_number: 220,
        external_id: "demo-220",
      },
    ],
    get latestBuild() {
      return this.builds[0];
    },
  },
];

function clampProgress(value?: number | string | null) {
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return Math.min(100, Math.max(0, parsed));
    }
  }
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function toUiProject(project: SupabaseProject): UiProject {
  const builds = (project.builds ?? [])
    .map((build) => ({
      ...build,
      status: BUILD_STATUSES.includes((build.status ?? "unknown") as BuildStatus)
        ? ((build.status ?? "unknown") as BuildStatus)
        : "unknown",
      progress: clampProgress(build.progress),
      metadata: build.metadata ?? {},
    }))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    repo_url: project.repo_url,
    ci_provider: project.ci_provider,
    builds,
    latestBuild: builds[0],
  };
}

function formatCommit(commit?: string | null) {
  if (!commit) return "";
  return commit.slice(0, 7);
}

function formatRelative(date?: string | null) {
  if (!date) return "Unknown";
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return "Unknown";
  const diff = Date.now() - target.getTime();
  const minutes = Math.round(diff / (60 * 1000));
  if (minutes < 1) return "Moments ago";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function computeStats(projects: UiProject[]) {
  const builds = projects.flatMap((project) => project.builds);
  const total = builds.length;
  const running = builds.filter((build) => build.status === "running").length;
  const queued = builds.filter((build) => build.status === "queued").length;
  const terminal = builds.filter((build) => ["succeeded", "failed", "cancelled"].includes(build.status)).length;
  const succeeded = builds.filter((build) => build.status === "succeeded").length;
  const failed = builds.filter((build) => build.status === "failed").length;

  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const recentBuilds = builds.filter((build) => new Date(build.updated_at).getTime() >= last24h);
  const recentFailed = recentBuilds.filter((build) => build.status === "failed").length;
  const recentSucceeded = recentBuilds.filter((build) => build.status === "succeeded").length;

  const successRate = total === 0 ? 100 : Math.round((succeeded / total) * 100);
  const averageProgress = total === 0
    ? 0
    : Math.round(
      builds.reduce((acc, build) => acc + clampProgress(build.progress), 0) / total,
    );

  const successAccent = successRate >= 90
    ? "text-revenue-green"
    : successRate >= 70
      ? "text-corporate-silver"
      : "text-corporate-crimson";

  return [
    {
      label: "Tracked Projects",
      value: projects.length.toString(),
      change: `${running + queued} active pipelines`,
      icon: LineChart,
      accent: "text-corporate-platinum",
      description: "Across your CI providers",
    },
    {
      label: "Live Builds",
      value: `${running}`,
      change: `${queued} queued`,
      icon: Activity,
      accent: running > 0 ? "text-revenue-green" : "text-corporate-silver",
      description: "Real-time telemetry",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      change: `${recentSucceeded}/${recentBuilds.length || 0} past 24h`,
      icon: CheckCircle2,
      accent: successAccent,
      description: "Total builds",
    },
    {
      label: "Failed Builds",
      value: `${failed}`,
      change: `${recentFailed} in 24h`,
      icon: AlertTriangle,
      accent: failed > 0 ? "text-corporate-crimson" : "text-corporate-silver",
      description: `${terminal} completed runs`,
    },
  ];
}

const Dashboard = () => {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadProjects = useCallback(
    async ({ signal }: { signal?: AbortSignal } = {}) => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("projects")
        .select(
          `id, slug, name, repo_url, ci_provider, builds ( id, status, progress, branch, commit_sha, ci_provider, logs_url, message, metadata, started_at, completed_at, updated_at, build_number, external_id )`,
        )
        .order("updated_at", { ascending: false })
        .limit(5, { foreignTable: "builds" })
        .order("updated_at", { ascending: false, foreignTable: "builds" });

      if (signal?.aborted) {
        return;
      }

      if (supabaseError) {
        console.error("Failed to load projects", supabaseError);
        setError(supabaseError.message);
        setProjects([]);
        setLoading(false);
        setUsingDemoData(false);
        return;
      }

      const normalized = (data ?? []).map(toUiProject);
      normalized.sort((a, b) => {
        const aUpdated = a.latestBuild ? new Date(a.latestBuild.updated_at).getTime() : 0;
        const bUpdated = b.latestBuild ? new Date(b.latestBuild.updated_at).getTime() : 0;
        return bUpdated - aUpdated;
      });

      setProjects(normalized);
      setUsingDemoData(false);
      setError(null);
      setLoading(false);
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) {
      setProjects(
        demoProjects.map((project) => ({
          ...project,
          builds: project.builds.map((build) => ({ ...build })),
          latestBuild: project.builds[0],
        })),
      );
      setLoading(false);
      setError(null);
      setUsingDemoData(true);
      return;
    }

    const controller = new AbortController();
    loadProjects({ signal: controller.signal }).catch((err) => {
      console.error("Unexpected loadProjects failure", err);
      if (!controller.signal.aborted) {
        setError(String(err));
        setProjects([]);
        setLoading(false);
        setUsingDemoData(false);
      }
    });

    return () => controller.abort();
  }, [supabase, loadProjects]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        loadProjects().catch((err) => {
          console.error("Failed to refresh projects", err);
          setError((prev) => prev ?? String(err));
        });
      }, 400);
    };

    const channel = supabase
      .channel("build-telemetry")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "builds" },
        scheduleRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        scheduleRefresh,
      )
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [supabase, loadProjects]);

  const stats = useMemo(() => computeStats(projects), [projects]);

  return (
    <div className="min-h-screen bg-background corporate-grid p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold fortune-heading mb-2">REVENUE COMMAND CENTER</h1>
          <p className="text-corporate-silver">Enterprise Marketing Operations • Fortune 100 Class</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="glow-corporate" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-corporate-navy" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button className="btn-corporate text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="executive-card metric-card border-corporate-navy">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-corporate-blue/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-corporate-blue" />
                </div>
                <Badge variant="secondary" className={cn("text-background font-bold", stat.accent)}>
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-corporate-silver mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-corporate-platinum mb-1">{stat.value}</p>
                <p className="text-xs text-corporate-silver">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <LaunchChecklist />
      </div>

      {error && (
        <Card className="executive-card border-corporate-crimson/60 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 text-sm text-corporate-platinum">
              <AlertTriangle className="h-5 w-5 text-corporate-crimson mt-0.5" />
              <div>
                <p className="font-semibold">Realtime telemetry degraded</p>
                <p className="text-corporate-silver">
                  {error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {usingDemoData && (
        <Card className="executive-card border-corporate-blue/60 mb-8 bg-corporate-blue/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 text-sm text-corporate-platinum">
              <Info className="h-5 w-5 text-corporate-blue mt-0.5" />
              <div>
                <p className="font-semibold">Running in showcase mode</p>
                <p className="text-corporate-silver">
                  Populate <code className="text-xs px-1 py-0.5 bg-corporate-charcoal rounded">VITE_SUPABASE_URL</code> and
                  <code className="ml-1 text-xs px-1 py-0.5 bg-corporate-charcoal rounded">VITE_SUPABASE_ANON_KEY</code> in your
                  environment to stream live build telemetry from Supabase. Until then, curated demo data keeps the dashboard
                  fully interactive.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="executive-card border-corporate-navy">
        <CardHeader>
          <CardTitle className="text-xl text-corporate-platinum">
            Active Build Telemetry
            {loading && <span className="ml-3 text-xs text-corporate-silver">Refreshing…</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project) => {
              const latest = project.latestBuild;
              const latestProgress = clampProgress(latest?.progress ?? 0);
              return (
                <div key={project.id} className="metric-card rounded-lg p-6 border-corporate-charcoal">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-corporate-platinum flex items-center gap-3">
                        {project.name}
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-corporate-silver underline decoration-dotted hover:text-corporate-platinum"
                          >
                            {project.repo_url.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge className={statusBadgeClass[latest?.status ?? "unknown"]}>
                          {statusLabel[latest?.status ?? "unknown"]}
                        </Badge>
                        {project.ci_provider && (
                          <Badge variant="outline" className="border-corporate-navy text-corporate-platinum">
                            {project.ci_provider}
                          </Badge>
                        )}
                        {latest?.branch && (
                          <Badge variant="outline" className="border-corporate-gold text-corporate-gold">
                            {latest.branch}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-corporate-navy text-corporate-platinum"
                    >
                      Executive View
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-xs text-corporate-silver uppercase tracking-wide">Latest build</p>
                      <p className="text-2xl font-bold text-corporate-platinum">
                        #{latest?.build_number ?? "—"}
                      </p>
                      <p className="text-xs text-corporate-silver">Updated {formatRelative(latest?.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corporate-silver uppercase tracking-wide">Commit</p>
                      <p className="text-lg font-semibold text-corporate-blue">
                        {formatCommit(latest?.commit_sha) || "Pending"}
                      </p>
                      <p className="text-xs text-corporate-silver">{latest?.commit_sha ?? "Awaiting revision"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corporate-silver uppercase tracking-wide">Progress</p>
                      <p className="text-lg font-semibold text-revenue-green">{latestProgress}%</p>
                      <p className="text-xs text-corporate-silver">{statusLabel[latest?.status ?? "unknown"]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-corporate-silver uppercase tracking-wide">Logs</p>
                      {latest?.logs_url ? (
                        <a
                          className="text-sm text-corporate-gold underline decoration-dotted"
                          href={latest.logs_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open pipeline logs
                        </a>
                      ) : (
                        <p className="text-sm text-corporate-silver">Streaming from desktop companion</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-corporate-silver">Deployment Confidence</span>
                      <span className="text-revenue-green font-semibold">{latestProgress}%</span>
                    </div>
                    <Progress value={latestProgress} className="h-2 bg-corporate-charcoal" />
                    {latest?.message && (
                      <p className="text-xs text-corporate-silver">
                        Last event: <span className="text-corporate-platinum">{latest.message}</span>
                      </p>
                    )}
                  </div>

                  {project.builds.length > 1 && (
                    <div className="mt-6">
                      <p className="text-xs text-corporate-silver uppercase tracking-wide mb-2">
                        Recent builds
                      </p>
                      <div className="space-y-2">
                        {project.builds.slice(0, 4).map((build) => (
                          <div
                            key={build.id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-corporate-silver"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "w-2.5 h-2.5 rounded-full",
                                  statusDotClass[build.status ?? "unknown"],
                                )}
                              />
                              <span className="text-corporate-platinum font-semibold">
                                #{build.build_number ?? "—"}
                              </span>
                              <span>
                                {statusLabel[build.status ?? "unknown"]} • {formatCommit(build.commit_sha)}
                              </span>
                            </div>
                            <span className="text-corporate-silver">
                              {formatRelative(build.updated_at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {projects.length === 0 && !loading && (
              <div className="text-center text-corporate-silver py-10">
                No projects reporting yet. Wire your CI pipelines to the Supabase `report-build` endpoint to light up this board.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 btn-corporate glow-premium pulse-corporate shadow-2xl"
          aria-label="Quick launch"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
