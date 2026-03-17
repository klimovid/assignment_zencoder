import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@shared/lib/utils";

export interface DeltaIndicatorProps {
  value: number;
  direction: "up" | "down" | "neutral";
  invertColor?: boolean;
}

const icons = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

export function DeltaIndicator({
  value,
  direction,
  invertColor = false,
}: DeltaIndicatorProps) {
  const Icon = icons[direction];

  const isPositive =
    direction === "neutral"
      ? null
      : invertColor
        ? direction === "down"
        : direction === "up";

  const colorClass =
    isPositive === null
      ? "text-muted-foreground"
      : isPositive
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400";

  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
  const label = `${sign}${Math.abs(value).toFixed(1)}% ${direction === "up" ? "increase" : direction === "down" ? "decrease" : "no change"}`;

  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-xs font-medium", colorClass)}
      aria-label={label}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
