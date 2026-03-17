import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { DeliveryPage } from "./DeliveryPage";
import { createDeliveryResponse } from "@shared/__mocks__/factories";

describe("DeliveryPage", () => {
  // DL-1: PR throughput KPIs
  it("renders PR throughput metrics", () => {
    const data = createDeliveryResponse();
    render(<DeliveryPage data={data} />);
    expect(screen.getByText("Agent PRs Opened")).toBeInTheDocument();
    expect(screen.getByText("Agent PRs Merged")).toBeInTheDocument();
  });

  // DL-2: Time metrics
  it("renders time-to-merge metric", () => {
    const data = createDeliveryResponse();
    render(<DeliveryPage data={data} />);
    expect(screen.getByText("Median Time to Merge")).toBeInTheDocument();
  });

  // DL-3: Agent vs non-agent comparison
  it("renders agent comparison table", () => {
    const data = createDeliveryResponse();
    render(<DeliveryPage data={data} />);
    expect(screen.getByText("Agent vs Non-Agent")).toBeInTheDocument();
    data.data.agent_vs_non_agent_comparison.forEach((row) => {
      expect(screen.getByText(row.metric)).toBeInTheDocument();
    });
  });

  it("renders loading state", () => {
    render(<DeliveryPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(3);
  });

  it("passes accessibility audit", async () => {
    const data = createDeliveryResponse();
    const { container } = render(<DeliveryPage data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
