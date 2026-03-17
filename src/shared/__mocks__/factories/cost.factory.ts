import { faker } from "@faker-js/faker";
import type { CostResponse } from "@pages/cost/api/schemas";

export function createCostResponse(
  overrides?: Partial<CostResponse>,
): CostResponse {
  const budgetLimit = faker.number.int({ min: 5000, max: 50000 });
  const currentSpend = faker.number.float({ min: 1000, max: budgetLimit, fractionDigits: 2 });

  const teamCount = faker.number.int({ min: 2, max: 5 });
  const spendByTeam = Array.from({ length: teamCount }, () => ({
    team_id: faker.string.uuid(),
    team_name: `${faker.commerce.department()} Team`,
    spend_usd: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
    percentage: 0,
  }));
  const totalTeamSpend = spendByTeam.reduce((s, t) => s + t.spend_usd, 0);
  spendByTeam.forEach((t) => {
    t.percentage = parseFloat(((t.spend_usd / totalTeamSpend) * 100).toFixed(1));
  });

  const models = ["claude-sonnet-4-20250514", "gpt-4o", "claude-haiku"];
  const spendByModel = models.map((model) => ({
    model,
    spend_usd: faker.number.float({ min: 200, max: 3000, fractionDigits: 2 }),
    percentage: 0,
    tokens_in: faker.number.int({ min: 100000, max: 10000000 }),
    tokens_out: faker.number.int({ min: 50000, max: 5000000 }),
  }));
  const totalModelSpend = spendByModel.reduce((s, m) => s + m.spend_usd, 0);
  spendByModel.forEach((m) => {
    m.percentage = parseFloat(((m.spend_usd / totalModelSpend) * 100).toFixed(1));
  });

  const estimate = faker.number.float({ min: currentSpend, max: budgetLimit * 1.2, fractionDigits: 2 });

  return {
    data: {
      current_spend: {
        value: currentSpend,
        budget_limit: budgetLimit,
        utilization_percent: parseFloat(((currentSpend / budgetLimit) * 100).toFixed(1)),
      },
      spend_by_team: spendByTeam,
      spend_by_model: spendByModel,
      cost_per_task: {
        average: faker.number.float({ min: 0.2, max: 2.0, fractionDigits: 2 }),
        median: faker.number.float({ min: 0.1, max: 1.5, fractionDigits: 2 }),
        min: faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 2 }),
        max: faker.number.float({ min: 2.0, max: 10.0, fractionDigits: 2 }),
      },
      cost_per_merged_pr: {
        average: faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 }),
        median: faker.number.float({ min: 0.3, max: 3.0, fractionDigits: 2 }),
        min: faker.number.float({ min: 0.05, max: 0.5, fractionDigits: 2 }),
        max: faker.number.float({ min: 3.0, max: 15.0, fractionDigits: 2 }),
      },
      forecast: {
        end_of_period_estimate: estimate,
        confidence_range: {
          low: parseFloat((estimate * 0.85).toFixed(2)),
          high: parseFloat((estimate * 1.15).toFixed(2)),
        },
        trend_direction: faker.helpers.arrayElement(["up", "down", "stable"] as const),
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
