"use client";

import { observer } from "mobx-react-lite";
import { redirect } from "next/navigation";
import { useAuthStore } from "../model/AuthContext";
import { Skeleton } from "@shared/ui/skeleton";
import { getDefaultRoute } from "@shared/config/permissions";
import type { Role } from "@shared/config/permissions";

interface AuthGuardProps {
  roles?: Role[];
  children: React.ReactNode;
}

export const AuthGuard = observer(function AuthGuard({
  roles,
  children,
}: AuthGuardProps) {
  const auth = useAuthStore();

  if (!auth.initialized) {
    return (
      <div className="flex h-screen items-center justify-center" role="status" aria-label="Loading">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    redirect("/auth");
  }

  if (roles && auth.role && !roles.includes(auth.role) && auth.role !== "org_admin") {
    redirect(getDefaultRoute(auth.role));
  }

  return <>{children}</>;
});
