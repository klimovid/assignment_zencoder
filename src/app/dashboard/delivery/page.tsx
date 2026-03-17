"use client";

import { useDelivery } from "@pages/delivery/api/useDelivery";
import { DeliveryPage } from "@pages/delivery/ui/DeliveryPage";

export default function DeliveryRoute() {
  const { data, isLoading } = useDelivery({ time_range: "30d" });
  return <DeliveryPage data={data ?? null} loading={isLoading} />;
}
