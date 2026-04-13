import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { resolveSupabaseCredentialsFromOnboarding } from "./onboarding";

let browserClient: SupabaseClient | null = null;
let cachedFingerprint: string | null = null;

function fingerprint(url: string, key: string) {
  return `${url}::${key.length}::${key.slice(0, 8)}`;
}

export function resetSupabaseBrowserClient() {
  browserClient = null;
  cachedFingerprint = null;
}

export function getSupabaseBrowserClient() {
  const resolved = resolveSupabaseCredentialsFromOnboarding();
  if (!resolved?.projectUrl || !resolved?.anonKey) {
    resetSupabaseBrowserClient();
    return null;
  }

  const { projectUrl: url, anonKey } = resolved;
  const fp = fingerprint(url, anonKey);
  if (browserClient && cachedFingerprint === fp) {
    return browserClient;
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "pipeline-pantry-dashboard",
      },
    },
  });
  cachedFingerprint = fp;

  return browserClient;
}
