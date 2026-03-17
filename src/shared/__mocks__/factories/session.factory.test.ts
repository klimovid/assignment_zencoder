import { faker } from "@faker-js/faker";
import { SessionSchema, ThinkStepSchema, ActStepSchema, ObserveStepSchema } from "@entities/session/model/types";
import { createSession, createThinkStep, createActStep, createObserveStep, createDiffFile } from "./session.factory";

beforeEach(() => faker.seed(42));

describe("Session factories", () => {
  it("createThinkStep produces Zod-valid data", () => {
    const step = createThinkStep();
    expect(() => ThinkStepSchema.parse(step)).not.toThrow();
  });

  it("createActStep produces Zod-valid data", () => {
    const step = createActStep();
    expect(() => ActStepSchema.parse(step)).not.toThrow();
  });

  it("createObserveStep produces Zod-valid data", () => {
    const step = createObserveStep();
    expect(() => ObserveStepSchema.parse(step)).not.toThrow();
  });

  it("createDiffFile produces valid diff file", () => {
    const diff = createDiffFile();
    expect(diff.path).toBeTruthy();
    expect(diff.hunks.length).toBeGreaterThan(0);
    expect(diff.additions).toBeGreaterThanOrEqual(0);
  });

  it("createSession produces Zod-valid data", () => {
    const session = createSession();
    expect(() => SessionSchema.parse(session)).not.toThrow();
  });

  it("createSession respects overrides", () => {
    const session = createSession({ status: "failed", totalCost: 99.99 });
    expect(session.status).toBe("failed");
    expect(session.totalCost).toBe(99.99);
  });

  it("createSession with deterministic seed produces consistent results", () => {
    faker.seed(123);
    const a = createSession();
    faker.seed(123);
    const b = createSession();
    expect(a.id).toBe(b.id);
  });
});
