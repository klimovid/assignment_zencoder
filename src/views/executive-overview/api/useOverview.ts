"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { OverviewResponseSchema } from "./schemas";

export function useOverview(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/overview", OverviewResponseSchema),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
