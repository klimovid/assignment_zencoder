"use client";

import { useOverview } from "@pages/executive-overview/api/useOverview";
import { ExecutiveOverviewPage } from "@pages/executive-overview/ui/ExecutiveOverviewPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function DashboardPage() {
  const { data, isLoading } = useOverview({ time_range: "30d" });

  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard"]!]}>
      <ExecutiveOverviewPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
