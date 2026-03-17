"use client";

import { useQuality } from "@pages/quality/api/useQuality";
import { QualityPage } from "@pages/quality/ui/QualityPage";

export default function QualityRoute() {
  const { data, isLoading } = useQuality({ time_range: "30d" });
  return <QualityPage data={data ?? null} loading={isLoading} />;
}
