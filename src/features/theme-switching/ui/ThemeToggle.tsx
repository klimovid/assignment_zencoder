"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useTheme } from "./ThemeProvider";

const themeOrder = ["light", "dark", "system"] as const;

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels = {
  light: "Switch to dark mode",
  dark: "Switch to system mode",
  system: "Switch to light mode",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const idx = themeOrder.indexOf(theme);
  const nextTheme = themeOrder[(idx + 1) % themeOrder.length] ?? "system";
  const Icon = themeIcons[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label={themeLabels[theme]}
    >
      <Icon className="size-4" />
    </Button>
  );
}
