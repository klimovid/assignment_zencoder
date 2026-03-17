"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { AdoptionResponseSchema } from "./schemas";

export function useAdoption(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.adoption(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/adoption", AdoptionResponseSchema),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
