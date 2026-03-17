"use client";

import { useCost } from "@pages/cost/api/useCost";
import { CostPage } from "@pages/cost/ui/CostPage";

export default function CostRoute() {
  const { data, isLoading } = useCost({ time_range: "30d" });
  return <CostPage data={data ?? null} loading={isLoading} />;
}
