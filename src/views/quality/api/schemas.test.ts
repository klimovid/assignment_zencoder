import { QualityResponseSchema } from "./schemas";

const validResponse = {
  data: {
    ci_pass_rate: { first_run_passed: 85.5, first_run_failed: 14.5, total_runs: 500 },
    review_outcomes: {
      approved: 280,
      changes_requested: 45,
      closed_unmerged: 12,
      distribution: [
        { outcome: "approved", count: 280, percentage: 83.1 },
        { outcome: "changes_requested", count: 45, percentage: 13.4 },
        { outcome: "closed_unmerged", count: 12, percentage: 3.6 },
      ],
    },
    policy_violations: [
      {
        violation_type: "secret_exposure",
        severity: "critical" as const,
        count: 2,
        latest_timestamp: "2024-01-14T15:30:00Z",
        details: [
          {
            id: "viol-1",
            timestamp: "2024-01-14T15:30:00Z",
            resource: "src/config.ts",
            message: "Potential API key detected",
          },
        ],
      },
    ],
  },
  meta: {
    time_range: "30d",
    org_id: "org-123",
    generated_at: "2024-01-15T10:00:00Z",
  },
};

describe("QualityResponseSchema", () => {
  it("accepts valid response", () => {
    const result = QualityResponseSchema.parse(validResponse);
    expect(result.data.ci_pass_rate.total_runs).toBe(500);
    expect(result.data.policy_violations).toHaveLength(1);
  });

  it("accepts all severity levels", () => {
    for (const sev of ["low", "medium", "high", "critical"] as const) {
      const result = QualityResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          policy_violations: [
            { ...validResponse.data.policy_violations[0]!, severity: sev },
          ],
        },
      });
      expect(result.data.policy_violations[0]!.severity).toBe(sev);
    }
  });

  it("accepts empty arrays", () => {
    const result = QualityResponseSchema.parse({
      ...validResponse,
      data: {
        ...validResponse.data,
        review_outcomes: { ...validResponse.data.review_outcomes, distribution: [] },
        policy_violations: [],
      },
    });
    expect(result.data.policy_violations).toHaveLength(0);
  });

  it("rejects invalid severity", () => {
    expect(() =>
      QualityResponseSchema.parse({
        ...validResponse,
        data: {
          ...validResponse.data,
          policy_violations: [
            { ...validResponse.data.policy_violations[0]!, severity: "extreme" },
          ],
        },
      }),
    ).toThrow();
  });
});
