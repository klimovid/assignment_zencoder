import {
  formatNumber,
  formatCurrency,
  formatDuration,
  formatCompactNumber,
} from "./formatters";

describe("formatNumber", () => {
  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats negative numbers", () => {
    expect(formatNumber(-42)).toBe("-42");
  });

  it("formats large numbers with grouping", () => {
    expect(formatNumber(1_234_567)).toBe("1,234,567");
  });

  it("formats decimals", () => {
    expect(formatNumber(3.14159, { maximumFractionDigits: 2 })).toBe("3.14");
  });
});

describe("formatCurrency", () => {
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-99.5)).toBe("-$99.50");
  });

  it("formats large amounts", () => {
    expect(formatCurrency(12345.678)).toBe("$12,345.68");
  });
});

describe("formatDuration", () => {
  it("formats sub-second as milliseconds", () => {
    expect(formatDuration(150)).toBe("150ms");
    expect(formatDuration(0)).toBe("0ms");
  });

  it("formats seconds", () => {
    expect(formatDuration(2500)).toBe("2.5s");
    expect(formatDuration(1000)).toBe("1.0s");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(90_000)).toBe("1m 30s");
    expect(formatDuration(60_000)).toBe("1m 0s");
  });

  it("formats multi-minute durations", () => {
    expect(formatDuration(325_000)).toBe("5m 25s");
  });
});

describe("formatCompactNumber", () => {
  it("formats thousands as K", () => {
    expect(formatCompactNumber(1_000)).toBe("1K");
    expect(formatCompactNumber(1_500)).toBe("1.5K");
  });

  it("formats millions as M", () => {
    expect(formatCompactNumber(1_000_000)).toBe("1M");
    expect(formatCompactNumber(2_500_000)).toBe("2.5M");
  });

  it("formats billions as B", () => {
    expect(formatCompactNumber(1_000_000_000)).toBe("1B");
  });

  it("keeps small numbers as-is", () => {
    expect(formatCompactNumber(42)).toBe("42");
    expect(formatCompactNumber(999)).toBe("999");
  });
});
