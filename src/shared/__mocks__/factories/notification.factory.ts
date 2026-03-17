import { faker } from "@faker-js/faker";
import type {
  Notification,
  NotificationListResponse,
} from "@entities/notification/model/types";

export function createNotification(overrides?: Partial<Notification>): Notification {
  const type = faker.helpers.arrayElement([
    "budget_alert",
    "sla_breach",
    "policy_violation",
  ] as const);

  return {
    id: faker.string.uuid(),
    type,
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    message: faker.lorem.sentence(),
    severity: faker.helpers.arrayElement(["info", "warning", "error"] as const),
    read: faker.datatype.boolean(),
    acknowledged: faker.datatype.boolean(),
    timestamp: faker.date.recent().toISOString(),
    action_url: `/dashboard/${faker.helpers.arrayElement(["cost", "operations", "quality"])}`,
    metadata: {
      alert_type: type,
      threshold: faker.number.int({ min: 50, max: 100 }),
      current_value: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
      team_id: faker.string.uuid(),
    },
    ...overrides,
  };
}

export function createNotificationList(
  count = 5,
  overrides?: Partial<NotificationListResponse>,
): NotificationListResponse {
  const notifications = Array.from({ length: count }, () => createNotification());
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    data: notifications,
    pagination: {
      has_more: false,
    },
    meta: {
      unread_count: unreadCount,
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
