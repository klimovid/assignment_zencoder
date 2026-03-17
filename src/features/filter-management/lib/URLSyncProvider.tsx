"use client";

import { useEffect, useRef } from "react";
import { reaction } from "mobx";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "../model/FilterContext";
import type { TaskType, Granularity } from "../model/FilterStore";

const VALID_TASK_TYPES = new Set<string>(["bugfix", "feature", "refactor", "test", "ops"]);
const VALID_GRANULARITIES = new Set<string>(["hourly", "daily", "weekly", "monthly"]);

export function URLSyncProvider({ children }: { children: React.ReactNode }) {
  const filter = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipSync = useRef(false);

  // URL → FilterStore (on mount + searchParams change)
  useEffect(() => {
    skipSync.current = true;

    const timeRange = searchParams.get("time_range");
    if (timeRange) filter.setFilter("timeRange", timeRange);

    const teams = searchParams.getAll("team_id");
    if (teams.length) filter.setFilter("teamIds", teams);

    const repos = searchParams.getAll("repo_id");
    if (repos.length) filter.setFilter("repoIds", repos);

    const model = searchParams.get("model");
    if (model) filter.setFilter("model", model);

    const taskType = searchParams.get("task_type");
    if (taskType && VALID_TASK_TYPES.has(taskType)) {
      filter.setFilter("taskType", taskType as TaskType);
    }

    const language = searchParams.get("language");
    if (language) filter.setFilter("language", language);

    const granularity = searchParams.get("granularity");
    if (granularity && VALID_GRANULARITIES.has(granularity)) {
      filter.setFilter("granularity", granularity as Granularity);
    }

    const comparison = searchParams.get("comparison");
    if (comparison === "true") filter.setFilter("comparison", true);

    skipSync.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FilterStore → URL (on change)
  useEffect(() => {
    const dispose = reaction(
      () => filter.serialized,
      (filters) => {
        if (skipSync.current) return;

        const params = new URLSearchParams();
        if (filters.timeRange !== "30d") params.set("time_range", filters.timeRange);
        filters.teamIds.forEach((id) => params.append("team_id", id));
        filters.repoIds.forEach((id) => params.append("repo_id", id));
        if (filters.model) params.set("model", filters.model);
        if (filters.taskType) params.set("task_type", filters.taskType);
        if (filters.language) params.set("language", filters.language);
        if (filters.granularity !== "daily") params.set("granularity", filters.granularity);
        if (filters.comparison) params.set("comparison", "true");

        const qs = params.toString();
        router.replace(qs ? `?${qs}` : "?", { scroll: false });
      },
    );
    return dispose;
  }, [filter, router]);

  return <>{children}</>;
}
