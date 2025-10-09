import presets, { ThemePreset } from "./presets";

const STORAGE_KEY = "app.theme";

function getPresetById(id: string): ThemePreset | undefined {
  return presets.find((p) => p.id === id);
}

function removeAllThemeClasses(root: Element) {
  for (const preset of presets) {
    root.classList.remove(preset.className);
  }
}

export function applyTheme(preset: ThemePreset | undefined) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  removeAllThemeClasses(root);

  if (!preset) return;

  root.classList.add(preset.className);

  if (preset.properties) {
    for (const [key, value] of Object.entries(preset.properties)) {
      root.style.setProperty(key, value);
    }
  }
}

export function applyThemeById(id: string) {
  const preset = getPresetById(id);
  applyTheme(preset);
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  } catch {
    // ignore storage errors
  }
}

export function applyPersistedTheme(): ThemePreset | undefined {
  try {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const id = window.localStorage.getItem(STORAGE_KEY) ?? undefined;
    const preset = id ? getPresetById(id) : undefined;
    applyTheme(preset ?? presets[0]);
    return preset ?? presets[0];
  } catch {
    // ignore and return default
    applyTheme(presets[0]);
    return presets[0];
  }
}
