import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@shared/lib/utils";
import type { Notification } from "../model/types";

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const severityConfig = {
  info: {
    icon: Info,
    className: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    icon: AlertCircle,
    className: "text-red-600 dark:text-red-400",
  },
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: NotificationItemProps) {
  const { icon: Icon, className: iconClassName } =
    severityConfig[notification.severity];

  return (
    <div
      role="listitem"
      className={cn(
        "flex gap-3 rounded-lg p-3 transition-colors",
        notification.read ? "opacity-60" : "bg-muted/50",
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClassName)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        <time
          className="text-xs text-muted-foreground"
          dateTime={notification.timestamp}
        >
          {formatTimestamp(notification.timestamp)}
        </time>
      </div>
      <div className="flex shrink-0 gap-1">
        {!notification.read && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label={`Mark "${notification.title}" as read`}
          >
            Mark read
          </button>
        )}
        {onDismiss && (
          <button
            onClick={() => onDismiss(notification.id)}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label={`Dismiss "${notification.title}"`}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
