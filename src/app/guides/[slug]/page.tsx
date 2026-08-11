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
import { constructMetadata, schemaArticle, schemaBreadcrumb, schemaFAQ } from "@/components/seo/SEO";
import { mdxComponents } from "@/components/mdx/MDXComponents";

type Props = { params: Promise<{ slug: string }> };

// Force SSG at build time — no runtime MDX compile, no DB round-trips.
export const dynamic = "force-static";
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDocSlugs("guides").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "guides", "/guides");
  if (!doc) return constructMetadata({ title: "Guide Not Found", description: "The requested guide could not be found.", path: `/guides/${slug}` });

  return constructMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/guides/${slug}`,
    type: "article",
    keywords: doc.frontmatter.keywords || ["engineering guide", doc.frontmatter.category || "industrial engineering"],
    modifiedTime: doc.frontmatter.updated,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "guides", "/guides");
  if (!doc) notFound();

  const { frontmatter, content } = doc;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.industrialengineeringstudio.com";
  const pageUrl = `${baseUrl}/guides/${slug}`;

  // Build FAQ schema from headings (placeholder; ideally from frontmatter.faq)
  const jsonLd = [
    schemaArticle({
      title: frontmatter.title,
      description: frontmatter.description,
      url: pageUrl,
      modifiedTime: frontmatter.updated,
    }),
    schemaBreadcrumb([
      { name: "Home", url: baseUrl },
      { name: "Guides", url: `${baseUrl}/guides` },
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
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/guides" />}>Guides</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{frontmatter.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {frontmatter.category && <Badge variant="secondary">{frontmatter.category}</Badge>}
            {frontmatter.updated && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> Updated {frontmatter.updated}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" /> Engineering Guide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{frontmatter.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{frontmatter.description}</p>
        </header>

        <Separator className="mb-8" />

        {/* Article content */}
        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
          {content}
        </article>

        <Separator className="my-10" />

        {/* Related */}
        {frontmatter.related && frontmatter.related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-navy mb-4">Related Guides & Tools</h2>
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

        {/* Disclaimer */}
        <Card className="mt-10 bg-warning/5 border-warning/20 border-l-4">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <strong className="text-navy">Disclaimer:</strong> This guide is for educational purposes only.
            Always consult qualified engineering professionals and applicable codes/standards (ASME, API, ASTM)
            for engineering design. See{" "}
            <Link href="/disclaimer" className="text-engineering-blue hover:underline">full disclaimer</Link>.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
