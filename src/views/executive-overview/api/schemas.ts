import { z } from "zod";
import { KPIValueSchema } from "@entities/metric/model/types";

export const OverviewMetaSchema = z.object({
  time_range: z.string(),
  org_id: z.string(),
  generated_at: z.string().datetime(),
});

export const OverviewResponseSchema = z.object({
  data: z.object({
    active_users: KPIValueSchema,
    sessions_total: KPIValueSchema,
    accepted_outcome_rate: KPIValueSchema,
    cost_per_task: KPIValueSchema,
    ci_pass_rate: KPIValueSchema,
  }),
  meta: OverviewMetaSchema,
});

export type OverviewResponse = z.infer<typeof OverviewResponseSchema>;
