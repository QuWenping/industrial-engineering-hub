import type { MetadataRoute } from "next";
import { getAllCalculatorSlugs } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";
import { BASE_URL } from "@/components/seo/SEO";

// BASE_URL is the canonical www origin (see components/seo/SEO.tsx). Do not
// redeclare a second copy here — a bare-domain copy is what made sitemap URLs
// disagree with the canonical/hreflang host.

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

// Resolve a frontmatter `updated` value (YYYY-MM-DD) into a stable Date.
// Returns undefined when the date is missing or malformed, so the entry omits
// <lastmod> entirely instead of advertising the build date. A site-wide
// lastmod equal to the build day carries no signal and Google learns to
// ignore it, so omission is the safer output for undated pages.
function contentLastModified(value?: string): Date | undefined {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

type DocSection = {
  subdir: "services" | "industries" | "projects" | "guides" | "materials";
  urlPrefix: string;
  priority: number;
  changeFrequency: "monthly";
  hideFiltered: boolean;
};

const docSections: DocSection[] = [
  { subdir: "services", urlPrefix: "/services", priority: 0.8, changeFrequency: "monthly", hideFiltered: false },
  { subdir: "industries", urlPrefix: "/industries", priority: 0.8, changeFrequency: "monthly", hideFiltered: false },
  { subdir: "projects", urlPrefix: "/projects", priority: 0.7, changeFrequency: "monthly", hideFiltered: true },
  { subdir: "guides", urlPrefix: "/guides", priority: 0.7, changeFrequency: "monthly", hideFiltered: false },
  { subdir: "materials", urlPrefix: "/materials", priority: 0.65, changeFrequency: "monthly", hideFiltered: false },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes are code, not content: they carry no authoring date, so they
  // ship without lastmod.
  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: priorityFor(route),
  }));

  // MDX-backed pages: lastmod is the real content revision date from
  // frontmatter.updated (same value the page renders as "Updated ...").
  const docUrls = docSections.flatMap((section) =>
    getAllDocMeta(section.subdir, section.urlPrefix)
      .filter((meta) => !section.hideFiltered || !(meta.frontmatter as { hidden?: boolean }).hidden)
      .map((meta) => ({
        url: `${BASE_URL}${meta.urlPath}`,
        lastModified: contentLastModified(meta.frontmatter.updated),
        changeFrequency: section.changeFrequency,
        priority: section.priority,
      }))
  );

  // Calculator pages are generated from code, not MDX, so there is no content
  // revision date to publish — lastmod is intentionally omitted.
  const calculatorSlugs = getAllCalculatorSlugs();
  const calculatorUrls = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...docUrls, ...calculatorUrls];
}
