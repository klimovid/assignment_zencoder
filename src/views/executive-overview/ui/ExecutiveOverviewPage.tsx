"use client";

import { KPICard } from "@entities/metric/ui/KPICard";
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

  const { active_users, sessions_total, accepted_outcome_rate, cost_per_task, ci_pass_rate } = data.data;

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
    </div>
  );
}
