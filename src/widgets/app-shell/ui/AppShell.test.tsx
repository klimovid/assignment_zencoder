import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { AppShell } from "./AppShell";
import { AuthStoreProvider } from "@features/auth/model/AuthContext";
import { AuthStore } from "@features/auth/model/AuthStore";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

function createAuthStore() {
  const store = new AuthStore();
  store.setAuth({
    user: { id: "u1", email: "test@test.dev", name: "Test" },
    role: "org_admin",
    orgId: "org-1",
    teams: ["team-1"],
    permissions: ["analytics:read"],
  });
  return store;
}

function renderShell(props: { headerActions?: React.ReactNode; children?: React.ReactNode } = {}) {
  const store = createAuthStore();
  return render(
    <AuthStoreProvider store={store}>
      <AppShell headerActions={props.headerActions}>
        {props.children ?? <div>Page content</div>}
      </AppShell>
    </AuthStoreProvider>,
  );
}

describe("AppShell", () => {
  it("renders sidebar, header, and main content", () => {
    renderShell();

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders navigation in sidebar", () => {
    renderShell();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders header actions", () => {
    renderShell({ headerActions: <button>Theme</button> });
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });

  it("renders mobile hamburger button", () => {
    renderShell();
    expect(screen.getByRole("button", { name: "Toggle navigation" })).toBeInTheDocument();
  });

  it("toggles mobile sidebar on hamburger click", async () => {
    renderShell();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    // Mobile sidebar is now open — there should be 2 navs
    const navs = screen.getAllByRole("navigation", { name: "Main navigation" });
    expect(navs.length).toBe(2);
  });

  it("passes jest-axe", async () => {
    const { container } = renderShell();
    expect(await axe(container)).toHaveNoViolations();
  });
});
