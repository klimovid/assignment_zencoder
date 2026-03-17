function serializeFilters(filters: Record<string, unknown>): string {
  return JSON.stringify(filters, Object.keys(filters).sort());
}

export const queryKeys = {
  analytics: {
    overview: (f: Record<string, unknown>) =>
      ["analytics", "overview", serializeFilters(f)] as const,
    adoption: (f: Record<string, unknown>) =>
      ["analytics", "adoption", serializeFilters(f)] as const,
    delivery: (f: Record<string, unknown>) =>
      ["analytics", "delivery", serializeFilters(f)] as const,
    cost: (f: Record<string, unknown>) =>
      ["analytics", "cost", serializeFilters(f)] as const,
    quality: (f: Record<string, unknown>) =>
      ["analytics", "quality", serializeFilters(f)] as const,
    operations: (f: Record<string, unknown>) =>
      ["analytics", "operations", serializeFilters(f)] as const,
    session: (id: string) => ["analytics", "session", id] as const,
  },
  notifications: {
    list: () => ["notifications"] as const,
  },
  user: {
    profile: () => ["user", "profile"] as const,
    settings: () => ["user", "settings"] as const,
  },
} as const;
