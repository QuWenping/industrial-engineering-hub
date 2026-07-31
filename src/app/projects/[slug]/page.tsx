import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronRight, ArrowRight, MapPin, Calendar, Building2, Gauge } from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllDocSlugs, getDocBySlug } from "@/lib/mdx";
import { constructMetadata, schemaArticle, schemaBreadcrumb, BASE_URL } from "@/components/seo/SEO";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllDocSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "projects", "/projects");
  if (!doc) return constructMetadata({ title: "Project Not Found", description: "", path: `/projects/${slug}` });
  return constructMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/projects/${slug}`,
    type: "article",
    keywords: [doc.frontmatter.title, "engineering project", "case study", doc.frontmatter.category || ""],
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug, "projects", "/projects");
  if (!doc) notFound();
  const { frontmatter, content } = doc;
  const fm = frontmatter as any;
  const pageUrl = `${BASE_URL}/projects/${slug}`;

  const jsonLd = [
    schemaArticle({ title: fm.title, description: fm.description, url: pageUrl }),
    schemaBreadcrumb([
      { name: "Home", url: BASE_URL },
      { name: "Projects", url: `${BASE_URL}/projects` },
      { name: fm.title, url: pageUrl },
    ]),
  ];

  const meta = [
    fm.location && { icon: MapPin, label: "Location", value: fm.location },
    fm.client && { icon: Building2, label: "Client", value: fm.client },
    fm.scale && { icon: Gauge, label: "Scale", value: fm.scale },
    fm.year && { icon: Calendar, label: "Year", value: fm.year },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="bg-light-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/projects" />}>Projects</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbPage>{fm.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {fm.category && <Badge variant="secondary">{fm.category}</Badge>}
          {fm.clientType && <Badge variant="outline" className="border-engineering-blue/30 text-engineering-blue">{fm.clientType}</Badge>}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{fm.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{fm.description}</p>

        {fm.cover && (
          <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fm.cover} alt={fm.title} className="max-h-[420px] w-full object-cover" />
          </div>
        )}

        {meta.length > 0 && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-white p-5">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1"><m.icon className="h-3.5 w-3.5" /> {m.label}</dt>
                <dd className="text-slate-700 mt-1 text-sm">{m.value}</dd>
              </div>
            ))}
          </div>
        )}

        {fm.services?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-navy mb-2">Disciplines delivered</h2>
            <div className="flex flex-wrap gap-2">
              {fm.services.map((s: string) => (
                <Badge key={s} variant="outline" className="border-slate-300 text-slate-700">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {fm.highlights?.length > 0 && (
          <div className="mb-8 rounded-xl border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-5">
            <h2 className="text-sm font-semibold text-navy mb-3">Key highlights</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {fm.highlights.map((h: string) => (
                <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-engineering-blue" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator className="mb-8" />
        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-h2:text-navy">
          {content}
        </article>

        {fm.relatedTools?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy mb-3">Engineering tools for preliminary design</h2>
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

        <div className="mt-10 rounded-xl border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-navy mb-2">Discuss a similar project</h3>
          <p className="text-sm text-slate-600 mb-4">
            Tell us about your facility scope, location and standards — our team responds within one business day,
            in China or internationally.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors">
            Request an assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
