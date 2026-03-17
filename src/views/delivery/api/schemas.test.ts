import { DeliveryResponseSchema } from "./schemas";

const validResponse = {
  data: {
    pr_throughput: {
      agent_prs_opened: 120,
      agent_prs_merged: 95,
      non_agent_prs_merged: 200,
      trend: [
        { date: "2024-01-08", agent_opened: 15, agent_merged: 12, non_agent_merged: 25 },
        { date: "2024-01-15", agent_opened: 18, agent_merged: 14, non_agent_merged: 28 },
      ],
    },
    median_time_to_merge: { value: 3600000, unit: "ms" as const },
    time_to_first_pr: { value: 1800000, unit: "ms" as const },
    time_to_completion: { value: 7200000, unit: "ms" as const },
    agent_vs_non_agent_comparison: [
      { metric: "PR merge time", agent_value: 2.5, non_agent_value: 4.8, agent_percentage: 48 },
      { metric: "CI pass rate", agent_value: 94, non_agent_value: 89, agent_percentage: 106 },
    ],
  },
  meta: {
    time_range: "30d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
  },
};

describe("DeliveryResponseSchema", () => {
  it("accepts valid response", () => {
    const result = DeliveryResponseSchema.parse(validResponse);
    expect(result.data.pr_throughput.agent_prs_merged).toBe(95);
    expect(result.data.agent_vs_non_agent_comparison).toHaveLength(2);
  });

  it("accepts all time unit values", () => {
    for (const unit of ["ms", "s", "m", "h"] as const) {
      const result = DeliveryResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          median_time_to_merge: { value: 100, unit },
        },
      });
      expect(result.data.median_time_to_merge.unit).toBe(unit);
    }
  });

  it("accepts empty trend and comparison arrays", () => {
    const result = DeliveryResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        pr_throughput: { ...validResponse.data.pr_throughput, trend: [] },
        agent_vs_non_agent_comparison: [],
      },
    });
    expect(result.data.pr_throughput.trend).toHaveLength(0);
  });

  it("rejects invalid time unit", () => {
    expect(() =>
      DeliveryResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          median_time_to_merge: { value: 100, unit: "days" },
        },
      }),
    ).toThrow();
  });
});
