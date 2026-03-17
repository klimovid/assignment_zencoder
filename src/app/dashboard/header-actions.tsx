"use client";

import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useAuthStore } from "@features/auth/model/AuthContext";
import { useRootStore } from "../store-context";
import { UserMenu } from "@widgets/user-menu/ui/UserMenu";
import { NotificationCenter } from "@widgets/notification-center/ui/NotificationCenter";

export const HeaderActions = observer(function HeaderActions() {
  const router = useRouter();
  const auth = useAuthStore();
  const rootStore = useRootStore();

  if (!auth.isAuthenticated || !auth.user) return null;

  return (
    <>
      <NotificationCenter store={rootStore.notifications} />
      <UserMenu
        user={{
          name: auth.user.name,
          email: auth.user.email,
          role: auth.role ?? "ic_dev",
        }}
        onLogout={() => {
          fetch("/api/auth/logout", { method: "POST", credentials: "include" })
            .finally(() => {
              auth.logout();
              router.push("/auth");
            });
        }}
        onNavigateSettings={() => router.push("/dashboard/settings")}
      />
    </>
  );
});
