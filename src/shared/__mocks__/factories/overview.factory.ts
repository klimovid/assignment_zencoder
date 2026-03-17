import { faker } from "@faker-js/faker";
import type { OverviewResponse } from "@pages/executive-overview/api/schemas";

function createKPIValue() {
  const current = faker.number.float({ min: 0, max: 10000, fractionDigits: 2 });
  const previous = faker.number.float({ min: 0, max: 10000, fractionDigits: 2 });
  const delta = previous === 0 ? 0 : ((current - previous) / previous) * 100;
  return {
    current,
    previous,
    delta_percent: parseFloat(delta.toFixed(1)),
  };
}

export function createOverviewResponse(
  overrides?: Partial<OverviewResponse>,
): OverviewResponse {
  return {
    data: {
      active_users: createKPIValue(),
      sessions_total: createKPIValue(),
      accepted_outcome_rate: {
        ...createKPIValue(),
        current: faker.number.float({ min: 70, max: 99, fractionDigits: 1 }),
      },
      cost_per_task: {
        ...createKPIValue(),
        current: faker.number.float({ min: 0.1, max: 5.0, fractionDigits: 2 }),
      },
      ci_pass_rate: {
        ...createKPIValue(),
        current: faker.number.float({ min: 80, max: 99, fractionDigits: 1 }),
      },
      adoption_trend: Array.from({ length: faker.number.int({ min: 7, max: 30 }) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (30 - i));
        return {
          date: date.toISOString().split("T")[0]!,
          active_users: faker.number.int({ min: 50, max: 500 }),
        };
      }),
      outcome_vs_cost: Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        outcomes: faker.number.int({ min: 100, max: 500 }),
        total_spend: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
      })),
      risk_alerts: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
        id: faker.string.uuid(),
        violation_type: faker.helpers.arrayElement([
          "Unencrypted Secret in Suggestion",
          "Restricted Dependency Usage",
          "Excessive Token Consumption",
          "License Violation",
          "Large File Commit",
        ]),
        description: faker.lorem.sentence(),
        repository: faker.helpers.arrayElement([
          "core-auth-service",
          "web-dashboard-ui",
          "shared-api-utils",
          "ml-pipeline",
          "infra-terraform",
        ]),
        severity: faker.helpers.arrayElement(["low", "medium", "high", "critical"] as const),
        status: faker.helpers.arrayElement(["pending_review", "auto_fixed", "dismissed"] as const),
        detected_at: faker.helpers.arrayElement(["2 hours ago", "14 hours ago", "Yesterday", "3 days ago"]),
      })),
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
