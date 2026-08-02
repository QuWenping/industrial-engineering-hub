import { prisma } from "@/lib/db";
import { SeoDashboard } from "@/components/admin/seo/SeoDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SeoPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [totalMetrics, topQueries, topPages, aiDecisions] = await Promise.all([
    prisma.seoMetric.aggregate({
      where: { date: { gte: since } },
      _sum: { impressions: true, clicks: true },
      _avg: { ctr: true, position: true },
      _count: true,
    }),
    prisma.seoMetric.groupBy({
      by: ["query"],
      where: { date: { gte: since }, query: { not: "(not set)" } },
      _sum: { impressions: true, clicks: true },
      _avg: { position: true },
      orderBy: { _sum: { impressions: "desc" } },
      take: 20,
    }),
    prisma.seoMetric.groupBy({
      by: ["page"],
      where: { date: { gte: since }, page: { not: "(not set)" } },
      _sum: { impressions: true, clicks: true },
      _avg: { position: true },
      orderBy: { _sum: { impressions: "desc" } },
      take: 20,
    }),
    prisma.seoAiDecision.count(),
  ]);

  // Find opportunities: high impressions, low position (11-30 = page 2-3)
  const opportunities = topQueries
    .filter((q) => (q._avg.position ?? 99) > 10 && (q._avg.position ?? 99) < 31 && (q._sum.impressions ?? 0) > 10)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">SEO Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Google Search Console data + AI SEO opportunities. Import GSC CSV to populate.
        </p>
      </div>
      <SeoDashboard
        summary={{
          totalImpressions: totalMetrics._sum.impressions || 0,
          totalClicks: totalMetrics._sum.clicks || 0,
          avgCtr: totalMetrics._avg.ctr || 0,
          avgPosition: totalMetrics._avg.position || 0,
          totalRecords: totalMetrics._count,
          aiDecisions,
        }}
        topQueries={topQueries.map((q) => ({
          query: q.query,
          impressions: q._sum.impressions || 0,
          clicks: q._sum.clicks || 0,
          avgPosition: q._avg.position || 0,
        }))}
        topPages={topPages.map((p) => ({
          page: p.page,
          impressions: p._sum.impressions || 0,
          clicks: p._sum.clicks || 0,
          avgPosition: p._avg.position || 0,
        }))}
        opportunities={opportunities.map((q) => ({
          query: q.query,
          impressions: q._sum.impressions || 0,
          clicks: q._sum.clicks || 0,
          avgPosition: q._avg.position || 0,
        }))}
      />
    </div>
  );
}
