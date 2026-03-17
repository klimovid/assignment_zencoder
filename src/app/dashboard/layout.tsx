import type { Metadata } from "next";
import { Providers } from "../providers";
import { AppShell } from "@widgets/app-shell/ui/AppShell";

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
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
