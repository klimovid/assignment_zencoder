import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { KPICard } from "./KPICard";

describe("KPICard", () => {
  it("renders label and value", () => {
    render(<KPICard label="Active Users" value={1234} />);
    expect(screen.getByRole("status", { name: "Active Users" })).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders with currency format", () => {
    render(<KPICard label="Total Cost" value={15000} format="currency" />);
    expect(screen.getByText("$15,000")).toBeInTheDocument();
  });

  it("renders with percent format", () => {
    render(<KPICard label="Pass Rate" value={95.5} format="percent" />);
    expect(screen.getByText("95.5%")).toBeInTheDocument();
  });

  it("renders with duration format", () => {
    render(<KPICard label="Avg Duration" value={3.2} format="duration" />);
    expect(screen.getByText("3.2s")).toBeInTheDocument();
  });

  it("renders string value as-is", () => {
    render(<KPICard label="Status" value="Healthy" />);
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("renders delta indicator when provided", () => {
    render(
      <KPICard
        label="Users"
        value={500}
        delta={{ value: 12.5, direction: "up" }}
      />,
    );
    expect(screen.getByLabelText("+12.5% increase")).toBeInTheDocument();
  });

  it("renders loading skeleton state", () => {
    render(<KPICard label="Users" value={0} loading />);
    expect(
      screen.getByRole("status", { name: "Users loading" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("passes jest-axe", async () => {
    const { container } = render(
      <KPICard
        label="Active Users"
        value={1234}
        delta={{ value: 5, direction: "up" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
