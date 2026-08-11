import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Calendar, BookOpen } from "lucide-react";
import { getAllDocSlugs, getDocBySlug, getAllDocMeta } from "@/lib/mdx";
import { getMaterialById } from "@/lib/calculator/materials";
import { constructMetadata, schemaArticle, schemaBreadcrumb, schemaDataset } from "@/components/seo/SEO";
import { mdxComponents } from "@/components/mdx/MDXComponents";

type Props = { params: Promise<{ slug: string }> };

// Force SSG at build time — no runtime MDX compile, no DB round-trips.
export const dynamic = "force-static";
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDocSlugs("materials").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "materials", "/materials");
  if (!doc) return constructMetadata({ title: "Material Not Found", description: "The requested material could not be found.", path: `/materials/${slug}` });

  return constructMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/materials/${slug}`,
    type: "article",
    keywords: doc.frontmatter.keywords || ["material properties", doc.frontmatter.category || "engineering materials"],
    modifiedTime: doc.frontmatter.updated,
  });
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "materials", "/materials");
  if (!doc) notFound();

  const { frontmatter, content } = doc;
  const materialData = getMaterialById(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.industrialengineeringstudio.com";
  const pageUrl = `${baseUrl}/materials/${slug}`;

  const jsonLd = [
    schemaArticle({
      title: frontmatter.title,
      description: frontmatter.description,
      url: pageUrl,
      modifiedTime: frontmatter.updated,
    }),
    schemaDataset({
      name: frontmatter.title,
      description: frontmatter.description,
      url: pageUrl,
    }),
    schemaBreadcrumb([
      { name: "Home", url: baseUrl },
      { name: "Materials", url: `${baseUrl}/materials` },
      { name: frontmatter.title, url: pageUrl },
    ]),
  ];

  return (
    <div className="bg-light-bg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/materials" />}>Materials</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{frontmatter.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {frontmatter.category && <Badge variant="secondary">{frontmatter.category}</Badge>}
            {materialData && (
              <Badge variant="outline" className="text-accent-green border-accent-green/30">
                ρ = {materialData.density} kg/m³
              </Badge>
            )}
            {frontmatter.updated && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> Updated {frontmatter.updated}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" /> Material Reference
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{frontmatter.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{frontmatter.description}</p>
        </header>

        {/* Quick properties card if material data exists */}
        {materialData && (
          <Card className="mb-8 border-engineering-blue/20 bg-engineering-blue/5">
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Density</p>
                <p className="text-lg font-bold text-navy">{materialData.density} <span className="text-sm font-normal text-muted-foreground">kg/m³</span></p>
              </div>
              {materialData.yieldStrength && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Yield Strength</p>
                  <p className="text-lg font-bold text-navy">{materialData.yieldStrength} <span className="text-sm font-normal text-muted-foreground">MPa</span></p>
                </div>
              )}
              {materialData.tensileStrength && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tensile Strength</p>
                  <p className="text-lg font-bold text-navy">{materialData.tensileStrength} <span className="text-sm font-normal text-muted-foreground">MPa</span></p>
                </div>
              )}
              {materialData.thermalConductivity && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Thermal Cond.</p>
                  <p className="text-lg font-bold text-navy">{materialData.thermalConductivity} <span className="text-sm font-normal text-muted-foreground">W/m·K</span></p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator className="mb-8" />

        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
          {content}
        </article>

        <Separator className="my-10" />

        {frontmatter.related && frontmatter.related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-navy mb-4">Related Calculators & Guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {frontmatter.related.map((rel) => (
                <Link key={rel} href={rel.startsWith("/") ? rel : `/tools/${rel}`}>
                  <Card className="card-hover border-border/60">
                    <CardContent className="p-4 text-sm text-navy hover:text-engineering-blue">
                      {rel}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* E-E-A-T Section */}
        <section className="mt-10 rounded-lg bg-navy/[0.03] border border-navy/10 p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            <strong className="text-navy">Engineering Disclaimer:</strong> Material property data is for reference
            and educational purposes. Verify all properties against material test reports (MTRs) and
            applicable ASTM/ASME standards for engineering design.
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border/40 pt-3">
            <div>
              <span className="font-semibold text-navy">Reviewed by:</span> Industrial Engineering Team
            </div>
            <div>
              <span className="font-semibold text-navy">References:</span> ASTM International, ASME B31, Perry's Chemical Engineers' Handbook, ASM Material Data
            </div>
            <div>
              <span className="font-semibold text-navy">Methodology:</span>{" "}
              <Link href="/methodology" className="text-engineering-blue hover:underline">Engineering data methodology</Link>
            </div>
            <div>
              <span className="font-semibold text-navy">Data sources:</span>{" "}
              <Link href="/data-sources" className="text-engineering-blue hover:underline">View all sources</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

