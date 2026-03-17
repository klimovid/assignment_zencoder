"use client";

import { useDelivery } from "@pages/delivery/api/useDelivery";
import { DeliveryPage } from "@pages/delivery/ui/DeliveryPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function DeliveryRoute() {
  const { data, isLoading } = useDelivery({ time_range: "30d" });
  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard/delivery"]!]}>
      <DeliveryPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
