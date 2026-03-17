import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { DeltaIndicator } from "./DeltaIndicator";

describe("DeltaIndicator", () => {
  it("renders up direction with positive value", () => {
    render(<DeltaIndicator value={12.5} direction="up" />);
    const el = screen.getByLabelText("+12.5% increase");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("12.5%");
    expect(el).toHaveClass("text-green-600");
  });

  it("renders down direction with negative styling", () => {
    render(<DeltaIndicator value={5.3} direction="down" />);
    const el = screen.getByLabelText("-5.3% decrease");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("text-red-600");
  });

  it("renders neutral direction", () => {
    render(<DeltaIndicator value={0} direction="neutral" />);
    const el = screen.getByLabelText("0.0% no change");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("text-muted-foreground");
  });

  it("inverts colors when invertColor is true", () => {
    render(<DeltaIndicator value={8} direction="down" invertColor />);
    const el = screen.getByLabelText("-8.0% decrease");
    expect(el).toHaveClass("text-green-600");
  });

  it("inverts colors for up direction", () => {
    render(<DeltaIndicator value={8} direction="up" invertColor />);
    const el = screen.getByLabelText("+8.0% increase");
    expect(el).toHaveClass("text-red-600");
  });

  it("passes jest-axe", async () => {
    const { container } = render(
      <DeltaIndicator value={5} direction="up" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
