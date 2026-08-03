"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Network, Layers, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stats { totalEdges: number; totalPages: number; clusters: number; avgLinksPerPage: string; }
interface Cluster { id: string; name: string; pillarPage: string; pageCount: number; calculatorCount: number; guideCount: number; materialCount: number; keywords: string[]; }
interface LinkRec { to: string; weight: number; reason: string; }
interface LinkRecGroup { cluster: string; pillar: string; links: LinkRec[]; }
interface LowWordPage { url: string; wordCount: number; type: string; }

export function KnowledgeClient({ stats, clusters, linkRecs, lowWordCountPages }: {
  stats: Stats; clusters: Cluster[]; linkRecs: LinkRecGroup[]; lowWordCountPages: LowWordPage[];
}) {
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState("");

  async function runAudit() {
    setAuditing(true);
    setAuditResult("");
    try {
      const res = await fetch("/api/admin/seo/audit", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setAuditResult("Audited " + data.total + " pages. Updated " + data.updated + " PageSeoMeta records. Low word count: " + data.lowWordCount.length + ", Missing FAQ: " + data.missingFaq.length);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setAuditResult("Error: " + (data.error || "Unknown"));
      }
    } catch (e: any) {
      setAuditResult("Error: " + e.message);
    }
    setAuditing(false);
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Layers className="h-4 w-4" /> Clusters</div>
          <div className="text-2xl font-bold text-navy">{stats.clusters}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Network className="h-4 w-4" /> Link Edges</div>
          <div className="text-2xl font-bold text-navy">{stats.totalEdges}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><FileText className="h-4 w-4" /> Pages in Graph</div>
          <div className="text-2xl font-bold text-navy">{stats.totalPages}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Network className="h-4 w-4" /> Avg Links/Page</div>
          <div className="text-2xl font-bold text-navy">{stats.avgLinksPerPage}</div>
        </CardContent></Card>
      </div>

      {/* Audit button */}
      <Card>
        <CardHeader><CardTitle className="text-base">Page SEO Audit</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">Scan all pages and update PageSeoMeta table (title, H1, word count, FAQ, schema, internal links, cluster assignment).</p>
          <button onClick={runAudit} disabled={auditing} className="inline-flex items-center gap-1.5 bg-navy text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-navy/90 disabled:opacity-50">
            {auditing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Run Full Audit
          </button>
          {auditResult && <p className="text-sm text-slate-600">{auditResult}</p>}
        </CardContent>
      </Card>

      {/* Topic Clusters */}
      <Card>
        <CardHeader><CardTitle className="text-base">Topic Clusters ({clusters.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clusters.map((c) => (
              <div key={c.id} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-navy">{c.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{c.pillarPage}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="text-xs">{c.calculatorCount} calc</Badge>
                    <Badge variant="outline" className="text-xs">{c.guideCount} guides</Badge>
                    <Badge variant="outline" className="text-xs">{c.materialCount} materials</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.keywords.map((k) => (
                    <span key={k} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{k}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Link Graph Recommendations */}
      <Card>
        <CardHeader><CardTitle className="text-base">Link Graph: Pillar Page Recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {linkRecs.map((rec) => (
            <div key={rec.cluster}>
              <h4 className="text-sm font-semibold text-navy mb-2">{rec.cluster} ({rec.pillar})</h4>
              <table className="w-full text-sm">
                <thead className="text-slate-500 text-left">
                  <tr><th className="py-1 font-medium">Link To</th><th className="font-medium">Weight</th><th className="font-medium">Reason</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rec.links.map((l, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-1.5 text-engineering-blue font-medium text-xs">{l.to}</td>
                      <td><Badge variant="outline" className={l.weight >= 8 ? "text-green-600 border-green-300" : l.weight >= 5 ? "text-amber-600 border-amber-300" : "text-slate-500"}>{l.weight}</Badge></td>
                      <td className="text-slate-500 text-xs">{l.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Low Word Count Pages */}
      {lowWordCountPages.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Low Word Count Pages ({lowWordCountPages.length})</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-3">Pages with under 500 words should be expanded to 1500-2500 words for better SEO.</p>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1 font-medium">URL</th><th className="font-medium">Type</th><th className="font-medium">Words</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowWordCountPages.map((p) => (
                  <tr key={p.url} className="hover:bg-slate-50">
                    <td className="py-1.5 text-navy font-medium text-xs">{p.url}</td>
                    <td><Badge variant="outline" className="text-xs">{p.type}</Badge></td>
                    <td className="text-amber-600 font-medium">{p.wordCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
