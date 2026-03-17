import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { QualityPage } from "./QualityPage";
import { createQualityResponse } from "@shared/__mocks__/factories";

describe("QualityPage", () => {
  // QA-1: CI pass rate
  it("renders CI pass rate", () => {
    const data = createQualityResponse();
    render(<QualityPage data={data} />);
    expect(screen.getByText("CI Pass Rate")).toBeInTheDocument();
  });

  // QA-2: Review outcomes
  it("renders review outcomes", () => {
    const data = createQualityResponse();
    render(<QualityPage data={data} />);
    expect(screen.getByText("Review Outcomes")).toBeInTheDocument();
    expect(screen.getAllByText(/Approved/i).length).toBeGreaterThanOrEqual(1);
  });

  // QA-3: Policy violations table
  it("renders policy violations", () => {
    const data = createQualityResponse();
    render(<QualityPage data={data} />);
    expect(screen.getByText("Policy Violations")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<QualityPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(1);
  });

  it("passes accessibility audit", async () => {
    const data = createQualityResponse();
    const { container } = render(<QualityPage data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
