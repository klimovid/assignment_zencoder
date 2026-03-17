import { z } from "zod";

const ReviewOutcomeDistributionSchema = z.object({
  outcome: z.string(),
  count: z.number().int().nonnegative(),
  percentage: z.number(),
});

const ViolationDetailSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  resource: z.string(),
  message: z.string(),
});

const PolicyViolationSchema = z.object({
  violation_type: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  count: z.number().int().nonnegative(),
  latest_timestamp: z.string().datetime(),
  details: z.array(ViolationDetailSchema),
});

export const QualityResponseSchema = z.object({
  data: z.object({
    ci_pass_rate: z.object({
      first_run_passed: z.number(),
      first_run_failed: z.number(),
      total_runs: z.number().int().nonnegative(),
    }),
    review_outcomes: z.object({
      approved: z.number().int().nonnegative(),
      changes_requested: z.number().int().nonnegative(),
      closed_unmerged: z.number().int().nonnegative(),
      distribution: z.array(ReviewOutcomeDistributionSchema),
    }),
    policy_violations: z.array(PolicyViolationSchema),
  }),
  meta: z.object({
    time_range: z.string(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
  }),
});

export type QualityResponse = z.infer<typeof QualityResponseSchema>;
