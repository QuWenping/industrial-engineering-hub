import type { MetadataRoute } from "next";

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
  "/tools",
  "/guides",
  "/reference",
  "/materials",
  "/enterprise",
];

// TODO: Add calculator/guide/material slugs dynamically when content is available
// import { getAllCalculatorSlugs } from "@/lib/calculator/loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : route.startsWith("/tools") ? 0.9 : 0.7,
  }));

  return [...staticUrls];
}
