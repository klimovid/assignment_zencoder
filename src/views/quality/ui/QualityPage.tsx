"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import { Badge } from "@shared/ui/badge";
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

      <Card>
        <CardHeader>
          <CardTitle>Review Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{review_outcomes.approved}</p>
              <p className="text-muted-foreground">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{review_outcomes.changes_requested}</p>
              <p className="text-muted-foreground">Changes Requested</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{review_outcomes.closed_unmerged}</p>
              <p className="text-muted-foreground">Closed Unmerged</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
