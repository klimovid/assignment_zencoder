import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { OperationsPage } from "./OperationsPage";
import { createOperationsResponse } from "@shared/__mocks__/factories";

describe("OperationsPage", () => {
  // OP-1: Queue depth
  it("renders queue depth", () => {
    const data = createOperationsResponse();
    render(<OperationsPage data={data} />);
    expect(screen.getByText("Queue Depth")).toBeInTheDocument();
  });

  // OP-2: Wait time
  it("renders wait time metrics", () => {
    const data = createOperationsResponse();
    render(<OperationsPage data={data} />);
    expect(screen.getByText("Median Wait")).toBeInTheDocument();
    expect(screen.getByText("P95 Wait")).toBeInTheDocument();
  });

  // OP-3: Failure rate
  it("renders failure rate", () => {
    const data = createOperationsResponse();
    render(<OperationsPage data={data} />);
    expect(screen.getByText("Failure Rate")).toBeInTheDocument();
  });

  // OP-5: SLA compliance
  it("renders SLA compliance", () => {
    const data = createOperationsResponse();
    render(<OperationsPage data={data} />);
    expect(screen.getByText("SLA Compliance")).toBeInTheDocument();
  });

  it("renders failure categories", () => {
    const data = createOperationsResponse();
    render(<OperationsPage data={data} />);
    expect(screen.getByText("Failure Categories")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<OperationsPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(3);
  });

  it("passes accessibility audit", async () => {
    const data = createOperationsResponse();
    const { container } = render(<OperationsPage data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
