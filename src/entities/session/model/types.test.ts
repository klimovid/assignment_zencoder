import {
  SessionSchema,
  SessionStepSchema,
  ThinkStepSchema,
  ActStepSchema,
  ObserveStepSchema,
  DiffFileSchema,
} from "./types";

const validThinkStep = {
  id: "step-1",
  index: 0,
  status: "success" as const,
  startedAt: "2024-01-01T00:00:00Z",
  duration: 1500,
  cost: 0.02,
  type: "think" as const,
  model: "claude-sonnet-4-20250514",
  tokensIn: 1000,
  tokensOut: 500,
  promptSummary: "Analyze the bug",
  responseSummary: "Found root cause in auth module",
};

const validActStep = {
  id: "step-2",
  index: 1,
  status: "success" as const,
  startedAt: "2024-01-01T00:00:01Z",
  duration: 300,
  cost: 0,
  type: "act" as const,
  toolName: "file_edit",
  arguments: { path: "/src/auth.ts", line: 42 },
  resultSummary: "Applied fix to auth.ts",
};

const validObserveStep = {
  id: "step-3",
  index: 2,
  status: "success" as const,
  startedAt: "2024-01-01T00:00:02Z",
  duration: 5000,
  cost: 0,
  type: "observe" as const,
  diffs: [
    {
      path: "src/auth.ts",
      hunks: [
        {
          oldStart: 40,
          oldLines: 3,
          newStart: 40,
          newLines: 5,
          content: "@@ -40,3 +40,5 @@\n-old line\n+new line\n+added line",
        },
      ],
      additions: 2,
      deletions: 1,
    },
  ],
  testOutput: "All tests passed",
  ciResult: { passed: true, summary: "CI green" },
};

describe("Session entity schemas", () => {
  describe("DiffFileSchema", () => {
    it("accepts valid diff file", () => {
      const result = DiffFileSchema.parse(validObserveStep.diffs[0]);
      expect(result.path).toBe("src/auth.ts");
      expect(result.hunks).toHaveLength(1);
    });

    it("rejects diff with empty path", () => {
      expect(() =>
        DiffFileSchema.parse({ ...validObserveStep.diffs[0], path: "" }),
      ).toThrow();
    });

    it("accepts diff with empty hunks array", () => {
      const result = DiffFileSchema.parse({
        path: "file.ts",
        hunks: [],
        additions: 0,
        deletions: 0,
      });
      expect(result.hunks).toHaveLength(0);
    });
  });

  describe("ThinkStepSchema", () => {
    it("accepts valid think step", () => {
      const result = ThinkStepSchema.parse(validThinkStep);
      expect(result.type).toBe("think");
      expect(result.model).toBe("claude-sonnet-4-20250514");
    });

    it("accepts think step with optional reasoningExcerpt", () => {
      const result = ThinkStepSchema.parse({
        ...validThinkStep,
        reasoningExcerpt: "Let me think step by step...",
      });
      expect(result.reasoningExcerpt).toBe("Let me think step by step...");
    });

    it("rejects think step without model", () => {
      const { model: _, ...noModel } = validThinkStep;
      expect(() => ThinkStepSchema.parse(noModel)).toThrow();
    });
  });

  describe("ActStepSchema", () => {
    it("accepts valid act step", () => {
      const result = ActStepSchema.parse(validActStep);
      expect(result.type).toBe("act");
      expect(result.toolName).toBe("file_edit");
    });

    it("rejects act step without toolName", () => {
      const { toolName: _, ...noTool } = validActStep;
      expect(() => ActStepSchema.parse(noTool)).toThrow();
    });
  });

  describe("ObserveStepSchema", () => {
    it("accepts valid observe step", () => {
      const result = ObserveStepSchema.parse(validObserveStep);
      expect(result.type).toBe("observe");
      expect(result.diffs).toHaveLength(1);
    });

    it("accepts observe step without optional fields", () => {
      const { testOutput: _, ciResult: __, ...minimal } = validObserveStep;
      const result = ObserveStepSchema.parse(minimal);
      expect(result.testOutput).toBeUndefined();
      expect(result.ciResult).toBeUndefined();
    });

    it("accepts observe step with empty diffs", () => {
      const result = ObserveStepSchema.parse({
        ...validObserveStep,
        diffs: [],
      });
      expect(result.diffs).toHaveLength(0);
    });
  });

  describe("SessionStepSchema (discriminated union)", () => {
    it("correctly discriminates think step", () => {
      const result = SessionStepSchema.parse(validThinkStep);
      expect(result.type).toBe("think");
    });

    it("correctly discriminates act step", () => {
      const result = SessionStepSchema.parse(validActStep);
      expect(result.type).toBe("act");
    });

    it("correctly discriminates observe step", () => {
      const result = SessionStepSchema.parse(validObserveStep);
      expect(result.type).toBe("observe");
    });

    it("rejects unknown step type", () => {
      expect(() =>
        SessionStepSchema.parse({ ...validThinkStep, type: "unknown" }),
      ).toThrow();
    });
  });

  describe("SessionSchema", () => {
    const validSession = {
      id: "session-1",
      taskId: "task-1",
      status: "completed" as const,
      startedAt: "2024-01-01T00:00:00Z",
      completedAt: "2024-01-01T00:10:00Z",
      totalCost: 0.05,
      totalDuration: 600000,
      steps: [validThinkStep, validActStep, validObserveStep],
    };

    it("accepts valid session", () => {
      const result = SessionSchema.parse(validSession);
      expect(result.id).toBe("session-1");
      expect(result.steps).toHaveLength(3);
    });

    it("accepts session with null completedAt (running)", () => {
      const result = SessionSchema.parse({
        ...validSession,
        status: "running",
        completedAt: null,
      });
      expect(result.completedAt).toBeNull();
    });

    it("accepts session with empty steps", () => {
      const result = SessionSchema.parse({
        ...validSession,
        steps: [],
      });
      expect(result.steps).toHaveLength(0);
    });

    it("rejects session with invalid status", () => {
      expect(() =>
        SessionSchema.parse({ ...validSession, status: "paused" }),
      ).toThrow();
    });

    it("rejects session without id", () => {
      const { id: _, ...noId } = validSession;
      expect(() => SessionSchema.parse(noId)).toThrow();
    });

    it("rejects negative totalCost", () => {
      expect(() =>
        SessionSchema.parse({ ...validSession, totalCost: -1 }),
      ).toThrow();
    });
  });
});
