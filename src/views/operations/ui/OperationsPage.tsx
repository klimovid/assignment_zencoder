"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { CHART_COLORS } from "@shared/lib/chart-colors";
import type { OperationsResponse } from "../api/schemas";

interface OperationsPageProps {
  data: OperationsResponse | null;
  loading?: boolean;
}

function formatMs(ms: number): string {
  if (ms >= 60000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

      {/* Queue Depth Trend */}
      <ChartContainer
        title="Queue Depth Over Time"
        accessibilityData={{
          headers: ["Time", "Depth"],
          rows: queue_depth.trend.map((p) => [formatTimestamp(p.timestamp), p.depth]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={queue_depth.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
            <YAxis />
            <Tooltip labelFormatter={(label) => formatTimestamp(String(label))} />
            <Area type="monotone" dataKey="depth" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Failure Categories */}
      <ChartContainer
        title="Failure Categories"
        isEmpty={failure_rate.by_category.length === 0}
        accessibilityData={{
          headers: ["Reason", "Count", "Percentage"],
          rows: failure_rate.by_category.map((c) => [c.failure_reason, c.count, `${c.percentage}%`]),
        }}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={failure_rate.by_category} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="failure_reason" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
