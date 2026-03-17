import {
  NotificationSchema,
  NotificationListResponseSchema,
  NotificationPatchResponseSchema,
  NotificationTypeSchema,
  NotificationSeveritySchema,
} from "./types";

const validNotification = {
  id: "notif-1",
  type: "budget_alert" as const,
  title: "Budget threshold reached",
  message: "Team Alpha has reached 90% of monthly budget",
  severity: "warning" as const,
  read: false,
  acknowledged: false,
  timestamp: "2024-01-15T10:30:00Z",
  action_url: "/dashboard/cost",
  metadata: {
    alert_type: "budget_90",
    threshold: 90,
    current_value: 4500,
    team_id: "team-alpha",
  },
};

describe("Notification entity schemas", () => {
  describe("NotificationTypeSchema", () => {
    it("accepts all valid types", () => {
      for (const type of ["budget_alert", "sla_breach", "policy_violation"]) {
        expect(NotificationTypeSchema.parse(type)).toBe(type);
      }
    });

    it("rejects invalid type", () => {
      expect(() => NotificationTypeSchema.parse("unknown")).toThrow();
    });
  });

  describe("NotificationSeveritySchema", () => {
    it("accepts all valid severities", () => {
      for (const sev of ["info", "warning", "error"]) {
        expect(NotificationSeveritySchema.parse(sev)).toBe(sev);
      }
    });
  });

  describe("NotificationSchema", () => {
    it("accepts valid notification", () => {
      const result = NotificationSchema.parse(validNotification);
      expect(result.id).toBe("notif-1");
      expect(result.type).toBe("budget_alert");
    });

    it("accepts notification without optional fields", () => {
      const { action_url: _, metadata: __, ...minimal } = validNotification;
      const result = NotificationSchema.parse(minimal);
      expect(result.action_url).toBeUndefined();
      expect(result.metadata).toBeUndefined();
    });

    it("rejects notification without id", () => {
      const { id: _, ...noId } = validNotification;
      expect(() => NotificationSchema.parse(noId)).toThrow();
    });

    it("rejects notification with empty title", () => {
      expect(() =>
        NotificationSchema.parse({ ...validNotification, title: "" }),
      ).toThrow();
    });

    it("accepts read and acknowledged as booleans", () => {
      const result = NotificationSchema.parse({
        ...validNotification,
        read: true,
        acknowledged: true,
      });
      expect(result.read).toBe(true);
      expect(result.acknowledged).toBe(true);
    });
  });

  describe("NotificationListResponseSchema", () => {
    it("accepts valid list response", () => {
      const result = NotificationListResponseSchema.parse({
        data: [validNotification],
        pagination: { has_more: false },
        meta: {
          unread_count: 1,
          org_id: "org-1",
          generated_at: "2024-01-15T10:30:00Z",
        },
      });
      expect(result.data).toHaveLength(1);
      expect(result.meta.unread_count).toBe(1);
    });

    it("accepts list with empty data array", () => {
      const result = NotificationListResponseSchema.parse({
        data: [],
        pagination: { has_more: false },
        meta: {
          unread_count: 0,
          org_id: "org-1",
          generated_at: "2024-01-15T10:30:00Z",
        },
      });
      expect(result.data).toHaveLength(0);
    });

    it("accepts pagination with next_cursor", () => {
      const result = NotificationListResponseSchema.parse({
        data: [validNotification],
        pagination: { has_more: true, next_cursor: "cursor-abc" },
        meta: {
          unread_count: 5,
          org_id: "org-1",
          generated_at: "2024-01-15T10:30:00Z",
        },
      });
      expect(result.pagination.has_more).toBe(true);
      expect(result.pagination.next_cursor).toBe("cursor-abc");
    });
  });

  describe("NotificationPatchResponseSchema", () => {
    it("accepts valid patch response", () => {
      const result = NotificationPatchResponseSchema.parse({
        data: {
          id: "notif-1",
          read: true,
          acknowledged: false,
          updated_at: "2024-01-15T10:35:00Z",
        },
      });
      expect(result.data.read).toBe(true);
    });
  });
});
