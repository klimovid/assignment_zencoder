"use client";

import { useAdoption } from "@pages/adoption/api/useAdoption";
import { AdoptionPage } from "@pages/adoption/ui/AdoptionPage";

export default function AdoptionRoute() {
  const { data, isLoading } = useAdoption({ time_range: "30d" });
  return <AdoptionPage data={data ?? null} loading={isLoading} />;
}
