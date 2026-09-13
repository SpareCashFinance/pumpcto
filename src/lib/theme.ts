import type { CSSProperties } from "react";

/** Default pump.fun mint palette. Change this file for a new token theme. */
export const theme = {
  bg: "#050806",
  bg2: "#0a120e",
  bg3: "#121c16",
  accent: "#86efac",
  accent2: "#bbf7d0",
  accent3: "#4ade80",
  ink: "#f4fff8",
  cream: "#d8f5e4",
  dim: "#9bb5a6",
  stone: "#7d9488",
  inkOnAccent: "#052e16",
  line: "rgba(134, 239, 172, 0.16)",
} as const;

export const themeColor = theme.bg;

export function themeCssVars(): CSSProperties {
  return {
    "--navy": theme.bg,
    "--navy-2": theme.bg2,
    "--navy-3": theme.bg3,
    "--orange": theme.accent,
    "--orange-2": theme.accent2,
    "--cream": theme.cream,
    "--cream-2": theme.accent,
    "--stone": theme.stone,
    "--graphite": theme.bg3,
    "--gold": theme.accent,
    "--paper": "#e8fff2",
    "--ink": theme.ink,
    "--dim": theme.dim,
    "--muted": theme.bg3,
    "--line": theme.line,
    "--background": theme.bg,
    "--foreground": theme.ink,
    "--primary": theme.accent,
    "--primary-foreground": theme.inkOnAccent,
    "--accent": theme.accent,
    "--accent-foreground": theme.inkOnAccent,
    "--ring": theme.accent,
    "--chart-1": theme.accent,
    "--chart-2": theme.accent3,
    "--chart-3": theme.accent2,
  } as CSSProperties;
}
