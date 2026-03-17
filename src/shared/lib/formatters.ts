export function formatNumber(
  value: number,
  opts?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("en-US", opts).format(value);
}

export function formatCurrency(value: number): string {
  return formatNumber(value, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

export function formatCompactNumber(value: number): string {
  return formatNumber(value, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}
