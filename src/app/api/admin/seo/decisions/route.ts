import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createDecisions } from "@/lib/seo/engines/opportunity-scoring";
import { getRankingStages, getStageSummary } from "@/lib/seo/engines/ranking-stage";
import { analyzeAllPages } from "@/lib/seo/engines/page-intelligence";
import { classifyAllKeywords, getIntentSummary } from "@/lib/seo/engines/keyword-intent";
import { buildClusters } from "@/lib/seo/engines/topic-cluster";
import { generateActionPlan } from "@/lib/seo/engines/action-plan";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const action = searchParams.get("action");

  try {
    if (action === "summary") {
      const [stageSummary, intentSummary, decisions, clusters, pageScores] = await Promise.all([
        getStageSummary(30),
        getIntentSummary(),
        prisma.seoDecision.groupBy({ by: ["status"], _count: { id: true } }),
        prisma.topicCluster.findMany({ orderBy: { authorityScore: "desc" } }),
        prisma.pageScore.findMany({ orderBy: { totalScore: "desc" }, take: 20 }),
      ]);

      const domainScore = pageScores.length > 0
        ? Math.round(pageScores.reduce((sum, p) => sum + p.totalScore, 0) / pageScores.length)
        : 0;

      return NextResponse.json({
        domainScore,
        stageSummary,
        intentSummary,
        decisionCounts: decisions.reduce((acc, d) => ({ ...acc, [d.status]: d._count.id }), {}),
        clusterCount: clusters.length,
        topClusters: clusters.slice(0, 5),
        topPages: pageScores.slice(0, 10),
      });
    }

    if (action === "action-plan") {
      const plan = await generateActionPlan();
      return NextResponse.json(plan);
    }

    if (action === "opportunities") {
      const opps = await prisma.seoDecision.findMany({
        where: { status: "pending" },
        include: { SeoActions: true },
        orderBy: { priority: "desc" },
        take: 50,
      });
      return NextResponse.json(opps);
    }

    if (action === "page-scores") {
      const scores = await prisma.pageScore.findMany({
        orderBy: { totalScore: "desc" },
        take: 50,
      });
      return NextResponse.json(scores);
    }

    if (action === "clusters") {
      const clusters = await prisma.topicCluster.findMany({
        orderBy: { authorityScore: "desc" },
      });
      return NextResponse.json(clusters);
    }

    if (action === "keywords") {
      const keywords = await prisma.keywordIntent.findMany({
        orderBy: { priority: "desc" },
        take: 100,
      });
      return NextResponse.json(keywords);
    }

    // Default: return all decisions
    const decisions = await prisma.seoDecision.findMany({
      include: { SeoActions: true },
      orderBy: { priority: "desc" },
      take: 50,
    });
    return NextResponse.json(decisions);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  try {
    if (action === "analyze") {
      // Run all engines
      const [pages, keywords, clusters, stages] = await Promise.all([
        analyzeAllPages(),
        classifyAllKeywords(),
        buildClusters(),
        getRankingStages(30),
      ]);
      return NextResponse.json({
        success: true,
        pagesAnalyzed: pages.length,
        keywordsClassified: keywords.length,
        clustersBuilt: clusters.length,
        pagesRanked: stages.length,
      });
    }

    if (action === "generate-action-plan") {
      const plan = await generateActionPlan();
      return NextResponse.json(plan);
    }

    if (action === "generate-decisions") {
      const decisions = await createDecisions(body.topN || 20);
      return NextResponse.json({ success: true, decisionsCreated: decisions.length });
    }

    if (action === "approve") {
      const { decisionId } = body;
      await prisma.seoDecision.update({
        where: { id: decisionId },
        data: { status: "approved", approvedAt: new Date(), approvedBy: "admin" },
      });
      await prisma.seoAction.updateMany({
        where: { decisionId },
        data: { status: "approved" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      const { decisionId } = body;
      await prisma.seoDecision.update({
        where: { id: decisionId },
        data: { status: "rejected" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "execute") {
      const { decisionId } = body;
      await prisma.seoDecision.update({
        where: { id: decisionId },
        data: { status: "executed", executedAt: new Date() },
      });
      await prisma.seoAction.updateMany({
        where: { decisionId },
        data: { status: "done", executedAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
