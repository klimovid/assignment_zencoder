import { faker } from "@faker-js/faker";
import { NotificationSchema, NotificationListResponseSchema } from "@entities/notification/model/types";
import { createNotification, createNotificationList } from "./notification.factory";

beforeEach(() => faker.seed(42));

describe("Notification factories", () => {
  it("createNotification produces Zod-valid data", () => {
    const notif = createNotification();
    expect(() => NotificationSchema.parse(notif)).not.toThrow();
  });

  it("createNotification respects overrides", () => {
    const notif = createNotification({ read: true, severity: "error" });
    expect(notif.read).toBe(true);
    expect(notif.severity).toBe("error");
  });

  it("createNotificationList produces Zod-valid data", () => {
    const list = createNotificationList(3);
    expect(() => NotificationListResponseSchema.parse(list)).not.toThrow();
    expect(list.data).toHaveLength(3);
  });

  it("createNotificationList tracks unread count correctly", () => {
    const list = createNotificationList(10);
    const actualUnread = list.data.filter((n) => !n.read).length;
    expect(list.meta.unread_count).toBe(actualUnread);
  });
});
