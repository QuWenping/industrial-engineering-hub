// Internal Link Agent — recommends internal links between related pages.
// Uses Claude to analyze page content and suggest 3-5 relevant links.
import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/ai/deepseek-client";

import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";

export interface LinkRecommendation {
  fromPage: string;
  toPage: string;
  toTitle: string;
  anchorText: string;
  reason: string;
}

const SYSTEM_PROMPT = [
  "You are an internal link strategist for an industrial engineering website.",
  "You analyze page content and recommend 3-5 internal links to related pages.",
  "Links should connect topically related calculators, guides, and materials.",
  "Output MUST be valid JSON: { recommendations: [{ toPage, toTitle, anchorText, reason }] }",
  "Rules: max 5 links, anchor text should be natural (not keyword-stuffed),",
  "links should add value for the reader, not just for SEO.",
].join("\n");

export async function recommendInternalLinks(pageSlug: string, pageType: string): Promise<{ recommendations: LinkRecommendation[] }> {
  const calculators = getAllCalculators().map((c) => ({ slug: c.id, name: c.name, category: c.category }));
  const guides = getAllDocMeta("guides", "/guides").map((g) => ({ slug: g.slug, title: g.frontmatter.title }));
  const materials = getAllDocMeta("materials", "/materials").map((m) => ({ slug: m.slug, title: m.frontmatter.title }));

  const pageList = [
    ...calculators.map((c) => "/tools/" + c.slug + " | " + c.name + " | " + c.category),
    ...guides.map((g) => "/guides/" + g.slug + " | " + g.title),
    ...materials.map((m) => "/materials/" + m.slug + " | " + m.title),
  ].join("\n");

  const userPrompt = "Current page: " + pageSlug + " (type: " + pageType + ")\n\nAvailable pages to link to:\n" + pageList + "\n\nRecommend 3-5 internal links. Return JSON.";

  const result = await callLLM({ system: SYSTEM_PROMPT, user: userPrompt, maxTokens: 2048, temperature: 0.2 });

  let recs: LinkRecommendation[];
  try {
    const m = result.content.match(/\{[\s\S]*\}/);
    const parsed = m ? JSON.parse(m[0]) : { recommendations: [] };
    recs = (parsed.recommendations || []).map((r: any) => ({
      fromPage: pageSlug, toPage: r.toPage || "", toTitle: r.toTitle || "",
      anchorText: r.anchorText || "", reason: r.reason || "",
    }));
  } catch { recs = []; }

  await prisma.seoAiDecision.create({
    data: {
      type: "internal_links",
      inputData: { pageSlug, pageType } as any,
      analysis: { recommendations: recs } as any,
      recommendation: "Internal links for " + pageSlug,
      actions: recs as any,
      confidence: 0.7,
      model: result.model,
      status: "pending",
    } as any,
  });

  return { recommendations: recs };
}
