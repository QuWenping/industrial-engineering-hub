// Serialize a Calculator DB row into a pretty-printed JSON file for commit.
import type { Calculator } from "@/lib/calculator/types";

export function serializeCalculatorJson(schema: Calculator): { path: string; content: string } {
  const path = `content/calculators/${schema.id}.json`;
  const content = JSON.stringify(schema, null, 2) + "\n";
  return { path, content };
}
