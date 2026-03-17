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
  Legend,
} from "recharts";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { CHART_COLORS } from "@shared/lib/chart-colors";
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

      {/* PR Throughput Trend */}
      <ChartContainer
        title="PR Throughput Trend"
        accessibilityData={{
          headers: ["Date", "Agent Opened", "Agent Merged", "Non-Agent Merged"],
          rows: pr_throughput.trend.map((p) => [p.date, p.agent_opened, p.agent_merged, p.non_agent_merged]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pr_throughput.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="agent_opened" name="Agent Opened" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} />
            <Area type="monotone" dataKey="agent_merged" name="Agent Merged" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.3} />
            <Area type="monotone" dataKey="non_agent_merged" name="Non-Agent Merged" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Agent vs Non-Agent Comparison */}
      <ChartContainer
        title="Agent vs Non-Agent"
        accessibilityData={{
          headers: ["Metric", "Agent", "Non-Agent"],
          rows: agent_vs_non_agent_comparison.map((r) => [r.metric, r.agent_value, r.non_agent_value]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agent_vs_non_agent_comparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="agent_value" name="Agent" fill={CHART_COLORS[0]} />
            <Bar dataKey="non_agent_value" name="Non-Agent" fill={CHART_COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
