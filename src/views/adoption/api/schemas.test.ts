import { AdoptionResponseSchema } from "./schemas";

const validResponse = {
  data: {
    dau_wau_mau: {
      dau: 45,
      wau: 120,
      mau: 280,
      trend: [
        { date: "2024-01-08", dau: 40, wau: 110, mau: 260 },
        { date: "2024-01-15", dau: 45, wau: 120, mau: 280 },
      ],
    },
    sessions_by_team: [
      { team_id: "team-1", team_name: "Platform", sessions_count: 150, percentage: 45.5 },
      { team_id: "team-2", team_name: "Backend", sessions_count: 180, percentage: 54.5 },
    ],
    task_funnel: {
      created: 500,
      started: 450,
      completed: 380,
      pr_opened: 350,
      pr_reviewed: 320,
      pr_merged: 280,
    },
    task_type_distribution: [
      { type: "bugfix" as const, count: 120, percentage: 31.6 },
      { type: "feature" as const, count: 180, percentage: 47.4 },
      { type: "refactor" as const, count: 50, percentage: 13.2 },
      { type: "test" as const, count: 20, percentage: 5.3 },
      { type: "ops" as const, count: 10, percentage: 2.6 },
    ],
    integration_coverage: {
      repos_connected: 25,
      ci_providers: 2,
      ticketing_providers: 1,
    },
  },
  meta: {
    time_range: "30d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
  },
};

describe("AdoptionResponseSchema", () => {
  it("accepts valid response", () => {
    const result = AdoptionResponseSchema.parse(validResponse);
    expect(result.data.dau_wau_mau.dau).toBe(45);
    expect(result.data.sessions_by_team).toHaveLength(2);
    expect(result.data.task_type_distribution).toHaveLength(5);
  });

  it("accepts empty arrays", () => {
    const result = AdoptionResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        dau_wau_mau: { ...validResponse.data.dau_wau_mau, trend: [] },
        sessions_by_team: [],
        task_type_distribution: [],
      },
    });
    expect(result.data.sessions_by_team).toHaveLength(0);
  });

  it("rejects invalid task type", () => {
    expect(() =>
      AdoptionResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          task_type_distribution: [
            { type: "invalid", count: 10, percentage: 100 },
          ],
        },
      }),
    ).toThrow();
  });

  it("rejects missing funnel fields", () => {
    const { pr_merged: _, ...incompleteFunnel } = validResponse.data.task_funnel;
    expect(() =>
      AdoptionResponseSchema.parse({
        ...validResponse,
        data: { ...validResponse.data, task_funnel: incompleteFunnel },
      }),
    ).toThrow();
  });
});
