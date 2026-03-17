"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "@shared/ui/button";
import { NotificationItem } from "@entities/notification/ui/NotificationItem";
import type { NotificationStore } from "@entities/notification/model/NotificationStore";

interface NotificationCenterProps {
  store: NotificationStore;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const NotificationCenter = observer(function NotificationCenter({
  store,
  onMarkRead,
  onDismiss,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="size-4" />
        {store.unreadCount > 0 && (
          <span
            aria-live="polite"
            className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
          >
            {store.unreadCount > 9 ? "9+" : store.unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="region"
          aria-label="Notification list"
          className="absolute right-0 top-full z-50 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border bg-popover p-2 shadow-lg"
        >
          {store.notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            <div role="list">
              {store.notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={onMarkRead}
                  onDismiss={onDismiss}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
