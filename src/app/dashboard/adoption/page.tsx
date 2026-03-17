"use client";

import { useAdoption } from "@pages/adoption/api/useAdoption";
import { AdoptionPage } from "@pages/adoption/ui/AdoptionPage";
import { AuthGuard } from "@features/auth/ui/AuthGuard";
import { ROUTE_PERMISSIONS } from "@shared/config/permissions";

export default function AdoptionRoute() {
  const { data, isLoading } = useAdoption({ time_range: "30d" });
  return (
    <AuthGuard roles={[...ROUTE_PERMISSIONS["/dashboard/adoption"]!]}>
      <AdoptionPage data={data ?? null} loading={isLoading} />
    </AuthGuard>
  );
}
