import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("Breadcrumbs", () => {
  it("renders nothing for root dashboard path", () => {
    mockPathname = "/dashboard";
    const { container } = render(<Breadcrumbs />);
    expect(container.querySelector("nav")).toBeNull();
  });

  it("renders breadcrumbs for nested path", () => {
    mockPathname = "/dashboard/adoption";
    render(<Breadcrumbs />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
    expect(screen.getByText("Adoption & Usage")).toBeInTheDocument();
  });

  it("marks last crumb as current page", () => {
    mockPathname = "/dashboard/cost";
    render(<Breadcrumbs />);

    expect(screen.getByText("Cost & Budgets")).toHaveAttribute("aria-current", "page");
  });

  it("renders links for non-last crumbs", () => {
    mockPathname = "/dashboard/sessions/sess-123";
    render(<Breadcrumbs />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/dashboard");
  });

  it("uses segment as label for unknown paths", () => {
    mockPathname = "/dashboard/sessions/sess-xyz";
    render(<Breadcrumbs />);

    expect(screen.getByText("sess-xyz")).toBeInTheDocument();
  });
});
