import { faker } from "@faker-js/faker";
import { CostResponseSchema } from "@pages/cost/api/schemas";
import { createCostResponse } from "./cost.factory";

beforeEach(() => faker.seed(42));

describe("Cost factory", () => {
  it("produces Zod-valid data", () => {
    const response = createCostResponse();
    expect(() => CostResponseSchema.parse(response)).not.toThrow();
  });

  it("generates utilization within budget", () => {
    const { current_spend } = createCostResponse().data;
    expect(current_spend.value).toBeLessThanOrEqual(current_spend.budget_limit);
  });

  it("generates forecast with confidence range", () => {
    const { forecast } = createCostResponse().data;
    expect(forecast.confidence_range.low).toBeLessThanOrEqual(forecast.end_of_period_estimate);
    expect(forecast.confidence_range.high).toBeGreaterThanOrEqual(forecast.end_of_period_estimate);
  });
});
