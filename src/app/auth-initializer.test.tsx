import { render, waitFor } from "@testing-library/react";
import { AuthInitializer } from "./auth-initializer";
import { AuthStore } from "@features/auth/model/AuthStore";
import { AuthStoreProvider } from "@features/auth/model/AuthContext";

function renderWithAuth(store: AuthStore) {
  return render(
    <AuthStoreProvider store={store}>
      <AuthInitializer>
        <div data-testid="child">Content</div>
      </AuthInitializer>
    </AuthStoreProvider>,
  );
}

const originalFetch = global.fetch;

describe("AuthInitializer", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches /api/auth/me on mount and populates store", async () => {
    const store = new AuthStore();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            id: "user-001",
            email: "alice@acme.dev",
            name: "Alice Admin",
            role: "org_admin",
            org_id: "org-001",
            teams: ["team-platform"],
            permissions: ["analytics:read"],
          },
        }),
    });
    global.fetch = mockFetch;

    renderWithAuth(store);

    await waitFor(() => expect(store.initialized).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/me", { credentials: "include" });
    expect(store.user?.name).toBe("Alice Admin");
    expect(store.role).toBe("org_admin");
  });

  it("marks initialized on auth failure", async () => {
    const store = new AuthStore();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { code: "UNAUTHORIZED" } }),
    });

    renderWithAuth(store);

    await waitFor(() => expect(store.initialized).toBe(true));
    expect(store.isAuthenticated).toBe(false);
  });

  it("renders children immediately", () => {
    const store = new AuthStore();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: {} }),
    });

    const { getByTestId } = renderWithAuth(store);
    expect(getByTestId("child")).toBeInTheDocument();
  });
});
