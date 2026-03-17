import { z } from "zod";

export const DeltaValueSchema = z.object({
  value: z.number(),
  direction: z.enum(["up", "down", "neutral"]),
});

export const KPIValueSchema = z.object({
  current: z.number(),
  previous: z.number(),
  delta_percent: z.number(),
});

export const ChartDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  label: z.string().optional(),
});

export type DeltaValue = z.infer<typeof DeltaValueSchema>;
export type KPIValue = z.infer<typeof KPIValueSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
