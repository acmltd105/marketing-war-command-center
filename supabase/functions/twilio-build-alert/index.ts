import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
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
    build_id: z.string().min(1),
    project_slug: z.string().min(1),
    project_name: z.string().optional(),
    status: buildStatusSchema,
    branch: z.string().optional(),
    commit_sha: z.string().optional(),
    logs_url: z.string().url().optional(),
    message: z.string().optional(),
    build_number: z.union([z.number().int(), z.string()]).optional(),
    external_id: z.string().optional(),
    ci_provider: z.string().optional(),
  })
  .strict();

type Payload = z.infer<typeof payloadSchema>;

const respond = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

function renderMessage(payload: Payload) {
  const summaryLines = [
    `🚨 Build failure detected for ${payload.project_name ?? payload.project_slug}`,
    `Status: ${payload.status}`,
  ];

  if (payload.branch) summaryLines.push(`Branch: ${payload.branch}`);
  if (payload.commit_sha) summaryLines.push(`Commit: ${payload.commit_sha}`);
  if (payload.build_number !== undefined)
    summaryLines.push(`Build #: ${payload.build_number}`);
  if (payload.external_id) summaryLines.push(`External ID: ${payload.external_id}`);
  if (payload.message) summaryLines.push(`Message: ${payload.message}`);
  if (payload.logs_url) summaryLines.push(`Logs: ${payload.logs_url}`);

  return summaryLines.join("\n");
}

async function sendTwilioMessage(payload: Payload, to: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio credentials are not fully configured");
  }

  const authHeader = "Basic " + btoa(`${accountSid}:${authToken}`);
  const body = new URLSearchParams({
    From: fromNumber,
    To: to,
    Body: renderMessage(payload),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  if (!response.ok) {
    const failure = await response.text();
    throw new Error(`Twilio API error (${response.status}): ${failure}`);
  }

  const result = await response.json();
  return {
    sid: result.sid,
    to,
    status: result.status,
  };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const sharedSecret = Deno.env.get("TWILIO_ALERT_TOKEN");
  if (sharedSecret) {
    const authorization = req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
      return respond(401, { error: "missing_authorization" });
    }

    const incomingToken = authorization.slice("bearer ".length).trim();
    if (incomingToken !== sharedSecret) {
      return respond(403, { error: "invalid_token" });
    }
  }

  let rawPayload: unknown;
  try {
    rawPayload = await req.json();
  } catch (error) {
    console.error("Invalid JSON received", error);
    return respond(400, { error: "invalid_json" });
  }

  const parsed = payloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return respond(422, {
      error: "validation_error",
      issues: parsed.error.issues,
    });
  }

  const toNumbersEnv = Deno.env.get("TWILIO_TO_NUMBERS");
  if (!toNumbersEnv) {
    console.error("TWILIO_TO_NUMBERS is not configured");
    return respond(500, { error: "server_misconfigured" });
  }

  const recipients = toNumbersEnv
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (recipients.length === 0) {
    return respond(400, { error: "no_recipients" });
  }

  try {
    const deliveries = [] as Array<Record<string, unknown>>;
    for (const recipient of recipients) {
      try {
        const result = await sendTwilioMessage(parsed.data, recipient);
        deliveries.push({ ok: true, ...result });
      } catch (error) {
        console.error(`Failed to alert ${recipient}`, error);
        deliveries.push({ ok: false, recipient, error: String(error) });
      }
    }

    return respond(200, {
      status: "ok",
      deliveries,
    });
  } catch (error) {
    console.error("Unexpected Twilio failure", error);
    return respond(500, { error: "twilio_error", message: String(error) });
  }
});
