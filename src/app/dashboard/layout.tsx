import type { Metadata } from "next";
import { Providers } from "../providers";
import { AppShell } from "@widgets/app-shell/ui/AppShell";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { HeaderActions } from "./header-actions";

export const metadata: Metadata = {
  title: "Dashboard — Cloud Agent Platform",
  description: "Analytics dashboard for cloud agent execution platform",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthGuard>
        <AppShell headerActions={<HeaderActions />}>{children}</AppShell>
      </AuthGuard>
    </Providers>
  );
}
