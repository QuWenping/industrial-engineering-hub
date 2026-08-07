// SEO Action Plan Generator
// Converts GSC analysis into a structured Sprint Backlog with executable tasks.
// Output format: Task → URL → Reason → Actions → Expected → Priority → Effort

import { prisma } from "@/lib/db";
import { classifyStage } from "./ranking-stage";
import { classifyIntent, type KeywordIntentType } from "./keyword-intent";

export interface ActionTask {
  id: string;
  priority: number;      // 1-5 stars
  taskType: string;      // EXISTING_PAGE_OPTIMIZATION | NEW_CONTENT | CLUSTER_BUILDING | INTERNAL_LINKS
  title: string;         // short title
  url: string;           // target URL
  reason: string;         // why this task
  actions: string[];     // specific actions
  expectedGain: string;   // position → target
  effort: string;        // estimated effort
  sprint: number;        // which sprint (1, 2, or 3)
}

export interface SprintBacklog {
  sprints: {
    name: string;
    days: string;
    goal: string;
    tasks: ActionTask[];
  }[];
  totalTasks: number;
  generatedAt: string;
}

export async function generateActionPlan(): Promise<SprintBacklog> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Get all query+page data
  const data = await prisma.seoMetric.groupBy({
    by: ["query", "page"],
    where: { date: { gte: since }, query: { not: "(not set)" }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true },
    _avg: { position: true },
    orderBy: { _sum: { impressions: "desc" } },
    take: 100,
  });

  // Get page scores for content maturity
  const pageScores = await prisma.pageScore.findMany();
  const scoreMap = new Map(pageScores.map(p => [p.pageUrl, p]));

  const tasks: ActionTask[] = [];
  let taskId = 1;

  for (const d of data) {
    const position = d._avg.position || 99;
    const impressions = d._sum.impressions || 0;
    const intent = classifyIntent(d.query);
    const stage = classifyStage(position);
    const pageScore = scoreMap.get(d.page);

    // Skip if no impressions
    if (impressions === 0) continue;

    // Determine task type and actions based on stage and intent
    let taskType: string;
    let actions: string[];
    let priority: number;
    let effort: string;
    let sprint: number;

    if (stage === "striking_distance" && position <= 20) {
      taskType = "EXISTING_PAGE_OPTIMIZATION";
      priority = 5;
      sprint = 1;
      effort = "2-4 hours";
      actions = [
        "Update page title for better CTR and keyword match",
        "Expand content depth — add FAQ entries and engineering examples",
        "Add internal links to related calculators and material pages",
      ];
    } else if (stage === "growth" && position <= 50) {
      taskType = "EXISTING_PAGE_OPTIMIZATION";
      priority = 4;
      sprint = 2;
      effort = "4-8 hours";
      actions = [
        "Major content expansion — add data tables and engineering explanation",
        "Add How It Works section with step-by-step formula",
        "Add 3-5 FAQ entries targeting related long-tail queries",
        "Connect to topic cluster hub page",
      ];
    } else if (stage === "discovery" && impressions >= 3) {
      taskType = "CONTENT_UPGRADE";
      priority = 3;
      sprint = 3;
      effort = "4-8 hours";
      actions = [
        "Upgrade from database page to engineering reference page",
        "Add density/properties tables and comparison data",
        "Add calculation examples and engineering applications",
        "Add internal links to calculators and hub pages",
      ];
    } else {
      continue; // Skip very low-priority items
    }

    // Generate reason
    const reason = `Position ${position.toFixed(1)}, ${impressions} impressions, ${intent} intent, ${stage} stage` +
      (pageScore ? `, Page Score ${pageScore.totalScore}/100, Content ${pageScore.contentScore}` : "");

    // Generate expected gain
    let expectedGain: string;
    if (stage === "striking_distance") expectedGain = `Position ${position.toFixed(1)} → Top 10`;
    else if (stage === "growth") expectedGain = `Position ${position.toFixed(1)} → Top 30`;
    else expectedGain = `Position ${position.toFixed(1)} → Top 50`;

    tasks.push({
      id: `T${String(taskId).padStart(3, "0")}`,
      priority,
      taskType,
      title: `${taskType.replace(/_/g, " ")}: ${d.query}`,
      url: d.page,
      reason,
      actions,
      expectedGain,
      effort,
      sprint,
    });
    taskId++;
  }

  // Sort by priority (descending) then by impressions (descending)
  tasks.sort((a, b) => b.priority - a.priority);

  // Group into sprints
  const sprint1 = tasks.filter(t => t.sprint === 1).slice(0, 5);
  const sprint2 = tasks.filter(t => t.sprint === 2).slice(0, 8);
  const sprint3 = tasks.filter(t => t.sprint === 3).slice(0, 10);

  return {
    sprints: [
      {
        name: "Sprint 1 — Quick Wins (Day 1-7)",
        days: "Day 1-7",
        goal: "Push striking-distance pages to Page 1. Focus on title optimization, FAQ expansion, and internal links.",
        tasks: sprint1,
      },
      {
        name: "Sprint 2 — Topic Authority (Day 7-20)",
        days: "Day 7-20",
        goal: "Build cluster authority. Expand content depth, add data tables, connect to hub pages.",
        tasks: sprint2,
      },
      {
        name: "Sprint 3 — Content Upgrade (Day 20-30)",
        days: "Day 20-30",
        goal: "Upgrade thin pages to engineering reference quality. Add calculation examples and comparisons.",
        tasks: sprint3,
      },
    ],
    totalTasks: sprint1.length + sprint2.length + sprint3.length,
    generatedAt: new Date().toISOString(),
  };
}
