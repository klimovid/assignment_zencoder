"use client";

import { useQuality } from "@pages/quality/api/useQuality";
import { QualityPage } from "@pages/quality/ui/QualityPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function QualityRoute() {
  const { data, isLoading } = useQuality({ time_range: "30d" });
  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard/quality"]!]}>
      <QualityPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
