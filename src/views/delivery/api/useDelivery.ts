"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { queryKeys } from "@shared/api/query-keys";
import { DeliveryResponseSchema } from "./schemas";

export function useDelivery(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.analytics.delivery(filters),
    queryFn: () =>
      apiFetch("/v1/analytics/delivery", DeliveryResponseSchema),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
