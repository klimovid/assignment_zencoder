import { faker } from "@faker-js/faker";
import type { OperationsResponse } from "@pages/operations/api/schemas";

export function createOperationsResponse(
  overrides?: Partial<OperationsResponse>,
): OperationsResponse {
  const trendLength = faker.number.int({ min: 12, max: 48 });
  const trend = Array.from({ length: trendLength }, (_, i) => {
    const ts = new Date();
    ts.setMinutes(ts.getMinutes() - (trendLength - i) * 30);
    return {
      timestamp: ts.toISOString(),
      depth: faker.number.int({ min: 0, max: 50 }),
    };
  });

  const totalTasks = faker.number.int({ min: 200, max: 2000 });
  const totalFailed = faker.number.int({ min: 5, max: Math.floor(totalTasks * 0.1) });
  const failureReasons = ["timeout", "oom", "ci_failure", "rate_limit", "sandbox_crash"];
  const categories = faker.helpers
    .arrayElements(failureReasons, { min: 2, max: 4 })
    .map((reason) => ({
      failure_reason: reason,
      count: faker.number.int({ min: 1, max: totalFailed }),
      percentage: 0,
    }));
  const totalCatCount = categories.reduce((s, c) => s + c.count, 0);
  categories.forEach((c) => {
    c.percentage = parseFloat(((c.count / totalCatCount) * 100).toFixed(1));
  });

  const withinSla = totalTasks - faker.number.int({ min: 0, max: Math.floor(totalTasks * 0.1) });

  return {
    data: {
      queue_depth: {
        current: faker.number.int({ min: 0, max: 30 }),
        trend,
      },
      wait_time: {
        median_ms: faker.number.int({ min: 10000, max: 120000 }),
        p95_ms: faker.number.int({ min: 60000, max: 300000 }),
        p99_ms: faker.number.int({ min: 120000, max: 600000 }),
      },
      failure_rate: {
        total_failed: totalFailed,
        total_tasks: totalTasks,
        percentage: parseFloat(((totalFailed / totalTasks) * 100).toFixed(1)),
        by_category: categories,
      },
      sla_compliance: {
        within_sla: withinSla,
        total_tasks: totalTasks,
        compliance_percent: parseFloat(((withinSla / totalTasks) * 100).toFixed(1)),
        sla_target_ms: 600000,
      },
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
      freshness: "1-5 minutes",
    },
    ...overrides,
  };
}
