"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { CHART_COLORS } from "@shared/lib/chart-colors";
import type { AdoptionResponse } from "../api/schemas";

interface AdoptionPageProps {
  data: AdoptionResponse | null;
  loading?: boolean;
}

const FUNNEL_STAGES = [
  { key: "created", label: "Created" },
  { key: "started", label: "Started" },
  { key: "completed", label: "Completed" },
  { key: "pr_opened", label: "PR Opened" },
  { key: "pr_reviewed", label: "PR Reviewed" },
  { key: "pr_merged", label: "Merged" },
] as const;

export function AdoptionPage({ data, loading = false }: AdoptionPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Adoption & Usage</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const { dau_wau_mau, sessions_by_team, task_funnel, task_type_distribution } = data.data;

  const funnelData = FUNNEL_STAGES.map(
    (s) => ({ stage: s.label, value: task_funnel[s.key] }),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Adoption & Usage</h1>

      {/* DAU/WAU/MAU KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="DAU" value={dau_wau_mau.dau} format="number" />
        <KPICard label="WAU" value={dau_wau_mau.wau} format="number" />
        <KPICard label="MAU" value={dau_wau_mau.mau} format="number" />
      </div>

      {/* DAU/WAU/MAU Trend */}
      <ChartContainer
        title="DAU/WAU/MAU Trend"
        accessibilityData={{
          headers: ["Date", "DAU", "WAU", "MAU"],
          rows: dau_wau_mau.trend.map((p) => [p.date, p.dau, p.wau, p.mau]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dau_wau_mau.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dau" name="DAU" stroke={CHART_COLORS[0]} />
            <Line type="monotone" dataKey="wau" name="WAU" stroke={CHART_COLORS[1]} />
            <Line type="monotone" dataKey="mau" name="MAU" stroke={CHART_COLORS[2]} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Task Funnel */}
      <ChartContainer
        title="Task Funnel"
        accessibilityData={{
          headers: ["Stage", "Count"],
          rows: funnelData.map((d) => [d.stage, d.value]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" width={100} />
            <Tooltip />
            <Bar dataKey="value" fill={CHART_COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sessions by Team */}
        <ChartContainer
          title="Sessions by Team"
          accessibilityData={{
            headers: ["Team", "Sessions"],
            rows: sessions_by_team.map((t) => [t.team_name, t.sessions_count]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessions_by_team}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions_count" fill={CHART_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Task Type Distribution */}
        <ChartContainer
          title="Task Type Distribution"
          accessibilityData={{
            headers: ["Type", "Count", "Percentage"],
            rows: task_type_distribution.map((t) => [t.type, t.count, `${t.percentage}%`]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={task_type_distribution}
                dataKey="count"
                nameKey="type"
                innerRadius={60}
                outerRadius={100}
              >
                {task_type_distribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
