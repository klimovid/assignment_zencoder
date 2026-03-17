import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ChartContainer } from "./ChartContainer";

describe("ChartContainer", () => {
  it("renders title and children", () => {
    render(
      <ChartContainer title="Revenue Chart">
        <div>Chart content</div>
      </ChartContainer>,
    );
    expect(screen.getByText("Revenue Chart")).toBeInTheDocument();
    expect(screen.getByText("Chart content")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(
      <ChartContainer title="Revenue Chart" loading>
        <div>Chart content</div>
      </ChartContainer>,
    );
    expect(
      screen.getByRole("status", { name: "Revenue Chart loading" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Chart content")).not.toBeInTheDocument();
  });

  it("renders error state with retry button", async () => {
    const onRetry = jest.fn();
    render(
      <ChartContainer
        title="Revenue Chart"
        error={new Error("Failed to load")}
        onRetry={onRetry}
      >
        <div>Chart content</div>
      </ChartContainer>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders error state without retry button", () => {
    render(
      <ChartContainer title="Chart" error={new Error("Error")}>
        <div>Content</div>
      </ChartContainer>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <ChartContainer title="Chart" isEmpty>
        <div>Content</div>
      </ChartContainer>,
    );
    expect(
      screen.getByRole("status", { name: "No data available" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders hidden accessibility table", () => {
    render(
      <ChartContainer
        title="Revenue Chart"
        accessibilityData={{
          headers: ["Month", "Revenue"],
          rows: [
            ["Jan", 1000],
            ["Feb", 1200],
          ],
        }}
      >
        <div>Chart</div>
      </ChartContainer>,
    );
    const table = screen.getByRole("table");
    expect(table).toHaveClass("sr-only");
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("passes jest-axe", async () => {
    const { container } = render(
      <ChartContainer
        title="Revenue Chart"
        accessibilityData={{
          headers: ["Month", "Revenue"],
          rows: [["Jan", 1000]],
        }}
      >
        <div>Chart visualization</div>
      </ChartContainer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
