import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, ArrowRight } from "lucide-react";
import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";

// Force static generation — eliminates TTFB delay
export const dynamic = "force-static";

const SearchableCatalog = nextDynamic(
  () => import("@/components/search/SearchableCatalog").then(m => ({ default: m.SearchableCatalog })),
  {
    loading: () => <StaticToolsGrid />,
    ssr: true,
  }
);

export const metadata: Metadata = constructMetadata({
  title: "Engineering Calculators, Guides & Materials",
  description:
    "Browse 54+ free engineering calculators, 50+ technical guides, and material property references for fluid mechanics, pump sizing, structural design, thermal engineering, and more.",
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

// Static fallback — renders immediately, no JS needed
function StaticToolsGrid() {
  const calculators = getAllCalculators();
  const guides = getAllDocMeta("guides", "/guides");
  const materialsMeta = getAllDocMeta("materials", "/materials");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {calculators.map((c) => (
        <Link key={c.id} href={`/tools/${c.id}`}>
          <Card className="h-full card-hover border-border/60 cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/5 group-hover:bg-engineering-blue/10 transition-colors">
                  <Calculator className="h-4 w-4 text-engineering-blue" />
                </div>
                <div className="flex gap-1.5">
                  {c.visualization?.type?.startsWith("three-") ? (
                    <Badge className="text-xs font-bold bg-engineering-blue text-white">3D</Badge>
                  ) : c.visualization ? (
                    <Badge className="text-xs font-bold bg-ai-glow/20 text-engineering-blue border border-ai-glow/40">2D</Badge>
                  ) : null}
                  <Badge variant="secondary" className="text-xs font-normal capitalize">calculator</Badge>
                  <Badge variant="outline" className="text-xs font-normal">{c.category}</Badge>
                </div>
              </div>
              <h3 className="font-semibold text-navy group-hover:text-engineering-blue transition-colors text-sm leading-snug mb-1">
                {c.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

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
      vizType: c.visualization?.type?.startsWith("three-") ? "3D" : c.visualization ? "2D" : undefined,
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

        <Suspense fallback={<StaticToolsGrid />}>
          <SearchableCatalog items={items} />
        </Suspense>
      </div>
    </div>
  );
}

