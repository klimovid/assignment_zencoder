import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { AdoptionPage } from "./AdoptionPage";
import { createAdoptionResponse } from "@shared/__mocks__/factories";

describe("AdoptionPage", () => {
  // AD-1: Task funnel
  it("renders task funnel metrics", () => {
    const data = createAdoptionResponse();
    render(<AdoptionPage data={data} />);
    expect(screen.getByText("Task Funnel")).toBeInTheDocument();
    expect(screen.getByText(/Created/i)).toBeInTheDocument();
    expect(screen.getByText(/Merged/i)).toBeInTheDocument();
  });

  // AD-2: DAU/WAU/MAU KPIs
  it("renders DAU/WAU/MAU metrics", () => {
    const data = createAdoptionResponse();
    render(<AdoptionPage data={data} />);
    expect(screen.getByText("DAU")).toBeInTheDocument();
    expect(screen.getByText("WAU")).toBeInTheDocument();
    expect(screen.getByText("MAU")).toBeInTheDocument();
  });

  // AD-3: Sessions by team
  it("renders sessions by team", () => {
    const data = createAdoptionResponse();
    render(<AdoptionPage data={data} />);
    expect(screen.getByText("Sessions by Team")).toBeInTheDocument();
    data.data.sessions_by_team.forEach((team) => {
      expect(screen.getByText(team.team_name)).toBeInTheDocument();
    });
  });

  // AD-6: Empty state
  it("renders loading state", () => {
    render(<AdoptionPage data={null} loading />);
    const loadingCards = screen.getAllByRole("status");
    expect(loadingCards.length).toBeGreaterThanOrEqual(3);
  });

  it("renders task type distribution", () => {
    const data = createAdoptionResponse();
    render(<AdoptionPage data={data} />);
    expect(screen.getByText("Task Types")).toBeInTheDocument();
  });

  it("passes accessibility audit", async () => {
    const data = createAdoptionResponse();
    const { container } = render(<AdoptionPage data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
