/**
 * Design token reference for the dashboard theme.
 * In Tailwind v4, tokens are defined in globals.css via @theme.
 * This file provides programmatic access to token names for Recharts and other JS consumers.
 */

export const chartColors = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  5: "var(--chart-5)",
} as const;

export const semanticColors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  destructive: "var(--destructive)",
  border: "var(--border)",
  ring: "var(--ring)",
} as const;
