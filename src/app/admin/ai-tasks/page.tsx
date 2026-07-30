import { prisma } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AiTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const sp = await searchParams;
  const where = sp.agent ? { agent: sp.agent } : {};

  const [tasks, total] = await Promise.all([
    prisma.aiTask.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { Keyword: true, ContentItem: true },
    }),
    prisma.aiTask.count({ where }),
  ]);

  const totalCost = tasks.reduce((s, t) => s + (t.costUsd ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">AI Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">
          Record of all AI agent runs — tokens, cost, status. Total in view:
          <span className="font-mono ml-1 text-ai-glow">${totalCost.toFixed(4)}</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Tokens (in/out)</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  No AI tasks yet. Run an agent from a keyword or content page.
                </td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{t.agent}</td>
                <td className="px-4 py-3 text-xs">
                  {t.Keyword && (
                    <Link href={`/admin/keywords/${t.Keyword.id}`} className="text-engineering-blue hover:underline">
                      {t.Keyword.phrase}
                    </Link>
                  )}
                  {t.ContentItem && (
                    <Link href={`/admin/content/${t.ContentItem.id}`} className="text-engineering-blue hover:underline ml-2">
                      {t.ContentItem.title}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      t.status === "done"
                        ? "bg-green-100 text-green-700"
                        : t.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : t.status === "running"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t.status}
                  </span>
                  {t.error && <div className="text-[10px] text-red-500 mt-0.5 font-mono truncate max-w-xs">{t.error}</div>}
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">
                  {(t.model ?? "").replace("claude-", "").replace(/-20\d{6}$/, "")}
                </td>
                <td className="px-4 py-3 text-xs font-mono">
                  {t.tokensIn ?? "—"} / {t.tokensOut ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs font-mono">
                  {t.costUsd != null ? `$${t.costUsd.toFixed(4)}` : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400">
        Showing {tasks.length} of {total} records.
      </div>
    </div>
  );
}
