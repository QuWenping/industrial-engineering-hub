import { SchemaBuilder } from "@/components/admin/SchemaBuilder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function NewCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">
          Define the calculator schema in JSON. Run Tests to validate against the engine, then Create.
        </p>
      </div>
      <SchemaBuilder />
    </div>
  );
}
