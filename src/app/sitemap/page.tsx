import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { getAllCalculators } from "@/lib/calculator/loader";
import { getAllDocMeta } from "@/lib/mdx";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = constructMetadata({
  title: "Sitemap",
  description:
    "Complete sitemap of Industrial Engineering Studio: browse all calculators, engineering guides, material references, and informational pages.",
  path: "/sitemap",
});

export default function SitemapPage() {
  const calculators = getAllCalculators().sort((a, b) => a.name.localeCompare(b.name));
  const guides = getAllDocMeta("guides", "/guides").sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title)
  );
  const materials = getAllDocMeta("materials", "/materials").sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title)
  );

  // Group calculators by category
  const calcByCategory = new Map<string, typeof calculators>();
  for (const c of calculators) {
    if (!calcByCategory.has(c.category)) calcByCategory.set(c.category, []);
    calcByCategory.get(c.category)!.push(c);
  }

  const staticPages = [
    { name: "Home", href: "/" },
    { name: "All Calculators & Search", href: "/tools" },
    { name: "Engineering Guides", href: "/guides" },
    { name: "Material Properties Database", href: "/materials" },
    { name: "Reference Data", href: "/reference" },
    { name: "About Us", href: "/about" },
    { name: "Editorial Process", href: "/editorial-process" },
    { name: "Data Sources & References", href: "/data-sources" },
    { name: "Calculation Methodology", href: "/methodology" },
    { name: "Enterprise — AI Knowledge Platform", href: "/enterprise" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Site Navigation</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Sitemap</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All {calculators.length} calculators, {guides.length} guides, {materials.length} material references, and informational pages.
          </p>
        </div>

        {/* Static pages */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">Main Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {staticPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="text-sm text-engineering-blue hover:underline py-1"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Calculators by category */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">
            Engineering Calculators ({calculators.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Array.from(calcByCategory.entries()).map(([category, calcs]) => (
              <div key={category}>
                <h3 className="font-semibold text-navy text-sm mb-2">{category}</h3>
                <ul className="space-y-1">
                  {calcs.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/tools/${c.id}`}
                        className="text-sm text-muted-foreground hover:text-engineering-blue hover:underline"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Guides */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">
            Engineering Guides ({guides.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={g.urlPath}
                className="text-sm text-muted-foreground hover:text-engineering-blue hover:underline py-1 leading-snug"
              >
                {g.frontmatter.title}
              </Link>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">
            Material Properties ({materials.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {materials.map((m) => (
              <Link
                key={m.slug}
                href={m.urlPath}
                className="text-sm text-muted-foreground hover:text-engineering-blue hover:underline py-1"
              >
                {m.frontmatter.title}
              </Link>
            ))}
          </div>
        </section>

        <Card className="border-border/60 bg-engineering-blue/5 mt-8">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            <p>
              XML Sitemap available at{" "}
              <Link href="/sitemap.xml" className="text-engineering-blue font-medium hover:underline">
                /sitemap.xml
              </Link>{" "}
              for search engines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
