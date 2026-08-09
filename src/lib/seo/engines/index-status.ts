// Index Status Intelligence Engine
// Tracks Google indexing status and generates recommendations for each page.
// Can import Google Search Console > Coverage report data (CSV or manual).

import { prisma } from "@/lib/db";

export type IndexStatus = "indexed" | "discovered" | "excluded" | "unknown";

export interface PageIndexInfo {
  url: string;
  status: IndexStatus;
  lastCrawl?: Date;
  daysSinceCrawl: number;
  priorityScore: number;
  pageType: string;
  impressions: number;
  clicks: number;
  position: number;
  recommendation: string;
}

export function detectPageType(url: string): string {
  if (url.startsWith("/tools/")) return "calculator";
  if (url.startsWith("/guides/")) return "guide";
  if (url.startsWith("/materials/")) return "material";
  if (url.startsWith("/projects/")) return "project";
  if (url.startsWith("/services/")) return "service";
  if (url.startsWith("/industries/")) return "industry";
  return "other";
}

export function generateRecommendation(info: {
  status: IndexStatus;
  daysSinceCrawl: number;
  pageType: string;
  impressions: number;
  position: number;
}): string {
  if (info.status === "excluded") {
    return "Page excluded by Google. Check robots.txt, noindex tags, or thin content. Consider improving content depth or removing if low value.";
  }
  if (info.status === "discovered") {
    return "Google found this URL but hasn't indexed it yet. Ensure content is substantial (1000+ words), has internal links pointing to it, and is not blocked by robots.txt.";
  }
  if (info.status === "indexed" && info.position > 0 && info.position <= 20) {
    return "Striking distance! Optimize title for CTR, expand content depth, add FAQ to push to Top 10.";
  }
  if (info.status === "indexed" && info.position > 20 && info.position <= 50) {
    return "Growth stage. Major content expansion needed. Add engineering examples, data tables, and internal links to topic cluster hub.";
  }
  if (info.status === "indexed" && info.position > 50) {
    return "Indexed but low ranking. Google has found this page but doesn't consider it authoritative. Build Topic Authority through cluster content and internal links.";
  }
  if (info.status === "indexed" && info.daysSinceCrawl > 14) {
    return "Page not crawled recently. Submit URL in GSC, ensure sitemap is up to date, and add internal links from frequently-crawled pages.";
  }
  return "Page is indexed and being crawled regularly. Monitor GSC Performance for ranking improvements.";
}

