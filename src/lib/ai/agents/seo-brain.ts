// SEO Brain Agent
import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/ai/deepseek-client";


interface GscRow { query:string; impressions:number; clicks:number; ctr:number; avgPosition:number; }
interface SeoTask { action:string; target:string; reason:string; priority:number; type:string; }
interface SeoAnalysis { summary:string; opportunities:SeoTask[]; }

const SYSTEM_PROMPT = [
  "You are an SEO strategist for an industrial engineering website.",
  "The site has 54 calculators, 50 guides, 26 materials, and case studies.",
  "Analyze GSC data to identify ranking opportunities.",
  "Output MUST be valid JSON: { summary, opportunities: [{ action, target, reason, priority, type }] }",
  "Rules: HIGH IMPRESSION+LOW CTR=improve title; pos 11-20=content boost; pos 4-10=minor opt; new content for high volume 0-page queries; internal links between related pages; max 15, priority>70=this week",
].join("\n");

export async function runSeoBrain(): Promise<SeoAnalysis> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const queryData = await prisma.seoMetric.groupBy({
    by: ["query"], where: { date: { gte: since }, query: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true }, _avg: { ctr: true, position: true },
    orderBy: { _sum: { impressions: "desc" } }, take: 100,
  });
  const pageData = await prisma.seoMetric.groupBy({
    by: ["page"], where: { date: { gte: since }, page: { not: "(not set)" } },
    _sum: { impressions: true, clicks: true }, _avg: { ctr: true, position: true },
    orderBy: { _sum: { impressions: "desc" } }, take: 50,
  });
  const queries = queryData.map((q) => ({
    query: q.query, impressions: q._sum.impressions||0, clicks: q._sum.clicks||0,
    ctr: q._avg.ctr||0, avgPosition: q._avg.position||0,
  }));
  const pages = pageData.map((p) => ({
    page: p.page, impressions: p._sum.impressions||0, clicks: p._sum.clicks||0,
    ctr: p._avg.ctr||0, avgPosition: p._avg.position||0,
  }));
  if (queries.length === 0) return { summary: "No GSC data. Import CSV first.", opportunities: [] };
  const qLines = queries.map((q) => q.query+" | imp:"+q.impressions+" | clk:"+q.clicks+" | ctr:"+q.ctr.toFixed(1)+"% | pos:"+q.avgPosition.toFixed(1)).join("\n");
  const pLines = pages.map((p) => p.page+" | imp:"+p.impressions+" | pos:"+p.avgPosition.toFixed(1)).join("\n");
  const userPrompt = "Analyze GSC data (30d).\n\n## Queries\n"+qLines+"\n\n## Pages\n"+pLines+"\n\nReturn JSON.";
  const result = await callLLM({ system: SYSTEM_PROMPT, user: userPrompt, maxTokens: 4096, temperature: 0.3 });
  let analysis: SeoAnalysis;
  try {
    const m = result.content.match(/\{[\s\S]*\}/);
    analysis = m ? JSON.parse(m[0]) : { summary: result.content, opportunities: [] };
  } catch { analysis = { summary: "Parse failed", opportunities: [] }; }
  await prisma.seoAiDecision.create({ data: {
    type: "opportunity", inputData: { queries, pages, period: "30d" } as any,
    analysis: analysis as any, recommendation: analysis.summary,
    actions: analysis.opportunities as any, confidence: 0.8,  status: "pending",
  } });
  return analysis;
}
