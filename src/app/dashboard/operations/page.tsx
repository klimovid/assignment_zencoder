"use client";

import { useOperations } from "@pages/operations/api/useOperations";
import { OperationsPage } from "@pages/operations/ui/OperationsPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function OperationsRoute() {
  const { data, isLoading } = useOperations({ time_range: "30d" });
  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard/operations"]!]}>
      <OperationsPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
