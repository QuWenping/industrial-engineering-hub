// Module 5: Opportunity Scoring Engine + AI Decision Layer
// Replaces simple priority with a weighted Opportunity Score (0-100).
// Generates structured SEO Decisions with action types.

import { prisma } from "@/lib/db";
import { classifyStage, type RankingStage } from "./ranking-stage";
import { classifyIntent, getIntentAction, type KeywordIntentType } from "./keyword-intent";

export interface Opportunity {
  pageUrl: string;
  query: string;
  rankingPotential: number; // 0-100 (30% weight)
  searchDemand: number;     // 0-100 (25% weight)
  contentMatch: number;     // 0-100 (20% weight)
  topicImportance: number;  // 0-100 (15% weight)
  businessValue: number;    // 0-100 (10% weight)
  totalScore: number;       // weighted 0-100
  currentPosition: number;
  impressions: number;
  stage: RankingStage;
  intent: KeywordIntentType;
  recommendedAction: string;
  actionType: string; // Action type from the fixed action schema
}

export interface SeoDecisionInput {
  pageUrl: string;
  query: string;
  problem: string;
  analysis: {
    position: number;
    impressions: number;
    intent: KeywordIntentType;
    stage: RankingStage;
  };
  decisionType: string;
  actions: { action: string; payload?: Record<string, unknown>; priority: number }[];
  confidence: number;
  priority: number;
}

const ACTION_TYPES = {
  // Content actions
  expand_section: "Expand content section with more depth and detail",
  rewrite_intro: "Rewrite introduction for better search intent match",
  add_examples: "Add calculation examples and worked solutions",
  add_table: "Add data table (density, properties, dimensions)",
  add_faq: "Add FAQ entries targeting long-tail keywords",
  // SEO actions
  update_title: "Update page title for better CTR and keyword match",
  update_meta: "Update meta description for better CTR",
  update_schema: "Add or update structured data (JSON-LD)",
  improve_internal_links: "Add internal links to/from related pages",
  // Architecture actions
  create_hub: "Create topic cluster hub page",
  create_pillar: "Create pillar content page",
  create_support_article: "Create supporting article for topic cluster",
} as const;

export type ActionType = keyof typeof ACTION_TYPES;

/**
 * Calculate ranking potential (0-100) based on current position.
 * Pages closer to page 1 have higher potential for quick wins.
 */
function calcRankingPotential(position: number): number {
  if (position <= 10) return 100; // Already winning, maintain
  if (position <= 15) return 95;  // One step from page 1
  if (position <= 20) return 85;  // Striking distance
  if (position <= 30) return 70;
  if (position <= 50) return 55;
  if (position <= 80) return 35;
  return 20; // Discovery, long-term effort
}

/**
 * Calculate search demand (0-100) based on impressions.
 */
function calcSearchDemand(impressions: number): number {
  if (impressions > 50) return 100;
  if (impressions > 30) return 85;
  if (impressions > 15) return 70;
  if (impressions > 5) return 50;
  if (impressions > 0) return 30;
  return 10;
}

/**
 * Calculate content match (0-100) — how well does the page match the query.
 */
function calcContentMatch(pageUrl: string, query: string, intent: KeywordIntentType): number {
  let score = 50; // Base

  // URL keyword match
  const queryWords = query.toLowerCase().split(/\s+/);
  const urlLower = pageUrl.toLowerCase();
  const matchCount = queryWords.filter((w) => urlLower.includes(w.replace(/[^a-z]/g, ""))).length;
  score += matchCount * 10;

  // Intent-URL alignment
  if (intent === "calculator" && pageUrl.includes("/tools/")) score += 20;
  if (intent === "reference" && pageUrl.includes("/materials/")) score += 20;
  if (intent === "informational" && pageUrl.includes("/guides/")) score += 20;

  return Math.min(100, score);
}

/**
 * Calculate topic importance (0-100) based on cluster and query type.
 */
function calcTopicImportance(query: string, clusterName?: string): number {
  let score = 50;
  // High-value engineering topics
  const highValue = ["steel weight", "pipe flow", "pump", "aluminum", "density", "heat exchanger", "pressure"];
  if (highValue.some((kw) => query.toLowerCase().includes(kw))) score += 30;

  // Calculator queries are high-value (lead generation)
  if (query.includes("calculator")) score += 20;

  if (clusterName) score += 10; // Part of a cluster = more important

  return Math.min(100, score);
}

/**
 * Calculate business value (0-100) — potential for leads/revenue.
 */
function calcBusinessValue(query: string, intent: KeywordIntentType): number {
  let score = 40;
  // Commercial intent = high business value
  if (intent === "commercial") score += 40;
  if (intent === "calculator") score += 30; // Calculators drive engagement
  if (intent === "reference") score += 15; // Reference builds authority

  // Project-related queries
  if (/design|engineering|plant|factory|facility/i.test(query)) score += 20;

  return Math.min(100, score);
}

/**
 * Determine the best action type for an opportunity.
 */
