import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "budget_alert",
  "sla_breach",
  "policy_violation",
]);

export const NotificationSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
]);

export const NotificationMetadataSchema = z.object({
  alert_type: z.string().optional(),
  threshold: z.number().optional(),
  current_value: z.number().optional(),
  team_id: z.string().optional(),
  violation_type: z.string().optional(),
});

export const NotificationSchema = z.object({
  id: z.string().min(1),
  type: NotificationTypeSchema,
  title: z.string().min(1),
  message: z.string(),
  severity: NotificationSeveritySchema,
  read: z.boolean(),
  acknowledged: z.boolean(),
  timestamp: z.string().datetime(),
  action_url: z.string().optional(),
  metadata: NotificationMetadataSchema.optional(),
});

export const NotificationPaginationSchema = z.object({
  next_cursor: z.string().optional(),
  has_more: z.boolean(),
});

export const NotificationListResponseSchema = z.object({
  data: z.array(NotificationSchema),
  pagination: NotificationPaginationSchema,
  meta: z.object({
    unread_count: z.number().int().nonnegative(),
    org_id: z.string(),
    generated_at: z.string().datetime(),
  }),
});

export const NotificationPatchResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    read: z.boolean(),
    acknowledged: z.boolean(),
    updated_at: z.string().datetime(),
  }),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationSeverity = z.infer<typeof NotificationSeveritySchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
export type NotificationPatchResponse = z.infer<typeof NotificationPatchResponseSchema>;
