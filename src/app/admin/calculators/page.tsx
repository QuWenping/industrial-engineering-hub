import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { STATUS_META } from "@/lib/admin/status-machine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Map calculator DB status to a display label/color (reuse content meta for overlapping states)
const CALC_STATUS_META: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  review: { label: "Review", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-slate-200 text-slate-500" },
};

export default async function CalculatorsPage() {
  const items = await prisma.calculator.findMany({
    orderBy: [{ priority: "asc" }, { name: "asc" }],
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Calculators</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build and validate calculator tools. Tests must pass before publishing.
          </p>
        </div>
        <Link
          href="/admin/calculators/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-navy/90"
        >
          <Plus className="h-4 w-4" /> New calculator
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Tests</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No calculators yet. Click &quot;New calculator&quot; or seed existing data.
                </td>
              </tr>
            )}
            {items.map((c) => {
              const meta = CALC_STATUS_META[c.status] ?? STATUS_META.keyword;
              return (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/calculators/${c.id}`} className="font-medium text-navy hover:underline">
                      {c.name}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono">{c.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.testsFail > 0 ? "text-red-600" : "text-green-700"}>
                      {c.testsPass} pass / {c.testsFail} fail
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${meta.color}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/calculators/${c.id}`} className="text-engineering-blue hover:underline text-xs">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
