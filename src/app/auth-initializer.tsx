"use client";

import { useEffect } from "react";
import { useAuthStore } from "@features/auth/model/AuthContext";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();

  useEffect(() => {
    if (auth.initialized) return;

    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        auth.setAuth({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          },
          role: data.user.role,
          orgId: data.user.org_id,
          teams: data.user.teams ?? [],
          permissions: data.user.permissions ?? [],
        });
      })
      .catch(() => {
        auth.initialized = true;
      });
  }, [auth]);

  return <>{children}</>;
}
