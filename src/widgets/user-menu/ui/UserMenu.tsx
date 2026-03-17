"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User, Settings, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@shared/ui/button";

interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface UserMenuProps {
  user: UserInfo;
  onLogout: () => void;
  onNavigateSettings: () => void;
}

export function UserMenu({ user, onLogout, onNavigateSettings }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={24}
            height={24}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <User className="size-4" />
        )}
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="User actions"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-popover p-1 shadow-lg"
        >
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
          </div>

          <button
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
            onClick={() => { onNavigateSettings(); setOpen(false); }}
          >
            <Settings className="size-3.5" />
            Settings
          </button>

          <a
            role="menuitem"
            href="#"
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
          >
            <ExternalLink className="size-3.5" />
            Identity Provider
          </a>

          <div className="border-t" />

          <button
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-muted"
            onClick={() => { onLogout(); setOpen(false); }}
          >
            <LogOut className="size-3.5" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
