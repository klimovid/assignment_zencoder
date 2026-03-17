import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { SidebarNav } from "./SidebarNav";

let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("SidebarNav", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
  });

  it("renders 6 view links and Settings", () => {
    render(<SidebarNav />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();

    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
    expect(screen.getByText("Adoption & Usage")).toBeInTheDocument();
    expect(screen.getByText("Delivery Impact")).toBeInTheDocument();
    expect(screen.getByText("Cost & Budgets")).toBeInTheDocument();
    expect(screen.getByText("Quality & Security")).toBeInTheDocument();
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("highlights active link for dashboard", () => {
    mockPathname = "/dashboard";
    render(<SidebarNav />);

    const link = screen.getByText("Executive Overview").closest("a");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("highlights active link for nested routes", () => {
    mockPathname = "/dashboard/adoption/team-1";
    render(<SidebarNav />);

    const link = screen.getByText("Adoption & Usage").closest("a");
    expect(link).toHaveAttribute("aria-current", "page");

    const overview = screen.getByText("Executive Overview").closest("a");
    expect(overview).not.toHaveAttribute("aria-current");
  });

  it("hides labels when collapsed", () => {
    render(<SidebarNav collapsed />);
    expect(screen.queryByText("Executive Overview")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("shows labels when not collapsed", () => {
    render(<SidebarNav collapsed={false} />);
    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
  });

  it("passes jest-axe", async () => {
    const { container } = render(<SidebarNav />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
