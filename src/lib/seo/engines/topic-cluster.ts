// Module 3: Topic Cluster Engine
// Builds engineering knowledge graph and assigns pages to topic clusters.

import { prisma } from "@/lib/db";

export interface ClusterInfo {
  name: string;
  parentTopic?: string;
  pillarPage?: string;
  authorityScore: number;
  pageCount: number;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  pages: { url: string; role: string; impressions: number; position: number }[];
}

// Predefined cluster taxonomy for industrial engineering
export const CLUSTER_TAXONOMY: { name: string; parent: string; keywords: string[]; pillar: string | null }[] = [
  {
    name: "metal-weight",
    parent: "material-engineering",
    keywords: ["steel weight", "aluminum weight", "copper weight", "metal weight", "steel density", "aluminum density"],
    pillar: "/tools/metal-weight-cluster",
  },
  {
    name: "pipe-flow",
    parent: "mechanical-engineering",
    keywords: ["pipe flow", "flow rate", "pressure drop", "reynolds number", "friction loss", "pipe velocity", "pipe diameter"],
    pillar: "/tools/pipe-flow-cluster",
  },
  {
    name: "pump-engineering",
    parent: "mechanical-engineering",
    keywords: ["pump efficiency", "pump power", "pump head", "pump flow", "pump sizing", "npsh", "affinity law"],
    pillar: null,
  },
  {
    name: "heat-transfer",
    parent: "thermal-engineering",
    keywords: ["heat transfer", "heat exchanger", "lmtd", "heat loss", "thermal resistance", "heat transfer coefficient"],
    pillar: null,
  },
  {
    name: "tank-vessel",
    parent: "mechanical-engineering",
    keywords: ["tank volume", "tank capacity", "cylinder volume", "sphere volume", "cone volume", "pressure vessel"],
    pillar: null,
  },
  {
    name: "material-engineering",
    parent: "root",
    keywords: ["density", "material properties", "steel properties", "aluminum properties", "concrete"],
    pillar: null,
  },
  {
    name: "mechanical-engineering",
    parent: "root",
    keywords: ["mechanical engineering", "fluid mechanics", "hydraulics"],
    pillar: null,
  },
  {
    name: "thermal-engineering",
    parent: "root",
    keywords: ["thermal engineering", "heat transfer", "hvac"],
    pillar: null,
  },
];

/**
 * Classify a page URL into a topic cluster based on its content keywords.
 */
export function classifyCluster(pageUrl: string, queryKeywords: string[]): string | null {
  for (const cluster of CLUSTER_TAXONOMY) {
    const matches = cluster.keywords.some((kw) =>
      queryKeywords.some((qk) => qk.toLowerCase().includes(kw) || kw.includes(qk.toLowerCase()))
    );
    if (matches) {
      // Also check URL match
      if (pageUrl.includes(cluster.name.replace("-", "/")) || pageUrl.includes(cluster.name)) {
        return cluster.name;
      }
    }
  }

  // URL-based fallback
  if (pageUrl.includes("weight")) return "metal-weight";
  if (pageUrl.includes("flow") || pageUrl.includes("pipe") || pageUrl.includes("velocity")) return "pipe-flow";
  if (pageUrl.includes("pump")) return "pump-engineering";
  if (pageUrl.includes("heat") || pageUrl.includes("thermal") || pageUrl.includes("lmtd")) return "heat-transfer";
  if (pageUrl.includes("tank") || pageUrl.includes("vessel") || pageUrl.includes("volume")) return "tank-vessel";
  if (pageUrl.includes("material") || pageUrl.includes("density")) return "material-engineering";

  return null;
}

/**
 * Build/update all topic clusters from GSC data.
 */
export async function buildClusters(): Promise<ClusterInfo[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Get all page+query data
  const pageData = await prisma.seoMetric.groupBy({
    by: ["page"],
    where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { position: true },
  });

  // Get queries per page
  const queryData = await prisma.seoMetric.groupBy({
    by: ["page", "query"],
    where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true },
  });

  const clusters: Map<string, ClusterInfo> = new Map();

  for (const cluster of CLUSTER_TAXONOMY) {
    clusters.set(cluster.name, {
      name: cluster.name,
      parentTopic: cluster.parent,
      pillarPage: cluster.pillar || undefined,
      authorityScore: 0,
      pageCount: 0,
      totalImpressions: 0,
      totalClicks: 0,
      avgPosition: 0,
      pages: [],
    });
  }

  // Assign pages to clusters
  for (const p of pageData) {
    const pageQueries = queryData
      .filter((q) => q.page === p.page)
      .map((q) => q.query);
    const clusterName = classifyCluster(p.page, pageQueries);
    if (clusterName && clusters.has(clusterName)) {
      const cluster = clusters.get(clusterName)!;
      cluster.pages.push({
        url: p.page,
        role: p.page === cluster.pillarPage ? "pillar" : "support",
        impressions: p._sum.impressions || 0,
        position: p._avg.position || 0,
      });
      cluster.totalImpressions += p._sum.impressions || 0;
      cluster.totalClicks += p._sum.clicks || 0;
      cluster.pageCount++;
    }
  }

  // Calculate authority scores and avg positions
  const results: ClusterInfo[] = [];
  for (const [name, cluster] of clusters) {
    if (cluster.pageCount === 0) continue;
    cluster.avgPosition = cluster.pages.reduce((sum, p) => sum + p.position, 0) / cluster.pageCount;

    // Authority score: weighted by impressions, page count, and avg position
    const impressionScore = Math.min(40, cluster.totalImpressions / 2);
    const pageCountScore = Math.min(30, cluster.pageCount * 5);
    const positionScore = Math.max(0, 30 - cluster.avgPosition * 0.5);
    cluster.authorityScore = Math.round(impressionScore + pageCountScore + positionScore);

    results.push(cluster);

    // Upsert to database
    await prisma.topicCluster.upsert({
      where: { name },
      create: {
        name,
        parentTopic: cluster.parentTopic,
        pillarPage: cluster.pillarPage,
        authorityScore: cluster.authorityScore,
        pageCount: cluster.pageCount,
        totalImpressions: cluster.totalImpressions,
        totalClicks: cluster.totalClicks,
        avgPosition: cluster.avgPosition,
      },
      update: {
        parentTopic: cluster.parentTopic,
        pillarPage: cluster.pillarPage,
        authorityScore: cluster.authorityScore,
        pageCount: cluster.pageCount,
        totalImpressions: cluster.totalImpressions,
        totalClicks: cluster.totalClicks,
        avgPosition: cluster.avgPosition,
      },
    });

    // Update PageSeoMeta cluster assignment
    for (const page of cluster.pages) {
      await prisma.pageSeoMeta.updateMany({
        where: { url: page.url },
        data: { cluster: name },
      });
    }
  }

  return results.sort((a, b) => b.authorityScore - a.authorityScore);
}

