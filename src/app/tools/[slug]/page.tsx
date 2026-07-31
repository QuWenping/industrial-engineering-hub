import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { EngineeringCTA } from "@/components/EngineeringCTA";
import { constructMetadata, schemaBreadcrumb, schemaSoftwareApplication, schemaFAQ } from "@/components/seo/SEO";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/calculator/loader";
import { getMaterialOptions } from "@/lib/calculator/materials";
import { ChevronRight } from "lucide-react";

// Next.js 16: params is a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllCalculatorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return constructMetadata({ title: "Calculator Not Found", description: "The requested calculator could not be found.", path: `/tools/${slug}` });

  return constructMetadata({
    title: calc.seo.title,
    description: calc.seo.description,
    path: `/tools/${slug}`,
    type: "software-application",
    keywords: [calc.seo.keyword, calc.category.toLowerCase(), "engineering calculator"],
  });
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) notFound();

  const materials = getMaterialOptions();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.industrialengineeringstudio.com";
  const pageUrl = `${baseUrl}/tools/${slug}`;

  const jsonLd = [
    schemaSoftwareApplication({
      name: calc.name,
      description: calc.description,
      url: pageUrl,
      category: calc.category,
    }),
    schemaBreadcrumb([
      { name: "Home", url: baseUrl },
      { name: "Tools", url: `${baseUrl}/tools` },
      { name: calc.name, url: pageUrl },
    ]),
    ...(calc.content.faq
      ? [schemaFAQ(calc.content.faq.map((f) => ({ question: f.q, answer: f.a })))]
      : []),
  ];

  return (
    <div className="bg-light-bg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/tools" />}>Tools</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{calc.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{calc.category}</Badge>
            <Badge variant="outline">{calc.priority}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{calc.name}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{calc.description}</p>
        </div>

        {/* Calculator */}
        <CalculatorCard calculator={calc} materials={materials} />

        {/* Content sections */}
        <div className="mt-12 space-y-8">
          {/* Introduction */}
          {calc.content.introduction && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">{calc.content.introduction}</p>
            </section>
          )}

          <Separator />

          {/* Example */}
          {calc.content.example && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Calculation Example</h2>
              <Card className="border-border/60 bg-white">
                <CardContent className="p-6">
                  {calc.content.example.description && (
                    <p className="text-muted-foreground mb-4">{calc.content.example.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Inputs: </span>
                      <code className="font-mono text-navy">
                        {Object.entries(calc.content.example.inputs)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(", ")}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Result: </span>
                      <code className="font-mono text-accent-green font-semibold">
                        {calc.content.example.result} {calc.result.unit}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Applications */}
          {calc.content.applications && calc.content.applications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Engineering Applications</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {calc.content.applications.map((app) => (
                  <li key={app} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-engineering-blue mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {calc.content.faq && calc.content.faq.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {calc.content.faq.map((item, i) => (
                  <Card key={i} className="border-border/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-navy text-base">{item.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {calc.content.related && calc.content.related.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Related Calculators</h2>
              <div className="flex flex-wrap gap-2">
                {calc.content.related.map((rel) => {
                  const relCalc = getCalculatorBySlug(rel);
                  return (
                    <Link key={rel} href={`/tools/${rel}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-engineering-blue/5 hover:text-engineering-blue hover:border-engineering-blue/30 cursor-pointer"
                      >
                        {relCalc?.name || rel}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Engineering Consultation CTA */}
          <EngineeringCTA toolName={calc.name} />

          {/* Disclaimer */}
          <section className="rounded-lg bg-warning/5 border border-warning/20 p-4 text-sm text-muted-foreground">
            <strong className="text-navy">Disclaimer:</strong> Calculations are for reference and
            educational purposes only. Always verify results independently for engineering design.
            See <Link href="/disclaimer" className="text-engineering-blue hover:underline">full disclaimer</Link>.
          </section>
        </div>
      </div>
    </div>
  );
}
