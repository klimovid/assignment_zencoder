import { faker } from "@faker-js/faker";
import type { UserProfile, UserSettings } from "@entities/user/model/types";

export function createUserProfile(
  overrides?: Partial<UserProfile["data"]>,
): UserProfile {
  const orgId = faker.string.uuid();
  return {
    data: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar_url: faker.image.avatar(),
      role: faker.helpers.arrayElement([
        "vp_cto",
        "eng_manager",
        "platform_eng",
        "finops",
        "security",
        "ic_dev",
        "org_admin",
      ] as const),
      org_id: orgId,
      organization: {
        id: orgId,
        name: faker.company.name(),
      },
      teams: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        name: `${faker.commerce.department()} Team`,
      })),
      permissions: ["analytics:read", "settings:write"],
      ...overrides,
    },
  };
}

export function createUserSettings(
  overrides?: Partial<UserSettings["data"]>,
): UserSettings {
  return {
    data: {
      user_id: faker.string.uuid(),
      theme: faker.helpers.arrayElement(["light", "dark", "system"] as const),
      timezone: faker.helpers.arrayElement([
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
      ]),
      default_view: faker.helpers.arrayElement([
        "executive-overview",
        "adoption",
        "delivery",
        "cost",
        "quality",
        "operations",
      ] as const),
      default_date_range: faker.helpers.arrayElement(["7d", "30d", "90d", "custom"] as const),
      email_digest: {
        frequency: faker.helpers.arrayElement(["weekly", "disabled"] as const),
        scope: faker.helpers.arrayElement(["org", "team"] as const),
      },
      language: "en",
      updated_at: faker.date.recent().toISOString(),
      ...overrides,
    },
  };
}
