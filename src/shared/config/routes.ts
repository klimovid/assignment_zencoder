export const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  adoption: "/dashboard/adoption",
  adoptionTeam: (teamId: string) => `/dashboard/adoption/${teamId}`,
  delivery: "/dashboard/delivery",
  deliveryTeam: (teamId: string) => `/dashboard/delivery/${teamId}`,
  cost: "/dashboard/cost",
  costTeam: (teamId: string) => `/dashboard/cost/${teamId}`,
  quality: "/dashboard/quality",
  operations: "/dashboard/operations",
  sessions: "/dashboard/sessions",
  session: (sessionId: string) => `/dashboard/sessions/${sessionId}`,
  settings: "/dashboard/settings",
} as const;

export const DISPLAY_NAMES: Record<string, string> = {
  dashboard: "Executive Overview",
  adoption: "Adoption & Usage",
  delivery: "Delivery Impact",
  cost: "Cost & Budgets",
  quality: "Quality & Security",
  operations: "Operations",
  sessions: "Session Deep-Dive",
  settings: "Settings",
};
