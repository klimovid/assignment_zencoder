import { KPIValueSchema, DeltaValueSchema, ChartDataPointSchema } from "./types";

describe("Metric entity schemas", () => {
  describe("KPIValueSchema", () => {
    it("accepts valid KPI value", () => {
      const result = KPIValueSchema.parse({
        current: 150,
        previous: 120,
        delta_percent: 25,
      });
      expect(result.current).toBe(150);
      expect(result.delta_percent).toBe(25);
    });

    it("accepts zero values", () => {
      const result = KPIValueSchema.parse({
        current: 0,
        previous: 0,
        delta_percent: 0,
      });
      expect(result.current).toBe(0);
    });

    it("accepts negative delta_percent", () => {
      const result = KPIValueSchema.parse({
        current: 80,
        previous: 100,
        delta_percent: -20,
      });
      expect(result.delta_percent).toBe(-20);
    });

    it("rejects missing required fields", () => {
      expect(() => KPIValueSchema.parse({ current: 100 })).toThrow();
    });
  });

  describe("DeltaValueSchema", () => {
    it("accepts valid delta value", () => {
      const result = DeltaValueSchema.parse({
        value: 15.5,
        direction: "up",
      });
      expect(result.value).toBe(15.5);
      expect(result.direction).toBe("up");
    });

    it("accepts all direction values", () => {
      for (const dir of ["up", "down", "neutral"] as const) {
        const result = DeltaValueSchema.parse({ value: 0, direction: dir });
        expect(result.direction).toBe(dir);
      }
    });

    it("rejects invalid direction", () => {
      expect(() =>
        DeltaValueSchema.parse({ value: 5, direction: "sideways" }),
      ).toThrow();
    });
  });

  describe("ChartDataPointSchema", () => {
    it("accepts valid chart data point", () => {
      const result = ChartDataPointSchema.parse({
        date: "2024-01-15",
        value: 42,
      });
      expect(result.date).toBe("2024-01-15");
      expect(result.value).toBe(42);
    });

    it("accepts point with optional label", () => {
      const result = ChartDataPointSchema.parse({
        date: "2024-01-15",
        value: 42,
        label: "Week 3",
      });
      expect(result.label).toBe("Week 3");
    });

    it("accepts point without label", () => {
      const result = ChartDataPointSchema.parse({
        date: "2024-01-15",
        value: 42,
      });
      expect(result.label).toBeUndefined();
    });
  });
});
