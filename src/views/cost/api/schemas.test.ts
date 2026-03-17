import { CostResponseSchema } from "./schemas";

const validResponse = {
  data: {
    current_spend: { value: 4500, budget_limit: 10000, utilization_percent: 45 },
    spend_by_team: [
      { team_id: "team-1", team_name: "Platform", spend_usd: 2500, percentage: 55.6 },
      { team_id: "team-2", team_name: "Backend", spend_usd: 2000, percentage: 44.4 },
    ],
    spend_by_model: [
      { model: "claude-sonnet", spend_usd: 3000, percentage: 66.7, tokens_in: 5000000, tokens_out: 1000000 },
      { model: "gpt-4o", spend_usd: 1500, percentage: 33.3, tokens_in: 2000000, tokens_out: 500000 },
    ],
    cost_per_task: { average: 0.45, median: 0.38, min: 0.05, max: 2.10 },
    cost_per_merged_pr: { average: 1.20, median: 0.95, min: 0.15, max: 5.50 },
    forecast: {
      end_of_period_estimate: 9200,
      confidence_range: { low: 8500, high: 10100 },
      trend_direction: "up" as const,
    },
  },
  meta: {
    time_range: "30d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
  },
};

describe("CostResponseSchema", () => {
  it("accepts valid response", () => {
    const result = CostResponseSchema.parse(validResponse);
    expect(result.data.current_spend.value).toBe(4500);
    expect(result.data.forecast.trend_direction).toBe("up");
  });

  it("accepts all trend directions", () => {
    for (const dir of ["up", "down", "stable"] as const) {
      const result = CostResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          forecast: { ...validResponse.data.forecast, trend_direction: dir },
        },
      });
      expect(result.data.forecast.trend_direction).toBe(dir);
    }
  });

  it("accepts empty team and model arrays", () => {
    const result = CostResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        spend_by_team: [],
        spend_by_model: [],
      },
    });
    expect(result.data.spend_by_team).toHaveLength(0);
  });

  it("rejects missing forecast", () => {
    const { forecast: _, ...noForecast } = validResponse.data;
    expect(() =>
      CostResponseSchema.parse({ data: noForecast, meta: validResponse.meta }),
    ).toThrow();
  });
});
