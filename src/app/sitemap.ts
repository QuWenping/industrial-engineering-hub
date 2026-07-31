import type { MetadataRoute } from "next";
import { getAllCalculatorSlugs } from "@/lib/calculator/loader";
import { getAllDocSlugs, getAllDocMeta } from "@/lib/mdx";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com";

// Priority map: commercial landing pages highest, calculators next, knowledge lower
function priorityFor(route: string): number {
  if (route === "/") return 1.0;
  if (route === "/services" || route.startsWith("/services/")) return 0.85;
  if (route === "/industries" || route.startsWith("/industries/")) return 0.85;
  if (route === "/projects") return 0.85;
  if (route === "/contact") return 0.8;
  if (route === "/tools") return 0.9;
  if (route.startsWith("/tools/")) return 0.8;
  if (route === "/guides") return 0.75;
  if (route.startsWith("/guides/")) return 0.7;
  if (route === "/materials") return 0.7;
  if (route.startsWith("/materials/")) return 0.65;
  return 0.6;
}

const staticRoutes = [
  "/",
  "/services",
  "/industries",
  "/projects",
  "/tools",
  "/guides",
  "/materials",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/methodology",
  "/data-sources",
  "/editorial-process",
  "/sitemap",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: priorityFor(route),
  }));

  // Service pages (MDX)
  const serviceSlugs = getAllDocSlugs("services");
  const serviceUrls = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Industry pages (MDX)
  const industrySlugs = getAllDocSlugs("industries");
  const industryUrls = industrySlugs.map((slug) => ({
    url: `${BASE_URL}/industries/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Calculator pages
  const calculatorSlugs = getAllCalculatorSlugs();
  const calculatorUrls = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Project case-study pages
  const projectMetas = getAllDocMeta("projects", "/projects").filter((m) => !((m.frontmatter as any).hidden));
  const projectSlugs = projectMetas.map((m) => m.slug);
  const projectUrls = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Guide pages
  const guideSlugs = getAllDocSlugs("guides");
  const guideUrls = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Material pages
  const materialSlugs = getAllDocSlugs("materials");
  const materialUrls = materialSlugs.map((slug) => ({
    url: `${BASE_URL}/materials/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [
    ...staticUrls,
    ...serviceUrls,
    ...industryUrls,
    ...calculatorUrls,
    ...projectUrls,
    ...guideUrls,
    ...materialUrls,
  ];
}
