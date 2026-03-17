"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@shared/ui/button";
import { GitCompareArrows } from "lucide-react";
import { useFilterStore } from "../model/FilterContext";

export const PeriodComparisonToggle = observer(
  function PeriodComparisonToggle() {
    const filter = useFilterStore();

    return (
      <Button
        variant={filter.comparison ? "default" : "outline"}
        size="sm"
        onClick={() => filter.setFilter("comparison", !filter.comparison)}
        aria-pressed={filter.comparison}
        aria-label="Compare with previous period"
      >
        <GitCompareArrows className="mr-1 size-3.5" />
        Compare
      </Button>
    );
  },
);
