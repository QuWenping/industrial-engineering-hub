// Validate an arbitrary calculator payload — Zod schema check + runTests() on engine.
// Used by both Admin UI save and the AI calc-writer agent to gate persistence.
import { CalculatorSchema, type ValidatedCalculator } from "./schema.zod";
import { runTests } from "./engine";
import type { Calculator } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  zodError?: unknown;
  testResults?: {
    passed: number;
    failed: number;
    failures: {
      testIndex: number;
      expected: number;
      actual: number;
      message: string;
    }[];
  };
}

export function validateCalculator(payload: unknown): ValidationResult {
  const parsed = CalculatorSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map(
        (i) => `${i.path.join(".") || "schema"}: ${i.message}`
      ),
      zodError: parsed.error.flatten(),
    };
  }

  const calc = parsed.data as unknown as Calculator;
  const testResults = runTests(calc);

  const errors: string[] = [];
  if (testResults.failed > 0) {
    for (const f of testResults.failures) {
      errors.push(
        `Test #${f.testIndex + 1}: expected ${f.expected}, got ${f.actual} — ${f.message}`
      );
    }
  }

  return {
    valid: testResults.failed === 0,
    errors,
    testResults,
  };
}

// Same but returns typed calculator on success (convenience for agents).
export function validateCalculatorTyped(payload: unknown):
  | { ok: true; calculator: ValidatedCalculator; testResults: { passed: number; failed: number } }
  | { ok: false; errors: string[] } {
  const r = validateCalculator(payload);
  if (!r.valid) return { ok: false, errors: r.errors };
  return {
    ok: true,
    calculator: payload as ValidatedCalculator,
    testResults: { passed: r.testResults!.passed, failed: r.testResults!.failed },
  };
}
