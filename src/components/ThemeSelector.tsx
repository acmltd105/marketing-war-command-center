import React, { useEffect, useState } from "react";
import presets from "@/themes/presets";
import { applyThemeById, applyPersistedTheme } from "@/themes/applyTheme";

/**
 * Simple dropdown to select theme.
 * - Applies selected theme and persists choice.
 * - Reads initial selection from localStorage.
 */
export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    try {
      const applied = applyPersistedTheme();
      return applied?.id ?? presets[0].id;
    } catch {
      return presets[0].id;
    }
  });

  useEffect(() => {
    // Ensure theme is applied on mount (client-side)
    applyThemeById(currentTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    applyThemeById(id);
    setCurrentTheme(id);
  }

  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 14 }}>Theme</span>
      <select value={currentTheme} onChange={onChange} aria-label="Select theme">
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
