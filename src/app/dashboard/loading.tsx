import { Skeleton } from "@shared/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* KPI row skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Chart skeleton */}
      <Skeleton className="h-72 rounded-xl" />

      {/* Table skeleton */}
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
