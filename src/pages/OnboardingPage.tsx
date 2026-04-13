import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  ExternalLink,
  Loader2,
  Search,
  Shield,
} from "lucide-react";

import {
  BACKEND_CATEGORIES,
  BACKEND_PROVIDERS,
  filterProviders,
  type BackendProviderDefinition,
} from "@/lib/backendProviders";
import { isAzurePrimaryProvider } from "@/lib/dataPlane";
import { buildOnboardingPayload, clearOnboardingState, writeOnboardingState } from "@/lib/onboarding";
import { resetSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const STEPS = ["Welcome", "Choose backend", "Connect", "Review"] as const;

async function probeGateway(baseUrl: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const root = baseUrl.trim().replace(/\/$/, "");
  if (!root) {
    return { ok: false, message: "Gateway URL is required." };
  }
  const healthUrl = `${root}/health`;
  try {
    const res = await fetch(healthUrl, { method: "GET", mode: "cors" });
    if (res.ok) {
      return { ok: true };
    }
    return {
      ok: false,
      message: `Gateway responded with HTTP ${res.status} at ${healthUrl}. Fix CORS or implement GET /health.`,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return {
      ok: false,
      message: `Could not reach ${healthUrl} (${message}). If the gateway exists, CORS may block the browser—you can still continue.`,
    };
  }
}

async function probeSupabase(projectUrl: string, anonKey: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const url = projectUrl.trim().replace(/\/$/, "");
  const key = anonKey.trim();
  if (!url || !key) {
    return { ok: false, message: "Project URL and anon key are required." };
  }

  try {
    const client = createClient(url, key, {
      auth: { persistSession: false },
    });
    const { error } = await client.from("projects").select("id").limit(1);
    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("jwt") || msg.includes("api key") || msg.includes("invalid")) {
        return { ok: false, message: "Invalid project URL or anon key." };
      }
      if (msg.includes("relation") || msg.includes("does not exist")) {
        return {
          ok: false,
          message:
            "Connected to PostgREST, but the `projects` table is missing. Run `supabase db push` from this repository before testing.",
        };
      }
      return { ok: false, message: error.message || "Could not reach Supabase REST API." };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error while contacting Supabase.";
    return { ok: false, message };
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [primary, setPrimary] = useState<BackendProviderDefinition | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnon, setSupabaseAnon] = useState("");
  const [gatewayBaseUrl, setGatewayBaseUrl] = useState("");
  const [connectionNotes, setConnectionNotes] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "running" | "ok" | "error">("idle");
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [gatewayTestStatus, setGatewayTestStatus] = useState<"idle" | "running" | "ok" | "error">("idle");
  const [gatewayTestMessage, setGatewayTestMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => filterProviders(search), [search]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canAdvanceFromBackend = Boolean(primary);
  const isAzurePlane = Boolean(primary && isAzurePrimaryProvider(primary.id));

  const canAdvanceFromConnect =
    usingDemo ||
    (!isAzurePlane && Boolean(supabaseUrl.trim()) && Boolean(supabaseAnon.trim()) && testStatus === "ok") ||
    (isAzurePlane && Boolean(gatewayBaseUrl.trim())) ||
    (!isAzurePlane && Boolean(gatewayBaseUrl.trim()) && primary && primary.id !== "supabase");

  async function runGatewayTest() {
    setGatewayTestStatus("running");
    setGatewayTestMessage(null);
    const result = await probeGateway(gatewayBaseUrl);
    if (result.ok) {
      setGatewayTestStatus("ok");
      setGatewayTestMessage("GET /health succeeded.");
    } else {
      setGatewayTestStatus("error");
      setGatewayTestMessage(result.message);
    }
  }

  async function runTest() {
    setTestStatus("running");
    setTestMessage(null);
    const result = await probeSupabase(supabaseUrl, supabaseAnon);
    if (result.ok) {
      setTestStatus("ok");
      setTestMessage("Successfully queried the `projects` table.");
    } else {
      setTestStatus("error");
      setTestMessage(result.message);
    }
  }

  function finish() {
    if (!primary) return;
    setSaving(true);
    try {
      const payload = buildOnboardingPayload({
        primary,
        supabase:
          !usingDemo && !isAzurePlane && supabaseUrl.trim() && supabaseAnon.trim()
            ? { projectUrl: supabaseUrl.trim(), anonKey: supabaseAnon.trim() }
            : undefined,
        gatewayBaseUrl: gatewayBaseUrl.trim() || undefined,
        connectionNotes: connectionNotes.trim() || undefined,
        usingDemoUntilGateway: usingDemo,
      });
      writeOnboardingState(payload);
      resetSupabaseBrowserClient();
      window.location.assign("/");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Connect your data plane</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            You are building agents—this stack is for using them to <strong className="text-foreground">market and close</strong>.
            Dogfood default: <strong className="text-foreground">Azure</strong> (SQL Database, Cosmos DB, Blob Storage,
            Container Apps / AKS, Microsoft 365) via your <strong className="text-foreground">gateway</strong>—no database
            secrets in the browser. Optional Supabase block appears only if you pick a non-Azure primary backend.
          </p>
          <div className="space-y-1">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{STEPS[step]}</span>
              <span>
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Pipeline Pantry</CardTitle>
              <CardDescription>
                The product vision is simple: <strong className="text-foreground">text, email, RCS, and MMS at scale</strong>,
                Segment-style <strong className="text-foreground">triggers and enrichment</strong>, trainable{" "}
                <strong className="text-foreground">Closer Bots</strong> (text + voice) on <em>your</em> sales canon and
                knowledge base, payments across major processors with routing controls, a growing template library, lead
                marketplace hooks, e-sign over message, and landing pages that convert. This screen connects the{" "}
                <strong className="text-foreground">data plane</strong> so the rest of the shell can stay honest and fast.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Built for the browser</AlertTitle>
                <AlertDescription>
                  For <strong>Azure SQL</strong>, <strong>Cosmos DB</strong>, and peers, connection strings live in{" "}
                  <strong>Azure Key Vault</strong> + your <strong>API / Container Apps</strong> gateway. This SPA stores only
                  the gateway base URL and notes—never SQL passwords or Cosmos keys. Managed agents (see docs) call the same
                  gateway to read/write on your behalf.
                </AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setStep(1)}>
                  Choose backend
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://learn.microsoft.com/azure/" target="_blank" rel="noreferrer">
                    Azure docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose your primary backend</CardTitle>
              <CardDescription>
                {BACKEND_PROVIDERS.length} managed platforms and warehouses are catalogued. Search to narrow the list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="pl-9"
                  placeholder="Search Neon, Cosmos, Snowflake, DynamoDB…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Filter database vendors"
                />
              </div>
              <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-md border p-2">
                {filtered.map((p) => {
                  const cat = BACKEND_CATEGORIES[p.category];
                  const selected = primary?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPrimary(p)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-muted-foreground text-xs">{p.vendor}</div>
                          <div className="text-muted-foreground mt-1 text-xs">{p.syncHint}</div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {cat.label}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button disabled={!canAdvanceFromBackend} onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && primary && (
          <Card>
            <CardHeader>
              <CardTitle>Connect {primary.name}</CardTitle>
              <CardDescription>{primary.syncHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <div className="font-medium">Protocol</div>
                <div className="text-muted-foreground">{primary.protocol}</div>
                {primary.documentationUrl && (
                  <a
                    href={primary.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    Vendor documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {isAzurePlane ? (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Azure data plane gateway (required)</Label>
                  <p className="text-muted-foreground text-sm">
                    Your Container Apps / API Management / Function App exposes HTTPS only. It talks to{" "}
                    <strong className="text-foreground">Azure SQL</strong>, <strong className="text-foreground">Cosmos DB</strong>
                    , and <strong className="text-foreground">Blob Storage</strong> with managed identity + Key Vault—never from
                    this browser.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="gw-azure">Gateway base URL</Label>
                    <Input
                      id="gw-azure"
                      placeholder="https://pantry-gateway.azurecontainerapps.io"
                      value={gatewayBaseUrl}
                      onChange={(e) => {
                        setGatewayBaseUrl(e.target.value);
                        setGatewayTestStatus("idle");
                        setGatewayTestMessage(null);
                      }}
                      autoComplete="url"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={runGatewayTest}
                      disabled={!gatewayBaseUrl.trim() || gatewayTestStatus === "running"}
                    >
                      {gatewayTestStatus === "running" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing…
                        </>
                      ) : (
                        "Test GET /health"
                      )}
                    </Button>
                    {gatewayTestStatus === "ok" && (
                      <span className="text-revenue-green flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Gateway reachable
                      </span>
                    )}
                  </div>
                  {gatewayTestMessage && (
                    <Alert variant={gatewayTestStatus === "error" ? "destructive" : "default"}>
                      <AlertDescription>{gatewayTestMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Supabase (optional)</Label>
                    <p className="text-muted-foreground text-sm">
                      Paste project URL and anon key to validate <code className="text-xs">projects</code> over PostgREST.
                      Skip if you only use a custom gateway below.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="sb-url">Project URL</Label>
                      <Input
                        id="sb-url"
                        placeholder="https://xyzcompany.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => {
                          setSupabaseUrl(e.target.value);
                          setTestStatus("idle");
                          setTestMessage(null);
                        }}
                        autoComplete="url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sb-key">Anon public key</Label>
                      <Input
                        id="sb-key"
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
                        value={supabaseAnon}
                        onChange={(e) => {
                          setSupabaseAnon(e.target.value);
                          setTestStatus("idle");
                          setTestMessage(null);
                        }}
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={runTest}
                        disabled={!supabaseUrl.trim() || !supabaseAnon.trim()}
                      >
                        {testStatus === "running" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing…
                          </>
                        ) : (
                          "Test Supabase connection"
                        )}
                      </Button>
                      {testStatus === "ok" && (
                        <span className="text-revenue-green flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          Ready
                        </span>
                      )}
                    </div>
                    {testMessage && (
                      <Alert variant={testStatus === "error" ? "destructive" : "default"}>
                        <AlertDescription>{testMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gw">Custom sync gateway (optional)</Label>
                    <Input
                      id="gw"
                      placeholder="https://api.mycompany.com"
                      value={gatewayBaseUrl}
                      onChange={(e) => setGatewayBaseUrl(e.target.value)}
                    />
                    <p className="text-muted-foreground text-xs">
                      Point at your BFF for non-Supabase warehouses. Pipeline Pantry will call this URL in future releases.
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Operator notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Resource group, cluster ID, change-feed consumer name…"
                  value={connectionNotes}
                  onChange={(e) => setConnectionNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={usingDemo}
                  onChange={(e) => setUsingDemo(e.target.checked)}
                />
                <span>
                  Continue with <strong>demo data</strong> until my gateway is ready. I understand live telemetry stays
                  offline until my API (or Supabase, if configured) is reachable.
                </span>
              </label>

              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button disabled={!canAdvanceFromConnect} onClick={() => setStep(3)}>
                  Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && primary && (
          <Card>
            <CardHeader>
              <CardTitle>Review & launch</CardTitle>
              <CardDescription>We store preferences in this browser only unless you deploy with CI secrets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">Primary backend:</span>{" "}
                  <strong>{primary.name}</strong> ({primary.vendor})
                </li>
                <li>
                  <span className="text-muted-foreground">Data plane:</span>{" "}
                  {isAzurePlane ? "Azure (gateway only in browser)" : supabaseUrl.trim() ? "Supabase configured" : "Not set"}
                </li>
                <li>
                  <span className="text-muted-foreground">Gateway:</span>{" "}
                  {gatewayBaseUrl.trim() || "—"}
                </li>
                <li>
                  <span className="text-muted-foreground">Demo mode:</span> {usingDemo ? "Yes" : "No"}
                </li>
              </ul>
              <Alert>
                <AlertTitle>Reset onboarding</AlertTitle>
                <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  Need to wipe local setup?{" "}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearOnboardingState();
                      resetSupabaseBrowserClient();
                      window.location.reload();
                    }}
                  >
                    Clear saved onboarding
                  </Button>
                </AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={finish} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Enter Pipeline Pantry"
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/settings">Open settings after launch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
