export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatLargeNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000_000_000)
    return `$${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (Math.abs(n) >= 1_000_000_000)
    return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(1)}M`;
  return formatCurrency(n);
}