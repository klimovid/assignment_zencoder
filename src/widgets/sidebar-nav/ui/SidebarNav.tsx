"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import {
  LayoutDashboard,
  Users,
  Rocket,
  DollarSign,
  Shield,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@shared/lib/utils";
import { DASHBOARD_ROUTES } from "@shared/config/routes";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";
import { useAuthStore } from "@features/auth/model/AuthContext";

const navItems = [
  { label: "Executive Overview", href: DASHBOARD_ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Adoption & Usage", href: DASHBOARD_ROUTES.adoption, icon: Users },
  { label: "Delivery Impact", href: DASHBOARD_ROUTES.delivery, icon: Rocket },
  { label: "Cost & Budgets", href: DASHBOARD_ROUTES.cost, icon: DollarSign },
  { label: "Quality & Security", href: DASHBOARD_ROUTES.quality, icon: Shield },
  { label: "Operations", href: DASHBOARD_ROUTES.operations, icon: Activity },
] as const;

interface SidebarNavProps {
  collapsed?: boolean;
}

export const SidebarNav = observer(function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname();
  const auth = useAuthStore();

  const visibleItems = navItems.filter((item) => {
    const allowed = ROUTE_PERMISSIONS[item.href];
    if (!allowed) return true;
    return auth.role === "org_admin" || (auth.role && allowed.includes(auth.role));
  });

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 p-2">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-muted",
              active && "bg-muted font-medium text-foreground",
              !active && "text-muted-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}

      <div className="my-2 border-t" />

      <Link
        href={DASHBOARD_ROUTES.settings}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          "hover:bg-muted",
          pathname.startsWith("/dashboard/settings")
            ? "bg-muted font-medium text-foreground"
            : "text-muted-foreground",
        )}
        aria-current={pathname.startsWith("/dashboard/settings") ? "page" : undefined}
      >
        <Settings className="size-4 shrink-0" />
        {!collapsed && <span>Settings</span>}
      </Link>
    </nav>
  );
});
