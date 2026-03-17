"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { KPICard } from "@entities/metric/ui/KPICard";
import type { AdoptionResponse } from "../api/schemas";

interface AdoptionPageProps {
  data: AdoptionResponse | null;
  loading?: boolean;
}

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Adoption & Usage</h1>

      {/* DAU/WAU/MAU */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="DAU" value={dau_wau_mau.dau} format="number" />
        <KPICard label="WAU" value={dau_wau_mau.wau} format="number" />
        <KPICard label="MAU" value={dau_wau_mau.mau} format="number" />
      </div>

      {/* Task Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Task Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            {(["created", "started", "completed", "pr_opened", "pr_reviewed", "pr_merged"] as const).map((stage) => (
              <div key={stage} className="text-center">
                <p className="text-2xl font-bold">{task_funnel[stage].toLocaleString()}</p>
                <p className="capitalize text-muted-foreground">{stage === "pr_opened" ? "PR Opened" : stage === "pr_reviewed" ? "PR Reviewed" : stage === "pr_merged" ? "Merged" : stage.replace("_", " ")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sessions by Team */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions by Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sessions_by_team.map((team) => (
                <li key={team.team_id} className="flex items-center justify-between text-sm">
                  <span>{team.team_name}</span>
                  <span className="font-mono">{team.sessions_count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Task Types */}
        <Card>
          <CardHeader>
            <CardTitle>Task Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {task_type_distribution.map((t) => (
                <li key={t.type} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{t.type}</span>
                  <span className="font-mono">{t.percentage}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
