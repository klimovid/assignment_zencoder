"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { CHART_COLORS } from "@shared/lib/chart-colors";
import type { CostResponse } from "../api/schemas";

interface CostPageProps {
  data: CostResponse | null;
  loading?: boolean;
}

function formatUSD(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CostPage({ data, loading = false }: CostPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Cost & Budgets</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const { current_spend, spend_by_team, spend_by_model, cost_per_task, forecast } = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cost & Budgets</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Current Spend" value={formatUSD(current_spend.value)} />
        <KPICard label="Budget Limit" value={formatUSD(current_spend.budget_limit)} />
        <KPICard label="Utilization" value={current_spend.utilization_percent} format="percent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spend by Team */}
        <ChartContainer
          title="Spend by Team"
          accessibilityData={{
            headers: ["Team", "Spend (USD)"],
            rows: spend_by_team.map((t) => [t.team_name, formatUSD(t.spend_usd)]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spend_by_team} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="team_name" width={120} />
              <Tooltip formatter={(v) => formatUSD(v as number)} />
              <Bar dataKey="spend_usd" fill={CHART_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Spend by Model */}
        <ChartContainer
          title="Spend by Model"
          accessibilityData={{
            headers: ["Model", "Spend (USD)"],
            rows: spend_by_model.map((m) => [m.model, formatUSD(m.spend_usd)]),
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spend_by_model} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="model" width={160} />
              <Tooltip formatter={(v) => formatUSD(v as number)} />
              <Bar dataKey="spend_usd" fill={CHART_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost per Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Average:</span> <span className="font-mono">{formatUSD(cost_per_task.average)}</span></div>
              <div><span className="text-muted-foreground">Median:</span> <span className="font-mono">{formatUSD(cost_per_task.median)}</span></div>
              <div><span className="text-muted-foreground">Min:</span> <span className="font-mono">{formatUSD(cost_per_task.min)}</span></div>
              <div><span className="text-muted-foreground">Max:</span> <span className="font-mono">{formatUSD(cost_per_task.max)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">End of Period Estimate</span>
                <span className="font-mono font-bold">{formatUSD(forecast.end_of_period_estimate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence Range</span>
                <span className="font-mono">{formatUSD(forecast.confidence_range.low)} – {formatUSD(forecast.confidence_range.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend</span>
                <span className="capitalize">{forecast.trend_direction}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
