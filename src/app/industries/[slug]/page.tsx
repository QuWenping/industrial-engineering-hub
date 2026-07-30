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
import { ChevronRight, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getAllDocSlugs, getDocBySlug } from "@/lib/mdx";
import {
  constructMetadata,
  schemaArticle,
  schemaBreadcrumb,
  BASE_URL,
} from "@/components/seo/SEO";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllDocSlugs("industries").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "industries", "/industries");
  if (!doc) return constructMetadata({ title: "Industry Not Found", description: "", path: `/industries/${slug}` });

  return constructMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/industries/${slug}`,
    type: "article",
    keywords: [doc.frontmatter.title, "industrial engineering", "engineering services"],
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "industries", "/industries");
  if (!doc) notFound();

  const { frontmatter, content } = doc;
  const fm = frontmatter as any;
  const pageUrl = `${BASE_URL}/industries/${slug}`;

  const jsonLd = [
    schemaArticle({ title: fm.title, description: fm.description, url: pageUrl }),
    schemaBreadcrumb([
      { name: "Home", url: BASE_URL },
      { name: "Industries", url: `${BASE_URL}/industries` },
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/industries" />}>Industries</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{fm.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{fm.icon || "🏭"}</span>
            <Badge variant="secondary">Industry Solution</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{fm.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{fm.description}</p>
        </header>

        {/* Challenges & Solutions two-col */}
        {(fm.challieves || fm.solutions) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {fm.challieves && fm.challieves.length > 0 && (
              <Card className="border-amber-200/60 bg-amber-50/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h2 className="text-base font-semibold text-navy">Engineering Challenges</h2>
                  </div>
                  <ul className="space-y-2">
                    {fm.challieves.map((c: string) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-amber-500 mt-1">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {fm.solutions && fm.solutions.length > 0 && (
              <Card className="border-engineering-blue/20 bg-engineering-blue/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-engineering-blue" />
                    <h2 className="text-base font-semibold text-navy">Our Engineering Solutions</h2>
                  </div>
                  <ul className="space-y-2">
                    {fm.solutions.map((c: string) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-engineering-blue" /> {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Separator className="mb-8" />

        {/* MDX body */}
        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
          {content}
        </article>

        <Separator className="my-10" />

        {/* Related services */}
        {fm.relatedServices && fm.relatedServices.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-navy mb-3">Related Engineering Services</h2>
            <div className="flex flex-wrap gap-2">
              {fm.relatedServices.map((rel: string) => (
                <Link key={rel} href={`/services/${rel}`}>
                  <Badge variant="outline" className="hover:bg-engineering-blue/5 hover:text-engineering-blue hover:border-engineering-blue/30 cursor-pointer text-sm">
                    {rel.replace(/-/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-navy mb-2">Planning a {fm.title.toLowerCase()} facility?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Share your project scope, location and timeline — our engineering team will follow up within one business day.
            </p>
            <Link
              href={`/contact?industry=${slug}`}
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
