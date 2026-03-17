import { UIStore } from "./UIStore";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe("UIStore", () => {
  it("initializes with default values", () => {
    const store = new UIStore();
    expect(store.sidebarCollapsed).toBe(false);
    expect(store.isMobile).toBe(false);
  });

  it("toggles sidebar state", () => {
    const store = new UIStore();
    expect(store.sidebarCollapsed).toBe(false);

    store.toggleSidebar();
    expect(store.sidebarCollapsed).toBe(true);

    store.toggleSidebar();
    expect(store.sidebarCollapsed).toBe(false);
  });

  it("persists sidebar state to localStorage", () => {
    const store = new UIStore();
    store.toggleSidebar();

    expect(localStorage.getItem("ui:sidebarCollapsed")).toBe("true");
  });

  it("restores sidebar state from localStorage", () => {
    localStorage.setItem("ui:sidebarCollapsed", "true");

    const store = new UIStore();
    expect(store.sidebarCollapsed).toBe(true);
  });

  it("sets mobile state", () => {
    const store = new UIStore();
    store.setMobile(true);
    expect(store.isMobile).toBe(true);

    store.setMobile(false);
    expect(store.isMobile).toBe(false);
  });
});
