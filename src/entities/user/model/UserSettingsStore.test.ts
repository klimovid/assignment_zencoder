import { UserSettingsStore } from "./UserSettingsStore";

describe("UserSettingsStore", () => {
  it("initializes with default values", () => {
    const store = new UserSettingsStore();
    expect(store.theme).toBe("system");
    expect(store.timezone).toBe("UTC");
    expect(store.defaultView).toBe("executive-overview");
    expect(store.defaultDateRange).toBe("30d");
  });

  it("setTheme updates theme", () => {
    const store = new UserSettingsStore();
    store.setTheme("dark");
    expect(store.theme).toBe("dark");
  });

  it("setTimezone updates timezone", () => {
    const store = new UserSettingsStore();
    store.setTimezone("America/New_York");
    expect(store.timezone).toBe("America/New_York");
  });

  it("setDefaultView updates default view", () => {
    const store = new UserSettingsStore();
    store.setDefaultView("adoption");
    expect(store.defaultView).toBe("adoption");
  });

  it("setDefaultDateRange updates date range", () => {
    const store = new UserSettingsStore();
    store.setDefaultDateRange("7d");
    expect(store.defaultDateRange).toBe("7d");
  });

  it("applyFromAPI applies all settings from API response", () => {
    const store = new UserSettingsStore();
    store.applyFromAPI({
      theme: "light",
      timezone: "Europe/London",
      default_view: "cost",
      default_date_range: "90d",
    });
    expect(store.theme).toBe("light");
    expect(store.timezone).toBe("Europe/London");
    expect(store.defaultView).toBe("cost");
    expect(store.defaultDateRange).toBe("90d");
  });

  it("applyFromAPI applies partial settings", () => {
    const store = new UserSettingsStore();
    store.setTheme("dark");
    store.applyFromAPI({ timezone: "Asia/Tokyo" });
    expect(store.theme).toBe("dark");
    expect(store.timezone).toBe("Asia/Tokyo");
  });
});
