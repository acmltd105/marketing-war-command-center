export type SkinDefinition = {
  id: string;
  name: string;
  description: string;
  cssVars: Record<string, string>;
  previewColors: readonly string[];
  heroGradient: string;
  headline: string;
};

 codex/add-skin-selector-for-color-theme-on40yv
const liquidGlassTokens: Record<string, string> = {
  background: "210 40% 98%",
  foreground: "215 32% 14%",
  card: "0 0% 100%",
  "card-foreground": "215 32% 14%",
  popover: "0 0% 100%",
  "popover-foreground": "215 32% 14%",
  primary: "213 90% 56%",
  "primary-foreground": "0 0% 100%",
  secondary: "152 76% 45%",
  "secondary-foreground": "0 0% 100%",
  muted: "210 16% 92%",
  "muted-foreground": "215 20% 36%",
  accent: "189 70% 62%",
  "accent-foreground": "0 0% 100%",
  destructive: "0 72% 56%",
  "destructive-foreground": "0 0% 100%",
  border: "210 24% 88%",
  input: "210 24% 88%",
  ring: "213 90% 56%",
  radius: "0.95rem",
  "sidebar-background": "210 40% 98%",
  "sidebar-foreground": "215 34% 16%",
  "sidebar-primary": "213 90% 56%",
  "sidebar-primary-foreground": "0 0% 100%",
  "sidebar-accent": "189 70% 62%",
  "sidebar-accent-foreground": "210 40% 15%",
  "sidebar-border": "210 24% 88%",
  "sidebar-ring": "213 90% 56%",
  "glass-base": "210 45% 99%",
  "glass-highlight": "0 0% 100%",
  "glass-border": "208 28% 82%",
  "glass-shadow": "213 46% 52%",
  "corporate-blue": "213 90% 56%",
  "corporate-navy": "226 40% 28%",
  "corporate-silver": "210 16% 80%",
  "corporate-platinum": "204 24% 92%",
  "corporate-gold": "44 84% 62%",
  "corporate-crimson": "0 78% 54%",
  "corporate-emerald": "152 76% 45%",
  "corporate-charcoal": "215 24% 28%",
  "revenue-green": "150 80% 40%",
  "conversion-orange": "28 94% 55%",
  "kpi-purple": "262 70% 58%",
  "warning-amber": "44 90% 58%",
};

main
const fortune100Tokens: Record<string, string> = {
  background: "218 23% 4%",
  foreground: "210 40% 95%",
  card: "218 23% 6%",
  "card-foreground": "210 40% 95%",
  popover: "218 23% 6%",
  "popover-foreground": "210 40% 95%",
  primary: "212 100% 45%",
  "primary-foreground": "218 23% 4%",
  secondary: "218 23% 8%",
  "secondary-foreground": "210 40% 95%",
  muted: "218 23% 10%",
  "muted-foreground": "210 20% 65%",
  accent: "14 90% 55%",
  "accent-foreground": "218 23% 4%",
  destructive: "0 75% 60%",
  "destructive-foreground": "210 40% 98%",
  border: "218 23% 12%",
  input: "218 23% 8%",
  ring: "212 100% 45%",
  radius: "0.25rem",
  "sidebar-background": "218 23% 3%",
  "sidebar-foreground": "210 40% 95%",
  "sidebar-primary": "212 100% 45%",
  "sidebar-primary-foreground": "218 23% 4%",
  "sidebar-accent": "218 23% 7%",
  "sidebar-accent-foreground": "210 40% 95%",
  "sidebar-border": "218 23% 10%",
  "sidebar-ring": "212 100% 45%",
 codex/add-skin-selector-for-color-theme-on40yv
	
  "glass-base": "218 28% 10%",
  "glass-highlight": "210 40% 88%",
  "glass-border": "218 24% 18%",
  "glass-shadow": "212 90% 32%",
main
  "corporate-blue": "212 100% 45%",
  "corporate-navy": "218 50% 20%",
  "corporate-silver": "210 15% 75%",
  "corporate-platinum": "210 10% 85%",
  "corporate-gold": "43 74% 66%",
  "corporate-crimson": "355 85% 55%",
  "corporate-emerald": "160 84% 39%",
  "corporate-charcoal": "218 23% 15%",
  "revenue-green": "142 71% 45%",
  "conversion-orange": "25 95% 53%",
  "kpi-purple": "262 83% 58%",
  "warning-amber": "45 93% 47%",
};

