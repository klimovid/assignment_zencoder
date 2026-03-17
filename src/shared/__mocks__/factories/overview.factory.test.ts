import { faker } from "@faker-js/faker";
import { OverviewResponseSchema } from "@pages/executive-overview/api/schemas";
import { createOverviewResponse } from "./overview.factory";

beforeEach(() => faker.seed(42));

describe("Overview factory", () => {
  it("produces Zod-valid data", () => {
    const response = createOverviewResponse();
    expect(() => OverviewResponseSchema.parse(response)).not.toThrow();
  });

  it("generates all 5 KPI fields", () => {
    const response = createOverviewResponse();
    expect(response.data.active_users).toBeDefined();
    expect(response.data.sessions_total).toBeDefined();
    expect(response.data.accepted_outcome_rate).toBeDefined();
    expect(response.data.cost_per_task).toBeDefined();
    expect(response.data.ci_pass_rate).toBeDefined();
  });

  it("respects overrides", () => {
    const response = createOverviewResponse({
      meta: { time_range: "7d", org_id: "custom", generated_at: "2024-01-01T00:00:00Z" },
    });
    expect(response.meta.time_range).toBe("7d");
    expect(response.meta.org_id).toBe("custom");
  });
});
