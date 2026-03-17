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
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { Badge } from "@shared/ui/badge";
import { CHART_COLORS } from "@shared/lib/chart-colors";
import type { OverviewResponse } from "../api/schemas";

interface ExecutiveOverviewPageProps {
  data: OverviewResponse | null;
  loading?: boolean;
}

function deltaDirection(pct: number): "up" | "down" | "neutral" {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "neutral";
}

const severityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

const statusLabel: Record<string, string> = {
  pending_review: "Pending Review",
  auto_fixed: "Auto-Fixed",
  dismissed: "Dismissed",
};

export function ExecutiveOverviewPage({ data, loading = false }: ExecutiveOverviewPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Executive Overview</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const {
    active_users,
    sessions_total,
    accepted_outcome_rate,
    cost_per_task,
    ci_pass_rate,
    adoption_trend,
    outcome_vs_cost,
    risk_alerts,
  } = data.data;

  const kpis = [
    { label: "Active Users", value: active_users.current, format: "number" as const, delta: active_users.delta_percent },
    { label: "Total Sessions", value: sessions_total.current, format: "number" as const, delta: sessions_total.delta_percent },
    { label: "Accepted Outcome Rate", value: accepted_outcome_rate.current, format: "percent" as const, delta: accepted_outcome_rate.delta_percent },
    { label: "Cost per Task", value: cost_per_task.current, format: "currency" as const, delta: cost_per_task.delta_percent, invertColor: true },
    { label: "CI Pass Rate", value: ci_pass_rate.current, format: "percent" as const, delta: ci_pass_rate.delta_percent },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Executive Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            format={kpi.format}
            delta={{
              value: Math.abs(kpi.delta),
              direction: deltaDirection(kpi.delta),
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Adoption Trends */}
        <ChartContainer
          title="Adoption Trends"
          accessibilityData={{
            headers: ["Date", "Active Users"],
            rows: adoption_trend.map((p) => [p.date, p.active_users]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={adoption_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="active_users" name="Active Users" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Outcome vs. Cost */}
        <ChartContainer
          title="Outcome vs. Cost"
          accessibilityData={{
            headers: ["Week", "Outcomes", "Total Spend"],
            rows: outcome_vs_cost.map((p) => [p.week, p.outcomes, `$${p.total_spend.toFixed(2)}`]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={outcome_vs_cost}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="outcomes" name="Outcomes" fill={CHART_COLORS[0]} />
              <Bar yAxisId="right" dataKey="total_spend" name="Total Spend" fill={CHART_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Risk & Compliance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Risk & Compliance Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {risk_alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Policy Violation</th>
                  <th className="pb-2">Repository</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Detected</th>
                </tr>
              </thead>
              <tbody>
                {risk_alerts.map((alert) => (
                  <tr key={alert.id} className="border-b last:border-b-0">
                    <td className="py-2">
                      <div className="font-medium">{alert.violation_type}</div>
                      <div className="text-xs text-muted-foreground">{alert.description}</div>
                    </td>
                    <td className="py-2 font-mono text-xs">{alert.repository}</td>
                    <td className="py-2">
                      <Badge variant={severityVariant[alert.severity] ?? "default"}>
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-2 text-xs">{statusLabel[alert.status] ?? alert.status}</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">{alert.detected_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
