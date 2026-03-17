"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@shared/ui/button";
import { useFilterStore } from "../model/FilterContext";

const presets = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
] as const;

export const DateRangePicker = observer(function DateRangePicker() {
  const filter = useFilterStore();

  return (
    <div role="group" aria-label="Date range" className="flex gap-1">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={filter.timeRange === preset.value ? "default" : "outline"}
          size="sm"
          onClick={() => filter.setFilter("timeRange", preset.value)}
          aria-pressed={filter.timeRange === preset.value}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
});
