import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveSkinId, type SkinId } from "./skins";

const STORAGE_KEY = "mwcc:dashboard-skin";

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

function isAuthSessionError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "message" in error && typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message.toLowerCase().includes("session")
    : false;
}

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
    if ("code" in error && (error as { code?: string }).code === "PGRST116") {
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
    throw formatSupabaseError(error, "Failed to persist dashboard skin preference");
  }
}
