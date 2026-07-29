import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { getAllDocMeta } from "@/lib/mdx";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Guides",
  description: "In-depth engineering guides on pump selection, pressure drop calculation, pipe sizing, material properties, and industrial engineering best practices.",
  path: "/guides",
});

export default function GuidesPage() {
  const guides = getAllDocMeta("guides", "/guides").sort((a, b) => {
    const cat = (a.frontmatter.category || "").localeCompare(b.frontmatter.category || "");
    if (cat !== 0) return cat;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });

  // Group by category
  const categories = new Map<string, typeof guides>();
  for (const g of guides) {
    const cat = g.frontmatter.category || "General";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(g);
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Engineering Knowledge Library</Badge>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-engineering-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">Engineering Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            In-depth engineering guides covering fluid mechanics, pump selection, pressure drop,
            pipe sizing, material properties, thermal design, and process engineering fundamentals.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            {guides.length} guides across {categories.size} categories
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {Array.from(categories.entries()).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">
                {category} <span className="text-sm font-normal text-muted-foreground ml-2">({items.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((g) => (
                  <Link key={g.slug} href={g.urlPath}>
                    <Card className="card-hover border-border/60 h-full">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-navy text-sm leading-snug mb-2 hover:text-engineering-blue transition-colors">
                          {g.frontmatter.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                          {g.frontmatter.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {g.frontmatter.updated && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {g.frontmatter.updated}
                            </span>
                          )}
                          <span className="text-engineering-blue flex items-center gap-0.5">
                            Read <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-engineering-blue/5 to-ai-glow/5 border-engineering-blue/20 inline-block max-w-2xl">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-navy mb-2">Need a Calculator?</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Try our free online engineering calculators for quick design calculations.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 bg-engineering-blue hover:bg-engineering-blue/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                Browse All Calculators <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
