import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2 } from "lucide-react";
import { getAllDocMeta } from "@/lib/mdx";
import { constructMetadata, BASE_URL } from "@/components/seo/SEO";
import Script from "next/script";

export const metadata: Metadata = constructMetadata({
  title: "Industries We Serve",
  description:
    "Engineering for battery manufacturing, chemical plants, energy facilities, smart factories and industrial buildings — multi-discipline design for global industrial projects.",
  path: "/industries",
  keywords: [
    "battery factory design",
    "chemical plant engineering",
    "energy facility design",
    "smart factory engineering",
    "industrial engineering",
  ],
});

export default function IndustriesPage() {
  const industries = getAllDocMeta("industries", "/industries");

  // Breadcrumb list schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Industries — Industrial Engineering Studio",
    url: `${BASE_URL}/industries`,
    hasPart: industries.map((i) => ({
      "@type": "WebPage",
      name: i.frontmatter.title,
      url: `${BASE_URL}${i.urlPath}`,
    })),
  };

  return (
    <div className="bg-light-bg min-h-screen">
      <Script
        id="schema-industries"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20">
            <Building2 className="h-3 w-3 mr-1" /> Industries
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">
            Industries We Engineer For
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Multi-discipline engineering for battery, chemical, energy, manufacturing and
            infrastructure projects — delivered with digital-first delivery methods.
          </p>
        </div>
      </section>

      {/* Industries grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {industries.map((ind) => {
            const fm = ind.frontmatter as any;
            return (
              <Link key={ind.slug} href={ind.urlPath}>
                <Card className="h-full card-hover border-slate-200 hover:border-engineering-blue/40 transition-all">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{fm.icon || "🏭"}</span>
                      <h3 className="text-xl font-semibold text-navy">{fm.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {fm.tagline || fm.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-engineering-blue font-medium">
                      Explore solutions <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Working in one of these industries?</h2>
          <p className="text-slate-300 mb-6">
            We engage on projects from concept through commissioning. Tell us about your scope.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy hover:bg-slate-100 transition-colors"
          >
            Discuss your project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
