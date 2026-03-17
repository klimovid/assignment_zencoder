"use client";

import { useOperations } from "@pages/operations/api/useOperations";
import { OperationsPage } from "@pages/operations/ui/OperationsPage";

export default function OperationsRoute() {
  const { data, isLoading } = useOperations({ time_range: "30d" });
  return <OperationsPage data={data ?? null} loading={isLoading} />;
}
