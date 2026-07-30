import type { MetadataRoute } from "next";
import { getAllCalculatorSlugs } from "@/lib/calculator/loader";
import { getAllDocSlugs } from "@/lib/mdx";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringhub.com";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/editorial-process",
  "/data-sources",
  "/methodology",
  "/sitemap",
  "/tools",
  "/guides",
  "/reference",
  "/materials",
  "/enterprise",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : route.startsWith("/tools") ? 0.9 : 0.7,
  }));

  // Calculator pages
  const calculatorSlugs = getAllCalculatorSlugs();
  const calculatorUrls = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Guide pages
  const guideSlugs = getAllDocSlugs("guides");
  const guideUrls = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Material pages
  const materialSlugs = getAllDocSlugs("materials");
  const materialUrls = materialSlugs.map((slug) => ({
    url: `${BASE_URL}/materials/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...calculatorUrls, ...guideUrls, ...materialUrls];
}
