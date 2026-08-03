import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Eye, TrendingUp } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SharesPage() {
  const allShares = await prisma.shareResult.findMany({ orderBy: { createdAt: "desc" } });

  const totalShares = allShares.length;
  const totalViews = allShares.reduce((s, r) => s + (r.views || 0), 0);
  const avgViews = totalShares > 0 ? Math.round((totalViews / totalShares) * 10) / 10 : 0;

  const byCalc = new Map<string, { shares: number; views: number }>();
  for (const s of allShares) {
    const key = s.calculatorName || s.calculator;
    const existing = byCalc.get(key) || { shares: 0, views: 0 };
    existing.shares++;
    existing.views += s.views || 0;
    byCalc.set(key, existing);
  }
  const topShared = Array.from(byCalc.entries())
    .map(([name, v]) => ({ name, ...v, avg: v.shares > 0 ? Math.round((v.views / v.shares) * 10) / 10 : 0 }))
    .sort((a, b) => b.shares - a.shares)
    .slice(0, 10);

  const recentShares = allShares.slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Share Statistics</h1>
        <p className="text-sm text-slate-500 mt-1">Which calculators are being shared and viewed the most.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Share2 className="h-4 w-4" /> Total Shares</div>
          <div className="text-2xl font-bold text-navy">{totalShares}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Eye className="h-4 w-4" /> Total Views</div>
          <div className="text-2xl font-bold text-navy">{totalViews}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><TrendingUp className="h-4 w-4" /> Avg Views/Share</div>
          <div className="text-2xl font-bold text-navy">{avgViews}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><TrendingUp className="h-4 w-4" /> Unique Calculators</div>
          <div className="text-2xl font-bold text-navy">{byCalc.size}</div>
        </CardContent></Card>
      </div>

      {topShared.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Top Shared Calculators</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1.5 font-medium">Calculator</th><th className="font-medium">Shares</th><th className="font-medium">Views</th><th className="font-medium">Avg Views</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topShared.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50">
                    <td className="py-1.5 font-medium text-navy">{s.name}</td>
                    <td className="text-slate-600">{s.shares}</td>
                    <td className="text-slate-600">{s.views}</td>
                    <td className="text-slate-600">{s.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {recentShares.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Shares</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-1.5 font-medium">Calculator</th><th className="font-medium">Result</th><th className="font-medium">Views</th><th className="font-medium">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentShares.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-1.5 font-medium text-navy text-xs">{s.calculatorName}</td>
                    <td className="text-slate-600 text-xs">{(s.resultData as any)?.value || "—"} {(s.resultData as any)?.unit || ""}</td>
                    <td><Badge variant="outline" className="text-xs">{s.views}</Badge></td>
                    <td className="text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {totalShares === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-slate-400">
            No shares yet. Share features appear on calculator pages after Calculate is clicked.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
