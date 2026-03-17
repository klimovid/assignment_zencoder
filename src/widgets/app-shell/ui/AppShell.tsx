"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@shared/ui/button";
import { SidebarNav } from "@widgets/sidebar-nav/ui/SidebarNav";
import { Breadcrumbs } from "@widgets/breadcrumbs/ui/Breadcrumbs";
import { cn } from "@shared/lib/utils";

interface AppShellProps {
  collapsed?: boolean;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ collapsed = false, headerActions, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden border-r bg-card md:block",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          {!collapsed && <span className="text-sm font-semibold">Dashboard</span>}
        </div>
        <SidebarNav collapsed={collapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card md:hidden">
            <div className="flex h-14 items-center border-b px-4">
              <span className="text-sm font-semibold">Dashboard</span>
            </div>
            <SidebarNav />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <Menu className="size-4" />
          </Button>

          <Breadcrumbs />
          <div className="flex-1" />
          {headerActions && (
            <div className="flex items-center gap-1">{headerActions}</div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
