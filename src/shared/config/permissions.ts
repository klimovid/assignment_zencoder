export const Role = {
  VP_CTO: "vp_cto",
  ENG_MANAGER: "eng_manager",
  PLATFORM_ENG: "platform_eng",
  IC_DEV: "ic_dev",
  FINOPS: "finops",
  SECURITY: "security",
  ORG_ADMIN: "org_admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

const ALL_ROLES = Object.values(Role);

export const ROUTE_PERMISSIONS: Record<string, readonly Role[]> = {
  "/dashboard": [Role.VP_CTO, Role.ENG_MANAGER, Role.FINOPS],
  "/dashboard/adoption": [
    Role.VP_CTO,
    Role.ENG_MANAGER,
    Role.PLATFORM_ENG,
    Role.IC_DEV,
  ],
  "/dashboard/delivery": [
    Role.VP_CTO,
    Role.ENG_MANAGER,
    Role.PLATFORM_ENG,
    Role.IC_DEV,
  ],
  "/dashboard/cost": [Role.VP_CTO, Role.ENG_MANAGER, Role.FINOPS],
  "/dashboard/quality": [Role.ENG_MANAGER, Role.SECURITY],
  "/dashboard/operations": [Role.ENG_MANAGER, Role.PLATFORM_ENG],
  "/dashboard/settings": ALL_ROLES,
};