const auroraGlassTokens: Record<string, string> = {
  background: "223 54% 6%",
  foreground: "197 56% 96%",
  card: "222 48% 12%",
  "card-foreground": "197 56% 96%",
  popover: "222 48% 10%",
  "popover-foreground": "197 56% 96%",
  primary: "195 86% 62%",
  "primary-foreground": "218 45% 10%",
  secondary: "225 36% 18%",
  "secondary-foreground": "197 56% 96%",
  muted: "225 34% 22%",
  "muted-foreground": "197 40% 78%",
  accent: "282 78% 68%",
  "accent-foreground": "222 55% 12%",
  destructive: "356 82% 62%",
  "destructive-foreground": "197 56% 96%",
  border: "224 36% 26%",
  input: "224 36% 20%",
  ring: "195 86% 62%",
  radius: "0.65rem",
  "sidebar-background": "225 48% 8%",
  "sidebar-foreground": "197 56% 96%",
  "sidebar-primary": "195 86% 62%",
  "sidebar-primary-foreground": "220 54% 12%",
  "sidebar-accent": "282 70% 30%",
  "sidebar-accent-foreground": "198 48% 92%",
  "sidebar-border": "225 36% 26%",
  "sidebar-ring": "195 86% 62%",
 codex/add-skin-selector-for-color-theme-on40yv

  "glass-base": "223 52% 16%",
  "glass-highlight": "197 56% 94%",
  "glass-border": "223 40% 28%",
  "glass-shadow": "195 70% 48%",
main
  "corporate-blue": "195 86% 62%",
  "corporate-navy": "224 60% 18%",
  "corporate-silver": "197 28% 74%",
  "corporate-platinum": "197 32% 85%",
  "corporate-gold": "45 92% 72%",
  "corporate-crimson": "351 82% 62%",
  "corporate-emerald": "154 72% 50%",
  "corporate-charcoal": "225 40% 22%",
  "revenue-green": "152 72% 48%",
  "conversion-orange": "32 88% 58%",
  "kpi-purple": "275 78% 68%",
  "warning-amber": "45 94% 56%",
};

const emberVanguardTokens: Record<string, string> = {
  background: "24 42% 6%",
  foreground: "32 40% 94%",
  card: "24 45% 12%",
  "card-foreground": "32 40% 94%",
  popover: "24 45% 10%",
  "popover-foreground": "32 40% 94%",
  primary: "16 92% 58%",
  "primary-foreground": "28 36% 8%",
  secondary: "32 32% 20%",
  "secondary-foreground": "32 40% 94%",
  muted: "32 28% 24%",
  "muted-foreground": "28 24% 74%",
  accent: "347 74% 62%",
  "accent-foreground": "28 36% 8%",
  destructive: "2 82% 60%",
  "destructive-foreground": "28 36% 96%",
  border: "28 32% 26%",
  input: "28 32% 22%",
  ring: "16 92% 58%",
  radius: "0.4rem",
  "sidebar-background": "24 42% 9%",
  "sidebar-foreground": "32 40% 94%",
  "sidebar-primary": "16 92% 58%",
  "sidebar-primary-foreground": "28 36% 8%",
  "sidebar-accent": "347 74% 28%",
  "sidebar-accent-foreground": "28 36% 94%",
  "sidebar-border": "28 32% 26%",
  "sidebar-ring": "16 92% 58%",
codex/add-skin-selector-for-color-theme-on40yv

  "glass-base": "24 38% 12%",
  "glass-highlight": "32 40% 92%",
  "glass-border": "26 34% 24%",
  "glass-shadow": "16 88% 42%",
main
  "corporate-blue": "205 82% 54%",
  "corporate-navy": "220 50% 20%",
  "corporate-silver": "35 24% 70%",
  "corporate-platinum": "35 22% 82%",
  "corporate-gold": "42 86% 62%",
  "corporate-crimson": "2 82% 60%",
  "corporate-emerald": "145 65% 48%",
  "corporate-charcoal": "24 32% 18%",
  "revenue-green": "142 64% 46%",
  "conversion-orange": "28 92% 58%",
  "kpi-purple": "285 70% 62%",
  "warning-amber": "40 92% 58%",
};

