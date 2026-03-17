"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import type { DeliveryResponse } from "../api/schemas";

interface DeliveryPageProps {
  data: DeliveryResponse | null;
  loading?: boolean;
}

function formatDuration(value: number, unit: string): string {
  if (unit === "ms") {
    if (value >= 3600000) return `${(value / 3600000).toFixed(1)}h`;
    if (value >= 60000) return `${(value / 60000).toFixed(0)}m`;
    return `${(value / 1000).toFixed(0)}s`;
  }
  return `${value}${unit}`;
}

export function DeliveryPage({ data, loading = false }: DeliveryPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Delivery Impact</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const { pr_throughput, median_time_to_merge, time_to_first_pr, agent_vs_non_agent_comparison } = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Delivery Impact</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Agent PRs Opened" value={pr_throughput.agent_prs_opened} format="number" />
        <KPICard label="Agent PRs Merged" value={pr_throughput.agent_prs_merged} format="number" />
        <KPICard label="Median Time to Merge" value={formatDuration(median_time_to_merge.value, median_time_to_merge.unit)} />
        <KPICard label="Time to First PR" value={formatDuration(time_to_first_pr.value, time_to_first_pr.unit)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent vs Non-Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2">Metric</th>
                <th className="pb-2 text-right">Agent</th>
                <th className="pb-2 text-right">Non-Agent</th>
              </tr>
            </thead>
            <tbody>
              {agent_vs_non_agent_comparison.map((row) => (
                <tr key={row.metric} className="border-b last:border-b-0">
                  <td className="py-2">{row.metric}</td>
                  <td className="py-2 text-right font-mono">{row.agent_value}</td>
                  <td className="py-2 text-right font-mono">{row.non_agent_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
