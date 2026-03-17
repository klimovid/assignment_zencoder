import { TeamSchema } from "./types";

describe("Team entity schema", () => {
  it("accepts valid team", () => {
    const result = TeamSchema.parse({ id: "team-1", name: "Platform" });
    expect(result.id).toBe("team-1");
    expect(result.name).toBe("Platform");
  });

  it("rejects team with empty id", () => {
    expect(() => TeamSchema.parse({ id: "", name: "Platform" })).toThrow();
  });

  it("rejects team with empty name", () => {
    expect(() => TeamSchema.parse({ id: "team-1", name: "" })).toThrow();
  });

  it("rejects team without required fields", () => {
    expect(() => TeamSchema.parse({})).toThrow();
    expect(() => TeamSchema.parse({ id: "team-1" })).toThrow();
  });
});
