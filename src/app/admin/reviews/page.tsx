import { prisma } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { ContentItem: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          All human and AI review records across content.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Content</th>
              <th className="px-4 py-3 font-medium">Reviewer</th>
              <th className="px-4 py-3 font-medium">Acc</th>
              <th className="px-4 py-3 font-medium">Log</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Orig</th>
              <th className="px-4 py-3 font-medium">Overall</th>
              <th className="px-4 py-3 font-medium">Verdict</th>
              <th className="px-4 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  No reviews yet.
                </td>
              </tr>
            )}
            {reviews.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  {r.ContentItem && (
                    <Link href={`/admin/content/${r.contentId}`} className="text-navy hover:underline">
                      {r.ContentItem.title}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 capitalize text-xs">{r.reviewer}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.scoreAccuracy ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.scoreLogic ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.scoreSeo ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.scoreOrig ?? "—"}</td>
                <td className="px-4 py-3 font-mono font-bold">{r.overall ?? "—"}</td>
                <td className="px-4 py-3 text-xs uppercase">{r.verdict ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
