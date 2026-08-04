// Module 2: Page Intelligence Engine
// Calculates Page Authority Score (0-100) from 5 dimensions:
// Content Quality (25%) + Keyword Coverage (20%) + Internal Links (15%) + Search Performance (25%) + E-E-A-T (15%)

import { prisma } from "@/lib/db";
import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { getDocFrontmatter } from "@/lib/mdx";
import { classifyStage } from "./ranking-stage";

export interface PageIntelligence {
  pageUrl: string;
  pageType: "calculator" | "guide" | "material" | "service" | "cluster" | "other";
  contentScore: number;   // 0-100
  keywordScore: number;   // 0-100
  linksScore: number;     // 0-100
  searchScore: number;    // 0-100
  eeattScore: number;     // 0-100
  totalScore: number;     // weighted 0-100
  rankingStage: string;
  impressions: number;
  clicks: number;
  avgPosition: number;
  clusterName?: string;
  recommendations: string[];
}

const WEIGHTS = {
  content: 0.25,
  keyword: 0.20,
  links: 0.15,
  search: 0.25,
  eeatt: 0.15,
};

/**
 * Score content quality based on word count, FAQ presence, schema, tables.
 */
function scoreContent(params: {
  wordCount: number;
  hasFaq: boolean;
  hasSchema: boolean;
  hasTable: boolean;
  hasFormula: boolean;
}): number {
  let score = 0;
  // Word count: 0-40 points (target 1500+ words)
  if (params.wordCount >= 2000) score += 40;
  else if (params.wordCount >= 1000) score += 30;
  else if (params.wordCount >= 500) score += 20;
  else if (params.wordCount >= 200) score += 10;
  else score += 5;

  if (params.hasFaq) score += 20;
  if (params.hasSchema) score += 15;
  if (params.hasTable) score += 15;
  if (params.hasFormula) score += 10;

  return Math.min(100, score);
}

/**
 * Score keyword coverage based on GSC impressions and queries.
 */
function scoreKeyword(impressions: number, queryCount: number): number {
  let score = 0;
  if (impressions > 50) score += 40;
  else if (impressions > 20) score += 30;
  else if (impressions > 5) score += 20;
  else if (impressions > 0) score += 10;

  if (queryCount >= 10) score += 30;
  else if (queryCount >= 5) score += 25;
  else if (queryCount >= 3) score += 20;
  else if (queryCount >= 1) score += 15;

  // Bonus for having keywords in title
  score += 30; // Assume keywords present (simplified)

  return Math.min(100, score);
}

/**
 * Score internal links.
 */
function scoreLinks(internalLinkCount: number): number {
  if (internalLinkCount >= 10) return 100;
  if (internalLinkCount >= 6) return 80;
  if (internalLinkCount >= 3) return 60;
  if (internalLinkCount >= 1) return 40;
  return 20;
}

/**
 * Score search performance based on GSC data.
 */
function scoreSearch(position: number, impressions: number, clicks: number): number {
  let score = 0;
  // Position-based (0-50 points)
  if (position <= 10) score += 50;
  else if (position <= 20) score += 40;
  else if (position <= 50) score += 25;
  else if (position <= 100) score += 10;
  else score += 5;

  // Impressions (0-30 points)
  if (impressions > 50) score += 30;
  else if (impressions > 20) score += 25;
  else if (impressions > 5) score += 20;
  else if (impressions > 0) score += 15;

  // Clicks (0-20 points)
  if (clicks > 5) score += 20;
  else if (clicks > 0) score += 10;

  return Math.min(100, score);
}

/**
 * Score E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
 */
function scoreEeatt(params: {
  hasDisclaimer: boolean;
  hasMethodology: boolean;
  hasAuthor: boolean;
  hasUpdated: boolean;
  isCalculator: boolean;
}): number {
  let score = 30; // Base for being an engineering tool site
  if (params.hasDisclaimer) score += 15;
  if (params.hasMethodology) score += 15;
  if (params.hasAuthor) score += 10;
  if (params.hasUpdated) score += 10;
  if (params.isCalculator) score += 20; // Calculators have inherent utility
  return Math.min(100, score);
}

/**
 * Analyze a single page and compute its intelligence score.
 */
