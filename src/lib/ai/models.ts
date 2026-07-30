// Anthropic Claude model aliases. Update IDs here when Anthropic ships new versions.
// Current as of 2026-07: Sonnet 4.6 and Haiku 4.5.
export const MODELS = {
  strong: "claude-sonnet-4-6-20250514",
  cheap: "claude-haiku-4-5-20251001",
} as const;

export type ModelAlias = keyof typeof MODELS;
