import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const buildStatusSchema = z.enum([
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
  "unknown",
]);

const payloadSchema = z
  .object({
    project_slug: z.string().min(1),
    project_name: z.string().min(1).optional(),
    repository_url: z.string().url().optional(),
    ci_provider: z.string().optional(),
    branch: z.string().optional(),
    commit_sha: z.string().optional(),
    logs_url: z.string().url().optional(),
    build_number: z.union([z.number().int(), z.string()]).optional(),
    external_id: z.string().min(1).optional(),
    build_id: z.string().min(1).optional(),
    status: buildStatusSchema,
    progress: z.coerce.number().min(0).max(100).optional(),
    message: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    started_at: z.string().datetime({ offset: true }).optional(),
    completed_at: z.string().datetime({ offset: true }).optional(),
    log_chunk: z.string().optional(),
  })
  .strict();

type Payload = z.infer<typeof payloadSchema>;

type UpsertProjectInput = {
  slug: string;
  name: string;
  repo_url?: string | null;
  ci_provider?: string | null;
};

type UpsertBuildInput = {
  project_id: string;
  external_id: string;
  build_number?: number | null;
  status: string;
  progress: number;
  branch?: string | null;
  commit_sha?: string | null;
  ci_provider?: string | null;
  logs_url?: string | null;
  message?: string | null;
  metadata?: Record<string, unknown> | null;
  started_at?: string | null;
  completed_at?: string | null;
};

const respond = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-_]/gi, "-");
}

function coerceBuildNumber(value: Payload["build_number"]): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

function clampProgress(status: Payload["status"], progress?: number): number {
  if (typeof progress === "number" && Number.isFinite(progress)) {
    return Math.min(100, Math.max(0, progress));
  }
  if (status === "succeeded" || status === "failed" || status === "cancelled") {
    return 100;
  }
  return status === "running" ? 10 : 0;
}

async function upsertProject(
  supabase: ReturnType<typeof createClient>,
  payload: Payload,
): Promise<{ id: string; slug: string } | Response> {
  const slug = normalizeSlug(payload.project_slug);
  const project: UpsertProjectInput = {
    slug,
    name: payload.project_name?.trim() ?? payload.project_slug.trim(),
    repo_url: payload.repository_url ?? null,
    ci_provider: payload.ci_provider ?? null,
  };

  const { data, error } = await supabase
    .from("projects")
    .upsert(project, { onConflict: "slug" })
    .select("id, slug")
    .single();

  if (error || !data) {
    console.error("Failed to upsert project", error);
    return respond(500, {
      error: "project_upsert_failed",
      message: "Unable to persist project metadata.",
      details: error?.message ?? null,
    });
  }

  return data;
}

async function upsertBuild(
  supabase: ReturnType<typeof createClient>,
  project: { id: string; slug: string },
  payload: Payload,
): Promise<Response | { buildId: string }> {
  const resolvedExternalId = payload.external_id ?? payload.build_id;

  if (!resolvedExternalId) {
    return respond(400, {
      error: "missing_build_identifier",
      message: "Either external_id or build_id must be provided.",
    });
  }

  const metadata: Record<string, unknown> = {
    source: payload.metadata?.source ?? "report-build",
    ...payload.metadata,
  };

  if (payload.log_chunk) {
    metadata.log_chunk = payload.log_chunk;
    metadata.log_chunk_received_at = new Date().toISOString();
  }

  const progress = clampProgress(payload.status, payload.progress);
  const body: UpsertBuildInput = {
    project_id: project.id,
    external_id: resolvedExternalId,
    build_number: coerceBuildNumber(payload.build_number),
    status: payload.status,
    progress,
    branch: payload.branch ?? null,
    commit_sha: payload.commit_sha ?? null,
    ci_provider: payload.ci_provider ?? null,
    logs_url: payload.logs_url ?? null,
    message: payload.message ?? null,
    metadata,
    started_at: payload.started_at ?? null,
    completed_at: payload.completed_at ?? null,
  };

  if (!body.started_at && payload.status !== "queued") {
    body.started_at = new Date().toISOString();
  }

  if (!body.completed_at && ["succeeded", "failed", "cancelled"].includes(payload.status)) {
    body.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("builds")
    .upsert(body, { onConflict: "external_id" })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to upsert build", error);
    return respond(500, {
      error: "build_upsert_failed",
      message: "Unable to persist build payload.",
      details: error?.message ?? null,
    });
  }

  return { buildId: data.id };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const sharedSecret = Deno.env.get("BUILD_REPORT_TOKEN");
  if (!sharedSecret) {
    console.error("BUILD_REPORT_TOKEN is not configured");
    return respond(500, { error: "server_misconfigured" });
  }

  const authorization = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return respond(401, { error: "missing_authorization" });
  }

  const incomingToken = authorization.slice("bearer ".length).trim();
  if (incomingToken !== sharedSecret) {
    return respond(403, { error: "invalid_token" });
  }

  let rawPayload: unknown;
  try {
    rawPayload = await req.json();
  } catch (error) {
    console.error("Failed to parse JSON", error);
    return respond(400, { error: "invalid_json" });
  }

  const parsed = payloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return respond(422, {
      error: "validation_error",
      issues: parsed.error.issues,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase credentials missing for edge function");
    return respond(500, { error: "server_misconfigured" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "report-build-edge-function",
      },
    },
  });

  const project = await upsertProject(supabase, parsed.data);
  if (project instanceof Response) {
    return project;
  }

  const buildResult = await upsertBuild(supabase, project, parsed.data);
  if (buildResult instanceof Response) {
    return buildResult;
  }

  return respond(200, {
    status: "ok",
    project_slug: project.slug,
    build_id: buildResult.buildId,
  });
});
