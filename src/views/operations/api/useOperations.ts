"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { OperationsResponseSchema } from "./schemas";

export function useOperations(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.operations(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/operations", OperationsResponseSchema),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60_000,
  });
}
