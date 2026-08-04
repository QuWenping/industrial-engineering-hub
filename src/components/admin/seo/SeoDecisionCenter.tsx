"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Play, RefreshCw, Activity, Target, TrendingUp, Layers, Eye } from "lucide-react";

interface Decision {
  id: string;
  pageUrl: string;
  query: string;
  decisionType: string;
  problem: string;
  confidence: number | null;
  priority: number;
  status: string;
  actions: { action: string; status: string }[];
  createdAt: string;
}

interface PageScore {
  pageUrl: string;
  pageType: string;
  contentScore: number;
  keywordScore: number;
  linksScore: number;
  searchScore: number;
  eeattScore: number;
  totalScore: number;
  rankingStage: string;
  impressions: number;
  avgPosition: number;
}

interface Cluster {
  name: string;
  authorityScore: number;
  pageCount: number;
  totalImpressions: number;
  avgPosition: number;
}

interface Keyword {
  query: string;
  intent: string;
  impressions: number;
  currentPosition: number;
  priority: number;
}

interface Props {
  domainScore: number;
  pendingDecisions: number;
  trafficOpportunity: number;
  decisions: Decision[];
  pageScores: PageScore[];
  clusters: Cluster[];
  keywords: Keyword[];
  stageCounts: Record<string, number>;
}

const STAGE_COLORS: Record<string, string> = {
  winner: "bg-accent-green/20 text-accent-green border-accent-green/30",
  striking_distance: "bg-engineering-blue/20 text-engineering-blue border-engineering-blue/30",
  growth: "bg-warning/20 text-warning border-warning/30",
  discovery: "bg-slate-200 text-slate-600 border-slate-300",
};

const INTENT_COLORS: Record<string, string> = {
  calculator: "bg-engineering-blue/10 text-engineering-blue",
  informational: "bg-ai-glow/10 text-ai-glow",
  reference: "bg-accent-green/10 text-accent-green",
  commercial: "bg-warning/10 text-warning",
  comparison: "bg-purple-100 text-purple-700",
};

