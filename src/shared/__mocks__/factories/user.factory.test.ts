import { faker } from "@faker-js/faker";
import { UserProfileSchema, UserSettingsSchema } from "@entities/user/model/types";
import { createUserProfile, createUserSettings } from "./user.factory";

beforeEach(() => faker.seed(42));

describe("User factories", () => {
  it("createUserProfile produces Zod-valid data", () => {
    const profile = createUserProfile();
    expect(() => UserProfileSchema.parse(profile)).not.toThrow();
  });

  it("createUserProfile respects overrides", () => {
    const profile = createUserProfile({ role: "finops", name: "Test User" });
    expect(profile.data.role).toBe("finops");
    expect(profile.data.name).toBe("Test User");
  });

  it("createUserSettings produces Zod-valid data", () => {
    const settings = createUserSettings();
    expect(() => UserSettingsSchema.parse(settings)).not.toThrow();
  });

  it("createUserSettings respects overrides", () => {
    const settings = createUserSettings({ theme: "dark", timezone: "UTC" });
    expect(settings.data.theme).toBe("dark");
    expect(settings.data.timezone).toBe("UTC");
  });
});
