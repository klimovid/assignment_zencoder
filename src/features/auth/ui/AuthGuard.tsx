"use client";

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../model/AuthContext";
import type { Role } from "@shared/config/permissions";

interface AuthGuardProps {
  roles?: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AuthGuard = observer(function AuthGuard({
  roles,
  fallback,
  children,
}: AuthGuardProps) {
  const auth = useAuthStore();

  if (!auth.initialized) return null;
  if (!auth.isAuthenticated) return null;

  if (roles && auth.role && !roles.includes(auth.role) && auth.role !== "org_admin") {
    return <>{fallback ?? <DefaultForbidden />}</>;
  }

  return <>{children}</>;
});

function DefaultForbidden() {
  return (
    <div role="alert" className="p-8 text-center">
      <h2 className="text-lg font-semibold">Access Restricted</h2>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to view this page.
      </p>
    </div>
  );
}
