import { z } from "zod";

const QueueDepthTrendSchema = z.object({
  timestamp: z.string().datetime(),
  depth: z.number().int().nonnegative(),
});

const FailureCategorySchema = z.object({
  failure_reason: z.string(),
  count: z.number().int().nonnegative(),
  percentage: z.number(),
});

export const OperationsResponseSchema = z.object({
  data: z.object({
    queue_depth: z.object({
      current: z.number().int().nonnegative(),
      trend: z.array(QueueDepthTrendSchema),
    }),
    wait_time: z.object({
      median_ms: z.number().nonnegative(),
      p95_ms: z.number().nonnegative(),
      p99_ms: z.number().nonnegative(),
    }),
    failure_rate: z.object({
      total_failed: z.number().int().nonnegative(),
      total_tasks: z.number().int().nonnegative(),
      percentage: z.number(),
      by_category: z.array(FailureCategorySchema),
    }),
    sla_compliance: z.object({
      within_sla: z.number().int().nonnegative(),
      total_tasks: z.number().int().nonnegative(),
      compliance_percent: z.number(),
      sla_target_ms: z.number().nonnegative(),
    }),
  }),
  meta: z.object({
    time_range: z.string(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
    freshness: z.string().optional(),
  }),
});

export type OperationsResponse = z.infer<typeof OperationsResponseSchema>;
