"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import type { OperationsResponse } from "../api/schemas";

interface OperationsPageProps {
  data: OperationsResponse | null;
  loading?: boolean;
}

function formatMs(ms: number): string {
  if (ms >= 60000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function OperationsPage({ data, loading = false }: OperationsPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Operations</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const { queue_depth, wait_time, failure_rate, sla_compliance } = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Operations</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Queue Depth" value={queue_depth.current} format="number" />
        <KPICard label="Failure Rate" value={failure_rate.percentage} format="percent" />
        <KPICard label="SLA Compliance" value={sla_compliance.compliance_percent} format="percent" />
        <KPICard label="Median Wait" value={formatMs(wait_time.median_ms)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KPICard label="P95 Wait" value={formatMs(wait_time.p95_ms)} />
        <KPICard label="P99 Wait" value={formatMs(wait_time.p99_ms)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Failure Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {failure_rate.by_category.length === 0 ? (
            <p className="text-sm text-muted-foreground">No failures recorded.</p>
          ) : (
            <ul className="space-y-2">
              {failure_rate.by_category.map((cat) => (
                <li key={cat.failure_reason} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs">{cat.failure_reason}</span>
                  <span className="font-mono">{cat.count} ({cat.percentage}%)</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
