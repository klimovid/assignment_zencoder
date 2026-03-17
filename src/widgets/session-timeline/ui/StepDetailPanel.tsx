import type { ThinkStep, ActStep, ObserveStep } from "@entities/session/model/types";

interface StepDetailPanelProps {
  step: ThinkStep | ActStep | ObserveStep;
}

export function StepDetailPanel({ step }: StepDetailPanelProps) {
  switch (step.type) {
    case "think":
      return <ThinkDetail step={step} />;
    case "act":
      return <ActDetail step={step} />;
    case "observe":
      return <ObserveDetail step={step} />;
  }
}

function ThinkDetail({ step }: { step: ThinkStep }) {
  return (
    <div className="space-y-2 pl-6 text-sm">
      <div className="flex gap-4 text-muted-foreground">
        <span>Model: {step.model}</span>
        <span>
          {step.tokensIn.toLocaleString()} → {step.tokensOut.toLocaleString()} tokens
        </span>
      </div>
      <div>
        <p className="font-medium">Prompt</p>
        <p className="text-muted-foreground">{step.promptSummary}</p>
      </div>
      <div>
        <p className="font-medium">Response</p>
        <p className="text-muted-foreground">{step.responseSummary}</p>
      </div>
      {step.reasoningExcerpt && (
        <div>
          <p className="font-medium">Reasoning</p>
          <p className="text-muted-foreground italic">{step.reasoningExcerpt}</p>
        </div>
      )}
    </div>
  );
}

function ActDetail({ step }: { step: ActStep }) {
  return (
    <div className="space-y-2 pl-6 text-sm">
      <div className="text-muted-foreground">
        Tool: <span className="font-mono">{step.toolName}</span>
      </div>
      <div>
        <p className="font-medium">Arguments</p>
        <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">
          {JSON.stringify(step.arguments, null, 2)}
        </pre>
      </div>
      <div>
        <p className="font-medium">Result</p>
        <p className="text-muted-foreground">{step.resultSummary}</p>
      </div>
    </div>
  );
}

function ObserveDetail({ step }: { step: ObserveStep }) {
  const totalAdditions = step.diffs.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = step.diffs.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="space-y-2 pl-6 text-sm">
      {step.diffs.length > 0 && (
        <div>
          <p className="font-medium">
            {step.diffs.length} file{step.diffs.length !== 1 ? "s" : ""} changed
            <span className="ml-2 text-green-600">+{totalAdditions}</span>
            <span className="ml-1 text-red-600">-{totalDeletions}</span>
          </p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            {step.diffs.map((f) => (
              <li key={f.path} className="font-mono text-xs">
                {f.path}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.testOutput && (
        <div>
          <p className="font-medium">Test Output</p>
          <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">
            {step.testOutput}
          </pre>
        </div>
      )}

      {step.ciResult && (
        <div>
          <p className="font-medium">
            CI: {step.ciResult.passed ? "✓ Passed" : "✗ Failed"}
          </p>
          <p className="text-muted-foreground">{step.ciResult.summary}</p>
        </div>
      )}
    </div>
  );
}
