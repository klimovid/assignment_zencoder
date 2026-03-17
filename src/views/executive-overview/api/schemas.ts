import { z } from "zod";
import { KPIValueSchema } from "@entities/metric/model/types";

export const OverviewMetaSchema = z.object({
  time_range: z.string(),
  org_id: z.string(),
  generated_at: z.string().datetime(),
});

const AdoptionTrendPointSchema = z.object({
  date: z.string(),
  active_users: z.number().nonnegative(),
});

const OutcomeVsCostPointSchema = z.object({
  week: z.string(),
  outcomes: z.number().int().nonnegative(),
  total_spend: z.number().nonnegative(),
});

const RiskAlertSchema = z.object({
  id: z.string(),
  violation_type: z.string(),
  description: z.string(),
  repository: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["pending_review", "auto_fixed", "dismissed"]),
  detected_at: z.string(),
});

export const OverviewResponseSchema = z.object({
  data: z.object({
    active_users: KPIValueSchema,
    sessions_total: KPIValueSchema,
    accepted_outcome_rate: KPIValueSchema,
    cost_per_task: KPIValueSchema,
    ci_pass_rate: KPIValueSchema,
    adoption_trend: z.array(AdoptionTrendPointSchema),
    outcome_vs_cost: z.array(OutcomeVsCostPointSchema),
    risk_alerts: z.array(RiskAlertSchema),
  }),
  meta: OverviewMetaSchema,
});

export type OverviewResponse = z.infer<typeof OverviewResponseSchema>;
