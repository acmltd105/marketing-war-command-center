import React from "react";
import { useSkin } from "@/hooks/useSkin";

/**
 * ThemeSelector — thin wrapper to expose available skins as a simple <select>.
 * This reuses the existing `useSkin` contract so selection is persisted locally
 * and synced remotely via the existing preference pipeline.
 */
export default function ThemeSelector() {
  const { availableSkins, currentSkinId, selectSkin, isHydrated } = useSkin();

  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 14 }}>Theme</span>
      <select
        value={currentSkinId}
        onChange={(e) => selectSkin(e.target.value)}
        aria-label="Select theme"
        disabled={!isHydrated}
      >
        {availableSkins.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
