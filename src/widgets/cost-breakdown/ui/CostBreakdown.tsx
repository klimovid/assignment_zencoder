"use client";

import { cn } from "@shared/lib/utils";

interface CostStep {
  stepIndex: number;
  stepType: "think" | "act" | "observe";
  llmCost: number;
  computeCost: number;
  totalCost: number;
}

interface CostBreakdownProps {
  steps: CostStep[];
  totalLLMCost: number;
  totalComputeCost: number;
  totalSessionCost: number;
}

const typeColors = {
  think: "bg-blue-500",
  act: "bg-green-500",
  observe: "bg-amber-500",
};

export function CostBreakdown({
  steps,
  totalLLMCost,
  totalComputeCost,
  totalSessionCost,
}: CostBreakdownProps) {
  const maxCost = Math.max(...steps.map((s) => s.totalCost), 0.001);

  return (
    <div className="space-y-4">
      {/* Total summary */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold" data-testid="total-cost">
            ${totalSessionCost.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">LLM: </span>
          <span data-testid="llm-cost">${totalLLMCost.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Compute: </span>
          <span data-testid="compute-cost">${totalComputeCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Stacked bar */}
      {totalSessionCost > 0 && (
        <div
          className="flex h-6 overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`Cost breakdown: LLM $${totalLLMCost.toFixed(2)}, Compute $${totalComputeCost.toFixed(2)}`}
        >
          <div
            className="bg-blue-500 transition-all"
            style={{ width: `${(totalLLMCost / totalSessionCost) * 100}%` }}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${(totalComputeCost / totalSessionCost) * 100}%` }}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="size-2.5 rounded-full bg-blue-500" />
          LLM
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2.5 rounded-full bg-amber-500" />
          Compute
        </div>
      </div>

      {/* Per-step breakdown */}
      <div className="space-y-2" role="list" aria-label="Cost per step">
        {steps.map((step) => (
          <div key={step.stepIndex} role="listitem" className="flex items-center gap-3 text-xs">
            <span className="w-16 shrink-0 capitalize text-muted-foreground">
              {step.stepType} #{step.stepIndex + 1}
            </span>
            <div className="flex-1">
              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("transition-all", typeColors[step.stepType])}
                  style={{ width: `${(step.totalCost / maxCost) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-14 text-right font-mono">${step.totalCost.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
