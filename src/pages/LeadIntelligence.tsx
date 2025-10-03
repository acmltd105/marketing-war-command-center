import React, { useCallback, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Database,
  FileSpreadsheet,
  Loader2,
  PlugZap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLeadIngestion } from "@/hooks/useLeadIngestion";

const stageStatusClasses: Record<string, string> = {
  ready: "bg-corporate-blue text-white",
  running: "bg-revenue-green text-background",
  queued: "bg-warning-amber text-background",
  degraded: "bg-corporate-crimson text-white",
};

const stageStatusLabels: Record<string, string> = {
  ready: "Ready",
  running: "Running",
  queued: "Queued",
  degraded: "Degraded",
};

const carrierBreakout = [
  { carrier: "Verizon", percent: 0.31, lineType: "Mobile" },
  { carrier: "AT&T", percent: 0.27, lineType: "Mobile" },
  { carrier: "T-Mobile", percent: 0.21, lineType: "Mobile" },
  { carrier: "Comcast", percent: 0.08, lineType: "VoIP" },
  { carrier: "Unknown", percent: 0.13, lineType: "Mixed" },
];

const pipelineStages = [
  {
    key: "ingest",
    label: "Ingestion Validation",
    description: "Schema checks, consent verification, SHA-256 hashing",
    status: "running",
    metric: "128,000 records",
  },
  {
    key: "lookup",
    label: "Twilio Lookup",
    description: "Carrier & line type enrichment with fraud score",
    status: "ready",
    metric: "88% coverage",
  },
  {
    key: "dnc",
    label: "DNC Compliance",
    description: "Federal + state lists with Trust Hub auditing",
    status: "ready",
    metric: "5,120 flagged",
  },
  {
    key: "enrichment",
    label: "Third-Party Enrichment",
    description: "Clearbit, FullContact, internal CRM join",
    status: "queued",
    metric: "Awaiting sample",
  },
  {
    key: "silo",
    label: "Data Silo Replication",
    description: "Supabase logical replication to analytics zone",
    status: "ready",
    metric: "120s lag",
  },
];

const segmentDestinations = [
  {
    name: "Segment Personas",
    detail: "Identity resolution + trait hydration",
    cadence: "Continuous",
  },
  {
    name: "Engage Journeys",
    detail: "Real-time welcome + nurture series",
    cadence: "Triggered",
  },
  {
    name: "Paid Media Sync",
    detail: "Google Ads Customer Match + Meta CAPI",
    cadence: "Hourly",
  },
];

