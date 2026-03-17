import { z } from "zod";

const PrThroughputTrendSchema = z.object({
  date: z.string(),
  agent_opened: z.number().int().nonnegative(),
  agent_merged: z.number().int().nonnegative(),
  non_agent_merged: z.number().int().nonnegative(),
});

const TimeDurationSchema = z.object({
  value: z.number().nonnegative(),
  unit: z.enum(["ms", "s", "m", "h"]),
});

const AgentComparisonSchema = z.object({
  metric: z.string(),
  agent_value: z.number(),
  non_agent_value: z.number(),
  agent_percentage: z.number(),
});

export const DeliveryResponseSchema = z.object({
  data: z.object({
    pr_throughput: z.object({
      agent_prs_opened: z.number().int().nonnegative(),
      agent_prs_merged: z.number().int().nonnegative(),
      non_agent_prs_merged: z.number().int().nonnegative(),
      trend: z.array(PrThroughputTrendSchema),
    }),
    median_time_to_merge: TimeDurationSchema,
    time_to_first_pr: TimeDurationSchema,
    time_to_completion: TimeDurationSchema,
    agent_vs_non_agent_comparison: z.array(AgentComparisonSchema),
  }),
  meta: z.object({
    time_range: z.string(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
  }),
});

export type DeliveryResponse = z.infer<typeof DeliveryResponseSchema>;
