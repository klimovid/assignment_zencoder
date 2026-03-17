"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@entities/session/api/useSession";
import { SessionDeepDivePage } from "@pages/session-deep-dive/ui/SessionDeepDivePage";

export default function SessionRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const searchParams = useSearchParams();
  const activeStep = searchParams.get("step") ? Number(searchParams.get("step")) : undefined;
  const { data, isLoading } = useSession(sessionId);

  return (
    <SessionDeepDivePage
      session={data?.data ?? null}
      loading={isLoading}
      activeStep={activeStep}
    />
  );
}
