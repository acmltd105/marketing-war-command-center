import React, { useMemo, useState, useEffect } from "react";
import { useSkin } from "@/hooks/useSkin";
import presets from "@/themes/presets";
import { applyThemeById, applyPersistedTheme } from "@/themes/applyTheme";

/**
 * ThemeSelector — thin wrapper to expose available skins as a simple <select>.
 * This reuses the existing `useSkin` contract so selection is persisted locally
 * and synced remotely via the existing preference pipeline.
 */
export default function ThemeSelector() {
  const { availableSkins, currentSkinId, selectSkin, isHydrated } = useSkin();

  // Keep a small combined selection value so the select can show either a skin id or a preset id
  const [value, setValue] = useState<string>(() => {
    // Try persisted theme first (from applyTheme), fall back to current skin id
    try {
      const persisted = applyPersistedTheme();
      return persisted?.id ?? currentSkinId;
    } catch {
      return currentSkinId;
    }
  });

  useEffect(() => {
    // Keep value in sync when skin provider updates
    setValue((current) => (current === currentSkinId ? current : currentSkinId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSkinId]);

  const skinIds = useMemo(() => new Set(availableSkins.map((s) => s.id)), [availableSkins]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setValue(id);

    if (skinIds.has(id)) {
      // It's an available skin — use the skin pipeline (local + remote persistence)
      selectSkin(id as any).catch((err) => {
        console.error("Failed to select skin", err);
      });
      return;
    }

    // Otherwise treat as a lightweight theme preset
    try {
      applyThemeById(id);
    } catch (err) {
      console.error("Failed to apply theme preset", err);
    }
  }

  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 14 }}>Theme</span>
      <select value={value} onChange={onChange} aria-label="Select theme" disabled={!isHydrated}>
        <optgroup label="Skins">
          {availableSkins.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Simple themes">
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
