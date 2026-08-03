// Content Optimizer — analyzes a page and suggests SEO improvements
// based on content quality + GSC performance data.
import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/ai/deepseek-client";

import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { getDocFrontmatter } from "@/lib/mdx";

export interface OptimizationSuggestion {
  area: string;
  current: string;
  suggestion: string;
  priority: number;
}

export interface ContentAnalysis {
  url: string;
  title: string;
  h1: string;
  wordCount: number;
  hasFaq: boolean;
  hasSchema: boolean;
  internalLinks: number;
  suggestions: OptimizationSuggestion[];
}

const SYSTEM_PROMPT = [
  "You are a content SEO optimizer for an industrial engineering website.",
  "Analyze the given page content and GSC performance data.",
  "Suggest specific improvements for better ranking.",
  "",
  "Output MUST be valid JSON:",
  '{ "suggestions": [{ "area": "title|h1|intro|faq|content|internal_links|meta_desc",',
  '  "current": "what exists now",',
  '  "suggestion": "specific improvement",',
  '  "priority": 1-100 }] }',
  "",
  "Rules:",
  "- Title < 60 chars, meta_desc 150-320 chars",
  "- H1 should match search intent",
  "- FAQ should answer common questions (aim for 3-5)",
  "- Content should be 1500-2500 words for calculator pages",
  "- Internal links to related calculators and guides",
  "- Max 10 suggestions, be specific and actionable",
].join("\n");

export async function optimizeContent(
  pageUrl: string,
  pageType: "calculator" | "guide" | "material" | "service"
): Promise<ContentAnalysis> {
  let title = "";
  let h1 = "";
  let wordCount = 0;
  let hasFaq = false;
  let hasSchema = false;
  let internalLinks = 0;
  let bodyText = "";

  if (pageType === "calculator") {
    const slug = pageUrl.replace("/tools/", "");
    const calc = getCalculatorBySlug(slug);
    if (!calc) throw new Error("Calculator not found: " + slug);
    title = calc.seo.title;
    h1 = calc.name;
    bodyText = calc.content.introduction || "";
    wordCount = bodyText.split(/\s+/).length;
    hasFaq = !!calc.content.faq && calc.content.faq.length > 0;
    hasSchema = true;
    internalLinks = (calc.content.related || []).length;
  } else {
    const slug = pageUrl.replace(/^\//, "").split("/").pop() || "";
    const subdir = pageType === "guide" ? "guides" : pageType === "material" ? "materials" : "services";
    const fm = getDocFrontmatter(slug, subdir);
    if (!fm) throw new Error("Document not found: " + slug);
    title = fm.title;
    h1 = fm.title;
    bodyText = (fm.description || "") + " " + (fm.title || "");
    wordCount = bodyText.split(/\s+/).length;
    hasFaq = bodyText.toLowerCase().includes("faq") || bodyText.includes("## FAQ");
    hasSchema = false;
    internalLinks = (bodyText.match(/\]\(\/[a-z]/g) || []).length;
  }

  // Get GSC data for this page (last 30 days)
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const gscData = await prisma.seoMetric.aggregate({
    where: { page: pageUrl, date: { gte: since } },
    _sum: { impressions: true, clicks: true },
    _avg: { ctr: true, position: true },
  });

  const gscInfo = "GSC (30d): impressions=" + (gscData._sum.impressions || 0) +
    ", clicks=" + (gscData._sum.clicks || 0) +
    ", avgCtr=" + ((gscData._avg.ctr || 0)).toFixed(1) + "%" +
    ", avgPosition=" + ((gscData._avg.position || 0)).toFixed(1);

  const userPrompt = [
    "Page URL: " + pageUrl,
    "Type: " + pageType,
    "Title: " + title,
    "H1: " + h1,
    "Word count: " + wordCount,
    "Has FAQ: " + hasFaq,
    "Has Schema: " + hasSchema,
    "Internal links: " + internalLinks,
    "Body text (first 500 words): " + bodyText.substring(0, 2000),
    "GSC Performance: " + gscInfo,
    "",
    "Analyze and suggest optimizations. Return JSON.",
  ].join("\n");

  const result = await callLLM({ system: SYSTEM_PROMPT, user: userPrompt, maxTokens: 4096, temperature: 0.3 });

  let suggestions: OptimizationSuggestion[];
  try {
    const m = result.content.match(/\{[\s\S]*\}/);
    const parsed = m ? JSON.parse(m[0]) : { suggestions: [] };
    suggestions = (parsed.suggestions || []).map((s: any) => ({
      area: s.area || "content",
      current: s.current || "",
      suggestion: s.suggestion || "",
      priority: s.priority || 50,
    }));
  } catch { suggestions = []; }

  // Save decision
  await prisma.seoAiDecision.create({
    data: {
      type: "optimization",
      inputData: { url: pageUrl, type: pageType, wordCount, hasFaq, hasSchema, internalLinks, gsc: gscInfo } as any,
      analysis: { suggestions } as any,
      recommendation: "Optimize " + pageUrl,
      actions: suggestions as any,
      confidence: 0.8,
      model: result.model,
      status: "pending",
    } as any,
  });

  // Update PageSeoMeta
  await prisma.pageSeoMeta.upsert({
    where: { url: pageUrl },
    create: { url: pageUrl, title, h1, wordCount, hasFaq, hasSchema, internalLinks, lastAudited: new Date() },
    update: { title, h1, wordCount, hasFaq, hasSchema, internalLinks, lastAudited: new Date() },
  });

  return {
    url: pageUrl,
    title, h1, wordCount, hasFaq, hasSchema, internalLinks,
    suggestions,
  };
}
