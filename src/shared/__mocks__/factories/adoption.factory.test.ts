import { faker } from "@faker-js/faker";
import { AdoptionResponseSchema } from "@pages/adoption/api/schemas";
import { createAdoptionResponse } from "./adoption.factory";

beforeEach(() => faker.seed(42));

describe("Adoption factory", () => {
  it("produces Zod-valid data", () => {
    const response = createAdoptionResponse();
    expect(() => AdoptionResponseSchema.parse(response)).not.toThrow();
  });

  it("generates funnel with decreasing values", () => {
    const { task_funnel } = createAdoptionResponse().data;
    expect(task_funnel.created).toBeGreaterThanOrEqual(task_funnel.started);
    expect(task_funnel.started).toBeGreaterThanOrEqual(task_funnel.completed);
  });

  it("generates all 5 task type distributions", () => {
    const response = createAdoptionResponse();
    expect(response.data.task_type_distribution).toHaveLength(5);
  });
});
