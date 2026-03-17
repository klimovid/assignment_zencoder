import { z } from "zod";

export const RoleSchema = z.enum([
  "vp_cto",
  "eng_manager",
  "platform_eng",
  "finops",
  "security",
  "ic_dev",
  "org_admin",
]);

export const UserProfileSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    avatar_url: z.string().optional(),
    role: RoleSchema,
    org_id: z.string().min(1),
    organization: z.object({
      id: z.string(),
      name: z.string(),
    }),
    teams: z.array(z.object({ id: z.string(), name: z.string() })),
    permissions: z.array(z.string()),
  }),
});

export const UserSettingsSchema = z.object({
  data: z.object({
    user_id: z.string().min(1),
    theme: z.enum(["light", "dark", "system"]),
    timezone: z.string().min(1),
    default_view: z.enum([
      "executive-overview",
      "adoption",
      "delivery",
      "cost",
      "quality",
      "operations",
    ]),
    default_date_range: z.enum(["7d", "30d", "90d", "custom"]),
    email_digest: z.object({
      frequency: z.enum(["weekly", "disabled"]),
      scope: z.enum(["org", "team"]),
    }),
    language: z.string(),
    updated_at: z.string().datetime(),
  }),
});

export type Role = z.infer<typeof RoleSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
