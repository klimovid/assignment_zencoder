"use client";

import { FileQuestion, RotateCcw } from "lucide-react";
import { Button } from "@shared/ui/button";

interface EmptyStateProps {
  variant: "no-data" | "onboarding";
  onReset?: () => void;
}

export function EmptyState({ variant, onReset }: EmptyStateProps) {
  if (variant === "onboarding") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <FileQuestion className="size-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Get Started</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Connect a repository, run your first agent task, then come back to view analytics.
        </p>
        <ol className="mt-2 space-y-1 text-left text-sm text-muted-foreground">
          <li>1. Connect a code repository</li>
          <li>2. Run an agent task</li>
          <li>3. View analytics here</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h2 className="text-lg font-semibold">No data found</h2>
      <p className="text-sm text-muted-foreground">
        No data matches the current filters. Try adjusting your selection.
      </p>
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="mr-1.5 size-3.5" />
          Reset filters
        </Button>
      )}
    </div>
  );
}
