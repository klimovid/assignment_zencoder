import { faker } from "@faker-js/faker";
import type { DeliveryResponse } from "@pages/delivery/api/schemas";

export function createDeliveryResponse(
  overrides?: Partial<DeliveryResponse>,
): DeliveryResponse {
  const trendLength = faker.number.int({ min: 7, max: 30 });
  const trend = Array.from({ length: trendLength }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (trendLength - i));
    return {
      date: date.toISOString().split("T")[0]!,
      agent_opened: faker.number.int({ min: 5, max: 30 }),
      agent_merged: faker.number.int({ min: 3, max: 25 }),
      non_agent_merged: faker.number.int({ min: 10, max: 50 }),
    };
  });

  return {
    data: {
      pr_throughput: {
        agent_prs_opened: faker.number.int({ min: 50, max: 200 }),
        agent_prs_merged: faker.number.int({ min: 30, max: 150 }),
        non_agent_prs_merged: faker.number.int({ min: 100, max: 400 }),
        trend,
      },
      median_time_to_merge: {
        value: faker.number.int({ min: 1800000, max: 86400000 }),
        unit: "ms" as const,
      },
      time_to_first_pr: {
        value: faker.number.int({ min: 600000, max: 7200000 }),
        unit: "ms" as const,
      },
      time_to_completion: {
        value: faker.number.int({ min: 3600000, max: 172800000 }),
        unit: "ms" as const,
      },
      agent_vs_non_agent_comparison: [
        {
          metric: "PR merge time",
          agent_value: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
          non_agent_value: faker.number.float({ min: 2, max: 20, fractionDigits: 1 }),
          agent_percentage: faker.number.float({ min: 30, max: 150, fractionDigits: 0 }),
        },
        {
          metric: "Lines of code",
          agent_value: faker.number.int({ min: 50, max: 500 }),
          non_agent_value: faker.number.int({ min: 20, max: 300 }),
          agent_percentage: faker.number.float({ min: 80, max: 250, fractionDigits: 0 }),
        },
      ],
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
