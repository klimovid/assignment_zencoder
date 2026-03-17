import { faker } from "@faker-js/faker";
import type { Session, ThinkStep, ActStep, ObserveStep, DiffFile } from "@entities/session/model/types";

export function createDiffFile(overrides?: Partial<DiffFile>): DiffFile {
  return {
    path: `src/${faker.system.fileName({ extensionCount: 1 })}`,
    hunks: [
      {
        oldStart: faker.number.int({ min: 1, max: 100 }),
        oldLines: faker.number.int({ min: 1, max: 10 }),
        newStart: faker.number.int({ min: 1, max: 100 }),
        newLines: faker.number.int({ min: 1, max: 15 }),
        content: `@@ -${faker.number.int({ min: 1, max: 50 })},3 +${faker.number.int({ min: 1, max: 50 })},5 @@\n-${faker.lorem.sentence()}\n+${faker.lorem.sentence()}`,
      },
    ],
    additions: faker.number.int({ min: 0, max: 50 }),
    deletions: faker.number.int({ min: 0, max: 30 }),
    ...overrides,
  };
}

export function createThinkStep(overrides?: Partial<ThinkStep>): ThinkStep {
  return {
    id: faker.string.uuid(),
    index: 0,
    status: "success",
    startedAt: faker.date.recent().toISOString(),
    duration: faker.number.int({ min: 500, max: 5000 }),
    cost: faker.number.float({ min: 0.001, max: 0.1, fractionDigits: 4 }),
    type: "think",
    model: faker.helpers.arrayElement(["claude-sonnet-4-20250514", "gpt-4o", "claude-opus-4-20250514"]),
    tokensIn: faker.number.int({ min: 100, max: 10000 }),
    tokensOut: faker.number.int({ min: 50, max: 5000 }),
    promptSummary: faker.lorem.sentence(),
    responseSummary: faker.lorem.sentence(),
    ...overrides,
  };
}

export function createActStep(overrides?: Partial<ActStep>): ActStep {
  return {
    id: faker.string.uuid(),
    index: 1,
    status: "success",
    startedAt: faker.date.recent().toISOString(),
    duration: faker.number.int({ min: 100, max: 3000 }),
    cost: 0,
    type: "act",
    toolName: faker.helpers.arrayElement(["file_edit", "terminal", "file_read", "search"]),
    arguments: { path: `src/${faker.system.fileName()}` },
    resultSummary: faker.lorem.sentence(),
    ...overrides,
  };
}

export function createObserveStep(overrides?: Partial<ObserveStep>): ObserveStep {
  return {
    id: faker.string.uuid(),
    index: 2,
    status: "success",
    startedAt: faker.date.recent().toISOString(),
    duration: faker.number.int({ min: 1000, max: 30000 }),
    cost: 0,
    type: "observe",
    diffs: [createDiffFile()],
    testOutput: faker.lorem.paragraph(),
    ciResult: { passed: true, summary: "All tests passed" },
    ...overrides,
  };
}

export function createSession(overrides?: Partial<Session>): Session {
  const steps = [createThinkStep(), createActStep(), createObserveStep()];
  const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const status = faker.helpers.arrayElement(["completed", "running", "failed"] as const);

  return {
    id: faker.string.uuid(),
    taskId: faker.string.uuid(),
    status,
    startedAt: faker.date.recent().toISOString(),
    completedAt: status === "running" ? null : faker.date.recent().toISOString(),
    totalCost,
    totalDuration,
    steps,
    ...overrides,
  };
}
