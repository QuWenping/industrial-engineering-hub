import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Materials view is just the Content view pre-filtered to kind=material.
export default async function MaterialsPage() {
  const items = await prisma.contentItem.findMany({
    where: { kind: "material" },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Material References</h1>
          <p className="text-sm text-slate-500 mt-1">
            Material data sheets — handled the same as guides, with <code>kind=material</code>.
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-navy/90"
        >
          <Plus className="h-4 w-4" /> New material
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  No materials yet. Run <code>npm run db:seed</code> to import existing material pages.
                </td>
              </tr>
            )}
            {items.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/content/${c.id}`} className="font-medium text-navy hover:underline">
                    {c.title}
                  </Link>
                  <div className="text-xs text-slate-400 font-mono">{c.slug}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.category ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-mono">{c.status}</td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
