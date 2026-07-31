import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { constructMetadata } from "@/components/seo/SEO";
import { getAllDocMeta } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Project Case Studies",
  description:
    "Selected industrial, chemical, energy, public-building, steel-structure and cultural-tourism projects delivered by Industrial Engineering Studio — including overseas work in Seychelles and projects for Sino-US, Japanese, Korean and German-invested clients.",
  path: "/projects",
});

// Display order matching the studio's service categories.
const CATEGORY_ORDER = [
  "Industrial Building",
  "Chemical & Pharmaceutical Design",
  "Steel Structure Design & Optimization",
  "Public Building",
  "Cultural Tourism Planning & Design",
  "BIM & Digital Design",
  "Energy & Environmental Protection",
  "Cost Consultancy",
];

export default function ProjectsPage() {
  const allMetas = getAllDocMeta("projects", "/projects");
  const metas = allMetas.filter((m) => !((m.frontmatter as any).hidden));
  const fm = (m: ReturnType<typeof getAllDocMeta>[number]) => m.frontmatter as {
    title: string; description: string; category?: string; location?: string;
    client?: string; clientType?: string; scale?: string; cover?: string; highlights?: string[];
  };

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: metas.filter((m) => fm(m).category === cat),
  })).filter((g) => g.items.length > 0);
  const other = metas.filter((m) => !CATEGORY_ORDER.includes(fm(m).category || ""));

  return (
    <div className="bg-light-bg min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20">Case Studies</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">Engineering Project Case Studies</h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            A selection of real projects delivered by our team across industrial buildings, chemical and energy
            facilities, steel structures, public buildings and cultural-tourism redevelopments — including overseas
            work and projects for international and foreign-invested clients.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {[...grouped, ...(other.length ? [{ category: "Other Projects", items: other }] : [])].map((g) => (
          <section key={g.category} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-navy">{g.category}</h2>
              <span className="text-sm text-slate-400">{g.items.length}</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((m) => {
                const f = fm(m);
                return (
                  <Link key={m.slug} href={`/projects/${m.slug}`} className="group">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
                      {f.cover && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={f.cover}
                            alt={f.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {f.clientType && (
                            <Badge variant="outline" className="border-engineering-blue/30 text-engineering-blue text-[11px]">{f.clientType}</Badge>
                          )}
                          {f.location && (
                            <span className="text-[11px] text-slate-400">{f.location}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-navy leading-snug group-hover:text-engineering-blue transition-colors">{f.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{f.description}</p>
                        {f.scale && <p className="mt-3 text-xs text-slate-400">{f.scale}</p>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <div className="rounded-xl border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-navy mb-2">Have a project in mind?</h2>
          <p className="text-sm text-slate-600 mb-4 max-w-xl mx-auto">
            Our team delivers industrial, chemical, energy, steel-structure and public-building design — in China and
            internationally. Tell us your scope and standards.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors">
            Request an assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
