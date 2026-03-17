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
  it("renders agent vs non-agent comparison chart", () => {
    const data = createDeliveryResponse();
    render(<DeliveryPage data={data} />);
    expect(screen.getByRole("img", { name: "Agent vs Non-Agent" })).toBeInTheDocument();
  });

  it("renders PR throughput trend chart", () => {
    const data = createDeliveryResponse();
    render(<DeliveryPage data={data} />);
    expect(screen.getByRole("img", { name: "PR Throughput Trend" })).toBeInTheDocument();
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
