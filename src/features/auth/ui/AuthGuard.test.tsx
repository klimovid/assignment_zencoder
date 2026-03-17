import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { AuthGuard } from "./AuthGuard";
import { AuthStore } from "../model/AuthStore";
import { AuthStoreProvider } from "../model/AuthContext";

function renderWithAuth(store: AuthStore, ui: React.ReactElement) {
  return render(<AuthStoreProvider store={store}>{ui}</AuthStoreProvider>);
}

describe("AuthGuard", () => {
  beforeEach(() => {
    (redirect as unknown as jest.Mock).mockClear();
  });

  it("renders loading skeleton when not initialized", () => {
    const store = new AuthStore();
    renderWithAuth(
      store,
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
  });

  it("redirects to /auth when not authenticated", () => {
    const store = new AuthStore();
    store.initialized = true;
    renderWithAuth(
      store,
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(redirect).toHaveBeenCalledWith("/auth");
  });

  it("renders children when authenticated and no role restriction", () => {
    const store = new AuthStore();
    store.setAuth({
      user: { id: "u1", email: "a@b.com", name: "Test" },
      role: "eng_manager",
      orgId: "org-1",
      teams: [],
      permissions: [],
    });

    renderWithAuth(
      store,
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children when user has required role", () => {
    const store = new AuthStore();
    store.setAuth({
      user: { id: "u1", email: "a@b.com", name: "Test" },
      role: "eng_manager",
      orgId: "org-1",
      teams: [],
      permissions: [],
    });

    renderWithAuth(
      store,
      <AuthGuard roles={["eng_manager", "vp_cto"]}>
        <div>Manager Content</div>
      </AuthGuard>,
    );
    expect(screen.getByText("Manager Content")).toBeInTheDocument();
  });

  it("renders default fallback when user lacks required role", () => {
    const store = new AuthStore();
    store.setAuth({
      user: { id: "u1", email: "a@b.com", name: "Test" },
      role: "ic_dev",
      orgId: "org-1",
      teams: [],
      permissions: [],
    });

    renderWithAuth(
      store,
      <AuthGuard roles={["eng_manager", "vp_cto"]}>
        <div>Manager Content</div>
      </AuthGuard>,
    );
    expect(screen.queryByText("Manager Content")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Access Restricted")).toBeInTheDocument();
  });

  it("renders custom fallback when user lacks role", () => {
    const store = new AuthStore();
    store.setAuth({
      user: { id: "u1", email: "a@b.com", name: "Test" },
      role: "ic_dev",
      orgId: "org-1",
      teams: [],
      permissions: [],
    });

    renderWithAuth(
      store,
      <AuthGuard roles={["finops"]} fallback={<div>Custom Denied</div>}>
        <div>Content</div>
      </AuthGuard>,
    );
    expect(screen.getByText("Custom Denied")).toBeInTheDocument();
  });

  it("allows org_admin regardless of role restriction", () => {
    const store = new AuthStore();
    store.setAuth({
      user: { id: "u1", email: "a@b.com", name: "Admin" },
      role: "org_admin",
      orgId: "org-1",
      teams: [],
      permissions: [],
    });

    renderWithAuth(
      store,
      <AuthGuard roles={["finops"]}>
        <div>Admin Access</div>
      </AuthGuard>,
    );
    expect(screen.getByText("Admin Access")).toBeInTheDocument();
  });
});