export async function analyzePage(pageUrl: string): Promise<PageIntelligence> {
  // Determine page type
  let pageType: PageIntelligence["pageType"] = "other";
  if (pageUrl.startsWith("/tools/")) pageType = "calculator";
  else if (pageUrl.startsWith("/guides/")) pageType = "guide";
  else if (pageUrl.startsWith("/materials/")) pageType = "material";
  else if (pageUrl.startsWith("/services/")) pageType = "service";

  // Get page content data
  let wordCount = 0;
  let hasFaq = false;
  let hasSchema = false;
  let hasTable = false;
  let hasFormula = false;
  let internalLinks = 0;
  let hasDisclaimer = false;
  let hasMethodology = false;
  let hasAuthor = false;
  let hasUpdated = false;

  if (pageType === "calculator") {
    const slug = pageUrl.replace("/tools/", "");
    const calc = getCalculatorBySlug(slug);
    if (calc) {
      wordCount = (calc.content.introduction || "").split(/\s+/).length +
        (calc.content.formula_explanation || "").split(/\s+/).length +
        (calc.content.faq || []).reduce((sum, f) => sum + f.q.split(/\s+/).length + f.a.split(/\s+/).length, 0);
      hasFaq = !!calc.content.faq && calc.content.faq.length > 0;
      hasSchema = true;
      hasFormula = true;
      internalLinks = (calc.content.related || []).length;
    }
  } else if (pageType === "guide" || pageType === "material") {
    const slug = pageUrl.split("/").pop() || "";
    const subdir = pageType === "guide" ? "guides" : "materials";
    const fm = getDocFrontmatter(slug, subdir);
    if (fm) {
      wordCount = ((fm.description || "") + " " + (fm.title || "")).split(/\s+/).length;
      hasFaq = (fm.description || "").toLowerCase().includes("faq");
      hasUpdated = !!fm.updated;
      hasAuthor = !!fm.author;
      internalLinks = ((fm.related as string[]) || []).length;
    }
  }

  // Get GSC data (last 30 days)
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const gscData = await prisma.seoMetric.aggregate({
    where: { page: pageUrl, date: { gte: since } },
    _sum: { impressions: true, clicks: true },
    _avg: { ctr: true, position: true },
  });

  // Count unique queries for this page
  const queryCount = await prisma.seoMetric.groupBy({
    by: ["query"],
    where: { page: pageUrl, date: { gte: since } },
    _sum: { impressions: true },
  });

  const impressions = gscData._sum.impressions || 0;
  const clicks = gscData._sum.clicks || 0;
  const avgPosition = gscData._avg.position || 0;

  // Calculate scores
  const contentScore = scoreContent({ wordCount, hasFaq, hasSchema, hasTable, hasFormula });
  const keywordScore = scoreKeyword(impressions, queryCount.length);
  const linksScore = scoreLinks(internalLinks);
  const searchScore = scoreSearch(avgPosition, impressions, clicks);
  const eeattScore = scoreEeatt({ hasDisclaimer, hasMethodology, hasAuthor, hasUpdated, isCalculator: pageType === "calculator" });

  const totalScore = Math.round(
    contentScore * WEIGHTS.content +
    keywordScore * WEIGHTS.keyword +
    linksScore * WEIGHTS.links +
    searchScore * WEIGHTS.search +
    eeattScore * WEIGHTS.eeatt
  );

  const rankingStage = classifyStage(avgPosition);

  // Generate recommendations
  const recommendations: string[] = [];
  if (contentScore < 60) recommendations.push("Expand content depth — add more engineering detail, examples, and FAQ entries");
  if (keywordScore < 50) recommendations.push("Improve keyword coverage — add related search terms and long-tail variations");
  if (linksScore < 60) recommendations.push("Build internal links — connect to related calculators, guides, and material pages");
  if (searchScore < 40 && avgPosition > 20) recommendations.push("Focus on ranking improvement — this page needs content authority boost");
  if (eeattScore < 60) recommendations.push("Strengthen E-E-A-T signals — add methodology references, author info, and disclaimers");

  // Get cluster name from PageSeoMeta
  const existingMeta = await prisma.pageSeoMeta.findUnique({ where: { url: pageUrl } });
  const clusterName = existingMeta?.cluster || undefined;

  return {
    pageUrl,
    pageType,
    contentScore,
    keywordScore,
    linksScore,
    searchScore,
    eeattScore,
    totalScore,
    rankingStage,
    impressions,
    clicks,
    avgPosition,
    clusterName,
    recommendations,
  };
}

/**
 * Analyze all pages with GSC data and upsert PageScore records.
 */
export async function analyzeAllPages(): Promise<PageIntelligence[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const pages = await prisma.seoMetric.groupBy({
    by: ["page"],
    where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true },
    orderBy: { _sum: { impressions: "desc" } },
    take: 50,
  });

  const results: PageIntelligence[] = [];
  for (const p of pages) {
    const intelligence = await analyzePage(p.page);
    results.push(intelligence);

    // Upsert PageScore
    await prisma.pageScore.upsert({
      where: { pageUrl: p.page },
      create: {
        pageUrl: p.page,
        pageType: intelligence.pageType,
        contentScore: intelligence.contentScore,
        keywordScore: intelligence.keywordScore,
        linksScore: intelligence.linksScore,
        searchScore: intelligence.searchScore,
        eeattScore: intelligence.eeattScore,
        totalScore: intelligence.totalScore,
        rankingStage: intelligence.rankingStage,
        impressions: intelligence.impressions,
        clicks: intelligence.clicks,
        avgPosition: intelligence.avgPosition,
        clusterName: intelligence.clusterName,
      },
      update: {
        pageType: intelligence.pageType,
        contentScore: intelligence.contentScore,
        keywordScore: intelligence.keywordScore,
        linksScore: intelligence.linksScore,
        searchScore: intelligence.searchScore,
        eeattScore: intelligence.eeattScore,
        totalScore: intelligence.totalScore,
        rankingStage: intelligence.rankingStage,
        impressions: intelligence.impressions,
        clicks: intelligence.clicks,
        avgPosition: intelligence.avgPosition,
        clusterName: intelligence.clusterName,
      },
    });
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}
