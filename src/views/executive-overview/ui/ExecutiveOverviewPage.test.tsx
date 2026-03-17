import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ExecutiveOverviewPage } from "./ExecutiveOverviewPage";
import { createOverviewResponse } from "@shared/__mocks__/factories";
import type { OverviewResponse } from "../api/schemas";

function renderPage(overrides?: Partial<OverviewResponse>) {
  const data = createOverviewResponse(overrides);
  return render(<ExecutiveOverviewPage data={data} />);
}

describe("ExecutiveOverviewPage", () => {
  // OV-1: KPI cards
  it("renders all 5 KPI cards", () => {
    renderPage();
    expect(screen.getByRole("status", { name: "Active Users" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Total Sessions" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Accepted Outcome Rate" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Cost per Task" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "CI Pass Rate" })).toBeInTheDocument();
  });

  // OV-2: Delta indicators on each KPI
  it("shows delta indicators on each KPI card", () => {
    renderPage();
    // Check delta indicators are rendered (aria-labels with % values)
    const deltas = screen.getAllByText(/%$/);
    expect(deltas.length).toBeGreaterThanOrEqual(5);
  });

  it("renders adoption trends chart", () => {
    renderPage();
    expect(screen.getByRole("img", { name: "Adoption Trends" })).toBeInTheDocument();
  });

  it("renders outcome vs cost chart", () => {
    renderPage();
    expect(screen.getByRole("img", { name: "Outcome vs. Cost" })).toBeInTheDocument();
  });

  it("renders risk & compliance alerts table", () => {
    renderPage();
    expect(screen.getByText("Risk & Compliance Alerts")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<ExecutiveOverviewPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(5);
  });

  it("passes accessibility audit", async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
