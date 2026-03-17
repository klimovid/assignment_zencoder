import { RootStore, createRootStore } from "./stores";

describe("RootStore", () => {
  it("creates with all child stores", () => {
    const root = createRootStore();
    expect(root.auth).toBeDefined();
    expect(root.filter).toBeDefined();
    expect(root.ui).toBeDefined();
    expect(root.notifications).toBeDefined();
    expect(root.settings).toBeDefined();
  });

  it("each child store is a separate instance", () => {
    const a = createRootStore();
    const b = createRootStore();
    expect(a.auth).not.toBe(b.auth);
    expect(a.filter).not.toBe(b.filter);
  });

  it("returns RootStore type", () => {
    const root = createRootStore();
    expect(root).toBeInstanceOf(RootStore);
  });

  it("auth store starts uninitialized", () => {
    const root = createRootStore();
    expect(root.auth.initialized).toBe(false);
    expect(root.auth.isAuthenticated).toBe(false);
  });

  it("filter store starts with defaults", () => {
    const root = createRootStore();
    expect(root.filter.timeRange).toBe("30d");
    expect(root.filter.hasActiveFilters).toBe(false);
  });

  it("notification store starts empty", () => {
    const root = createRootStore();
    expect(root.notifications.unreadCount).toBe(0);
  });

  it("settings store starts with defaults", () => {
    const root = createRootStore();
    expect(root.settings.theme).toBe("system");
    expect(root.settings.timezone).toBe("UTC");
  });
});
