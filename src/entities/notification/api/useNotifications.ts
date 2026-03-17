"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { NotificationListResponseSchema } from "../model/types";
import { queryKeys } from "@shared/api/query-keys";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () =>
      apiFetch("/v1/notifications", NotificationListResponseSchema, {
        baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/mock",
      }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
