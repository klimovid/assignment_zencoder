import { faker } from "@faker-js/faker";
import { DeliveryResponseSchema } from "@pages/delivery/api/schemas";
import { createDeliveryResponse } from "./delivery.factory";

beforeEach(() => faker.seed(42));

describe("Delivery factory", () => {
  it("produces Zod-valid data", () => {
    const response = createDeliveryResponse();
    expect(() => DeliveryResponseSchema.parse(response)).not.toThrow();
  });

  it("generates comparison data", () => {
    const response = createDeliveryResponse();
    expect(response.data.agent_vs_non_agent_comparison.length).toBeGreaterThan(0);
  });

  it("generates trend data", () => {
    const response = createDeliveryResponse();
    expect(response.data.pr_throughput.trend.length).toBeGreaterThan(0);
  });
});
