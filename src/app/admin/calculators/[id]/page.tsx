import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CalculatorEditor } from "@/components/admin/CalculatorEditor";

type Params = Promise<{ id: string }>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditCalculatorPage({ params }: { params: Params }) {
  const { id } = await params;
  const calc = await prisma.calculator.findUnique({ where: { id } });
  if (!calc) notFound();

  return (
    <CalculatorEditor
      id={calc.id}
      name={calc.name}
      status={calc.status}
      schema={calc.schema}
      publicUrl={`/tools/${calc.id}`}
    />
  );
}
