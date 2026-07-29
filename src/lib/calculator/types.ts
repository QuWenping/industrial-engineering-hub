// Calculator JSON Schema type definitions

export type InputType = "number" | "select" | "material";

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  unit?: string;
  required?: boolean;
  default?: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
}

export interface CalculatorFormula {
  expression: string;
  unit: string;
  explanation?: string;
}

export interface CalculatorResult {
  label: string;
  unit: string;
  decimals?: number;
  prefix?: string;
}

export interface CalculatorFAQ {
  q: string;
  a: string;
}

export interface CalculatorExample {
  inputs: Record<string, number | string>;
  result: number;
  description?: string;
}

export interface CalculatorContent {
  introduction: string;
  example?: CalculatorExample;
  faq?: CalculatorFAQ[];
  related?: string[];
  applications?: string[];
  formula_explanation?: string;
}

export interface CalculatorSEO {
  title: string;
  description: string;
  keyword: string;
}

export interface CalculatorTestCase {
  inputs: Record<string, number | string>;
  expected: number;
  tolerance: number;
  description?: string;
}

export interface Calculator {
  id: string;
  name: string;
  category: string;
  priority: "P0" | "P1" | "P2";
  description: string;
  seo: CalculatorSEO;
  formula: CalculatorFormula;
  inputs: CalculatorInput[];
  result: CalculatorResult;
  content: CalculatorContent;
  tests?: CalculatorTestCase[];
}

export interface CalculationResult {
  value: number;
  unit: string;
  formatted: string;
  allInputs: Record<string, number | string>;
}

export interface CalculationError {
  field?: string;
  message: string;
}
