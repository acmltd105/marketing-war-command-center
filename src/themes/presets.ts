export type ThemePreset = {
  id: string;
  name: string;
  /** CSS class applied to documentElement when this theme is active */
  className: string;
  /** Optional CSS custom properties to apply when this theme is active */
  properties?: Record<string, string>;
};

// Minimal theme presets. Add or extend with real palettes or variable sets as needed.
const presets: ThemePreset[] = [
  {
    id: "light",
    name: "Light",
    className: "theme-light",
    properties: {
      // Example: '--bg': '#fff'
    },
  },
  {
    id: "dark",
    name: "Dark",
    className: "theme-dark",
    properties: {
      // Example: '--bg': '#0b0b0b'
    },
  },
  {
    id: "high-contrast",
    name: "High contrast",
    className: "theme-high-contrast",
    properties: {
      // Example high contrast variables
    },
  },
];

export default presets;
