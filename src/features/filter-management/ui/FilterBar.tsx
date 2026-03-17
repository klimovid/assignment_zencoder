"use client";

import { observer } from "mobx-react-lite";
import { X } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useFilterStore } from "../model/FilterContext";

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export const FilterBar = observer(function FilterBar() {
  const filter = useFilterStore();

  if (!filter.hasActiveFilters) return null;

  const chips: FilterChip[] = [];

  filter.teamIds.forEach((id) => {
    chips.push({
      key: `team-${id}`,
      label: `Team: ${id}`,
      onRemove: () =>
        filter.setFilter(
          "teamIds",
          filter.teamIds.filter((t) => t !== id),
        ),
    });
  });

  filter.repoIds.forEach((id) => {
    chips.push({
      key: `repo-${id}`,
      label: `Repo: ${id}`,
      onRemove: () =>
        filter.setFilter(
          "repoIds",
          filter.repoIds.filter((r) => r !== id),
        ),
    });
  });

  if (filter.model) {
    chips.push({
      key: "model",
      label: `Model: ${filter.model}`,
      onRemove: () => filter.setFilter("model", null),
    });
  }

  if (filter.taskType) {
    chips.push({
      key: "taskType",
      label: `Type: ${filter.taskType}`,
      onRemove: () => filter.setFilter("taskType", null),
    });
  }

  if (filter.language) {
    chips.push({
      key: "language",
      label: `Lang: ${filter.language}`,
      onRemove: () => filter.setFilter("language", null),
    });
  }

  return (
    <div role="list" aria-label="Active filters" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          role="listitem"
          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label}`}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => filter.resetFilters()}
        className="text-xs"
      >
        Clear all
      </Button>
    </div>
  );
});
