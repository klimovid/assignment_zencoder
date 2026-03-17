import { Card, CardContent } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import { DeltaIndicator, type DeltaIndicatorProps } from "./DeltaIndicator";

export interface KPICardProps {
  label: string;
  value: string | number;
  format?: "number" | "currency" | "percent" | "duration";
  delta?: Pick<DeltaIndicatorProps, "value" | "direction">;
  loading?: boolean;
}

function formatValue(value: string | number, format?: string): string {
  if (typeof value === "string") return value;

  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case "percent":
      return `${value.toFixed(1)}%`;
    case "duration":
      return `${value.toFixed(1)}s`;
    default:
      return value.toLocaleString("en-US");
  }
}

export function KPICard({ label, value, format, delta, loading = false }: KPICardProps) {
  if (loading) {
    return (
      <Card role="status" aria-label={`${label} loading`}>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card role="status" aria-label={label}>
      <CardContent className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight">
          {formatValue(value, format)}
        </p>
        {delta && (
          <DeltaIndicator value={delta.value} direction={delta.direction} />
        )}
      </CardContent>
    </Card>
  );
}
