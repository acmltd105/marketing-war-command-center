 codex/add-skin-selector-for-color-theme
import type { SupabaseClient } from "@supabase/supabase-js";
=======
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
 main
import { resolveSkinId, type SkinId } from "./skins";

const STORAGE_KEY = "mwcc:dashboard-skin";

 codex/add-skin-selector-for-color-theme
=======
type StorageCallback = (skinId: SkinId | null) => void;

main
export function readStoredSkin(): SkinId | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    return resolveSkinId(stored);
  } catch (error) {
    console.warn("Unable to read skin preference from localStorage", error);
    return null;
  }
}

export function persistStoredSkin(skinId: SkinId) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, skinId);
  } catch (error) {
    console.warn("Unable to persist skin preference to localStorage", error);
  }
}

codex/add-skin-selector-for-color-theme
=======
export function subscribeToStoredSkin(callback: StorageCallback): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    try {
      callback(event.newValue ? resolveSkinId(event.newValue) : null);
    } catch (error) {
      console.warn("Unable to react to skin preference storage change", error);
      callback(null);
    }
  };

  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}

 main
function isAuthSessionError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "message" in error && typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message.toLowerCase().includes("session")
    : false;
}

codex/add-skin-selector-for-color-theme
=======
function getPostgrestCode(error: unknown): string | null {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as PostgrestError).code;
    if (typeof code === "string") {
      return code;
    }
  }
  return null;
}

function isIgnorablePreferenceError(error: unknown): boolean {
  const code = getPostgrestCode(error);

  if (!code) {
    return false;
  }

  // 42P01: relation does not exist, 42501: insufficient privilege
  // PGRST116: row not found for maybeSingle, PGRST301: table not found
  return ["42P01", "42501", "PGRST116", "PGRST301"].includes(code);
}

main
function formatSupabaseError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallback);
}

export async function fetchRemoteSkin(
  client: SupabaseClient,
): Promise<SkinId | null> {
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) {
    if (isAuthSessionError(authError)) {
      return null;
    }
    throw formatSupabaseError(authError, "Failed to determine current Supabase user");
  }

  if (!user) {
    return null;
  }

  const { data, error } = await client
    .from("user_preferences")
    .select("dashboard_skin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
codex/add-skin-selector-for-color-theme
    if ("code" in error && (error as { code?: string }).code === "PGRST116") {
=======
    if (isIgnorablePreferenceError(error)) {
      console.warn("Dashboard skin preference table unavailable, falling back to defaults", error);
main
      return null;
    }

    throw formatSupabaseError(error, "Failed to load dashboard skin preference");
  }

  const remoteSkin = data?.dashboard_skin as string | null | undefined;
  if (!remoteSkin) {
    return null;
  }

  return resolveSkinId(remoteSkin);
}

export async function persistRemoteSkin(client: SupabaseClient, skinId: SkinId): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) {
    if (isAuthSessionError(authError)) {
      return;
    }
    throw formatSupabaseError(authError, "Failed to determine current Supabase user");
  }

  if (!user) {
    return;
  }

  const { error } = await client
    .from("user_preferences")
    .upsert(
      {
        user_id: user.id,
        dashboard_skin: skinId,
      },
      { onConflict: "user_id" },
    );

  if (error) {
codex/add-skin-selector-for-color-theme
=======
    if (isIgnorablePreferenceError(error)) {
      console.warn("Unable to persist dashboard skin preference remotely; continuing with local value", error);
      return;
    }

 main
    throw formatSupabaseError(error, "Failed to persist dashboard skin preference");
  }
}
