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

  it("renders risk alerts table with rows", () => {
    const data = createOverviewResponse();
    render(<ExecutiveOverviewPage data={data} />);
    const heading = screen.getByText("Risk & Compliance Alerts");
    expect(heading).toBeInTheDocument();
    // First alert's violation type is visible (may appear multiple times if faker repeats)
    expect(screen.getAllByText(data.data.risk_alerts[0]!.violation_type).length).toBeGreaterThanOrEqual(1);
    // Repository is rendered
    expect(screen.getAllByText(data.data.risk_alerts[0]!.repository).length).toBeGreaterThanOrEqual(1);
    // All alerts rendered — check column headers
    expect(screen.getByText("Policy Violation")).toBeInTheDocument();
    expect(screen.getByText("Severity")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders severity badges on risk alerts", () => {
    const data = createOverviewResponse();
    render(<ExecutiveOverviewPage data={data} />);
    for (const alert of data.data.risk_alerts) {
      expect(screen.getAllByText(alert.severity).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders status labels on risk alerts", () => {
    const statusMap: Record<string, string> = {
      pending_review: "Pending Review",
      auto_fixed: "Auto-Fixed",
      dismissed: "Dismissed",
    };
    const data = createOverviewResponse();
    render(<ExecutiveOverviewPage data={data} />);
    for (const alert of data.data.risk_alerts) {
      const expected = statusMap[alert.status] ?? alert.status;
      expect(screen.getAllByText(expected).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("shows empty state when no risk alerts", () => {
    const data = createOverviewResponse();
    data.data.risk_alerts = [];
    render(<ExecutiveOverviewPage data={data} />);
    expect(screen.getByText("No active alerts.")).toBeInTheDocument();
    // No column headers from risk table
    expect(screen.queryByText("Policy Violation")).not.toBeInTheDocument();
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
