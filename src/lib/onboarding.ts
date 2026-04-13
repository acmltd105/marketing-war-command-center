import type { BackendProviderDefinition } from "./backendProviders";
import { shouldUseSupabaseInBrowser } from "./dataPlane";

const STORAGE_KEY = "mwcc:onboarding-v1";

export type OnboardingSupabaseCredentials = {
  projectUrl: string;
  anonKey: string;
};

export type OnboardingStateV1 = {
  version: 1;
  completedAt: string;
  /** Primary database / platform the operator chose */
  primaryProviderId: string;
  /** When set, dashboard uses this Supabase project (overrides Vite env). */
  supabase?: OnboardingSupabaseCredentials;
  /** Optional base URL for a custom sync gateway (BFF) */
  gatewayBaseUrl?: string;
  /** Freeform notes (e.g. resource group, cluster id) */
  connectionNotes?: string;
  /** True if user continued without live DB (demo / gateway pending) */
  usingDemoUntilGateway?: boolean;
};

function readEnvSupabase(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (url?.trim() && anonKey?.trim()) {
    return { url: url.trim(), anonKey: anonKey.trim() };
  }
  return null;
}

export function readOnboardingState(): OnboardingStateV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Partial<OnboardingStateV1>;
    if (o.version !== 1 || typeof o.completedAt !== "string" || typeof o.primaryProviderId !== "string") {
      return null;
    }
    return o as OnboardingStateV1;
  } catch {
    return null;
  }
}

export function writeOnboardingState(state: OnboardingStateV1) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Unable to persist onboarding state", e);
  }
}

export function clearOnboardingState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Skip wizard when the app is built with Supabase env (typical GitHub Pages + injected secrets).
 * Set `VITE_REQUIRE_ONBOARDING=true` to always show the wizard until localStorage onboarding completes
 * (Azure dogfood when CI still injects Supabase for OSS demos).
 */
export function isOnboardingComplete(): boolean {
  /** Local dev only — skip wizard when iterating on auth/contacts (see .env.development). */
  if (import.meta.env.VITE_DEV_SKIP_ONBOARDING === "true") {
    return true;
  }
  const forceWizard = import.meta.env.VITE_REQUIRE_ONBOARDING === "true";
  if (!forceWizard && readEnvSupabase()) {
    return true;
  }
  const s = readOnboardingState();
  return Boolean(s?.completedAt);
}

export function resolveSupabaseCredentialsFromOnboarding(): {
  projectUrl: string;
  anonKey: string;
} | null {
  const ob = readOnboardingState();
  /** Dogfood / Azure plane: never open Supabase in this browser once onboarding locked Azure. */
  if (ob?.completedAt && ob.primaryProviderId && !shouldUseSupabaseInBrowser(ob.primaryProviderId)) {
    return null;
  }

  const fromEnv = readEnvSupabase();
  const fromOb =
    ob?.supabase?.projectUrl?.trim() && ob?.supabase?.anonKey?.trim()
      ? {
          projectUrl: ob.supabase.projectUrl.trim().replace(/\/$/, ""),
          anonKey: ob.supabase.anonKey.trim(),
        }
      : null;
  if (fromOb) return fromOb;
  if (fromEnv) {
    return { projectUrl: fromEnv.url.replace(/\/$/, ""), anonKey: fromEnv.anonKey };
  }
  return null;
}

export { isAzurePrimaryProvider } from "./dataPlane";

export function buildOnboardingPayload(args: {
  primary: BackendProviderDefinition;
  supabase?: OnboardingSupabaseCredentials | null;
  gatewayBaseUrl?: string;
  connectionNotes?: string;
  usingDemoUntilGateway?: boolean;
}): OnboardingStateV1 {
  const payload: OnboardingStateV1 = {
    version: 1,
    completedAt: new Date().toISOString(),
    primaryProviderId: args.primary.id,
    gatewayBaseUrl: args.gatewayBaseUrl?.trim() || undefined,
    connectionNotes: args.connectionNotes?.trim() || undefined,
    usingDemoUntilGateway: args.usingDemoUntilGateway,
  };

  if (args.supabase?.projectUrl?.trim() && args.supabase?.anonKey?.trim()) {
    payload.supabase = {
      projectUrl: args.supabase.projectUrl.trim().replace(/\/$/, ""),
      anonKey: args.supabase.anonKey.trim(),
    };
  }

  return payload;
}
