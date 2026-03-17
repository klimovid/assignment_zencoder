import { OperationsResponseSchema } from "./schemas";

const validResponse = {
  data: {
    queue_depth: {
      current: 12,
      trend: [
        { timestamp: "2024-01-15T09:00:00Z", depth: 8 },
        { timestamp: "2024-01-15T09:30:00Z", depth: 12 },
      ],
    },
    wait_time: { median_ms: 45000, p95_ms: 120000, p99_ms: 300000 },
    failure_rate: {
      total_failed: 15,
      total_tasks: 500,
      percentage: 3.0,
      by_category: [
        { failure_reason: "timeout", count: 8, percentage: 53.3 },
        { failure_reason: "oom", count: 5, percentage: 33.3 },
        { failure_reason: "ci_failure", count: 2, percentage: 13.3 },
      ],
    },
    sla_compliance: {
      within_sla: 470,
      total_tasks: 500,
      compliance_percent: 94.0,
      sla_target_ms: 600000,
    },
  },
  meta: {
    time_range: "7d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
    freshness: "1-5 minutes",
  },
};

describe("OperationsResponseSchema", () => {
  it("accepts valid response", () => {
    const result = OperationsResponseSchema.parse(validResponse);
    expect(result.data.queue_depth.current).toBe(12);
    expect(result.data.sla_compliance.compliance_percent).toBe(94.0);
  });

  it("accepts response without optional freshness", () => {
    const { freshness: _, ...metaNoFreshness } = validResponse.meta;
    const result = OperationsResponseSchema.parse({
      ...validResponse,
      meta: metaNoFreshness,
    });
    expect(result.meta.freshness).toBeUndefined();
  });

  it("accepts empty failure categories", () => {
    const result = OperationsResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        failure_rate: { ...validResponse.data.failure_rate, by_category: [] },
      },
    });
    expect(result.data.failure_rate.by_category).toHaveLength(0);
  });

  it("accepts empty queue trend", () => {
    const result = OperationsResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        queue_depth: { current: 0, trend: [] },
      },
    });
    expect(result.data.queue_depth.trend).toHaveLength(0);
  });

  it("rejects missing sla_compliance", () => {
    const { sla_compliance: _, ...noSla } = validResponse.data;
    expect(() =>
      OperationsResponseSchema.parse({ data: noSla, meta: validResponse.meta }),
    ).toThrow();
  });
});
