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
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