export function SeoDecisionCenter({
  domainScore, pendingDecisions, trafficOpportunity,
  decisions, pageScores, clusters, keywords, stageCounts,
}: Props) {
  const [activeTab, setActiveTab] = useState<"decisions" | "pages" | "clusters" | "keywords">("decisions");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setMessage("Running analysis engines...");
    try {
      const res = await fetch("/api/admin/seo/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze" }),
      });
      const data = await res.json();
      setMessage(`Analyzed: ${data.pagesAnalyzed} pages, ${data.keywordsClassified} keywords, ${data.clustersBuilt} clusters`);

      // Generate decisions
      const res2 = await fetch("/api/admin/seo/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-decisions", topN: 20 }),
      });
      const data2 = await res2.json();
      setMessage(`Analysis done. ${data.decisionsCreated || 0} new decisions generated. Refresh page to see.`);
    } catch (e) {
      setMessage("Error: " + String(e));
    }
    setLoading(false);
  }, []);

  const handleDecision = useCallback(async (id: string, action: "approve" | "reject" | "execute") => {
    try {
      await fetch("/api/admin/seo/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, decisionId: id }),
      });
      setMessage(`Decision ${action}d. Refresh to update.`);
    } catch (e) {
      setMessage("Error: " + String(e));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Health Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-engineering-blue/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Domain Score</p>
                <p className="text-3xl font-bold text-navy mt-1">{domainScore}<span className="text-lg text-slate-400">/100</span></p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-engineering-blue/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-engineering-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Pending Decisions</p>
                <p className="text-3xl font-bold text-navy mt-1">{pendingDecisions}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-green/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Traffic Opportunity</p>
                <p className="text-3xl font-bold text-navy mt-1">{trafficOpportunity}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Distribution */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(stageCounts).map(([stage, count]) => (
          <Badge key={stage} className={STAGE_COLORS[stage] || "bg-slate-100 text-slate-600"}>
            {stage.replace(/_/g, " ")}: {count}
          </Badge>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <Button onClick={runAnalysis} disabled={loading} className="btn-primary-gradient border-0 text-white">
          {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Run Full Analysis
        </Button>
        {message && <span className="text-sm text-slate-500">{message}</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60">
        {(["decisions", "pages", "clusters", "keywords"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-engineering-blue border-b-2 border-engineering-blue"
                : "text-slate-500 hover:text-navy"
            }`}
          >
            {tab} ({tab === "decisions" ? decisions.length : tab === "pages" ? pageScores.length : tab === "clusters" ? clusters.length : keywords.length})
          </button>
        ))}
      </div>

      {/* Decisions Tab */}
      {activeTab === "decisions" && (
        <div className="space-y-3">
          {decisions.length === 0 && (
            <Card><CardContent className="p-8 text-center text-slate-500">
              No decisions yet. Click "Run Full Analysis" to generate AI-powered SEO decisions.
            </CardContent></Card>
          )}
          {decisions.map((d) => (
            <Card key={d.id} className={d.status === "pending" ? "border-warning/30" : "border-border/60"}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{d.decisionType}</Badge>
                      <Badge className={d.priority >= 70 ? "bg-danger/20 text-danger" : d.priority >= 50 ? "bg-warning/20 text-warning" : "bg-slate-100 text-slate-600"}>
                        Priority: {d.priority}
                      </Badge>
                      {d.confidence && (
                        <span className="text-xs text-slate-400">Confidence: {(d.confidence * 100).toFixed(0)}%</span>
                      )}
                      <Badge variant="secondary" className="text-xs">{d.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-navy truncate">{d.query}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{d.pageUrl}</p>
                    <p className="text-xs text-slate-400 mt-1">{d.problem}</p>
                    {d.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {d.actions.map((a, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-mono">{a.action}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {d.status === "pending" && (
                      <>
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleDecision(d.id, "approve")}>
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleDecision(d.id, "reject")}>
                          <XCircle className="mr-1 h-3 w-3" /> Reject
                        </Button>
                      </>
                    )}
                    {d.status === "approved" && (
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleDecision(d.id, "execute")}>
                        <Play className="mr-1 h-3 w-3" /> Execute
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Page Scores Tab */}
      {activeTab === "pages" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-3 py-2 text-left">Page</th>
                <th className="px-3 py-2 text-center">Total</th>
                <th className="px-3 py-2 text-center">Content</th>
                <th className="px-3 py-2 text-center">Keyword</th>
                <th className="px-3 py-2 text-center">Links</th>
                <th className="px-3 py-2 text-center">Search</th>
                <th className="px-3 py-2 text-center">E-E-A-T</th>
                <th className="px-3 py-2 text-center">Stage</th>
                <th className="px-3 py-2 text-center">Pos</th>
              </tr>
            </thead>
            <tbody>
              {pageScores.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                  <td className="px-3 py-2 text-xs font-mono text-navy truncate max-w-xs">{p.pageUrl}</td>
                  <td className="px-3 py-2 text-center font-bold text-navy">{p.totalScore}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.contentScore}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.keywordScore}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.linksScore}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.searchScore}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.eeattScore}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={STAGE_COLORS[p.rankingStage] || ""}>{p.rankingStage.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600">{p.avgPosition.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Clusters Tab */}
      {activeTab === "clusters" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <Card key={c.name}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-engineering-blue" />
                    <span className="font-semibold text-navy text-sm">{c.name.replace(/-/g, " ")}</span>
                  </div>
                  <Badge variant="outline">{c.authorityScore}/100</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                  <div><span className="block font-bold text-navy">{c.pageCount}</span>Pages</div>
                  <div><span className="block font-bold text-navy">{c.totalImpressions}</span>Impressions</div>
                  <div><span className="block font-bold text-navy">{c.avgPosition.toFixed(0)}</span>Avg Pos</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {clusters.length === 0 && (
            <Card className="col-span-full"><CardContent className="p-8 text-center text-slate-500">
              No clusters yet. Run analysis to build topic clusters.
            </CardContent></Card>
          )}
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === "keywords" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-3 py-2 text-left">Query</th>
                <th className="px-3 py-2 text-center">Intent</th>
                <th className="px-3 py-2 text-center">Impressions</th>
                <th className="px-3 py-2 text-center">Position</th>
                <th className="px-3 py-2 text-center">Priority</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((k, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                  <td className="px-3 py-2 text-xs font-mono text-navy">{k.query}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={INTENT_COLORS[k.intent] || "bg-slate-100 text-slate-600"}>{k.intent}</Badge>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600">{k.impressions}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{k.currentPosition.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={k.priority >= 70 ? "bg-danger/20 text-danger" : k.priority >= 50 ? "bg-warning/20 text-warning" : "bg-slate-100 text-slate-600"}>{k.priority}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
