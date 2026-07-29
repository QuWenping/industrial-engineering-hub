// Result formatting
export function formatResult(value: number, decimals: number = 2, unit: string = ""): string {
  if (!isFinite(value)) return "—";

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return unit ? `${formatted} ${unit}` : formatted;
}

export function toFixed(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
