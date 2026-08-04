// Module 4: Keyword Intent Classifier
// Classifies search queries by intent to determine the right optimization action.

import { prisma } from "@/lib/db";

export type KeywordIntentType = "informational" | "calculator" | "commercial" | "reference" | "comparison";

export interface ClassifiedKeyword {
  query: string;
  intent: KeywordIntentType;
  impressions: number;
  clicks: number;
  currentPosition: number;
  targetPage?: string;
  priority: number;
}

export const INTENT_LABELS: Record<KeywordIntentType, string> = {
  informational: "Informational (Guides, Articles)",
  calculator: "Calculator (Tools, Interactive)",
  commercial: "Commercial (Services, Pricing)",
  reference: "Reference (Data, Properties, Tables)",
  comparison: "Comparison (vs, alternatives)",
};

// Pattern-based intent classification rules
const INTENT_PATTERNS: { intent: KeywordIntentType; patterns: RegExp[] }[] = [
  {
    intent: "calculator",
    patterns: [/calculator/i, /calculate/i, /compute/i, /estimate/i, /converter/i, /conversion/i],
  },
  {
    intent: "comparison",
    patterns: [/vs\b/i, /versus/i, /compare/i, /alternative/i, /difference between/i, /or\b/i],
  },
  {
    intent: "commercial",
    patterns: [/cost/i, /price/i, /hire/i, /service/i, /company/i, /consult/i, /quote/i, /estimate.*cost/i],
  },
  {
    intent: "reference",
    patterns: [/density/i, /properties/i, /table/i, /chart/i, /data/i, /specification/i, /standard/i, /value/i, /coefficient/i],
  },
  {
    intent: "informational",
    patterns: [/what is/i, /how to/i, /why/i, /guide/i, /tutorial/i, /explain/i, /definition/i, /meaning/i, /types of/i],
  },
];

export function classifyIntent(query: string): KeywordIntentType {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(query))) return intent;
  }
  // Default: reference for engineering queries
  return "reference";
}

/**
 * Get the recommended action for a keyword based on its intent.
 */
export function getIntentAction(intent: KeywordIntentType): string {
  switch (intent) {
    case "calculator":
      return "Optimize calculator page — improve UX, add visualization, ensure formula is clear";
    case "informational":
      return "Create or expand guide content — add depth, examples, and FAQ";
    case "reference":
      return "Expand material/reference page — add data tables, properties, and specifications";
    case "commercial":
      return "Strengthen service/CTA page — add case studies, pricing context, and trust signals";
    case "comparison":
      return "Create comparison content — comparison tables, pros/cons, and decision guides";
  }
}

/**
 * Classify all keywords from GSC data and upsert to database.
 */
export async function classifyAllKeywords(): Promise<ClassifiedKeyword[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const queryData = await prisma.seoMetric.groupBy({
    by: ["query"],
    where: { date: { gte: since }, query: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { ctr: true, position: true },
    orderBy: { _sum: { impressions: "desc" } },
    take: 200,
  });

  // Get top page for each query
  const pageForQuery = await prisma.seoMetric.groupBy({
    by: ["query", "page"],
    where: { date: { gte: since }, query: { not: "(not set)" } },
    _sum: { impressions: true },
    orderBy: { _sum: { impressions: "desc" } },
  });

  const topPageMap = new Map<string, string>();
  for (const q of pageForQuery) {
    if (!topPageMap.has(q.query)) {
      topPageMap.set(q.query, q.page);
    }
  }

  const results: ClassifiedKeyword[] = [];

  for (const q of queryData) {
    const intent = classifyIntent(q.query);
    const impressions = q._sum.impressions || 0;
    const clicks = q._sum.clicks || 0;
    const position = q._avg.position || 0;
    const targetPage = topPageMap.get(q.query);

    // Priority: based on impressions, position, and intent match
    let priority = 50;
    if (position <= 20) priority += 25; // striking distance
    else if (position <= 50) priority += 15;
    if (impressions > 10) priority += 15;
    if (impressions > 30) priority += 10;
    if (intent === "calculator" || intent === "reference") priority += 5; // high-value intents

    priority = Math.min(100, priority);

    results.push({
      query: q.query,
      intent,
      impressions,
      clicks,
      currentPosition: position,
      targetPage,
      priority,
    });

    // Upsert to database
    await prisma.keywordIntent.upsert({
      where: { query: q.query },
      create: {
        query: q.query,
        intent,
        impressions,
        clicks,
        currentPosition: position,
        targetPage,
        priority,
      },
      update: {
        intent,
        impressions,
        clicks,
        currentPosition: position,
        targetPage,
        priority,
      },
    });
  }

  return results.sort((a, b) => b.priority - a.priority);
}

/**
 * Get intent distribution summary.
 */
export async function getIntentSummary(): Promise<Record<KeywordIntentType, number>> {
  const all = await prisma.keywordIntent.groupBy({
    by: ["intent"],
    _count: { id: true },
  });

  const summary: Record<KeywordIntentType, number> = {
    informational: 0,
    calculator: 0,
    commercial: 0,
    reference: 0,
    comparison: 0,
  };

  for (const item of all) {
    summary[item.intent as KeywordIntentType] = item._count.id;
  }

  return summary;
}
