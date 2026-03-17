import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationCenter } from "./NotificationCenter";
import { NotificationStore } from "@entities/notification/model/NotificationStore";
import type { Notification } from "@entities/notification/model/types";

const makeNotification = (overrides?: Partial<Notification>): Notification => ({
  id: "n1",
  type: "budget_alert",
  title: "Budget alert",
  message: "Budget threshold reached",
  severity: "warning",
  read: false,
  acknowledged: false,
  timestamp: new Date().toISOString(),
  ...overrides,
});

describe("NotificationCenter", () => {
  it("renders bell button", () => {
    const store = new NotificationStore();
    render(<NotificationCenter store={store} />);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("shows unread badge when there are unread notifications", () => {
    const store = new NotificationStore();
    store.setNotifications([
      makeNotification({ id: "n1", read: false }),
      makeNotification({ id: "n2", read: false }),
    ]);
    render(<NotificationCenter store={store} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("caps badge at 9+", () => {
    const store = new NotificationStore();
    store.setNotifications(
      Array.from({ length: 12 }, (_, i) =>
        makeNotification({ id: `n${i}`, read: false }),
      ),
    );
    render(<NotificationCenter store={store} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("hides badge when all read", () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification({ read: true })]);
    render(<NotificationCenter store={store} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification()]);
    render(<NotificationCenter store={store} />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByRole("region", { name: "Notification list" })).toBeInTheDocument();
    expect(screen.getByText("Budget alert")).toBeInTheDocument();
  });

  it("shows empty message when no notifications", async () => {
    const store = new NotificationStore();
    render(<NotificationCenter store={store} />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });

  it("calls onMarkRead when mark read is clicked", async () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification({ id: "n1", read: false })]);
    const onMarkRead = jest.fn();

    render(<NotificationCenter store={store} onMarkRead={onMarkRead} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Notifications" }));
    await user.click(screen.getByRole("button", { name: /Mark.*read/i }));

    expect(onMarkRead).toHaveBeenCalledWith("n1");
  });

  it("calls onDismiss when dismiss is clicked", async () => {
    const store = new NotificationStore();
    store.setNotifications([makeNotification({ id: "n1" })]);
    const onDismiss = jest.fn();

    render(<NotificationCenter store={store} onDismiss={onDismiss} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Notifications" }));
    await user.click(screen.getByRole("button", { name: /Dismiss/i }));

    expect(onDismiss).toHaveBeenCalledWith("n1");
  });
});
