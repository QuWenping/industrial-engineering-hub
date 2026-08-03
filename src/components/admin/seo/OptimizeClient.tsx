"use client";

import { useState } from "react";
import { Loader2, Zap, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageItem {
  url: string;
  type: string;
  title: string;
  impressions: number;
  clicks: number;
  avgPosition: number;
}

interface Suggestion {
  area: string;
  current: string;
  suggestion: string;
  priority: number;
}

interface LinkRec {
  toPage: string;
  toTitle: string;
  anchorText: string;
  reason: string;
}

export function OptimizeClient({ pages }: { pages: PageItem[] }) {
  const [selected, setSelected] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState<"optimize" | "links" | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [linkRecs, setLinkRecs] = useState<LinkRec[]>([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function runOptimize(page: PageItem) {
    setSelected(page);
    setLoading("optimize");
    setSuggestions([]);
    setLinkRecs([]);
    setError("");
    try {
      const res = await fetch("/api/admin/seo/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: page.url, type: page.type, action: "optimize" }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuggestions(data.suggestions || []);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(null);
  }

  async function runLinks(page: PageItem) {
    setSelected(page);
    setLoading("links");
    setLinkRecs([]);
    setError("");
    try {
      const res = await fetch("/api/admin/seo/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: page.url, type: page.type, action: "links" }),
      });
      const data = await res.json();
      if (data.ok) {
        setLinkRecs(data.recommendations || []);
      } else {
        setError(data.error || "Link analysis failed");
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      {/* Page selector */}
      <Card>
        <CardHeader><CardTitle className="text-base">Select Page to Optimize</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left">
              <tr>
                <th className="py-1.5 font-medium">Page</th>
                <th className="font-medium">Type</th>
                <th className="font-medium">Impressions</th>
                <th className="font-medium">Clicks</th>
                <th className="font-medium">Position</th>
                <th className="font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.slice(0, 30).map((p) => (
                <tr key={p.url} className={selected?.url === p.url ? "bg-engineering-blue/5" : "hover:bg-slate-50"}>
                  <td className="py-1.5 font-medium text-navy truncate max-w-xs">{p.title}</td>
                  <td><Badge variant="outline" className="text-xs">{p.type}</Badge></td>
                  <td className="text-slate-600">{p.impressions.toLocaleString()}</td>
                  <td className="text-slate-600">{p.clicks}</td>
                  <td className="text-slate-600">{p.avgPosition > 0 ? p.avgPosition.toFixed(1) : "—"}</td>
                  <td className="text-right">
                    <button
                      onClick={() => runOptimize(p)}
                      disabled={loading !== null}
                      className="inline-flex items-center gap-1 text-xs font-medium text-engineering-blue hover:underline disabled:opacity-50"
                    >
                      <Zap className="h-3 w-3" /> Optimize
                    </button>
                    <span className="text-slate-300 mx-1">|</span>
                    <button
                      onClick={() => runLinks(p)}
                      disabled={loading !== null}
                      className="inline-flex items-center gap-1 text-xs font-medium text-engineering-blue hover:underline disabled:opacity-50"
                    >
                      <Link2 className="h-3 w-3" /> Links
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-engineering-blue mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {loading === "optimize" ? "Analyzing content with Claude AI..." : "Finding internal link opportunities..."}
              <br />
              <span className="text-xs text-slate-400">This takes 15-30 seconds.</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Optimization suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              SEO Suggestions for {selected?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={
                    s.priority > 70 ? "text-red-600 border-red-300" :
                    s.priority > 40 ? "text-amber-600 border-amber-300" :
                    "text-slate-500"
                  }>{s.priority}</Badge>
                  <span className="text-sm font-medium text-navy">{s.area}</span>
                </div>
                {s.current && <p className="text-xs text-slate-400 mb-1">Current: {s.current}</p>}
                <p className="text-sm text-slate-700">{s.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Internal link recommendations */}
      {linkRecs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Internal Link Recommendations for {selected?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="py-1.5 font-medium">Link To</th>
                  <th className="font-medium">Anchor Text</th>
                  <th className="font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {linkRecs.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-1.5">
                      <a href={r.toPage} target="_blank" className="text-engineering-blue hover:underline font-medium">
                        {r.toTitle || r.toPage}
                      </a>
                    </td>
                    <td className="text-slate-700 text-xs">{r.anchorText}</td>
                    <td className="text-slate-500 text-xs">{r.reason}</td>
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
