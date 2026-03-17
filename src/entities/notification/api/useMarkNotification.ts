"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { NotificationPatchResponseSchema } from "../model/types";
import { queryKeys } from "@shared/api/query-keys";

interface MarkNotificationParams {
  id: string;
  read?: boolean;
  acknowledged?: boolean;
}

export function useMarkNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: MarkNotificationParams) =>
      apiFetch(`/v1/notifications/${id}`, NotificationPatchResponseSchema, {
        baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/mock",
        method: "PATCH",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });
    },
  });
}
