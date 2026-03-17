import { makeAutoObservable } from "mobx";
import type { Notification } from "./types";

export class NotificationStore {
  notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  setNotifications(notifications: Notification[]) {
    this.notifications = notifications;
  }

  markRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  dismiss(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }
}
