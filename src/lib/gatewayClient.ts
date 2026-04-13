import type { Party } from "@/lib/contracts/party";
import { partySchema } from "@/lib/contracts/party";

const MOCK_HEALTH = { status: "ok" as const, version: "0.0.0-mock", region: "mock-east" };

const seedParties: Party[] = [
  {
    id: "party-001",
    type: "person",
    displayName: "Jamie Deal",
    primaryEmail: "jamie@example.test",
    primaryPhone: "+15550000001",
  },
  {
    id: "party-002",
    type: "org",
    displayName: "Acme Dental Co",
    primaryEmail: "ops@acmedental.test",
    primaryPhone: null,
  },
];

let mockParties: Party[] = [...seedParties];

export function isMockApiEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === "true";
}

export function getGatewayBaseUrl(): string {
  const base = (import.meta.env.VITE_GATEWAY_BASE_URL as string | undefined)?.trim();
  return base?.replace(/\/$/, "") ?? "";
}

/** Attach Bearer token when MSAL is configured and user has a token. */
export async function getGatewayFetchOptions(init?: RequestInit): Promise<RequestInit> {
  const { acquireGatewayAccessToken, isMsalConfigured } = await import("@/lib/msalConfig");
  const headers = new Headers(init?.headers ?? undefined);
  if (isMsalConfigured()) {
    const token = await acquireGatewayAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return { ...init, headers };
}

export type GatewayHealth = typeof MOCK_HEALTH;

export async function fetchHealth(): Promise<GatewayHealth> {
  if (isMockApiEnabled()) {
    return { ...MOCK_HEALTH };
  }
  const base = getGatewayBaseUrl();
  if (!base) {
    throw new Error("VITE_GATEWAY_BASE_URL is not set and mock API is off.");
  }
  const res = await fetch(`${base}/health`, await getGatewayFetchOptions());
  if (!res.ok) {
    throw new Error(`Gateway /health returned ${res.status}`);
  }
  return (await res.json()) as GatewayHealth;
}

export async function listParties(): Promise<Party[]> {
  if (isMockApiEnabled()) {
    return [...mockParties];
  }
  const base = getGatewayBaseUrl();
  if (!base) {
    throw new Error("VITE_GATEWAY_BASE_URL is not set and mock API is off.");
  }
  const res = await fetch(`${base}/api/parties`, await getGatewayFetchOptions());
  if (!res.ok) {
    throw new Error(`Gateway /api/parties returned ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  const arr = Array.isArray(data) ? data : (data as { items?: unknown }).items;
  if (!Array.isArray(arr)) {
    throw new Error("Invalid parties response shape");
  }
  return arr.map((row) => partySchema.parse(row));
}

export async function addParty(input: Omit<Party, "id">): Promise<Party> {
  if (isMockApiEnabled()) {
    const id = `party-${crypto.randomUUID().slice(0, 8)}`;
    const row = partySchema.parse({ ...input, id });
    mockParties = [...mockParties, row];
    return row;
  }
  const base = getGatewayBaseUrl();
  const opts = await getGatewayFetchOptions({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const res = await fetch(`${base}/api/parties`, opts);
  if (!res.ok) {
    throw new Error(`Gateway POST /api/parties returned ${res.status}`);
  }
  return partySchema.parse(await res.json());
}

/** Dev / tests only — reset mock store to seed data */
export function resetMockParties() {
  mockParties = [...seedParties];
}
