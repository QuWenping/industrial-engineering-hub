// Server-side Calculator DB access. No imports from client-only modules.
import { prisma } from "@/lib/db";
import type { Calculator } from "@/lib/calculator/types";

export type CalculatorsListFilter = {
  status?: string;
  category?: string;
};

export async function listCalculatorsFromDb(filter: CalculatorsListFilter = {}) {
  return prisma.calculator.findMany({
    where: {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.category ? { category: filter.category } : {}),
    },
    orderBy: [{ priority: "asc" }, { name: "asc" }],
  });
}

export async function getCalculatorFromDb(id: string) {
  return prisma.calculator.findUnique({ where: { id } });
}

export async function upsertCalculator(
  id: string,
  schema: Calculator,
  meta: { testsPass?: number; testsFail?: number; status?: string } = {}
) {
  return prisma.calculator.upsert({
    where: { id },
    update: {
      name: schema.name,
      category: schema.category,
      priority: schema.priority,
      description: schema.description,
      schema: schema as unknown as object,
      testsPass: meta.testsPass,
      testsFail: meta.testsFail,
      status: meta.status,
    },
    create: {
      id,
      name: schema.name,
      category: schema.category,
      priority: schema.priority,
      description: schema.description,
      schema: schema as unknown as object,
      testsPass: meta.testsPass ?? 0,
      testsFail: meta.testsFail ?? 0,
      status: meta.status ?? "draft",
    },
  });
}
