"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { CostResponseSchema } from "./schemas";

export function useCost(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.cost(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/cost", CostResponseSchema),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
