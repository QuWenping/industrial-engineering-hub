import { prisma } from "@/lib/db";
import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizeClient } from "@/components/admin/seo/OptimizeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OptimizePage() {
  const calculators = getAllCalculators().map((c) => ({ url: "/tools/" + c.id, type: "calculator" as const, title: c.name }));
  const guides = getAllDocMeta("guides", "/guides").map((g) => ({ url: "/guides/" + g.slug, type: "guide" as const, title: g.frontmatter.title }));
  const materials = getAllDocMeta("materials", "/materials").map((m) => ({ url: "/materials/" + m.slug, type: "material" as const, title: m.frontmatter.title }));

  const pages = [...calculators, ...guides, ...materials];

  // Get GSC performance for each page (last 30 days)
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const pagesWithGsc = await Promise.all(
    pages.map(async (p) => {
      const gsc = await prisma.seoMetric.aggregate({
        where: { page: p.url, date: { gte: since } },
        _sum: { impressions: true, clicks: true },
        _avg: { position: true },
      });
      return {
        ...p,
        impressions: gsc._sum.impressions || 0,
        clicks: gsc._sum.clicks || 0,
        avgPosition: gsc._avg.position || 0,
      };
    })
  );

  // Sort by impressions (highest first)
  pagesWithGsc.sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Content Optimizer</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a page to run AI-powered SEO optimization analysis. Claude will analyze content quality,
          GSC performance, and suggest specific improvements.
        </p>
      </div>

      <OptimizeClient pages={pagesWithGsc} />
    </div>
  );
}
