// Per-million-token pricing (input, output) in USD. Approximate; refresh from
// https://docs.anthropic.com/en/docs/about-claude/pricing when costs change.
export const PRICING: Record<string, { inputPerM: number; outputPerM: number }> = {
  "claude-sonnet-4-6-20250514": { inputPerM: 3.0, outputPerM: 15.0 },
  "claude-haiku-4-5-20251001": { inputPerM: 0.8, outputPerM: 4.0 },
};

export function estimateCost(
  model: string,
  tokensIn: number,
  tokensOut: number
): number {
  const p = PRICING[model];
  if (!p) return 0;
  return (tokensIn * p.inputPerM + tokensOut * p.outputPerM) / 1_000_000;
}
