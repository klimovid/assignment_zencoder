"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@shared/api/client";
import { UserProfileSchema } from "../model/types";
import { queryKeys } from "@shared/api/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () =>
      apiFetch("/v1/user/profile", UserProfileSchema, {
        baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/mock",
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
