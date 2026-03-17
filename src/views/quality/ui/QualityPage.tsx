"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import { ChartContainer } from "@entities/metric/ui/ChartContainer";
import { Badge } from "@shared/ui/badge";
import { CHART_COLORS } from "@shared/lib/chart-colors";
import type { QualityResponse } from "../api/schemas";

interface QualityPageProps {
  data: QualityResponse | null;
  loading?: boolean;
}

const severityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export function QualityPage({ data, loading = false }: QualityPageProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quality & Security</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICard key={i} label={`KPI ${i + 1}`} value="" loading />
          ))}
        </div>
      </div>
    );
  }

  const { ci_pass_rate, review_outcomes, policy_violations } = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quality & Security</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="CI Pass Rate" value={ci_pass_rate.first_run_passed} format="percent" />
        <KPICard label="Total Runs" value={ci_pass_rate.total_runs} format="number" />
        <KPICard label="Approved PRs" value={review_outcomes.approved} format="number" />
      </div>

      {/* Review Outcomes Donut */}
      <ChartContainer
        title="Review Outcomes"
        accessibilityData={{
          headers: ["Outcome", "Count", "Percentage"],
          rows: review_outcomes.distribution.map((d) => [d.outcome, d.count, `${d.percentage}%`]),
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={review_outcomes.distribution}
              dataKey="count"
              nameKey="outcome"
              innerRadius={60}
              outerRadius={100}
            >
              {review_outcomes.distribution.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Card>
        <CardHeader>
          <CardTitle>Policy Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {policy_violations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No violations detected.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {policy_violations.map((v) => (
                  <tr key={v.violation_type} className="border-b last:border-b-0">
                    <td className="py-2 font-mono text-xs">{v.violation_type}</td>
                    <td className="py-2">
                      <Badge variant={severityVariant[v.severity] ?? "default"}>
                        {v.severity}
                      </Badge>
                    </td>
                    <td className="py-2 text-right font-mono">{v.count}</td>
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
