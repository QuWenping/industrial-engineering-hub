// Input validation
import type { CalculatorInput, CalculationError } from "./types";

export function validateInputs(
  inputs: CalculatorInput[],
  values: Record<string, number | string>
): CalculationError[] {
  const errors: CalculationError[] = [];

  for (const input of inputs) {
    const value = values[input.id];

    // Required check
    if (input.required && (value === undefined || value === null || value === "")) {
      errors.push({ field: input.id, message: `${input.label} is required` });
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    if (input.type === "number") {
      const num = Number(value);

      if (isNaN(num)) {
        errors.push({ field: input.id, message: `${input.label} must be a number` });
        continue;
      }

      if (input.min !== undefined && num < input.min) {
        errors.push({ field: input.id, message: `${input.label} must be at least ${input.min} ${input.unit || ""}` });
      }

      if (input.max !== undefined && num > input.max) {
        errors.push({ field: input.id, message: `${input.label} must be at most ${input.max} ${input.unit || ""}` });
      }
    }
  }

  return errors;
}
