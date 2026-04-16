export interface ThemePalette {
  id: string;
  name: string;
  emoji: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
    critical: string;
    criticalForeground: string;
    criticalGlow: string;
    criticalLight: string;
    flexible: string;
    flexibleForeground: string;
    flexibleGlow: string;
    flexibleLight: string;
    success: string;
    successForeground: string;
  };
}

export const themes: ThemePalette[] = [
  {
    id: "warm",
    name: "Cálido",
    emoji: "☀️",
    colors: {
      background: "30 25% 97%",
      foreground: "220 15% 15%",
      card: "0 0% 100%",
      cardForeground: "220 15% 15%",
      primary: "217 91% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "30 15% 93%",
      secondaryForeground: "220 15% 30%",
      muted: "30 10% 91%",
      mutedForeground: "220 8% 50%",
      accent: "217 91% 95%",
      accentForeground: "217 91% 50%",
      border: "30 12% 90%",
      input: "30 12% 90%",
      ring: "217 91% 50%",
      critical: "0 75% 50%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "0 75% 50%",
      criticalLight: "0 75% 96%",
      flexible: "217 91% 50%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "217 91% 50%",
      flexibleLight: "217 91% 96%",
      success: "152 55% 48%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "ocean",
    name: "Océano",
    emoji: "🌊",
    colors: {
      background: "200 30% 96%",
      foreground: "210 20% 12%",
      card: "200 20% 100%",
      cardForeground: "210 20% 12%",
      primary: "199 89% 48%",
      primaryForeground: "0 0% 100%",
      secondary: "200 20% 92%",
      secondaryForeground: "210 15% 30%",
      muted: "200 15% 90%",
      mutedForeground: "210 10% 48%",
      accent: "199 89% 94%",
      accentForeground: "199 89% 48%",
      border: "200 18% 88%",
      input: "200 18% 88%",
      ring: "199 89% 48%",
      critical: "350 80% 52%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "350 80% 52%",
      criticalLight: "350 80% 96%",
      flexible: "199 89% 48%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "199 89% 48%",
      flexibleLight: "199 89% 95%",
      success: "162 60% 45%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "forest",
    name: "Bosque",
    emoji: "🌿",
    colors: {
      background: "140 20% 96%",
      foreground: "150 15% 12%",
      card: "140 15% 100%",
      cardForeground: "150 15% 12%",
      primary: "152 60% 42%",
      primaryForeground: "0 0% 100%",
      secondary: "140 15% 92%",
      secondaryForeground: "150 12% 30%",
      muted: "140 12% 90%",
      mutedForeground: "150 8% 48%",
      accent: "152 60% 93%",
      accentForeground: "152 60% 42%",
      border: "140 14% 88%",
      input: "140 14% 88%",
      ring: "152 60% 42%",
      critical: "0 70% 52%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "0 70% 52%",
      criticalLight: "0 70% 96%",
      flexible: "152 60% 42%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "152 60% 42%",
      flexibleLight: "152 60% 94%",
      success: "120 50% 45%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "sunset",
    name: "Atardecer",
    emoji: "🌅",
    colors: {
      background: "25 30% 96%",
      foreground: "15 20% 14%",
      card: "25 25% 100%",
      cardForeground: "15 20% 14%",
      primary: "25 95% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "25 20% 92%",
      secondaryForeground: "15 15% 32%",
      muted: "25 15% 90%",
      mutedForeground: "15 10% 48%",
      accent: "25 95% 94%",
      accentForeground: "25 95% 55%",
      border: "25 18% 88%",
      input: "25 18% 88%",
      ring: "25 95% 55%",
      critical: "355 80% 50%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "355 80% 50%",
      criticalLight: "355 80% 96%",
      flexible: "25 95% 55%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "25 95% 55%",
      flexibleLight: "25 95% 94%",
      success: "152 55% 48%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "lavender",
    name: "Lavanda",
    emoji: "💜",
    colors: {
      background: "270 25% 97%",
      foreground: "260 15% 14%",
      card: "270 20% 100%",
      cardForeground: "260 15% 14%",
      primary: "262 80% 58%",
      primaryForeground: "0 0% 100%",
      secondary: "270 15% 93%",
      secondaryForeground: "260 12% 32%",
      muted: "270 12% 91%",
      mutedForeground: "260 8% 48%",
      accent: "262 80% 95%",
      accentForeground: "262 80% 58%",
      border: "270 14% 89%",
      input: "270 14% 89%",
      ring: "262 80% 58%",
      critical: "0 75% 52%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "0 75% 52%",
      criticalLight: "0 75% 96%",
      flexible: "262 80% 58%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "262 80% 58%",
      flexibleLight: "262 80% 95%",
      success: "152 55% 48%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "midnight",
    name: "Nocturno",
    emoji: "🌙",
    colors: {
      background: "225 25% 12%",
      foreground: "210 20% 92%",
      card: "225 20% 16%",
      cardForeground: "210 20% 92%",
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      secondary: "225 15% 20%",
      secondaryForeground: "210 15% 75%",
      muted: "225 12% 22%",
      mutedForeground: "210 10% 55%",
      accent: "217 50% 22%",
      accentForeground: "217 91% 60%",
      border: "225 14% 22%",
      input: "225 14% 22%",
      ring: "217 91% 60%",
      critical: "0 75% 55%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "0 75% 55%",
      criticalLight: "0 40% 22%",
      flexible: "217 91% 60%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "217 91% 60%",
      flexibleLight: "217 50% 22%",
      success: "152 55% 48%",
      successForeground: "0 0% 100%",
    },
  },
  {
    id: "rose",
    name: "Rosado",
    emoji: "🌸",
    colors: {
      background: "340 25% 97%",
      foreground: "340 15% 14%",
      card: "340 20% 100%",
      cardForeground: "340 15% 14%",
      primary: "340 82% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "340 18% 93%",
      secondaryForeground: "340 12% 32%",
      muted: "340 14% 91%",
      mutedForeground: "340 8% 48%",
      accent: "340 82% 95%",
      accentForeground: "340 82% 55%",
      border: "340 16% 89%",
      input: "340 16% 89%",
      ring: "340 82% 55%",
      critical: "0 75% 52%",
      criticalForeground: "0 0% 100%",
      criticalGlow: "0 75% 52%",
      criticalLight: "0 75% 96%",
      flexible: "340 82% 55%",
      flexibleForeground: "0 0% 100%",
      flexibleGlow: "340 82% 55%",
      flexibleLight: "340 82% 95%",
      success: "152 55% 48%",
      successForeground: "0 0% 100%",
    },
  },
];

const THEME_KEY = "pulso-diario-theme";

export function loadTheme(): string {
  return localStorage.getItem(THEME_KEY) || "warm";
}

export function saveTheme(id: string): void {
  localStorage.setItem(THEME_KEY, id);
}

export function applyTheme(id: string): void {
  const theme = themes.find((t) => t.id === id) || themes[0];
  const root = document.documentElement;
  
  root.style.setProperty("--background", theme.colors.background);
  root.style.setProperty("--foreground", theme.colors.foreground);
  root.style.setProperty("--card", theme.colors.card);
  root.style.setProperty("--card-foreground", theme.colors.cardForeground);
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--primary-foreground", theme.colors.primaryForeground);
  root.style.setProperty("--secondary", theme.colors.secondary);
  root.style.setProperty("--secondary-foreground", theme.colors.secondaryForeground);
  root.style.setProperty("--muted", theme.colors.muted);
  root.style.setProperty("--muted-foreground", theme.colors.mutedForeground);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--accent-foreground", theme.colors.accentForeground);
  root.style.setProperty("--border", theme.colors.border);
  root.style.setProperty("--input", theme.colors.input);
  root.style.setProperty("--ring", theme.colors.ring);
  root.style.setProperty("--critical", theme.colors.critical);
  root.style.setProperty("--critical-foreground", theme.colors.criticalForeground);
  root.style.setProperty("--critical-glow", theme.colors.criticalGlow);
  root.style.setProperty("--critical-light", theme.colors.criticalLight);
  root.style.setProperty("--flexible", theme.colors.flexible);
  root.style.setProperty("--flexible-foreground", theme.colors.flexibleForeground);
  root.style.setProperty("--flexible-glow", theme.colors.flexibleGlow);
  root.style.setProperty("--flexible-light", theme.colors.flexibleLight);
  root.style.setProperty("--success", theme.colors.success);
  root.style.setProperty("--success-foreground", theme.colors.successForeground);
}
