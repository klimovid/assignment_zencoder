"use client";

import { useOverview } from "@pages/executive-overview/api/useOverview";
import { ExecutiveOverviewPage } from "@pages/executive-overview/ui/ExecutiveOverviewPage";

export default function DashboardPage() {
  const { data, isLoading } = useOverview({ time_range: "30d" });

  return <ExecutiveOverviewPage data={data ?? null} loading={isLoading} />;
}
