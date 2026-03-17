import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "../model/types";

const baseNotification: Notification = {
  id: "n1",
  type: "budget_alert",
  title: "Budget threshold reached",
  message: "Team Alpha has exceeded 90% of budget",
  severity: "warning",
  read: false,
  acknowledged: false,
  timestamp: new Date().toISOString(),
};

describe("NotificationItem", () => {
  it("renders title and message", () => {
    render(<NotificationItem notification={baseNotification} />);
    expect(screen.getByText("Budget threshold reached")).toBeInTheDocument();
    expect(
      screen.getByText("Team Alpha has exceeded 90% of budget"),
    ).toBeInTheDocument();
  });

  it("renders timestamp", () => {
    render(<NotificationItem notification={baseNotification} />);
    const time = screen.getByText("just now");
    expect(time).toBeInTheDocument();
    expect(time.closest("time")).toHaveAttribute(
      "datetime",
      baseNotification.timestamp,
    );
  });

  it("renders severity icon for warning", () => {
    const { container } = render(
      <NotificationItem notification={baseNotification} />,
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders severity icon for error", () => {
    render(
      <NotificationItem
        notification={{ ...baseNotification, severity: "error" }}
      />,
    );
    expect(screen.getByText("Budget threshold reached")).toBeInTheDocument();
  });

  it("renders severity icon for info", () => {
    render(
      <NotificationItem
        notification={{ ...baseNotification, severity: "info" }}
      />,
    );
    expect(screen.getByText("Budget threshold reached")).toBeInTheDocument();
  });

  it("shows mark read button for unread notification", async () => {
    const onMarkRead = jest.fn();
    render(
      <NotificationItem
        notification={baseNotification}
        onMarkRead={onMarkRead}
      />,
    );

    const btn = screen.getByRole("button", {
      name: 'Mark "Budget threshold reached" as read',
    });
    await userEvent.click(btn);
    expect(onMarkRead).toHaveBeenCalledWith("n1");
  });

  it("hides mark read button for read notification", () => {
    render(
      <NotificationItem
        notification={{ ...baseNotification, read: true }}
        onMarkRead={jest.fn()}
      />,
    );
    expect(screen.queryByText("Mark read")).not.toBeInTheDocument();
  });

  it("shows dismiss button when onDismiss provided", async () => {
    const onDismiss = jest.fn();
    render(
      <NotificationItem
        notification={baseNotification}
        onDismiss={onDismiss}
      />,
    );

    const btn = screen.getByRole("button", {
      name: 'Dismiss "Budget threshold reached"',
    });
    await userEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledWith("n1");
  });

  it("applies reduced opacity for read notifications", () => {
    const { container } = render(
      <NotificationItem
        notification={{ ...baseNotification, read: true }}
      />,
    );
    const item = container.querySelector("[role=listitem]");
    expect(item).toHaveClass("opacity-60");
  });

  it("passes jest-axe", async () => {
    const { container } = render(
      <div role="list">
        <NotificationItem
          notification={baseNotification}
          onMarkRead={jest.fn()}
          onDismiss={jest.fn()}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
