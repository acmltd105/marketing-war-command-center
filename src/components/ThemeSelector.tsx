import React, { useMemo, useState, useEffect } from "react";
import { useSkin } from "@/hooks/useSkin";

/**
 * ThemeSelector — thin wrapper to expose available skins as a simple <select>.
 * This reuses the existing `useSkin` contract so selection is persisted locally
 * and synced remotely via the existing preference pipeline.
 */
export default function ThemeSelector() {
  const { availableSkins, currentSkinId, selectSkin, isHydrated } = useSkin();

  // Keep a small selection value so the select can show the current skin id
  const [value, setValue] = useState<string>(currentSkinId);

  useEffect(() => setValue(currentSkinId), [currentSkinId]);

  const skinIds = useMemo(() => new Set(availableSkins.map((s) => s.id)), [availableSkins]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setValue(id);
    selectSkin(id as any).catch((err) => console.error("Failed to select skin", err));
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
        {/* No separate presets — only canonical skins are selectable to avoid diverging behaviour */}
      </select>
    </label>
  );
}
