import { faker } from "@faker-js/faker";
import { OperationsResponseSchema } from "@pages/operations/api/schemas";
import { createOperationsResponse } from "./operations.factory";

beforeEach(() => faker.seed(42));

describe("Operations factory", () => {
  it("produces Zod-valid data", () => {
    const response = createOperationsResponse();
    expect(() => OperationsResponseSchema.parse(response)).not.toThrow();
  });

  it("generates SLA compliance within total tasks", () => {
    const { sla_compliance } = createOperationsResponse().data;
    expect(sla_compliance.within_sla).toBeLessThanOrEqual(sla_compliance.total_tasks);
  });

  it("generates failure categories", () => {
    const { failure_rate } = createOperationsResponse().data;
    expect(failure_rate.by_category.length).toBeGreaterThan(0);
  });

  it("generates queue depth trend", () => {
    const { queue_depth } = createOperationsResponse().data;
    expect(queue_depth.trend.length).toBeGreaterThan(0);
  });
});
