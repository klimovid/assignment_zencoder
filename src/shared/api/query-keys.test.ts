import { queryKeys } from "./query-keys";

describe("queryKeys", () => {
  it("produces deterministic keys for same filters", () => {
    const filters = { timeRange: "7d", teamIds: ["t1"] };
    const key1 = queryKeys.analytics.overview(filters);
    const key2 = queryKeys.analytics.overview(filters);
    expect(key1).toEqual(key2);
  });

  it("produces different keys for different filters", () => {
    const key1 = queryKeys.analytics.overview({ timeRange: "7d" });
    const key2 = queryKeys.analytics.overview({ timeRange: "30d" });
    expect(key1).not.toEqual(key2);
  });

  it("serializes filter keys in consistent order", () => {
    const key1 = queryKeys.analytics.adoption({
      timeRange: "7d",
      teamIds: ["a"],
    });
    const key2 = queryKeys.analytics.adoption({
      teamIds: ["a"],
      timeRange: "7d",
    });
    expect(key1).toEqual(key2);
  });

  it("returns correct key structure for session", () => {
    const key = queryKeys.analytics.session("abc-123");
    expect(key).toEqual(["analytics", "session", "abc-123"]);
  });

  it("returns correct key structure for notifications", () => {
    expect(queryKeys.notifications.list()).toEqual(["notifications"]);
  });

  it("returns correct key structure for user", () => {
    expect(queryKeys.user.profile()).toEqual(["user", "profile"]);
    expect(queryKeys.user.settings()).toEqual(["user", "settings"]);
  });
});
