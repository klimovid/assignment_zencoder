import { NotificationStore } from "./NotificationStore";
import type { Notification } from "./types";

const makeNotification = (overrides?: Partial<Notification>): Notification => ({
  id: "notif-1",
  type: "budget_alert",
  title: "Budget alert",
  message: "Budget threshold reached",
  severity: "warning",
  read: false,
  acknowledged: false,
  timestamp: "2024-01-15T10:00:00Z",
  ...overrides,
});

describe("NotificationStore", () => {
  it("initializes with empty notifications", () => {
    const store = new NotificationStore();
    expect(store.notifications).toEqual([]);
    expect(store.unreadCount).toBe(0);
  });

  it("setNotifications replaces all notifications", () => {
    const store = new NotificationStore();
    const items = [
      makeNotification({ id: "n1", read: false }),
      makeNotification({ id: "n2", read: true }),
    ];
    store.setNotifications(items);
    expect(store.notifications).toHaveLength(2);
  });

  it("unreadCount returns count of unread notifications", () => {
    const store = new NotificationStore();
    store.setNotifications([
      makeNotification({ id: "n1", read: false }),
      makeNotification({ id: "n2", read: false }),
      makeNotification({ id: "n3", read: true }),
    ]);
    expect(store.unreadCount).toBe(2);
  });

  it("markRead marks a notification as read", () => {
    const store = new NotificationStore();
    store.setNotifications([
      makeNotification({ id: "n1", read: false }),
      makeNotification({ id: "n2", read: false }),
    ]);
    store.markRead("n1");
    expect(store.notifications.find((n) => n.id === "n1")?.read).toBe(true);
    expect(store.unreadCount).toBe(1);
  });

  it("markRead does nothing for unknown id", () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification({ id: "n1", read: false })]);
    store.markRead("unknown");
    expect(store.unreadCount).toBe(1);
  });

  it("dismiss removes a notification", () => {
    const store = new NotificationStore();
    store.setNotifications([
      makeNotification({ id: "n1" }),
      makeNotification({ id: "n2" }),
    ]);
    store.dismiss("n1");
    expect(store.notifications).toHaveLength(1);
    expect(store.notifications[0]?.id).toBe("n2");
  });

  it("dismiss does nothing for unknown id", () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification({ id: "n1" })]);
    store.dismiss("unknown");
    expect(store.notifications).toHaveLength(1);
  });
});
