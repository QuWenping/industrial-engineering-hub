// Internal Link Graph — builds page relationship graph from taxonomy.
// Used by Internal Link Agent for recommendations + SEO Brain for cluster analysis.
import { TAXONOMY, getClusterForPage, getClusterPages, type TopicCluster } from "@/lib/seo/taxonomy";

export interface LinkEdge {
  from: string;
  to: string;
  weight: number; // 1-10, higher = stronger relationship
  reason: string;
}

// Build the link graph from taxonomy clusters
export function buildLinkGraph(): LinkEdge[] {
  const edges: LinkEdge[] = [];

  for (const cluster of TAXONOMY) {
    const pages = getClusterPages(cluster);

    // Pillar page links to all supporting pages (weight 10)
    for (const p of pages) {
      if (p.url === cluster.pillarPage) continue;
      edges.push({
        from: cluster.pillarPage,
        to: p.url,
        weight: 10,
        reason: "Pillar page links to " + p.type + " in " + cluster.name + " cluster",
      });
      // Supporting pages link back to pillar (weight 8)
      edges.push({
        from: p.url,
        to: cluster.pillarPage,
        weight: 8,
        reason: "Supporting page links back to pillar (" + cluster.name + ")",
      });
    }

    // Cross-link supporting pages within cluster (weight 5)
    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        if (pages[i].url === cluster.pillarPage || pages[j].url === cluster.pillarPage) continue;
        edges.push({
          from: pages[i].url,
          to: pages[j].url,
          weight: 5,
          reason: "Related " + pages[i].type + " and " + pages[j].type + " in " + cluster.name,
        });
        edges.push({
          from: pages[j].url,
          to: pages[i].url,
          weight: 5,
          reason: "Related " + pages[j].type + " and " + pages[i].type + " in " + cluster.name,
        });
      }
    }
  }

  // Cross-cluster links for overlapping topics (weight 3)
  const overlaps: [string, string][] = [
    ["steel-engineering", "structural"],
    ["steel-engineering", "mechanical"],
    ["pump-engineering", "pipe-flow"],
    ["pump-engineering", "mechanical"],
    ["pipe-flow", "chemical-process"],
    ["pipe-flow", "thermal-energy"],
    ["hvac", "thermal-energy"],
    ["chemical-process", "thermal-energy"],
  ];

  for (const [a, b] of overlaps) {
    const ca = TAXONOMY.find((c) => c.id === a);
    const cb = TAXONOMY.find((c) => c.id === b);
    if (!ca || !cb) continue;
    edges.push({
      from: ca.pillarPage,
      to: cb.pillarPage,
      weight: 3,
      reason: "Cross-cluster: " + ca.name + " <-> " + cb.name,
    });
    edges.push({
      from: cb.pillarPage,
      to: ca.pillarPage,
      weight: 3,
      reason: "Cross-cluster: " + cb.name + " <-> " + ca.name,
    });
  }

  return edges;
}

// Get recommended links for a specific page (top N by weight)
export function getRecommendedLinks(pageUrl: string, limit: number = 5): LinkEdge[] {
  const edges = buildLinkGraph();
  return edges
    .filter((e) => e.from === pageUrl)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

// Get link graph statistics
export function getLinkGraphStats() {
  const edges = buildLinkGraph();
  const pages = new Set<string>();
  for (const e of edges) {
    pages.add(e.from);
    pages.add(e.to);
  }
  return {
    totalEdges: edges.length,
    totalPages: pages.size,
    clusters: TAXONOMY.length,
    avgLinksPerPage: pages.size > 0 ? (edges.length / pages.size).toFixed(1) : "0",
  };
}
