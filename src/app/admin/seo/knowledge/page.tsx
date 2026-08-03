import { prisma } from "@/lib/db";
import { TAXONOMY, getClusterPages } from "@/lib/seo/taxonomy";
import { getLinkGraphStats, getRecommendedLinks } from "@/lib/seo/link-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KnowledgeClient } from "@/components/admin/seo/KnowledgeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const stats = getLinkGraphStats();
  const pageMetas = await prisma.pageSeoMeta.findMany({ orderBy: { wordCount: "asc" }, take: 10 });

  const clusters = TAXONOMY.map((c) => {
    const pages = getClusterPages(c);
    return {
      id: c.id,
      name: c.name,
      pillarPage: c.pillarPage,
      pageCount: pages.length,
      calculatorCount: c.calculators.length,
      guideCount: c.guides.length,
      materialCount: c.materials.length,
      keywords: c.keywords,
    };
  });

  // Get top link recommendations for pillar pages
  const linkRecs = TAXONOMY.slice(0, 3).map((c) => ({
    cluster: c.name,
    pillar: c.pillarPage,
    links: getRecommendedLinks(c.pillarPage, 5),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Engineering Knowledge Layer</h1>
        <p className="text-sm text-slate-500 mt-1">
          Topic clusters, internal link graph, and page SEO audit. The foundation for SEO Brain and Internal Link Agent.
        </p>
      </div>

      <KnowledgeClient stats={stats} clusters={clusters} linkRecs={linkRecs} lowWordCountPages={pageMetas.filter(p => p.wordCount < 500).map(p => ({ url: p.url, wordCount: p.wordCount, type: p.url.split("/")[1] }))} />
    </div>
  );
}
