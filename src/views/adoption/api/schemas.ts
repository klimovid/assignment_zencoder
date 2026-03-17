import { z } from "zod";

const DauWauMauTrendPointSchema = z.object({
  date: z.string(),
  dau: z.number().nonnegative(),
  wau: z.number().nonnegative(),
  mau: z.number().nonnegative(),
});

const SessionsByTeamSchema = z.object({
  team_id: z.string(),
  team_name: z.string(),
  sessions_count: z.number().int().nonnegative(),
  percentage: z.number(),
});

const TaskTypeDistributionSchema = z.object({
  type: z.enum(["bugfix", "feature", "refactor", "test", "ops"]),
  count: z.number().int().nonnegative(),
  percentage: z.number(),
});

export const AdoptionResponseSchema = z.object({
  data: z.object({
    dau_wau_mau: z.object({
      dau: z.number().nonnegative(),
      wau: z.number().nonnegative(),
      mau: z.number().nonnegative(),
      trend: z.array(DauWauMauTrendPointSchema),
    }),
    sessions_by_team: z.array(SessionsByTeamSchema),
    task_funnel: z.object({
      created: z.number().int().nonnegative(),
      started: z.number().int().nonnegative(),
      completed: z.number().int().nonnegative(),
      pr_opened: z.number().int().nonnegative(),
      pr_reviewed: z.number().int().nonnegative(),
      pr_merged: z.number().int().nonnegative(),
    }),
    task_type_distribution: z.array(TaskTypeDistributionSchema),
    integration_coverage: z.object({
      repos_connected: z.number().int().nonnegative(),
      ci_providers: z.number().int().nonnegative(),
      ticketing_providers: z.number().int().nonnegative(),
    }),
  }),
  meta: z.object({
    time_range: z.string(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
  }),
});

export type AdoptionResponse = z.infer<typeof AdoptionResponseSchema>;
