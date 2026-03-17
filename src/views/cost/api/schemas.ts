import { z } from "zod";

const SpendByTeamSchema = z.object({
  team_id: z.string(),
  team_name: z.string(),
  spend_usd: z.number().nonnegative(),
  percentage: z.number(),
});

const SpendByModelSchema = z.object({
  model: z.string(),
  spend_usd: z.number().nonnegative(),
  percentage: z.number(),
  tokens_in: z.number().int().nonnegative(),
  tokens_out: z.number().int().nonnegative(),
});

const CostStatsSchema = z.object({
  average: z.number().nonnegative(),
  median: z.number().nonnegative(),
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
});

export const CostResponseSchema = z.object({
  data: z.object({
    current_spend: z.object({
      value: z.number().nonnegative(),
      budget_limit: z.number().nonnegative(),
      utilization_percent: z.number(),
    }),
    spend_by_team: z.array(SpendByTeamSchema),
    spend_by_model: z.array(SpendByModelSchema),
    cost_per_task: CostStatsSchema,
    cost_per_merged_pr: CostStatsSchema,
    forecast: z.object({
      end_of_period_estimate: z.number().nonnegative(),
      confidence_range: z.object({
        low: z.number().nonnegative(),
        high: z.number().nonnegative(),
      }),
      trend_direction: z.enum(["up", "down", "stable"]),
    }),
  }),
  meta: z.object({
    time_range: z.string(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
  }),
});

export type CostResponse = z.infer<typeof CostResponseSchema>;