const SKIN_DEFINITIONS = [
  {
 codex/add-skin-selector-for-color-theme-on40yv
 id: "liquid-glass-pro",
    name: "Liquid Glass PRO",
    description: "Crisp white glass with executive neon accents.",
    cssVars: liquidGlassTokens,
    previewColors: [
      "hsl(213 90% 56%)",
      "hsl(152 76% 45%)",
      "hsl(0 72% 56%)",
    ],
    heroGradient:
      "linear-gradient(135deg, hsla(213,90%,56%,0.18) 0%, hsla(152,76%,45%,0.12) 45%, hsla(0,0%,100%,0.8) 100%)",
    headline: "Liquid glass control",
  },
  {
 main
    id: "fortune-100",
    name: "Fortune 100 Steel",
    description: "Executive navy glass with electric revenue pulses.",
    cssVars: fortune100Tokens,
    previewColors: [
      "hsl(212 100% 45%)",
      "hsl(210 10% 85%)",
      "hsl(355 85% 55%)",
    ],
    heroGradient:
      "linear-gradient(135deg, hsla(212,100%,45%,0.8) 0%, hsla(218,50%,20%,0.9) 50%, hsla(210,10%,85%,0.35) 100%)",
    headline: "Fortune 100 ready",
  },
  {
    id: "aurora-glass",
    name: "Aurora Glass",
    description: "Polar neon glass for data-native operators.",
    cssVars: auroraGlassTokens,
    previewColors: [
      "hsl(195 86% 62%)",
      "hsl(282 78% 68%)",
      "hsl(152 72% 48%)",
    ],
    heroGradient:
      "linear-gradient(135deg, hsla(195,86%,62%,0.8) 0%, hsla(282,78%,68%,0.7) 55%, hsla(197,56%,96%,0.35) 100%)",
    headline: "Neon telemetry",
  },
  {
    id: "ember-vanguard",
    name: "Ember Vanguard",
    description: "Sunset war room with molten KPI heat.",
    cssVars: emberVanguardTokens,
    previewColors: [
      "hsl(16 92% 58%)",
      "hsl(347 74% 62%)",
      "hsl(42 86% 62%)",
    ],
    heroGradient:
      "linear-gradient(135deg, hsla(16,92%,58%,0.85) 0%, hsla(347,74%,62%,0.75) 50%, hsla(32,40%,94%,0.35) 100%)",
    headline: "Molten conversions",
  },
] as const satisfies readonly SkinDefinition[];

export type SkinId = (typeof SKIN_DEFINITIONS)[number]["id"];

const skinMap = new Map<SkinId, SkinDefinition>(
  SKIN_DEFINITIONS.map((definition) => [definition.id, definition]),
);

 codex/add-skin-selector-for-color-theme-on40yv
export const defaultSkinId: SkinId = "fortune-100";

export const defaultSkinId: SkinId = "liquid-glass-pro";
main

export function getAvailableSkins(): readonly SkinDefinition[] {
  return SKIN_DEFINITIONS;
}

export function getSkin(id: SkinId | string | null | undefined): SkinDefinition {
  if (!id) {
    return skinMap.get(defaultSkinId)!;
  }
  const skin = skinMap.get(id as SkinId);
  return skin ?? skinMap.get(defaultSkinId)!;
}

export function applySkin(target: HTMLElement, skin: SkinDefinition) {
  const resolved = getSkin(skin.id);
  const fallbackTokens = skinMap.get(defaultSkinId)!.cssVars;
  const tokens = { ...fallbackTokens, ...resolved.cssVars };

  Object.entries(tokens).forEach(([token, value]) => {
    target.style.setProperty(`--${token}`, value);
  });

  target.dataset.skin = resolved.id;
}

export function resolveSkinId(value: string | null | undefined): SkinId {
  const skin = getSkin(value as SkinId | undefined);
  return skin.id;
}
