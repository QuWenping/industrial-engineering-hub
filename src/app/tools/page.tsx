import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";
import { SearchableCatalog } from "@/components/search/SearchableCatalog";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Calculators, Guides & Materials",
  description:
    "Browse 53+ free engineering calculators, 50+ technical guides, and material property references for fluid mechanics, pump sizing, structural design, thermal engineering, and more.",
  path: "/tools",
  keywords: [
    "engineering calculators",
    "pipe flow calculator",
    "pump power calculator",
    "steel weight calculator",
    "pressure drop calculator",
    "heat exchanger calculator",
    "engineering guides",
    "material properties",
  ],
});

export default function ToolsPage() {
  const calculators = getAllCalculators();
  const guides = getAllDocMeta("guides", "/guides");
  const materialsMeta = getAllDocMeta("materials", "/materials");

  const items = [
    ...calculators.map((c) => ({
      title: c.name,
      description: c.description,
      href: `/tools/${c.id}`,
      category: c.category,
      tags: c.seo?.keyword ? [c.seo.keyword] : [],
      type: "calculator" as const,
    })),
    ...guides.map((g) => ({
      title: g.frontmatter.title,
      description: g.frontmatter.description,
      href: g.urlPath,
      category: g.frontmatter.category || "Engineering",
      tags: g.frontmatter.keywords || [],
      type: "guide" as const,
    })),
    ...materialsMeta.map((m) => ({
      title: m.frontmatter.title,
      description: m.frontmatter.description,
      href: m.urlPath,
      category: "Materials",
      tags: m.frontmatter.keywords || [],
      type: "material" as const,
    })),
  ];

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">Engineering Tools & References</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Calculators, Guides & Materials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Search across {calculators.length} calculators, {guides.length} technical guides, and {materialsMeta.length} material references.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading search...</div>}>
          <SearchableCatalog items={items} />
        </Suspense>
      </div>
    </div>
  );
}
