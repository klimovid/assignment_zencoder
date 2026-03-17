"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { QualityResponseSchema } from "./schemas";

export function useQuality(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.quality(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/quality", QualityResponseSchema),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
