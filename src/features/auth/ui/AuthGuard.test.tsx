import { render, screen } from "@testing-library/react";
import { AuthGuard } from "./AuthGuard";
import { AuthStore } from "../model/AuthStore";
import { AuthStoreProvider } from "../model/AuthContext";

function renderWithAuth(store: AuthStore, ui: React.ReactElement) {
  return render(<AuthStoreProvider store={store}>{ui}</AuthStoreProvider>);
}

describe("AuthGuard", () => {
  it("renders nothing when not initialized", () => {
    const store = new AuthStore();
    const { container } = renderWithAuth(
      store,
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when not authenticated", () => {
    const store = new AuthStore();
    store.initialized = true;
    const { container } = renderWithAuth(
      store,
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(container).toBeEmptyDOMElement();
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
