import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { getAllDocSlugs, getDocBySlug } from "@/lib/mdx";
import {
  constructMetadata,
  schemaArticle,
  schemaBreadcrumb,
  schemaEngineeringService,
  BASE_URL,
} from "@/components/seo/SEO";
import { mdxComponents } from "@/components/mdx/MDXComponents";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllDocSlugs("services").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "services", "/services");
  if (!doc) return constructMetadata({ title: "Service Not Found", description: "", path: `/services/${slug}` });

  return constructMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/services/${slug}`,
    type: "article",
    keywords: [doc.frontmatter.title, "industrial engineering", "engineering services"],
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "services", "/services");
  if (!doc) notFound();

  const { frontmatter, content } = doc;
  const fm = frontmatter as any;
  const pageUrl = `${BASE_URL}/services/${slug}`;

  const jsonLd = [
    schemaArticle({
      title: fm.title,
      description: fm.description,
      url: pageUrl,
    }),
    schemaEngineeringService({
      name: fm.title,
      description: fm.description,
      url: pageUrl,
      serviceType: fm.capabilities,
    }),
    schemaBreadcrumb([
      { name: "Home", url: BASE_URL },
      { name: "Services", url: `${BASE_URL}/services` },
      { name: fm.title, url: pageUrl },
    ]),
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
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/services" />}>Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{fm.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{fm.icon || "⚙️"}</span>
            <Badge variant="secondary">Engineering Service</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{fm.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{fm.description}</p>
        </header>

        {/* Capabilities quick-list */}
        {fm.capabilities && fm.capabilities.length > 0 && (
          <Card className="mb-8 border-slate-200 bg-white">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-navy mb-3">Core Capabilities</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {fm.capabilities.map((c: string) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-engineering-blue" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Separator className="mb-8" />

        {/* MDX body */}
        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
          {content}
        </article>

        <Separator className="my-10" />

        {/* Related industries */}
        {fm.relatedIndustries && fm.relatedIndustries.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-navy mb-3">Related Industries</h2>
            <div className="flex flex-wrap gap-2">
              {fm.relatedIndustries.map((rel: string) => (
                <Link key={rel} href={`/industries/${rel}`}>
                  <Badge variant="outline" className="hover:bg-engineering-blue/5 hover:text-engineering-blue hover:border-engineering-blue/30 cursor-pointer text-sm">
                    {rel.replace(/-/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related tools */}
        {fm.relatedTools && fm.relatedTools.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-navy mb-3">Engineering Tools for Preliminary Design</h2>
            <div className="flex flex-wrap gap-2">
              {fm.relatedTools.map((rel: string) => (
                <Link key={rel} href={`/tools/${rel}`}>
                  <Badge variant="outline" className="hover:bg-engineering-blue/5 hover:text-engineering-blue hover:border-engineering-blue/30 cursor-pointer text-sm">
                    {rel.replace(/-/g, " ")} calculator
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-navy mb-2">Discuss your {fm.title.toLowerCase()} project</h3>
            <p className="text-sm text-slate-600 mb-4">
              Tell us about your facility scope, timeline and standards — our engineering team will
              respond within one business day.
            </p>
            <Link
              href={`/contact?service=${slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
            >
              Request Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
