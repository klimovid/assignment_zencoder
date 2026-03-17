"use client";

import dynamic from "next/dynamic";
import { Badge } from "@shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import type { Session } from "@entities/session/model/types";

const SessionTimeline = dynamic(
  () => import("@widgets/session-timeline/ui/SessionTimeline").then((m) => ({ default: m.SessionTimeline })),
  { loading: () => <Skeleton className="h-40 rounded-xl" /> },
);

const CostBreakdown = dynamic(
  () => import("@widgets/cost-breakdown/ui/CostBreakdown").then((m) => ({ default: m.CostBreakdown })),
  { loading: () => <Skeleton className="h-32 rounded-xl" /> },
);

interface SessionDeepDivePageProps {
  session: Session | null;
  loading?: boolean;
  activeStep?: number;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  completed: "default",
  running: "secondary",
  failed: "destructive",
};

export function SessionDeepDivePage({ session, loading = false, activeStep }: SessionDeepDivePageProps) {
  if (loading || !session) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Session Deep-Dive</h1>
        <p className="text-muted-foreground">Loading session data...</p>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const costSteps = session.steps.map((step, i) => ({
    stepIndex: i,
    stepType: step.type,
    llmCost: step.type === "think" ? step.cost : 0,
    computeCost: step.type !== "think" ? step.cost : 0,
    totalCost: step.cost,
  }));

  const totalLLMCost = costSteps.reduce((s, c) => s + c.llmCost, 0);
  const totalComputeCost = costSteps.reduce((s, c) => s + c.computeCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Session Deep-Dive</h1>
        <Badge variant={statusVariant[session.status] ?? "default"}>
          {session.status}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Cost: </span>
          <span className="font-bold">${session.totalCost.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Duration: </span>
          <span className="font-bold">{(session.totalDuration / 1000).toFixed(1)}s</span>
        </div>
        <div>
          <span className="text-muted-foreground">Steps: </span>
          <span className="font-bold">{session.steps.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTimeline session={session} activeStep={activeStep} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <CostBreakdown
                steps={costSteps}
                totalLLMCost={totalLLMCost}
                totalComputeCost={totalComputeCost}
                totalSessionCost={session.totalCost}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
