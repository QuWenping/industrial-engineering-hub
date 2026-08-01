import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase } from "lucide-react";
import { getAllDocMeta } from "@/lib/mdx";
import { constructMetadata, schemaEngineeringService, BASE_URL } from "@/components/seo/SEO";
import Script from "next/script";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Services",
  description:
    "Industrial engineering services — building design, structural, HVAC & MEP, chemical plant, energy facility and digital engineering for industrial projects worldwide.",
  path: "/services",
  keywords: [
    "industrial engineering services",
    "structural engineering services",
    "HVAC engineering",
    "MEP design",
    "chemical plant engineering",
    "industrial building design",
    "digital engineering",
  ],
});

export default function ServicesPage() {
  const services = getAllDocMeta("services", "/services");

  const jsonLd = schemaEngineeringService({
    name: "Industrial Engineering Services",
    description:
      "Multi-discipline engineering services for industrial facilities — structural, MEP, process, energy and digital engineering.",
    url: `${BASE_URL}/services`,
    serviceType: services.map((s) => s.frontmatter.title),
  });

  return (
    <div className="bg-light-bg min-h-screen">
      <Script
        id="schema-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20">
            <Briefcase className="h-3 w-3 mr-1" /> Services
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">
            Industrial Engineering Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Multi-discipline engineering for factories, energy facilities, chemical plants and
            infrastructure projects — from concept through construction and handover.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const fm = svc.frontmatter as any;
            return (
              <Link key={svc.slug} href={svc.urlPath}>
                <Card className="h-full card-hover border-slate-200 hover:border-engineering-blue/40 transition-all">
                  <CardContent className="p-6">
                    <div className="mb-3">{fm.iconFile ? (<img src={fm.iconFile} alt={fm.title} className="h-12 w-12 object-contain" />) : (<span className="text-3xl">{fm.icon}</span>)}</div>
                    <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-engineering-blue">
                      {fm.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {fm.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-engineering-blue font-medium">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have an industrial project to discuss?</h2>
          <p className="text-slate-300 mb-6">
            Tell us about your facility, scope and timeline — our engineering team will follow up
            within one business day.
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
