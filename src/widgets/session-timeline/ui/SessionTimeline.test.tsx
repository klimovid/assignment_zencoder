import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionTimeline } from "./SessionTimeline";
import type { Session } from "@entities/session/model/types";

const mockSession: Session = {
  id: "sess-1",
  taskId: "task-1",
  status: "completed",
  startedAt: "2024-01-15T10:00:00Z",
  completedAt: "2024-01-15T10:05:00Z",
  totalCost: 1.24,
  totalDuration: 300,
  steps: [
    {
      id: "s1",
      index: 0,
      type: "think",
      status: "success",
      startedAt: "2024-01-15T10:00:00Z",
      duration: 0.8,
      cost: 0.12,
      model: "claude-sonnet-4-5",
      tokensIn: 1200,
      tokensOut: 3400,
      promptSummary: "Analyze repository structure",
      responseSummary: "Found 3 files to modify",
    },
    {
      id: "s2",
      index: 1,
      type: "act",
      status: "success",
      startedAt: "2024-01-15T10:00:01Z",
      duration: 2.1,
      cost: 0.03,
      toolName: "file_edit",
      arguments: { path: "src/parser.ts" },
      resultSummary: "Modified parse function",
    },
    {
      id: "s3",
      index: 2,
      type: "observe",
      status: "success",
      startedAt: "2024-01-15T10:00:03Z",
      duration: 5.4,
      cost: 0.08,
      diffs: [
        {
          path: "src/parser.ts",
          hunks: [{ oldStart: 10, oldLines: 5, newStart: 10, newLines: 8, content: "@@ -10,5 +10,8 @@" }],
          additions: 8,
          deletions: 3,
        },
      ],
      testOutput: "24/24 passed",
      ciResult: { passed: true, summary: "All tests passed" },
    },
  ],
};

describe("SessionTimeline", () => {
  it("renders all steps", () => {
    render(<SessionTimeline session={mockSession} />);
    expect(screen.getByRole("list", { name: "Session timeline" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows step type labels", () => {
    render(<SessionTimeline session={mockSession} />);
    expect(screen.getByText("think")).toBeInTheDocument();
    expect(screen.getByText("act")).toBeInTheDocument();
    expect(screen.getByText("observe")).toBeInTheDocument();
  });

  it("shows step duration and cost", () => {
    render(<SessionTimeline session={mockSession} />);
    expect(screen.getByText("800ms")).toBeInTheDocument();
    expect(screen.getByText("$0.120")).toBeInTheDocument();
  });

  it("expands step detail on click", async () => {
    render(<SessionTimeline session={mockSession} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Step 1: think" }));
    expect(screen.getByText("claude-sonnet-4-5", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Analyze repository structure")).toBeInTheDocument();
  });

  it("collapses step on second click", async () => {
    render(<SessionTimeline session={mockSession} />);
    const user = userEvent.setup();

    const btn = screen.getByRole("button", { name: "Step 1: think" });
    await user.click(btn);
    expect(screen.getByText("Analyze repository structure")).toBeInTheDocument();

    await user.click(btn);
    expect(screen.queryByText("Analyze repository structure")).not.toBeInTheDocument();
  });

  it("shows act step details", async () => {
    render(<SessionTimeline session={mockSession} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Step 2: act" }));
    expect(screen.getByText("file_edit")).toBeInTheDocument();
    expect(screen.getByText("Modified parse function")).toBeInTheDocument();
  });

  it("shows observe step details with diff summary", async () => {
    render(<SessionTimeline session={mockSession} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Step 3: observe" }));
    expect(screen.getByText("src/parser.ts")).toBeInTheDocument();
    expect(screen.getByText(/All tests passed/)).toBeInTheDocument();
  });

  it("auto-expands step when activeStep is set", () => {
    render(<SessionTimeline session={mockSession} activeStep={1} />);
    expect(screen.getByText("file_edit")).toBeInTheDocument();
  });

  it("shows error indicator for failed steps", () => {
    const errorSession: Session = {
      ...mockSession,
      steps: [
        {
          ...mockSession.steps[0]!,
          status: "error" as const,
        },
      ],
    };
    render(<SessionTimeline session={errorSession} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
