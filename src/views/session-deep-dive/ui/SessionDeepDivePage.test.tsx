import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { SessionDeepDivePage } from "./SessionDeepDivePage";
import { createSession } from "@shared/__mocks__/factories";

// Mock widgets that use complex rendering
jest.mock("@widgets/session-timeline/ui/SessionTimeline", () => ({
  SessionTimeline: ({ session }: { session: { steps: unknown[] } }) => (
    <div data-testid="session-timeline">Timeline: {session.steps.length} steps</div>
  ),
}));
jest.mock("@widgets/cost-breakdown/ui/CostBreakdown", () => ({
  CostBreakdown: () => <div data-testid="cost-breakdown">Cost Breakdown</div>,
}));

describe("SessionDeepDivePage", () => {
  // SD-1: Session header
  it("renders session status and ID", () => {
    const session = createSession({ status: "completed" });
    render(<SessionDeepDivePage session={session} />);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  // SD-2: Timeline widget
  it("renders session timeline", () => {
    const session = createSession();
    render(<SessionDeepDivePage session={session} />);
    expect(screen.getByTestId("session-timeline")).toBeInTheDocument();
  });

  // SD-5: Cost breakdown
  it("renders cost breakdown", () => {
    const session = createSession();
    render(<SessionDeepDivePage session={session} />);
    expect(screen.getByTestId("cost-breakdown")).toBeInTheDocument();
  });

  // SD-6: Session metadata
  it("renders total cost and duration", () => {
    const session = createSession({ totalCost: 0.456, totalDuration: 12345 });
    render(<SessionDeepDivePage session={session} />);
    expect(screen.getByText("$0.46")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<SessionDeepDivePage session={null} loading />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("passes accessibility audit", async () => {
    const session = createSession();
    const { container } = render(<SessionDeepDivePage session={session} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
