import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { SidebarNav } from "./SidebarNav";
import { AuthStoreProvider } from "@features/auth/model/AuthContext";
import { AuthStore } from "@features/auth/model/AuthStore";

let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

function createAuthStore(role = "org_admin" as const) {
  const store = new AuthStore();
  store.setAuth({
    user: { id: "u1", email: "test@test.dev", name: "Test" },
    role,
    orgId: "org-1",
    teams: ["team-1"],
    permissions: ["analytics:read"],
  });
  return store;
}

function renderNav(props: { collapsed?: boolean } = {}, role?: string) {
  const store = createAuthStore(role as "org_admin");
  return render(
    <AuthStoreProvider store={store}>
      <SidebarNav {...props} />
    </AuthStoreProvider>,
  );
}

describe("SidebarNav", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
  });

  it("renders 6 view links and Settings for org_admin", () => {
    renderNav();
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
    renderNav();

    const link = screen.getByText("Executive Overview").closest("a");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("highlights active link for nested routes", () => {
    mockPathname = "/dashboard/adoption/team-1";
    renderNav();

    const link = screen.getByText("Adoption & Usage").closest("a");
    expect(link).toHaveAttribute("aria-current", "page");

    const overview = screen.getByText("Executive Overview").closest("a");
    expect(overview).not.toHaveAttribute("aria-current");
  });

  it("hides labels when collapsed", () => {
    renderNav({ collapsed: true });
    expect(screen.queryByText("Executive Overview")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("shows labels when not collapsed", () => {
    renderNav({ collapsed: false });
    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
  });

  it.each([
    {
      role: "org_admin",
      visible: ["Executive Overview", "Adoption & Usage", "Delivery Impact", "Cost & Budgets", "Quality & Security", "Operations"],
      hidden: [],
    },
    {
      role: "vp_cto",
      visible: ["Executive Overview", "Adoption & Usage", "Delivery Impact", "Cost & Budgets"],
      hidden: ["Quality & Security", "Operations"],
    },
    {
      role: "eng_manager",
      visible: ["Executive Overview", "Adoption & Usage", "Delivery Impact", "Cost & Budgets", "Quality & Security", "Operations"],
      hidden: [],
    },
    {
      role: "platform_eng",
      visible: ["Adoption & Usage", "Delivery Impact", "Operations"],
      hidden: ["Executive Overview", "Cost & Budgets", "Quality & Security"],
    },
    {
      role: "ic_dev",
      visible: ["Adoption & Usage", "Delivery Impact"],
      hidden: ["Executive Overview", "Cost & Budgets", "Quality & Security", "Operations"],
    },
    {
      role: "finops",
      visible: ["Executive Overview", "Cost & Budgets"],
      hidden: ["Adoption & Usage", "Delivery Impact", "Quality & Security", "Operations"],
    },
    {
      role: "security",
      visible: ["Quality & Security"],
      hidden: ["Executive Overview", "Adoption & Usage", "Delivery Impact", "Cost & Budgets", "Operations"],
    },
  ])("shows correct nav items for $role", ({ role, visible, hidden }) => {
    renderNav({}, role);
    for (const label of visible) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const label of hidden) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
    // Settings is always visible
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("passes jest-axe", async () => {
    const { container } = renderNav();
    expect(await axe(container)).toHaveNoViolations();
  });
});
