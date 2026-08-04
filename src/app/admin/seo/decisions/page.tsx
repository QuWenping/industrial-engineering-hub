import { prisma } from "@/lib/db";
import { SeoDecisionCenter } from "@/components/admin/seo/SeoDecisionCenter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SeoDecisionsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [decisions, pageScores, clusters, keywordIntents, stageCounts] = await Promise.all([
    prisma.seoDecision.findMany({
      include: { SeoActions: true },
      orderBy: { priority: "desc" },
      take: 50,
    }),
    prisma.pageScore.findMany({
      orderBy: { totalScore: "desc" },
      take: 20,
    }),
    prisma.topicCluster.findMany({
      orderBy: { authorityScore: "desc" },
    }),
    prisma.keywordIntent.findMany({
      orderBy: { priority: "desc" },
      take: 30,
    }),
    prisma.pageScore.groupBy({
      by: ["rankingStage"],
      _count: { id: true },
    }),
  ]);

  const domainScore = pageScores.length > 0
    ? Math.round(pageScores.reduce((sum, p) => sum + p.totalScore, 0) / pageScores.length)
    : 0;

  const pendingDecisions = decisions.filter((d) => d.status === "pending").length;
  const trafficOpportunity = decisions
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + (d.priority || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">SEO Decision Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-powered SEO growth operating system. Analyze GSC data, generate decisions, approve and execute.
        </p>
      </div>
      <SeoDecisionCenter
        domainScore={domainScore}
        pendingDecisions={pendingDecisions}
        trafficOpportunity={trafficOpportunity}
        decisions={decisions.map((d) => ({
          id: d.id,
          pageUrl: d.pageUrl || "",
          query: d.query || "",
          decisionType: d.decisionType,
          problem: d.problem || "",
          confidence: d.confidence,
          priority: d.priority,
          status: d.status,
          actions: d.SeoActions.map((a) => ({ action: a.action, status: a.status })),
          createdAt: d.createdAt.toISOString(),
        }))}
        pageScores={pageScores.map((p) => ({
          pageUrl: p.pageUrl,
          pageType: p.pageType,
          contentScore: p.contentScore,
          keywordScore: p.keywordScore,
          linksScore: p.linksScore,
          searchScore: p.searchScore,
          eeattScore: p.eeattScore,
          totalScore: p.totalScore,
          rankingStage: p.rankingStage,
          impressions: p.impressions,
          avgPosition: p.avgPosition,
        }))}
        clusters={clusters.map((c) => ({
          name: c.name,
          authorityScore: c.authorityScore,
          pageCount: c.pageCount,
          totalImpressions: c.totalImpressions,
          avgPosition: c.avgPosition,
        }))}
        keywords={keywordIntents.map((k) => ({
          query: k.query,
          intent: k.intent,
          impressions: k.impressions,
          currentPosition: k.currentPosition || 0,
          priority: k.priority,
        }))}
        stageCounts={stageCounts.reduce((acc, s) => ({ ...acc, [s.rankingStage]: s._count.id }), {} as Record<string, number>)}
      />
    </div>
  );
}
