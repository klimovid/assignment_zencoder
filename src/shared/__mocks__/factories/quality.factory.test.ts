import { faker } from "@faker-js/faker";
import { QualityResponseSchema } from "@pages/quality/api/schemas";
import { createQualityResponse } from "./quality.factory";

beforeEach(() => faker.seed(42));

describe("Quality factory", () => {
  it("produces Zod-valid data", () => {
    const response = createQualityResponse();
    expect(() => QualityResponseSchema.parse(response)).not.toThrow();
  });

  it("generates CI pass rate that sums to 100", () => {
    const { ci_pass_rate } = createQualityResponse().data;
    expect(ci_pass_rate.first_run_passed + ci_pass_rate.first_run_failed).toBeCloseTo(100, 0);
  });

  it("generates review outcome distribution", () => {
    const { review_outcomes } = createQualityResponse().data;
    expect(review_outcomes.distribution.length).toBeGreaterThan(0);
  });
});
