import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";
import { MobileUnavailable } from "./MobileUnavailable";

describe("EmptyState", () => {
  it("renders onboarding variant", () => {
    render(<EmptyState variant="onboarding" />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Connect a code repository", { exact: false })).toBeInTheDocument();
  });

  it("renders no-data variant", () => {
    render(<EmptyState variant="no-data" />);
    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(screen.getByText(/No data matches/)).toBeInTheDocument();
  });

  it("renders reset button when onReset provided", () => {
    render(<EmptyState variant="no-data" onReset={jest.fn()} />);
    expect(screen.getByRole("button", { name: /Reset filters/i })).toBeInTheDocument();
  });

  it("calls onReset when button is clicked", async () => {
    const onReset = jest.fn();
    render(<EmptyState variant="no-data" onReset={onReset} />);

    await userEvent.setup().click(screen.getByRole("button", { name: /Reset filters/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("does not render reset button without onReset", () => {
    render(<EmptyState variant="no-data" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("MobileUnavailable", () => {
  it("renders view name", () => {
    render(<MobileUnavailable viewName="Delivery Impact" />);
    expect(screen.getByText("Delivery Impact")).toBeInTheDocument();
  });

  it("renders desktop message", () => {
    render(<MobileUnavailable viewName="Test" />);
    expect(screen.getByText(/wider screen/)).toBeInTheDocument();
  });
});