function determineAction(stage: RankingStage, intent: KeywordIntentType, pageUrl: string): { action: string; type: string } {
  if (stage === "winner") {
    return { action: "Maintain and refresh content", type: "add_examples" };
  }
  if (stage === "striking_distance") {
    if (intent === "calculator") return { action: "Improve calculator page depth and add FAQ", type: "add_faq" };
    return { action: "Expand content and update title for CTR", type: "update_title" };
  }
  if (stage === "growth") {
    if (intent === "reference") return { action: "Add data tables and expand reference content", type: "add_table" };
    if (intent === "informational") return { action: "Create supporting guide content", type: "create_support_article" };
    return { action: "Major content expansion needed", type: "expand_section" };
  }
  // Discovery
  return { action: "Content overhaul or create new pillar page", type: "create_pillar" };
}

/**
 * Generate all opportunities from GSC data with Opportunity Scores.
 */
export async function generateOpportunities(): Promise<Opportunity[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Get query+page pairs with GSC data
  const data = await prisma.seoMetric.groupBy({
    by: ["query", "page"],
    where: { date: { gte: since }, query: { not: "(not set)" }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { position: true, ctr: true },
    orderBy: { _sum: { impressions: "desc" } },
    take: 200,
  });

  // Get cluster info
  const pageClusters = await prisma.pageSeoMeta.findMany({
    where: { cluster: { not: null } },
    select: { url: true, cluster: true },
  });
  const clusterMap = new Map(pageClusters.map((p) => [p.url, p.cluster]));

  const opportunities: Opportunity[] = [];

  for (const d of data) {
    const position = d._avg.position || 0;
    const impressions = d._sum.impressions || 0;
    const clicks = d._sum.clicks || 0;
    const intent = classifyIntent(d.query);
    const stage = classifyStage(position);
    const clusterName = clusterMap.get(d.page) || undefined;

    const rankingPotential = calcRankingPotential(position);
    const searchDemand = calcSearchDemand(impressions);
    const contentMatch = calcContentMatch(d.page, d.query, intent);
    const topicImportance = calcTopicImportance(d.query, clusterName);
    const businessValue = calcBusinessValue(d.query, intent);

    const totalScore = Math.round(
      rankingPotential * 0.30 +
      searchDemand * 0.25 +
      contentMatch * 0.20 +
      topicImportance * 0.15 +
      businessValue * 0.10
    );

    const { action, type } = determineAction(stage, intent, d.page);

    opportunities.push({
      pageUrl: d.page,
      currentPosition: position,
      impressions,
      query: d.query,
      rankingPotential,
      searchDemand,
      contentMatch,
      topicImportance,
      businessValue,
      totalScore,
      stage,
      intent,
      recommendedAction: action,
      actionType: type,
    });
  }

  return opportunities.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Create SeoDecision records for top opportunities.
 */
export async function createDecisions(topN = 20): Promise<SeoDecisionInput[]> {
  const opportunities = await generateOpportunities();
  const top = opportunities.slice(0, topN);
  const decisions: SeoDecisionInput[] = [];

  for (const opp of top) {
    const decisionType = mapActionToDecisionType(opp.actionType, opp.stage);
    const problem = `${opp.query} — Position ${opp.currentPosition}, ${opp.impressions} impressions, ${opp.stage} stage, ${opp.intent} intent`;

    const decision: SeoDecisionInput = {
      pageUrl: opp.pageUrl,
      query: opp.query,
      problem,
      analysis: {
        position: opp.currentPosition,
        impressions: opp.impressions,
        intent: opp.intent,
        stage: opp.stage,
      },
      decisionType,
      actions: [
        {
          action: opp.actionType,
          payload: { query: opp.query, target: opp.pageUrl, reason: opp.recommendedAction },
          priority: opp.totalScore,
        },
      ],
      confidence: Math.min(0.95, 0.5 + opp.contentMatch / 200),
      priority: opp.totalScore,
    };

    // Check if decision already exists for this page+query
    const existing = await prisma.seoDecision.findFirst({
      where: { pageUrl: opp.pageUrl, query: opp.query, status: "pending" },
    });

    if (!existing) {
      const created = await prisma.seoDecision.create({
        data: {
          pageUrl: decision.pageUrl,
          query: decision.query,
          decisionType: decision.decisionType,
          problem: decision.problem,
          analysis: decision.analysis as any,
          actions: decision.actions as any,
          confidence: decision.confidence,
          priority: decision.priority,
          status: "pending",
        },
      });

      // Create SeoAction records
      for (const action of decision.actions) {
        await prisma.seoAction.create({
          data: {
            decisionId: created.id,
            action: action.action,
            payload: (action.payload || {}) as any,
            status: "pending",
          },
        });
      }
    }

    decisions.push(decision);
  }

  return decisions;
}

function mapActionToDecisionType(actionType: string, stage: RankingStage): string {
  if (actionType.startsWith("create_")) return "new_content";
  if (actionType === "update_title" || actionType === "update_meta") return "title_optimization";
  if (actionType === "improve_internal_links") return "internal_links";
  if (actionType === "add_table" || actionType === "add_faq" || actionType === "add_examples") return "content_expansion";
  if (actionType === "create_hub") return "cluster_building";
  return "content_expansion";
}

export { ACTION_TYPES };


