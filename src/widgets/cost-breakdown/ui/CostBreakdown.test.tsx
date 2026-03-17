import { render, screen } from "@testing-library/react";
import { CostBreakdown } from "./CostBreakdown";

const mockSteps = [
  { stepIndex: 0, stepType: "think" as const, llmCost: 0.12, computeCost: 0.01, totalCost: 0.13 },
  { stepIndex: 1, stepType: "act" as const, llmCost: 0.0, computeCost: 0.03, totalCost: 0.03 },
  { stepIndex: 2, stepType: "observe" as const, llmCost: 0.0, computeCost: 0.08, totalCost: 0.08 },
];

describe("CostBreakdown", () => {
  it("renders total session cost", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.12}
        totalComputeCost={0.12}
        totalSessionCost={0.24}
      />,
    );
    expect(screen.getByTestId("total-cost")).toHaveTextContent("$0.24");
  });

  it("renders LLM and compute totals", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.89}
        totalComputeCost={0.35}
        totalSessionCost={1.24}
      />,
    );
    expect(screen.getByTestId("llm-cost")).toHaveTextContent("$0.89");
    expect(screen.getByTestId("compute-cost")).toHaveTextContent("$0.35");
  });

  it("renders per-step breakdown", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.12}
        totalComputeCost={0.12}
        totalSessionCost={0.24}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByText("$0.130")).toBeInTheDocument();
    expect(screen.getByText("$0.030")).toBeInTheDocument();
    expect(screen.getByText("$0.080")).toBeInTheDocument();
  });

  it("renders stacked bar with aria-label", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.89}
        totalComputeCost={0.35}
        totalSessionCost={1.24}
      />,
    );
    expect(
      screen.getByRole("img", { name: /Cost breakdown: LLM \$0\.89, Compute \$0\.35/ }),
    ).toBeInTheDocument();
  });

  it("renders legend", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.12}
        totalComputeCost={0.12}
        totalSessionCost={0.24}
      />,
    );
    expect(screen.getByText("LLM")).toBeInTheDocument();
    expect(screen.getByText("Compute")).toBeInTheDocument();
  });

  it("renders step type labels", () => {
    render(
      <CostBreakdown
        steps={mockSteps}
        totalLLMCost={0.12}
        totalComputeCost={0.12}
        totalSessionCost={0.24}
      />,
    );
    expect(screen.getByText("think #1")).toBeInTheDocument();
    expect(screen.getByText("act #2")).toBeInTheDocument();
    expect(screen.getByText("observe #3")).toBeInTheDocument();
  });
});
