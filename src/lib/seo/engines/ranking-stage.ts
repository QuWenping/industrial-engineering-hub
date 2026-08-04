// Module 1: Ranking Stage Engine
// Classifies pages by their Google ranking position into actionable stages.

import { prisma } from "@/lib/db";

export type RankingStage = "winner" | "striking_distance" | "growth" | "discovery";

export interface PageRankingData {
  pageUrl: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  stage: RankingStage;
}

export function classifyStage(position: number): RankingStage {
  if (position <= 10) return "winner";
  if (position <= 20) return "striking_distance";
  if (position <= 50) return "growth";
  return "discovery";
}

export const STAGE_LABELS: Record<RankingStage, string> = {
  winner: "Winner (Top 10)",
  striking_distance: "Striking Distance (11-20)",
  growth: "Growth (21-50)",
  discovery: "Discovery (50+)",
};

export const STAGE_COLORS: Record<RankingStage, string> = {
  winner: "#00B578",
  striking_distance: "#1677FF",
  growth: "#F59E0B",
  discovery: "#94A3B8",
};

export const STAGE_STRATEGIES: Record<RankingStage, string> = {
  winner: "Maintain position. Monitor CTR, refresh content quarterly, build internal links to this page.",
  striking_distance: "Content boost needed. Expand depth, add FAQ, improve title for CTR, build internal links.",
  growth: "Significant content expansion required. Add 500+ words, create supporting articles, improve E-E-A-T signals.",
  discovery: "Google has found the page but doesn't trust it yet. Major content overhaul or consider merging with stronger pages.",
};

/**
 * Get ranking stage data for all pages with GSC data in the last N days.
 */
export async function getRankingStages(days = 30): Promise<PageRankingData[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const pageData = await prisma.seoMetric.groupBy({
    by: ["page"],
    where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { ctr: true, position: true },
    orderBy: { _sum: { impressions: "desc" } },
    take: 100,
  });

  return pageData.map((p) => {
    const position = p._avg.position || 0;
    return {
      pageUrl: p.page,
      impressions: p._sum.impressions || 0,
      clicks: p._sum.clicks || 0,
      ctr: p._avg.ctr || 0,
      avgPosition: position,
      stage: classifyStage(position),
    };
  });
}

/**
 * Get summary counts by stage.
 */
export async function getStageSummary(days = 30): Promise<Record<RankingStage, number>> {
  const stages = await getRankingStages(days);
  const summary: Record<RankingStage, number> = {
    winner: 0,
    striking_distance: 0,
    growth: 0,
    discovery: 0,
  };
  for (const s of stages) {
    summary[s.stage]++;
  }
  return summary;
}
