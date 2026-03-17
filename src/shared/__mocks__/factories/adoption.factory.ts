import { faker } from "@faker-js/faker";
import type { AdoptionResponse } from "@pages/adoption/api/schemas";

export function createAdoptionResponse(
  overrides?: Partial<AdoptionResponse>,
): AdoptionResponse {
  const teamCount = faker.number.int({ min: 2, max: 5 });
  const teams = Array.from({ length: teamCount }, () => {
    const count = faker.number.int({ min: 10, max: 300 });
    return {
      team_id: faker.string.uuid(),
      team_name: `${faker.commerce.department()} Team`,
      sessions_count: count,
      percentage: 0,
    };
  });
  const totalSessions = teams.reduce((s, t) => s + t.sessions_count, 0);
  teams.forEach((t) => {
    t.percentage = parseFloat(((t.sessions_count / totalSessions) * 100).toFixed(1));
  });

  const created = faker.number.int({ min: 100, max: 1000 });
  const started = Math.floor(created * faker.number.float({ min: 0.8, max: 0.95 }));
  const completed = Math.floor(started * faker.number.float({ min: 0.7, max: 0.9 }));
  const prOpened = Math.floor(completed * faker.number.float({ min: 0.8, max: 0.95 }));
  const prReviewed = Math.floor(prOpened * faker.number.float({ min: 0.85, max: 0.95 }));
  const prMerged = Math.floor(prReviewed * faker.number.float({ min: 0.8, max: 0.95 }));

  const trendLength = faker.number.int({ min: 7, max: 30 });
  const trend = Array.from({ length: trendLength }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (trendLength - i));
    return {
      date: date.toISOString().split("T")[0]!,
      dau: faker.number.int({ min: 10, max: 100 }),
      wau: faker.number.int({ min: 50, max: 300 }),
      mau: faker.number.int({ min: 100, max: 500 }),
    };
  });

  return {
    data: {
      dau_wau_mau: {
        dau: faker.number.int({ min: 20, max: 100 }),
        wau: faker.number.int({ min: 80, max: 300 }),
        mau: faker.number.int({ min: 150, max: 500 }),
        trend,
      },
      sessions_by_team: teams,
      task_funnel: {
        created,
        started,
        completed,
        pr_opened: prOpened,
        pr_reviewed: prReviewed,
        pr_merged: prMerged,
      },
      task_type_distribution: [
        { type: "bugfix" as const, count: faker.number.int({ min: 20, max: 200 }), percentage: 0 },
        { type: "feature" as const, count: faker.number.int({ min: 30, max: 300 }), percentage: 0 },
        { type: "refactor" as const, count: faker.number.int({ min: 5, max: 100 }), percentage: 0 },
        { type: "test" as const, count: faker.number.int({ min: 5, max: 50 }), percentage: 0 },
        { type: "ops" as const, count: faker.number.int({ min: 2, max: 30 }), percentage: 0 },
      ].map((item, _, arr) => {
        const total = arr.reduce((s, i) => s + i.count, 0);
        return { ...item, percentage: parseFloat(((item.count / total) * 100).toFixed(1)) };
      }),
      integration_coverage: {
        repos_connected: faker.number.int({ min: 5, max: 50 }),
        ci_providers: faker.number.int({ min: 1, max: 4 }),
        ticketing_providers: faker.number.int({ min: 0, max: 3 }),
      },
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
