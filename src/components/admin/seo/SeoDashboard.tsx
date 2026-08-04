"use client";

import { useState, useRef } from "react";
import { Upload, TrendingUp, MousePointerClick, Eye, Target, Loader2, Brain, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  summary: {
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
    avgPosition: number;
    totalRecords: number;
    aiDecisions: number;
  };
  topQueries: { query: string; impressions: number; clicks: number; avgPosition: number }[];
  topPages: { page: string; impressions: number; clicks: number; avgPosition: number }[];
  opportunities: { query: string; impressions: number; clicks: number; avgPosition: number }[];
}

export function SeoDashboard({ summary, topQueries, topPages, opportunities }: Props) {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string>("");
  const [importType, setImportType] = useState<"query" | "page">("query");
  const fileRef = useRef<HTMLInputElement>(null);
  const queryFileRef = useRef<HTMLInputElement>(null);
  const pageFileRef = useRef<HTMLInputElement>(null);
  const [queryFileName, setQueryFileName] = useState("");
  const [pageFileName, setPageFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalysisResult("");
    try {
      const res = await fetch("/api/admin/seo/analyze", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setAnalysisResult("Analysis complete: " + (data.opportunities?.length || 0) + " opportunities found");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setAnalysisResult("Error: " + (data.error || "Unknown"));
      }
    } catch (e: any) {
      setAnalysisResult("Error: " + e.message);
    }
    setAnalyzing(false);
  }

  async function handleImport() {
    const file = fileRef.current?.files?.[0];
    if (!file) { setImportResult("Please select a CSV file first."); return; }
    setImporting(true);
    setImportResult("");
    try {
      const text = await file.text();
      const res = await fetch(`/api/admin/seo/gsc-import?type=${importType}`, {
        method: "POST",
        body: text,
      });
      const data = await res.json();
      if (data.ok) {
        setImportResult(`Imported ${data.imported} rows (created: ${data.created})`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportResult(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setImportResult(`Error: ${e.message}`);
    }
    setImporting(false);
  }

  async function handleDualImport() {
    const queryFile = queryFileRef.current?.files?.[0];
    const pageFile = pageFileRef.current?.files?.[0];
    if (!queryFile && !pageFile) {
      setImportResult("Please select at least one CSV file.");
      return;
    }
    setImporting(true);
    setImportResult("Uploading...");
    const results: string[] = [];
    try {
      if (queryFile) {
        const text = await queryFile.text();
        const res = await fetch(`/api/admin/seo/gsc-import?type=query`, {
          method: "POST", body: text,
        });
        const data = await res.json();
        if (data.ok) results.push(`Queries: ${data.imported} rows imported`);
        else results.push(`Queries: Error - ${data.error}`);
      }
      if (pageFile) {
        const text = await pageFile.text();
        const res = await fetch(`/api/admin/seo/gsc-import?type=page`, {
          method: "POST", body: text,
        });
        const data = await res.json();
        if (data.ok) results.push(`Pages: ${data.imported} rows imported`);
        else results.push(`Pages: Error - ${data.error}`);
      }
      setImportResult(results.join(" | "));
      setTimeout(() => window.location.reload(), 2000);
    } catch (e: any) {
      setImportResult(`Error: ${e.message}`);
    }
    setImporting(false);
  }

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

  return (
    <div className="space-y-6">
      {/* SEO sub-navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <a href="/admin/seo" className="px-3 py-1.5 text-sm font-medium text-white bg-navy rounded-md">Dashboard</a>
        <a href="/admin/seo/optimize" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">Optimize</a>
        <a href="/admin/seo/knowledge" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">Knowledge</a>
        <a href="/admin/seo/tasks" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">AI Decisions</a>
      </div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1"><Eye className="h-4 w-4" /> Impressions</div>
            <div className="text-2xl font-bold text-navy">{fmt(summary.totalImpressions)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1"><MousePointerClick className="h-4 w-4" /> Clicks</div>
            <div className="text-2xl font-bold text-navy">{fmt(summary.totalClicks)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1"><TrendingUp className="h-4 w-4" /> Avg CTR</div>
            <div className="text-2xl font-bold text-navy">{fmt(summary.avgCtr)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1"><Target className="h-4 w-4" /> Avg Position</div>
            <div className="text-2xl font-bold text-navy">{fmt(summary.avgPosition)}</div>
          </CardContent>
        </Card>
      </div>

      {/* GSC Import */}
      <Card>
        <CardHeader><CardTitle className="text-base">Import GSC Data</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value as "query" | "page")}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="query">Top Queries CSV</option>
              <option value="page">Top Pages CSV</option>
            </select>
            <input ref={fileRef} type="file" accept=".csv" className="text-sm" />
            <button
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center gap-1.5 bg-navy text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
            >
              {importing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Upload className="h-3.5 w-3.5" /> Import
            </button>
          </div>
          {importResult && <p className="text-sm text-slate-600">{importResult}</p>}
          <p className="text-xs text-slate-400">Download CSV from Google Search Console, Performance, Export.</p>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-engineering-blue" /> AI SEO Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">Run Claude AI to analyze GSC data and generate ranked SEO opportunities.</p>
          <div className="flex items-center gap-3">
            <button onClick={handleAnalyze} disabled={analyzing} className="inline-flex items-center gap-1.5 bg-engineering-blue text-white px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />} Run AI Analysis
            </button>
            <a href="/admin/seo/tasks" className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50">
              <FileText className="h-3.5 w-3.5" /> View Decisions
            </a>
          </div>
          {analysisResult && <p className="text-sm text-slate-600">{analysisResult}</p>}
          {analyzing && <p className="text-xs text-slate-400">Analyzing... this takes 15-30 seconds.</p>}
          <p className="text-xs text-slate-400">
            Download CSV from Google Search Console → Performance → Export. Upload the CSV file here.
            Data is stored per-date; re-importing the same date overwrites.
          </p>
        </CardContent>
      </Card>

      {/* Opportunities (high impressions, page 2-3) */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">SEO Opportunities (Page 2-3 → optimize to reach Page 1)</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1.5 font-medium">Query</th><th className="font-medium">Impressions</th><th className="font-medium">Clicks</th><th className="font-medium">Position</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((o) => (
                  <tr key={o.query} className="hover:bg-slate-50">
                    <td className="py-1.5 font-medium text-navy">{o.query}</td>
                    <td className="text-slate-600">{fmt(o.impressions)}</td>
                    <td className="text-slate-600">{o.clicks}</td>
                    <td><Badge variant="outline" className="text-amber-600 border-amber-300">{fmt(o.avgPosition)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Top Queries */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Queries (30 days)</CardTitle></CardHeader>
        <CardContent>
          {topQueries.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet. Import GSC CSV to populate.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1.5 font-medium">Query</th><th className="font-medium">Impressions</th><th className="font-medium">Clicks</th><th className="font-medium">Position</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topQueries.map((q) => (
                  <tr key={q.query} className="hover:bg-slate-50">
                    <td className="py-1.5 font-medium text-navy">{q.query}</td>
                    <td className="text-slate-600">{fmt(q.impressions)}</td>
                    <td className="text-slate-600">{q.clicks}</td>
                    <td className="text-slate-600">{fmt(q.avgPosition)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Pages (30 days)</CardTitle></CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet. Import GSC CSV to populate.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1.5 font-medium">Page</th><th className="font-medium">Impressions</th><th className="font-medium">Clicks</th><th className="font-medium">Position</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPages.map((p) => (
                  <tr key={p.page} className="hover:bg-slate-50">
                    <td className="py-1.5 font-medium text-navy truncate max-w-xs">{p.page}</td>
                    <td className="text-slate-600">{fmt(p.impressions)}</td>
                    <td className="text-slate-600">{p.clicks}</td>
                    <td className="text-slate-600">{fmt(p.avgPosition)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


