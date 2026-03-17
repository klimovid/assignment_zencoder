"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiFetch } from "@shared/api/client";
import { SessionSchema } from "../model/types";
import { queryKeys } from "@shared/api/query-keys";

const SessionResponseSchema = z.object({
  data: SessionSchema,
});

export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.analytics.session(sessionId ?? ""),
    queryFn: () =>
      apiFetch(`/v1/analytics/sessions/${sessionId}`, SessionResponseSchema, {
        baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/mock",
      }),
    enabled: !!sessionId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
