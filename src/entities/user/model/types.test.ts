import { UserProfileSchema, UserSettingsSchema, RoleSchema } from "./types";

const validProfile = {
  data: {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar_url: "https://example.com/avatar.png",
    role: "eng_manager" as const,
    org_id: "org-1",
    organization: { id: "org-1", name: "Acme Corp" },
    teams: [
      { id: "team-1", name: "Platform" },
      { id: "team-2", name: "Backend" },
    ],
    permissions: ["analytics:read", "settings:write"],
  },
};

const validSettings = {
  data: {
    user_id: "user-1",
    theme: "dark" as const,
    timezone: "America/New_York",
    default_view: "executive-overview" as const,
    default_date_range: "30d" as const,
    email_digest: { frequency: "weekly" as const, scope: "org" as const },
    language: "en",
    updated_at: "2024-01-15T10:00:00Z",
  },
};

describe("User entity schemas", () => {
  describe("RoleSchema", () => {
    it("accepts all valid roles", () => {
      const roles = [
        "vp_cto",
        "eng_manager",
        "platform_eng",
        "finops",
        "security",
        "ic_dev",
        "org_admin",
      ];
      for (const role of roles) {
        expect(RoleSchema.parse(role)).toBe(role);
      }
    });

    it("rejects invalid role", () => {
      expect(() => RoleSchema.parse("superadmin")).toThrow();
    });
  });

  describe("UserProfileSchema", () => {
    it("accepts valid profile", () => {
      const result = UserProfileSchema.parse(validProfile);
      expect(result.data.name).toBe("John Doe");
      expect(result.data.teams).toHaveLength(2);
    });

    it("accepts profile without optional avatar_url", () => {
      const { avatar_url: _, ...dataNoAvatar } = validProfile.data;
      const result = UserProfileSchema.parse({ data: dataNoAvatar });
      expect(result.data.avatar_url).toBeUndefined();
    });

    it("rejects profile with invalid email", () => {
      expect(() =>
        UserProfileSchema.parse({
          data: { ...validProfile.data, email: "not-an-email" },
        }),
      ).toThrow();
    });

    it("accepts profile with empty teams", () => {
      const result = UserProfileSchema.parse({
        data: { ...validProfile.data, teams: [] },
      });
      expect(result.data.teams).toHaveLength(0);
    });

    it("rejects profile with invalid role", () => {
      expect(() =>
        UserProfileSchema.parse({
          data: { ...validProfile.data, role: "unknown" },
        }),
      ).toThrow();
    });
  });

  describe("UserSettingsSchema", () => {
    it("accepts valid settings", () => {
      const result = UserSettingsSchema.parse(validSettings);
      expect(result.data.theme).toBe("dark");
      expect(result.data.timezone).toBe("America/New_York");
    });

    it("accepts all theme values", () => {
      for (const theme of ["light", "dark", "system"] as const) {
        const result = UserSettingsSchema.parse({
          data: { ...validSettings.data, theme },
        });
        expect(result.data.theme).toBe(theme);
      }
    });

    it("accepts all default_view values", () => {
      const views = [
        "executive-overview",
        "adoption",
        "delivery",
        "cost",
        "quality",
        "operations",
      ] as const;
      for (const view of views) {
        const result = UserSettingsSchema.parse({
          data: { ...validSettings.data, default_view: view },
        });
        expect(result.data.default_view).toBe(view);
      }
    });

    it("rejects settings with invalid theme", () => {
      expect(() =>
        UserSettingsSchema.parse({
          data: { ...validSettings.data, theme: "neon" },
        }),
      ).toThrow();
    });

    it("rejects settings with empty timezone", () => {
      expect(() =>
        UserSettingsSchema.parse({
          data: { ...validSettings.data, timezone: "" },
        }),
      ).toThrow();
    });
  });
});
