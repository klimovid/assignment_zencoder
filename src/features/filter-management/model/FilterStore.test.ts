import { FilterStore } from "./FilterStore";

describe("FilterStore", () => {
  it("initializes with default values", () => {
    const store = new FilterStore();
    expect(store.teamIds).toEqual([]);
    expect(store.repoIds).toEqual([]);
    expect(store.model).toBeNull();
    expect(store.taskType).toBeNull();
    expect(store.language).toBeNull();
    expect(store.timeRange).toBe("30d");
    expect(store.granularity).toBe("daily");
    expect(store.comparison).toBe(false);
  });

  it("setFilter updates a specific filter", () => {
    const store = new FilterStore();
    store.setFilter("timeRange", "7d");
    expect(store.timeRange).toBe("7d");
  });

  it("setFilter updates array filters", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["team-1", "team-2"]);
    expect(store.teamIds).toEqual(["team-1", "team-2"]);
  });

  it("setFilter updates nullable filters", () => {
    const store = new FilterStore();
    store.setFilter("model", "gpt-4");
    expect(store.model).toBe("gpt-4");

    store.setFilter("taskType", "bugfix");
    expect(store.taskType).toBe("bugfix");
  });

  it("resetFilters restores all defaults", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["team-1"]);
    store.setFilter("timeRange", "7d");
    store.setFilter("model", "gpt-4");
    store.setFilter("comparison", true);

    store.resetFilters();

    expect(store.teamIds).toEqual([]);
    expect(store.timeRange).toBe("30d");
    expect(store.model).toBeNull();
    expect(store.comparison).toBe(false);
  });

  it("serialized returns a snapshot of current state", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["team-1"]);
    store.setFilter("timeRange", "90d");

    const snapshot = store.serialized;
    expect(snapshot).toEqual({
      teamIds: ["team-1"],
      repoIds: [],
      model: null,
      taskType: null,
      language: null,
      timeRange: "90d",
      granularity: "daily",
      comparison: false,
    });
  });

  it("serialized returns a copy (immutable)", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["team-1"]);

    const a = store.serialized;
    const b = store.serialized;
    expect(a).toEqual(b);
    expect(a.teamIds).not.toBe(b.teamIds);
  });

  it("hasActiveFilters is false by default", () => {
    const store = new FilterStore();
    expect(store.hasActiveFilters).toBe(false);
  });

  it("hasActiveFilters is true when teamIds are set", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["team-1"]);
    expect(store.hasActiveFilters).toBe(true);
  });

  it("hasActiveFilters is true when model is set", () => {
    const store = new FilterStore();
    store.setFilter("model", "claude");
    expect(store.hasActiveFilters).toBe(true);
  });

  it("hasActiveFilters ignores timeRange and granularity", () => {
    const store = new FilterStore();
    store.setFilter("timeRange", "7d");
    store.setFilter("granularity", "hourly");
    expect(store.hasActiveFilters).toBe(false);
  });
});
