// Safe formula parser using mathjs
// Evaluates mathematical expressions with variables, no eval()

import { evaluate, parse } from "mathjs";
import type { CalculationError } from "./types";

// Supported functions and constants
const ALLOWED_FUNCTIONS = new Set([
  "sqrt", "abs", "sin", "cos", "tan", "asin", "acos", "atan",
  "log", "log10", "log2", "exp", "pow", "ceil", "floor", "round",
  "min", "max", "sign", "pi", "e",
]);

export interface ParseResult {
  valid: boolean;
  variables: string[];
  error?: string;
}

export function parseFormula(expression: string): ParseResult {
  try {
    const node = parse(expression);
    const variables: string[] = [];

    node.traverse((n) => {
      if (n.type === "SymbolNode") {
        const name = (n as unknown as { name: string }).name;
        if (!ALLOWED_FUNCTIONS.has(name) && name !== "pi" && name !== "e") {
          if (!variables.includes(name)) {
            variables.push(name);
          }
        }
      }
    });

    return { valid: true, variables };
  } catch (e) {
    return { valid: false, variables: [], error: (e as Error).message };
  }
}

export function evaluateFormula(
  expression: string,
  variables: Record<string, number>
): { result?: number; error?: CalculationError } {
  try {
    // Validate the expression first
    const parsed = parseFormula(expression);
    if (!parsed.valid) {
      return { error: { message: `Formula parse error: ${parsed.error}` } };
    }

    // Check all required variables are provided
    for (const v of parsed.variables) {
      if (variables[v] === undefined) {
        return { error: { field: v, message: `Missing required variable: ${v}` } };
      }
    }

    const result = evaluate(expression, variables);

    if (typeof result !== "number" || !isFinite(result)) {
      return { error: { message: "Calculation resulted in a non-numeric or infinite value" } };
    }

    if (isNaN(result)) {
      return { error: { message: "Calculation resulted in NaN" } };
    }

    return { result };
  } catch (e) {
    return { error: { message: `Calculation error: ${(e as Error).message}` } };
  }
}
