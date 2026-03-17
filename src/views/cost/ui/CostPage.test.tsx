import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { CostPage } from "./CostPage";
import { createCostResponse } from "@shared/__mocks__/factories";

describe("CostPage", () => {
  // CO-1: Budget KPI
  it("renders current spend and budget", () => {
    const data = createCostResponse();
    render(<CostPage data={data} />);
    expect(screen.getByText("Current Spend")).toBeInTheDocument();
    expect(screen.getByText("Budget Limit")).toBeInTheDocument();
  });

  // CO-2: Spend breakdown by team
  it("renders spend by team", () => {
    const data = createCostResponse();
    render(<CostPage data={data} />);
    expect(screen.getByText("Spend by Team")).toBeInTheDocument();
    data.data.spend_by_team.forEach((team) => {
      expect(screen.getAllByText(team.team_name).length).toBeGreaterThanOrEqual(1);
    });
  });

  // CO-3: Spend by model
  it("renders spend by model", () => {
    const data = createCostResponse();
    render(<CostPage data={data} />);
    expect(screen.getByText("Spend by Model")).toBeInTheDocument();
  });

  // CO-4: Forecast
  it("renders forecast section", () => {
    const data = createCostResponse();
    render(<CostPage data={data} />);
    expect(screen.getByText("Forecast")).toBeInTheDocument();
  });

  // CO-5: Cost per task stats
  it("renders cost per task stats", () => {
    const data = createCostResponse();
    render(<CostPage data={data} />);
    expect(screen.getByText("Cost per Task")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<CostPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(2);
  });

  it("passes accessibility audit", async () => {
    const data = createCostResponse();
    const { container } = render(<CostPage data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
