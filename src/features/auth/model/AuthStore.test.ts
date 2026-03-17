import { AuthStore } from "./AuthStore";

const mockUser = {
  user: { id: "u1", email: "test@example.com", name: "Test User" },
  role: "eng_manager" as const,
  orgId: "org-1",
  teams: ["team-1", "team-2"],
  permissions: ["view:dashboard", "view:adoption", "export:csv"],
};

describe("AuthStore", () => {
  it("initializes as unauthenticated", () => {
    const store = new AuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.initialized).toBe(false);
    expect(store.user).toBeNull();
    expect(store.role).toBeNull();
  });

  it("setAuth sets user data and marks as initialized", () => {
    const store = new AuthStore();
    store.setAuth(mockUser);

    expect(store.isAuthenticated).toBe(true);
    expect(store.initialized).toBe(true);
    expect(store.user?.email).toBe("test@example.com");
    expect(store.role).toBe("eng_manager");
    expect(store.orgId).toBe("org-1");
    expect(store.teams).toEqual(["team-1", "team-2"]);
    expect(store.permissions).toEqual(["view:dashboard", "view:adoption", "export:csv"]);
  });

  it("hasPermission returns true for matching permission", () => {
    const store = new AuthStore();
    store.setAuth(mockUser);

    expect(store.hasPermission("view:dashboard")).toBe(true);
    expect(store.hasPermission("export:csv")).toBe(true);
  });

  it("hasPermission returns false for non-matching permission", () => {
    const store = new AuthStore();
    store.setAuth(mockUser);

    expect(store.hasPermission("admin:delete")).toBe(false);
  });

  it("hasPermission returns true for org_admin regardless of permission", () => {
    const store = new AuthStore();
    store.setAuth({ ...mockUser, role: "org_admin", permissions: [] });

    expect(store.hasPermission("admin:delete")).toBe(true);
    expect(store.hasPermission("anything")).toBe(true);
  });

  it("logout clears all auth data", () => {
    const store = new AuthStore();
    store.setAuth(mockUser);
    expect(store.isAuthenticated).toBe(true);

    store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.initialized).toBe(false);
    expect(store.user).toBeNull();
    expect(store.role).toBeNull();
    expect(store.orgId).toBeNull();
    expect(store.teams).toEqual([]);
    expect(store.permissions).toEqual([]);
  });
});