export function calculatePriorityScore(params: {
  status: IndexStatus;
  pageType: string;
  impressions: number;
  position: number;
  daysSinceCrawl: number;
}): number {
  let score = 50;

  // Page type weight
  const typeWeights: Record<string, number> = {
    calculator: 30, // Highest commercial value
    guide: 20,
    material: 20,
    service: 15,
    industry: 10,
    project: 5,
    other: 10,
  };
  score += typeWeights[params.pageType] || 10;

  // Impressions
  if (params.impressions > 50) score += 15;
  else if (params.impressions > 10) score += 10;
  else if (params.impressions > 0) score += 5;

  // Position
  if (params.position > 0 && params.position <= 20) score += 20;
  else if (params.position > 20 && params.position <= 50) score += 10;

  // Indexing status
  if (params.status === "discovered") score += 10; // Push for indexing
  if (params.status === "excluded") score -= 10; // Lower priority (fix needed)

  // Recency
  if (params.daysSinceCrawl < 7) score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Import GSC URL Inspection data (batch).
 * Accepts array of { url, status, lastCrawl? } and upserts to database.
 */
export async function importIndexStatus(entries: {
  url: string;
  status: IndexStatus;
  lastCrawl?: string;
}[]): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const entry of entries) {
    const pageType = detectPageType(entry.url);
    const lastCrawl = entry.lastCrawl ? new Date(entry.lastCrawl) : undefined;
    const daysSinceCrawl = lastCrawl
      ? Math.floor((Date.now() - lastCrawl.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Get GSC data for this page
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const gscData = await prisma.seoMetric.aggregate({
      where: { page: entry.url, date: { gte: since } },
      _sum: { impressions: true, clicks: true },
      _avg: { position: true },
    });

    const impressions = gscData._sum.impressions || 0;
    const clicks = gscData._sum.clicks || 0;
    const position = gscData._avg.position || 0;

    const priorityScore = calculatePriorityScore({
      status: entry.status,
      pageType,
      impressions,
      position,
      daysSinceCrawl,
    });

    const recommendation = generateRecommendation({
      status: entry.status,
      daysSinceCrawl,
      pageType,
      impressions,
      position,
    });

    try {
      await prisma.pageIndexStatus.upsert({
        where: { url: entry.url },
        create: {
          url: entry.url,
          status: entry.status,
          lastCrawl,
          daysSinceCrawl,
          priorityScore,
          pageType,
          impressions,
          clicks,
          position,
          recommendation,
        },
        update: {
          status: entry.status,
          lastCrawl,
          daysSinceCrawl,
          priorityScore,
          pageType,
          impressions,
          clicks,
          position,
          recommendation,
        },
      });
      created++;
    } catch {
      updated++;
    }
  }

  return { created, updated };
}

/**
 * Auto-generate index status entries for all known pages on the site.
 * Used when no manual GSC coverage data is available — guesses status based on GSC Performance data.
 */
export async function autoGenerateIndexStatus(): Promise<{
  total: number;
  indexed: number;
  discovered: number;
  unknown: number;
}> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Get all pages that have GSC performance data (these are likely indexed)
  const pagesWithGSC = await prisma.seoMetric.groupBy({
    by: ["page"],
    where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { position: true },
  });

  const gscUrls = new Set(pagesWithGSC.map((p) => p.page));

  // Generate entries for all GSC pages (assume indexed if they have impressions)
  const entries: { url: string; status: IndexStatus }[] = [];
  for (const p of pagesWithGSC) {
    const impressions = p._sum.impressions || 0;
    const status: IndexStatus = impressions > 0 ? "indexed" : "discovered";
    entries.push({ url: p.page, status });
  }

  // Also check for known site URLs that have no GSC data (likely discovered or excluded)
  const knownPaths = [
    "/tools/steel-weight-calculator",
    "/tools/pipe-flow-calculator",
    "/tools/aluminum-weight-calculator",
    "/tools/copper-weight-calculator",
    "/tools/beam-deflection-calculator",
    "/tools/pump-efficiency-calculator",
    "/materials/aluminum",
    "/materials/diesel",
    "/materials/copper",
    "/materials/gasoline",
    "/guides/material-strength-basics",
    "/guides/pipe-flow-engineering",
    "/guides/piping-engineering",
    "/guides/pressure-vessel-design",
    "/guides/battery-factory-engineering",
  ];

  for (const url of knownPaths) {
    if (!gscUrls.has(url)) {
      entries.push({ url, status: "discovered" });
    }
  }

  const result = await importIndexStatus(entries);

  return {
    total: result.created + result.updated,
    indexed: entries.filter((e) => e.status === "indexed").length,
    discovered: entries.filter((e) => e.status === "discovered").length,
    unknown: 0,
  };
}

/**
 * Get index status summary for dashboard.
 */
export async function getIndexSummary(): Promise<{
  total: number;
  indexed: number;
  discovered: number;
  excluded: number;
  unknown: number;
  byType: Record<string, { indexed: number; discovered: number; total: number }>;
}> {
  const all = await prisma.pageIndexStatus.findMany();

  const summary = {
    total: all.length,
    indexed: all.filter((p) => p.status === "indexed").length,
    discovered: all.filter((p) => p.status === "discovered").length,
    excluded: all.filter((p) => p.status === "excluded").length,
    unknown: all.filter((p) => p.status === "unknown").length,
    byType: {} as Record<string, { indexed: number; discovered: number; total: number }>,
  };

  for (const p of all) {
    if (!summary.byType[p.pageType || "other"]) {
      summary.byType[p.pageType || "other"] = { indexed: 0, discovered: 0, total: 0 };
    }
    const type = summary.byType[p.pageType || "other"];
    type.total++;
    if (p.status === "indexed") type.indexed++;
    else if (p.status === "discovered") type.discovered++;
  }

  return summary;
}
