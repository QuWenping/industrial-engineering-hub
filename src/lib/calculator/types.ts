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

// === Visualization System (V0.5) ===

export type VisualizationType =
  | "svg-section"   // SVG cross-section diagrams (zero dependency)
  | "canvas-flow"   // Canvas 2D particle/flow simulation (zero dependency)
  | "three-beam"    // Three.js 3D beam deflection (lazy loaded)
  | "three-tank"    // Three.js 3D tank liquid level (lazy loaded)
  | "svg-curve";    // SVG performance curve / chart (zero dependency)

/** Maps calculator input IDs to visualization parameters */
export interface VisualizationProps {
  [key: string]: string; // inputId -> viz param name
}

export interface CalculatorVisualization {
  type: VisualizationType;
  component: string;  // file name under src/components/calculator/visualizations/
  title?: string;
  props?: VisualizationProps;
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
  visualization?: CalculatorVisualization;
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

