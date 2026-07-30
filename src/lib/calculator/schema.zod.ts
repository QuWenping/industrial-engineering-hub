// Zod schema mirroring src/lib/calculator/types.ts. Used to validate
// calculators submitted via the Admin UI and AI-generated calculators before persistence.
import { z } from "zod";

export const InputTypeSchema = z.enum(["number", "select", "material"]);

export const InputOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const CalculatorInputSchema = z.object({
  id: z.string().min(1).max(60),
  label: z.string().min(1).max(200),
  type: InputTypeSchema,
  unit: z.string().max(40).optional(),
  required: z.boolean().optional(),
  default: z.union([z.number(), z.string()]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z.array(InputOptionSchema).optional(),
  placeholder: z.string().max(200).optional(),
  hint: z.string().max(500).optional(),
});

export const CalculatorFormulaSchema = z.object({
  expression: z.string().min(1).max(500),
  unit: z.string().min(1).max(40),
  explanation: z.string().max(2000).optional(),
});

export const CalculatorResultSchema = z.object({
  label: z.string().min(1).max(200),
  unit: z.string().min(1).max(40),
  decimals: z.number().int().min(0).max(10).optional(),
  prefix: z.string().max(20).optional(),
});

export const FAQSchema = z.object({
  q: z.string().min(1).max(500),
  a: z.string().min(1).max(5000),
});

export const ExampleSchema = z.object({
  inputs: z.record(z.string(), z.union([z.number(), z.string()])),
  result: z.number(),
  description: z.string().max(1000).optional(),
});

export const ContentSchema = z.object({
  introduction: z.string().min(1).max(5000),
  example: ExampleSchema.optional(),
  faq: z.array(FAQSchema).max(20).optional(),
  related: z.array(z.string().max(100)).max(30).optional(),
  applications: z.array(z.string().max(300)).max(20).optional(),
  formula_explanation: z.string().max(5000).optional(),
});

export const SEOSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(10).max(320),
  keyword: z.string().min(2).max(200),
});

export const TestCaseSchema = z.object({
  inputs: z.record(z.string(), z.union([z.number(), z.string()])),
  expected: z.number(),
  tolerance: z.number().min(0),
  description: z.string().max(500).optional(),
});

export const CalculatorSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  name: z.string().min(2).max(200),
  category: z.string().min(2).max(100),
  priority: z.enum(["P0", "P1", "P2"]),
  description: z.string().min(10).max(2000),
  seo: SEOSchema,
  formula: CalculatorFormulaSchema,
  inputs: z.array(CalculatorInputSchema).min(1).max(20),
  result: CalculatorResultSchema,
  content: ContentSchema,
  tests: z.array(TestCaseSchema).min(1).max(50).optional(),
});

export type ValidatedCalculator = z.infer<typeof CalculatorSchema>;
