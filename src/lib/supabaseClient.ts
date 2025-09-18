import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function validateConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured. Falling back to demo data.",
    );
    return false;
  }
  return true;
}

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  if (!validateConfig()) {
    return null;
  }

  browserClient = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "marketing-war-command-center-dashboard",
      },
    },
  });

  return browserClient;
}
