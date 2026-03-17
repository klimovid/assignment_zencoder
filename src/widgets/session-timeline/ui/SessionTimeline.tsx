"use client";

import { useState } from "react";
import { Brain, Wrench, Eye, AlertCircle } from "lucide-react";
import { cn } from "@shared/lib/utils";
import type { Session, SessionStep } from "@entities/session/model/types";
import { StepDetailPanel } from "./StepDetailPanel";

interface SessionTimelineProps {
  session: Session;
  activeStep?: number;
}

const stepConfig = {
  think: { icon: Brain, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  act: { icon: Wrench, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  observe: { icon: Eye, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
};

function formatDuration(seconds: number): string {
  return seconds < 1 ? `${(seconds * 1000).toFixed(0)}ms` : `${seconds.toFixed(1)}s`;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(3)}`;
}

export function SessionTimeline({ session, activeStep }: SessionTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    () => activeStep !== undefined ? new Set([activeStep]) : new Set(),
  );

  function toggleStep(index: number) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="space-y-0" role="list" aria-label="Session timeline">
      {session.steps.map((step, index) => (
        <TimelineStep
          key={step.id}
          step={step}
          index={index}
          isLast={index === session.steps.length - 1}
          expanded={expandedSteps.has(index)}
          onToggle={() => toggleStep(index)}
        />
      ))}
    </div>
  );
}

function TimelineStep({
  step,
  index,
  isLast,
  expanded,
  onToggle,
}: {
  step: SessionStep;
  index: number;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isError = step.status === "error";
  const config = isError
    ? { icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" }
    : stepConfig[step.type];
  const Icon = config.icon;

  return (
    <div role="listitem" className="relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-0 w-px bg-border" aria-hidden="true" />
      )}

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`Step ${index + 1}: ${step.type}`}
        className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
      >
        <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", config.bg)}>
          <Icon className={cn("size-3.5", config.color)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize">{step.type}</span>
            <span className="text-xs text-muted-foreground">Step {index + 1}</span>
            {isError && (
              <span className="text-xs font-medium text-destructive">Error</span>
            )}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{formatDuration(step.duration)}</span>
            <span>{formatCost(step.cost)}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="pb-3">
          <StepDetailPanel step={step} />
        </div>
      )}
    </div>
  );
}