const LeadIntelligence = () => {
  const [sampleRate, setSampleRate] = useState(15);
  const totalLeads = 128_000;
  const { uploadState, isUploading, handleFileUpload } = useLeadIngestion();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = useCallback(() => {
    if (isUploading) return;
    fileInputRef.current?.click();
  }, [isUploading]);

  const handleLeadUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      void handleFileUpload(file);
      event.target.value = "";
    },
    [handleFileUpload],
  );

  const uploadStatusLabel = useMemo(() => {
    switch (uploadState.stage) {
      case "preparing":
        return "Preparing file";
      case "uploading":
        return "Uploading to Supabase";
      case "success":
        return "Ingestion complete";
      case "error":
        return "Upload failed";
      default:
        return "Awaiting upload";
    }
  }, [uploadState.stage]);

  const progressValue = useMemo(() => {
    if (uploadState.totalRows && uploadState.totalRows > 0) {
      return Math.min(100, Math.round((uploadState.processedRows / uploadState.totalRows) * 100));
    }
    if (uploadState.stage === "success") {
      return 100;
    }
    return uploadState.processedRows > 0 ? 15 : 0;
  }, [uploadState.processedRows, uploadState.stage, uploadState.totalRows]);

  const sampleLeads = useMemo(
    () => Math.max(1, Math.round((sampleRate / 100) * totalLeads)),
    [sampleRate, totalLeads],
  );

  const sanitized = useMemo(() => Math.round(sampleLeads * 0.94), [sampleLeads]);
  const dncHits = useMemo(() => Math.round(sampleLeads * 0.04), [sampleLeads]);
  const lookupCoverage = useMemo(() => Math.round(sampleLeads * 0.88), [sampleLeads]);

  return (
    <div className="min-h-screen bg-background corporate-grid p-6 space-y-8">
      <header className="flex flex-col gap-2">
        <Badge className="self-start bg-corporate-blue/20 text-corporate-blue border border-corporate-blue/40">
          Lead Intelligence
        </Badge>
        <h1 className="text-4xl font-bold fortune-heading text-corporate-platinum">
          LEAD INGESTION & ENRICHMENT COMMAND
        </h1>
        <p className="text-corporate-silver max-w-3xl">
          Orchestrate compliant onboarding of partner audiences, sanitize records with Twilio Lookup and DNC
          coverage, and stream enriched personas directly into Segment and Engage for activation.
        </p>
      </header>

      <Card className="executive-card border-corporate-navy">
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-corporate-platinum text-xl">Ingestion Control Center</CardTitle>
            <p className="text-sm text-corporate-silver">
              Accept secure list uploads or authenticated API pushes, monitor sampling strategy, and confirm
              compliance checkpoints before activation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-corporate-gold text-corporate-gold">
              <Cloud className="h-3.5 w-3.5 mr-1" /> Supabase Storage: Healthy
            </Badge>
            <Badge variant="outline" className="border-revenue-green text-revenue-green">
              <Activity className="h-3.5 w-3.5 mr-1" /> API Stream Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-corporate-platinum flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-corporate-gold" /> Batch Upload
                </h3>
                <Badge className="bg-corporate-blue text-white">AES-256 at rest</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="btn-corporate text-white flex items-center gap-2"
                  onClick={openFileDialog}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  {isUploading ? "Uploading…" : "Upload CSV / XLSX"}
                </Button>
                <input
                  id="lead-upload"
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleLeadUpload}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="border-corporate-navy text-corporate-platinum"
                  disabled={isUploading}
                >
                  <Sparkles className="h-4 w-4" /> Auto-map Columns
                </Button>
                <Button
                  variant="outline"
                  className="border-corporate-charcoal text-corporate-silver"
                  disabled={isUploading}
                >
                  <ShieldCheck className="h-4 w-4" /> Compliance Receipt
                </Button>
              </div>
              {uploadState.stage !== "idle" && (
                <div className="space-y-3 rounded-lg border border-corporate-navy/40 bg-corporate-navy/10 p-4 text-sm">
                  <div className="flex items-center justify-between text-xs text-corporate-silver uppercase tracking-wide">
                    <span>Upload status</span>
                    <span className="text-corporate-platinum font-semibold normal-case">
                      {uploadStatusLabel}
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2 bg-corporate-charcoal/40" />
                  <div className="flex items-center justify-between text-xs text-corporate-silver">
                    <span>
                      {uploadState.processedRows > 0
                        ? `${uploadState.processedRows.toLocaleString()} rows processed`
                        : "Initializing…"}
                    </span>
                    {uploadState.totalRows ? (
                      <span>{uploadState.totalRows.toLocaleString()} total rows</span>
                    ) : uploadState.stage === "uploading" ? (
                      <span>Estimating total…</span>
                    ) : null}
                  </div>
                  {uploadState.fileName && (
                    <div className="flex items-center justify-between text-xs text-corporate-silver/80">
                      <span>File</span>
                      <span className="max-w-[60%] truncate text-corporate-platinum">{uploadState.fileName}</span>
                    </div>
                  )}
                  {uploadState.ingestionId && uploadState.stage !== "idle" && (
                    <div className="flex items-center justify-between text-xs text-revenue-green/80">
                      <span>Supabase ingestion</span>
                      <span className="font-mono">{`${uploadState.ingestionId.slice(0, 8)}…`}</span>
                    </div>
                  )}
                  {uploadState.errorMessage && (
                    <p className="text-xs text-corporate-crimson">{uploadState.errorMessage}</p>
                  )}
                </div>
              )}
              <div className="grid gap-2 text-sm text-corporate-silver">
                <div className="flex justify-between">
                  <span>Records landed</span>
                  <span className="text-corporate-platinum font-semibold">{totalLeads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing window</span>
                  <span className="text-corporate-platinum font-semibold">~ 4m 12s</span>
                </div>
                <div className="flex justify-between">
                  <span>Last upload</span>
                  <span className="text-corporate-platinum font-semibold">7 minutes ago</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-corporate-platinum flex items-center gap-2">
                  <PlugZap className="h-5 w-5 text-revenue-green" /> API Ingestion
                </h3>
                <Badge className="bg-revenue-green text-background">Webhook Auth: Signed</Badge>
              </div>
              <div className="p-4 rounded-lg bg-corporate-navy/20 border border-corporate-navy/40 text-sm text-corporate-silver space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-corporate-platinum font-semibold">`POST /v1/lead-import`</p>
                    <p>Send JSON payloads or multipart file handles with HMAC auth.</p>
                  </div>
                  <Badge variant="outline" className="border-corporate-gold text-corporate-gold">
                    132 req/min
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-revenue-green" />
                  100% success across last 5 minutes • Retries with exponential backoff
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ArrowRight className="h-4 w-4 text-corporate-gold" />
                  Automatically streams to Supabase `lead_ingestions` table and emits `lead-ingestion` channel events.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-corporate-silver">Sample for enrichment ({sampleRate}%)</span>
                  <Badge variant="outline" className="border-corporate-navy text-corporate-platinum">
                    {sampleLeads.toLocaleString()} leads
                  </Badge>
                </div>
                <Slider
                  value={[sampleRate]}
                  max={50}
                  min={5}
                  step={1}
                  onValueChange={(value) => {
                    const next = value[0];
                    if (typeof next === "number" && !Number.isNaN(next)) {
                      setSampleRate(Math.min(50, Math.max(5, next)));
                    }
                  }}
                  className="text-corporate-blue"
                  aria-label="Sample percentage"
                />
                <div className="grid grid-cols-3 gap-3 text-xs text-corporate-silver">
                  <div className="p-3 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30">
                    <p className="text-corporate-platinum font-semibold">{sanitized.toLocaleString()}</p>
                    <p>Sanitized</p>
                  </div>
                  <div className="p-3 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30">
                    <p className="text-corporate-platinum font-semibold">{dncHits.toLocaleString()}</p>
                    <p>DNC Flags</p>
                  </div>
                  <div className="p-3 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30">
                    <p className="text-corporate-platinum font-semibold">{lookupCoverage.toLocaleString()}</p>
                    <p>Lookup Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="executive-card border-corporate-charcoal xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-corporate-platinum">Sanitize &amp; Silo Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {pipelineStages.map((stage) => (
              <div
                key={stage.key}
                className="rounded-lg border border-corporate-charcoal p-4 bg-corporate-charcoal/30 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm text-corporate-silver uppercase tracking-wide">{stage.label}</p>
                  <p className="text-base font-semibold text-corporate-platinum">{stage.description}</p>
                  <p className="text-xs text-corporate-silver">{stage.metric}</p>
                </div>
                <Badge
                  className={`${
                    stageStatusClasses[stage.status] ?? "bg-corporate-charcoal text-corporate-platinum"
                  } text-xs px-3 py-1 rounded-full self-start md:self-center`}
                >
                  {stageStatusLabels[stage.status] ?? "Unknown"}
                </Badge>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <p className="text-xs text-corporate-silver uppercase tracking-wide">SLA Monitoring</p>
              <Progress value={82} className="h-2 bg-corporate-charcoal" />
              <p className="text-xs text-corporate-silver">
                82% of enrichment jobs completed under 90 seconds. Alert threshold set at 70% with auto retry to
                backup vendor.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="executive-card border-corporate-charcoal">
          <CardHeader>
            <CardTitle className="text-lg text-corporate-platinum">Carrier Breakout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="border-corporate-charcoal">
                  <TableHead className="text-corporate-silver">Carrier</TableHead>
                  <TableHead className="text-corporate-silver">Line Type</TableHead>
                  <TableHead className="text-corporate-silver text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrierBreakout.map((carrier) => (
                  <TableRow key={carrier.carrier} className="border-corporate-charcoal/60">
                    <TableCell className="text-corporate-platinum font-semibold">{carrier.carrier}</TableCell>
                    <TableCell className="text-corporate-silver">{carrier.lineType}</TableCell>
                    <TableCell className="text-corporate-silver text-right">
                      {(carrier.percent * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="text-corporate-silver">
                Aggregated from Twilio Lookup metadata across sampled leads.
              </TableCaption>
            </Table>
            <div className="p-3 rounded-lg bg-corporate-navy/20 border border-corporate-navy/40 text-xs text-corporate-silver space-y-1">
              <p className="text-corporate-platinum font-semibold">Playbook</p>
              <p>Prioritize mobile carriers with full consent for SMS journeys. Route unknown carriers to manual review.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="executive-card border-corporate-navy">
        <CardHeader>
          <CardTitle className="text-lg text-corporate-platinum">Twilio Segment &amp; Engage Activation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {segmentDestinations.map((destination) => (
              <div
                key={destination.name}
                className="p-4 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-corporate-gold" />
                  <p className="text-sm font-semibold text-corporate-platinum">{destination.name}</p>
                </div>
                <p className="text-xs text-corporate-silver">{destination.detail}</p>
                <Badge variant="outline" className="border-corporate-blue text-corporate-blue text-xs">
                  Cadence: {destination.cadence}
                </Badge>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-corporate-navy/20 border border-corporate-navy/40 text-sm text-corporate-silver space-y-2">
            <p className="text-corporate-platinum font-semibold">Activation Guardrails</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Engage journeys throttle to 250 events/sec with automatic burst credits.</li>
              <li>Segment traits fall back to hashed email when phone identity unavailable.</li>
              <li>Real-time feedback loops emit to the desktop Rust companion for operator overrides.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadIntelligence;
