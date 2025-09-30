import {
  applySkin,
  defaultSkinId,
  getAvailableSkins,
  getSkin,
  resolveSkinId,
  type SkinDefinition,
  type SkinId,
} from "@/lib/skins";
import {
  fetchRemoteSkin,
  persistRemoteSkin,
  persistStoredSkin,
  readStoredSkin,
} from "@/lib/preferences";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SkinContextValue {
  availableSkins: readonly SkinDefinition[];
  currentSkinId: SkinId;
  currentSkin: SkinDefinition;
  isHydrated: boolean;
  isRemoteLoading: boolean;
  pendingSkinId: SkinId | null;
  lastError: string | null;
  selectSkin: (skinId: SkinId) => Promise<void>;
}

const SkinContext = createContext<SkinContextValue | undefined>(undefined);

function applyToDocument(skinId: SkinId) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  applySkin(root, getSkin(skinId));
}

export const SkinProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const availableSkins = useMemo(() => getAvailableSkins(), []);
  const [currentSkinId, setCurrentSkinId] = useState<SkinId>(defaultSkinId);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [pendingSkinId, setPendingSkinId] = useState<SkinId | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const initialSkin = readStoredSkin();
    if (initialSkin) {
      setCurrentSkinId(initialSkin);
    }
    applyToDocument(initialSkin ?? defaultSkinId);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    applyToDocument(currentSkinId);
    persistStoredSkin(currentSkinId);
  }, [currentSkinId]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let cancelled = false;
    setIsRemoteLoading(true);

    fetchRemoteSkin(supabase)
      .then((remoteSkin) => {
        if (cancelled || !remoteSkin) {
          return;
        }
        setCurrentSkinId(remoteSkin);
        persistStoredSkin(remoteSkin);
        setLastError(null);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        console.error("Failed to hydrate skin preference from Supabase", error);
        setLastError(
          error instanceof Error ? error.message : "Unable to load skin preference from Supabase",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setIsRemoteLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const selectSkin = useCallback(
    async (skinId: SkinId) => {
      const resolved = resolveSkinId(skinId);
      setCurrentSkinId(resolved);
      persistStoredSkin(resolved);
      setLastError(null);

      if (!supabase) {
        return;
      }

      setPendingSkinId(resolved);
      try {
        await persistRemoteSkin(supabase, resolved);
        setLastError(null);
      } catch (error) {
        console.error("Failed to persist skin preference", error);
        const message = error instanceof Error ? error.message : "Unable to save skin preference";
        setLastError(message);
        throw error instanceof Error ? error : new Error(message);
      } finally {
        setPendingSkinId((current) => (current === resolved ? null : current));
      }
    },
    [supabase],
  );

  const value = useMemo<SkinContextValue>(
    () => ({
      availableSkins,
      currentSkinId,
      currentSkin: getSkin(currentSkinId),
      isHydrated,
      isRemoteLoading,
      pendingSkinId,
      lastError,
      selectSkin,
    }),
    [
      availableSkins,
      currentSkinId,
      isHydrated,
      isRemoteLoading,
      pendingSkinId,
      lastError,
      selectSkin,
    ],
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
};

export function useSkin(): SkinContextValue {
  const context = useContext(SkinContext);
  if (!context) {
    throw new Error("useSkin must be used within a SkinProvider");
  }
  return context;
}
