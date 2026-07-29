// Main calculation engine
import { evaluateFormula } from "./parser";
import { convertToBase, baseUnits, getUnitCategory } from "./units";
import { validateInputs } from "./validator";
import { toFixed } from "./formatter";
import type { Calculator, CalculationResult, CalculationError } from "./types";

export interface EngineInput {
  calculator: Calculator;
  values: Record<string, number | string>;
}

export interface EngineOutput {
  result?: CalculationResult;
  errors: CalculationError[];
}

/**
 * Execute a calculator:
 * 1. Validate inputs
 * 2. Convert all numeric inputs to SI base units (m, Pa, m3/s, W, kg)
 * 3. Evaluate formula expression
 * 4. Format result
 */
export function calculate({ calculator, values }: EngineInput): EngineOutput {
  // Validate
  const errors = validateInputs(calculator.inputs, values);
  if (errors.length > 0) {
    return { errors };
  }

  // Build variables for formula: convert numeric inputs to base SI units
  const variables: Record<string, number> = {};

  for (const input of calculator.inputs) {
    const raw = values[input.id] ?? input.default;
    if (raw === undefined || raw === "") continue;

    if (input.type === "number") {
      const num = Number(raw);
      if (input.unit) {
        variables[input.id] = convertToBase(num, input.unit);
      } else {
        variables[input.id] = num;
      }
    } else if (input.type === "select" || input.type === "material") {
      // For select/material, the value should be a number (density etc.)
      const num = Number(raw);
      if (!isNaN(num)) {
        variables[input.id] = num;
      }
    }
  }

  // Evaluate formula
  const { result: rawResult, error: calcError } = evaluateFormula(
    calculator.formula.expression,
    variables
  );

  if (calcError || rawResult === undefined) {
    return { errors: [calcError || { message: "Calculation failed" }] };
  }

  const decimals = calculator.result.decimals ?? 2;
  const rounded = toFixed(rawResult, decimals + 2); // Keep extra precision for display

  // Format the result
  const formatted = formatResultValue(rawResult, decimals, calculator.result.unit);

  return {
    result: {
      value: rounded,
      unit: calculator.result.unit,
      formatted,
      allInputs: values,
    },
    errors: [],
  };
}

function formatResultValue(value: number, decimals: number, unit: string): string {
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Run all test cases for a calculator
 */
export function runTests(calculator: Calculator): {
  passed: number;
  failed: number;
  failures: { testIndex: number; expected: number; actual: number; message: string }[];
} {
  if (!calculator.tests) return { passed: 0, failed: 0, failures: [] };

  let passed = 0;
  let failed = 0;
  const failures: { testIndex: number; expected: number; actual: number; message: string }[] = [];

  for (let i = 0; i < calculator.tests.length; i++) {
    const test = calculator.tests[i];
    const { result, errors } = calculate({ calculator, values: test.inputs });

    if (errors.length > 0 || !result) {
      failed++;
      failures.push({
        testIndex: i,
        expected: test.expected,
        actual: NaN,
        message: errors[0]?.message || "No result",
      });
      continue;
    }

    const diff = Math.abs(result.value - test.expected);
    const pctDiff = test.expected !== 0 ? diff / Math.abs(test.expected) : diff;

    if (pctDiff <= test.tolerance) {
      passed++;
    } else {
      failed++;
      failures.push({
        testIndex: i,
        expected: test.expected,
        actual: result.value,
        message: `Expected ${test.expected}, got ${result.value} (diff ${(pctDiff * 100).toFixed(4)}%)`,
      });
    }
  }

  return { passed, failed, failures };
}
