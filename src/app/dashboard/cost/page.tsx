"use client";

import { useCost } from "@pages/cost/api/useCost";
import { CostPage } from "@pages/cost/ui/CostPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function CostRoute() {
  const { data, isLoading } = useCost({ time_range: "30d" });
  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard/cost"]!]}>
      <CostPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
