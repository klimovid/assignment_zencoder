"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { UserSettingsSchema } from "../model/types";
import { queryKeys } from "@shared/api/query-keys";

interface UpdateSettingsParams {
  theme?: "light" | "dark" | "system";
  timezone?: string;
  default_view?: string;
  default_date_range?: string;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateSettingsParams) =>
      apiFetch("/v1/user/settings", UserSettingsSchema, {
        baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/mock",
        method: "PATCH",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.settings(),
      });
    },
  });
}
