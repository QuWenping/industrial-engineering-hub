import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { AgentButton } from "@/components/admin/AgentButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function KeywordDetailPage({ params }: Props) {
  const { id } = await params;
  const kw = await prisma.keyword.findUnique({
    where: { id },
    include: {
      AiTask: { orderBy: { createdAt: "desc" }, take: 5 },
      ContentItem: { take: 10, orderBy: { createdAt: "desc" } },
      Calculator: { take: 10, orderBy: { createdAt: "desc" } },
    },
  });
  if (!kw) notFound();

  const brief = kw.brief as null | {
    headline?: string;
    targetAudience?: string;
    painPoints?: string[];
    suggestedFormulas?: string[];
    outline?: { h2: string; points: string[] }[];
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500 flex items-center gap-1">
        <Link href="/admin/keywords" className="hover:text-navy">Keywords</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-700 truncate">{kw.phrase}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{kw.phrase}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={kw.status === "new" ? "secondary" : "default"}>{kw.status}</Badge>
            {kw.priority && <Badge variant="outline">{kw.priority}</Badge>}
            {kw.intent && <Badge variant="outline">{kw.intent}</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AgentButton agent="keyword" keywordId={id} label={kw.brief ? "Re-analyze" : "Analyze with Haiku"} />
          {kw.brief && (
            <>
              <AgentButton agent="writer" keywordId={id} input={{ kind: "guide" }} label="Draft guide →" variant="secondary" />
              <AgentButton agent="calc-writer" keywordId={id} label="Build calculator" variant="secondary" />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <Stat label="Volume est." value={kw.volume?.toLocaleString() ?? "—"} />
        <Stat label="Difficulty" value={kw.difficulty?.toString() ?? "—"} />
        <Stat label="Updated" value={kw.updatedAt.toLocaleDateString()} />
      </div>

      {brief ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-navy">Content Brief</h2>
          {brief.headline && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Headline</p>
              <p className="font-medium text-navy">{brief.headline}</p>
            </div>
          )}
          {brief.targetAudience && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Target audience</p>
              <p className="text-sm text-slate-700">{brief.targetAudience}</p>
            </div>
          )}
          {brief.painPoints && brief.painPoints.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Pain points</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-0.5">
                {brief.painPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {brief.suggestedFormulas && brief.suggestedFormulas.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Formulas</p>
              <div className="flex flex-wrap gap-1.5">
                {brief.suggestedFormulas.map((f, i) => (
                  <code key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">{f}</code>
                ))}
              </div>
            </div>
          )}
          {brief.outline && brief.outline.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Outline</p>
              <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-1">
                {brief.outline.map((o, i) => (
                  <li key={i}>
                    <span className="font-medium text-navy">{o.h2}</span>
                    {o.points?.length > 0 && (
                      <ul className="list-disc pl-5 text-slate-600 text-xs mt-0.5">
                        {o.points.map((p, j) => <li key={j}>{p}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
          No brief yet. Click <strong>Analyze with Claude</strong> to generate one.
        </div>
      )}

      {kw.AiTask.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold text-navy mb-3">Recent AI tasks</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr><th className="text-left py-1">Agent</th><th className="text-left">Status</th><th className="text-left">Cost</th><th className="text-left">When</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kw.AiTask.map((t) => (
                <tr key={t.id}>
                  <td className="py-1.5">{t.agent}</td>
                  <td>
                    <Badge variant={t.status === "done" ? "default" : t.status === "failed" ? "destructive" : "secondary"}>{t.status}</Badge>
                  </td>
                  <td className="text-slate-600">{t.costUsd ? `$${t.costUsd.toFixed(4)}` : "—"}</td>
                  <td className="text-slate-500 text-xs">{t.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-bold text-navy mt-1">{value}</p>
    </div>
  );
}
