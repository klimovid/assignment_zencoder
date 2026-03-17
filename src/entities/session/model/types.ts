import { z } from "zod";

// --- DiffFile ---

export const DiffHunkSchema = z.object({
  oldStart: z.number().int().nonnegative(),
  oldLines: z.number().int().nonnegative(),
  newStart: z.number().int().nonnegative(),
  newLines: z.number().int().nonnegative(),
  content: z.string(),
});

export const DiffFileSchema = z.object({
  path: z.string().min(1),
  hunks: z.array(DiffHunkSchema),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
});

// --- Steps ---

const BaseStepSchema = z.object({
  id: z.string().min(1),
  index: z.number().int().nonnegative(),
  status: z.enum(["success", "error", "skipped"]),
  startedAt: z.string().datetime(),
  duration: z.number().nonnegative(),
  cost: z.number().nonnegative(),
});

export const ThinkStepSchema = BaseStepSchema.extend({
  type: z.literal("think"),
  model: z.string().min(1),
  tokensIn: z.number().int().nonnegative(),
  tokensOut: z.number().int().nonnegative(),
  promptSummary: z.string(),
  responseSummary: z.string(),
  reasoningExcerpt: z.string().optional(),
});

export const ActStepSchema = BaseStepSchema.extend({
  type: z.literal("act"),
  toolName: z.string().min(1),
  arguments: z.record(z.string(), z.any()),
  resultSummary: z.string(),
});

export const ObserveStepSchema = BaseStepSchema.extend({
  type: z.literal("observe"),
  diffs: z.array(DiffFileSchema),
  testOutput: z.string().optional(),
  ciResult: z
    .object({
      passed: z.boolean(),
      summary: z.string(),
    })
    .optional(),
});

export const SessionStepSchema = z.discriminatedUnion("type", [
  ThinkStepSchema,
  ActStepSchema,
  ObserveStepSchema,
]);

// --- Session ---

export const SessionSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  status: z.enum(["running", "completed", "failed"]),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  totalCost: z.number().nonnegative(),
  totalDuration: z.number().nonnegative(),
  steps: z.array(SessionStepSchema),
});

// --- Inferred types ---

export type DiffHunk = z.infer<typeof DiffHunkSchema>;
export type DiffFile = z.infer<typeof DiffFileSchema>;
export type ThinkStep = z.infer<typeof ThinkStepSchema>;
export type ActStep = z.infer<typeof ActStepSchema>;
export type ObserveStep = z.infer<typeof ObserveStepSchema>;
export type SessionStep = z.infer<typeof SessionStepSchema>;
export type Session = z.infer<typeof SessionSchema>;
