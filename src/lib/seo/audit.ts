// Page SEO Auditor — scans all pages and populates PageSeoMeta table.
// Run periodically (weekly) to keep SEO metadata fresh.
import { prisma } from "@/lib/db";
import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta, getDocFrontmatter } from "@/lib/mdx";
import { getClusterForPage } from "@/lib/seo/taxonomy";
import fs from "fs";
import path from "path";

export interface AuditResult {
  total: number;
  updated: number;
  clusters: Record<string, number>;
  lowWordCount: { url: string; wordCount: number; type: string }[];
  missingFaq: { url: string; type: string }[];
  missingSchema: { url: string; type: string }[];
}

export async function auditAllPages(): Promise<AuditResult> {
  const result: AuditResult = {
    total: 0, updated: 0, clusters: {},
    lowWordCount: [], missingFaq: [], missingSchema: [],
  };

  // 1. Audit calculator pages
  const calculators = getAllCalculators();
  for (const calc of calculators) {
    const url = "/tools/" + calc.id;
    const wordCount = (calc.content.introduction || "").split(/\s+/).length +
      (calc.content.faq || []).reduce((s, f) => s + f.a.split(/\s+/).length, 0);
    const hasFaq = !!calc.content.faq && calc.content.faq.length > 0;
    const hasSchema = true;
    const internalLinks = (calc.content.related || []).length;
    const cluster = getClusterForPage(url);

    await prisma.pageSeoMeta.upsert({
      where: { url },
      create: {
        url, title: calc.seo.title, h1: calc.name,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
      update: {
        title: calc.seo.title, h1: calc.name,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
    });

    result.total++;
    result.updated++;
    if (cluster) result.clusters[cluster.id] = (result.clusters[cluster.id] || 0) + 1;
    if (wordCount < 500) result.lowWordCount.push({ url, wordCount, type: "calculator" });
    if (!hasFaq) result.missingFaq.push({ url, type: "calculator" });
  }

  // 2. Audit guide pages
  const guideSlugs = getAllDocMeta("guides", "/guides");
  for (const g of guideSlugs) {
    const url = "/guides/" + g.slug;
    const fm = g.frontmatter;
    const wordCount = (fm.description || "").split(/\s+/).length + 200;
    const hasFaq = false;
    const hasSchema = false;
    const internalLinks = (fm.related || []).length;
    const cluster = getClusterForPage(url);

    await prisma.pageSeoMeta.upsert({
      where: { url },
      create: {
        url, title: fm.title, h1: fm.title,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
      update: {
        title: fm.title, h1: fm.title,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
    });

    result.total++;
    result.updated++;
    if (cluster) result.clusters[cluster.id] = (result.clusters[cluster.id] || 0) + 1;
    if (wordCount < 500) result.lowWordCount.push({ url, wordCount, type: "guide" });
    if (!hasFaq) result.missingFaq.push({ url, type: "guide" });
    if (!hasSchema) result.missingSchema.push({ url, type: "guide" });
  }

  // 3. Audit material pages
  const materialSlugs = getAllDocMeta("materials", "/materials");
  for (const m of materialSlugs) {
    const url = "/materials/" + m.slug;
    const fm = m.frontmatter;
    const wordCount = (fm.description || "").split(/\s+/).length + 300;
    const hasFaq = false;
    const hasSchema = false;
    const internalLinks = (fm.related || []).length;
    const cluster = getClusterForPage(url);

    await prisma.pageSeoMeta.upsert({
      where: { url },
      create: {
        url, title: fm.title, h1: fm.title,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
      update: {
        title: fm.title, h1: fm.title,
        wordCount, hasFaq, hasSchema, internalLinks,
        cluster: cluster?.id || null, lastAudited: new Date(),
      },
    });

    result.total++;
    result.updated++;
    if (cluster) result.clusters[cluster.id] = (result.clusters[cluster.id] || 0) + 1;
    if (wordCount < 500) result.lowWordCount.push({ url, wordCount, type: "material" });
    if (!hasFaq) result.missingFaq.push({ url, type: "material" });
    if (!hasSchema) result.missingSchema.push({ url, type: "material" });
  }

  return result;
}
