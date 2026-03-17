import { OverviewResponseSchema } from "./schemas";

const validResponse = {
  data: {
    active_users: { current: 150, previous: 120, delta_percent: 25 },
    sessions_total: { current: 3200, previous: 2800, delta_percent: 14.3 },
    accepted_outcome_rate: { current: 87.5, previous: 82.1, delta_percent: 6.6 },
    cost_per_task: { current: 0.45, previous: 0.52, delta_percent: -13.5 },
    ci_pass_rate: { current: 94.2, previous: 91.8, delta_percent: 2.6 },
  },
  meta: {
    time_range: "30d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
  },
};

describe("OverviewResponseSchema", () => {
  it("accepts valid response", () => {
    const result = OverviewResponseSchema.parse(validResponse);
    expect(result.data.active_users.current).toBe(150);
    expect(result.meta.time_range).toBe("30d");
  });

  it("accepts zero KPI values", () => {
    const zeroKPI = { current: 0, previous: 0, delta_percent: 0 };
    const result = OverviewResponseSchema.parse({
      ...validResponse,
      data: {
        active_users: zeroKPI,
        sessions_total: zeroKPI,
        accepted_outcome_rate: zeroKPI,
        cost_per_task: zeroKPI,
        ci_pass_rate: zeroKPI,
      },
    });
    expect(result.data.active_users.current).toBe(0);
  });

  it("accepts negative delta_percent", () => {
    const result = OverviewResponseSchema.parse(validResponse);
    expect(result.data.cost_per_task.delta_percent).toBe(-13.5);
  });

  it("rejects response missing a KPI field", () => {
    const { ci_pass_rate: _, ...missingKPI } = validResponse.data;
    expect(() =>
      OverviewResponseSchema.parse({ data: missingKPI, meta: validResponse.meta }),
    ).toThrow();
  });

  it("rejects response missing meta", () => {
    expect(() =>
      OverviewResponseSchema.parse({ data: validResponse.data }),
    ).toThrow();
  });
});
