import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FolderKanban } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Project Case Studies",
  description:
    "Industrial engineering case studies — battery manufacturing plants, chemical facilities, energy projects and smart factories delivered by Industrial Engineering Studio.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20">
            <FolderKanban className="h-3 w-3 mr-1" /> Case Studies
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">
            Engineering Projects
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Selected industrial facility engineering case studies — battery manufacturing, chemical,
            energy and smart factory projects.
          </p>
        </div>
      </section>

      {/* Placeholder content — Sprint 10 will connect real projects from DB */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Card className="border-dashed border-slate-300 bg-white/50">
          <CardContent className="p-12">
            <FolderKanban className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy mb-2">Case studies launching soon</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Our project case studies are currently being prepared. In the meantime, explore our
              engineering services or contact us to discuss your project directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm text-engineering-blue font-medium hover:underline"
              >
                Explore Services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
              >
                Discuss your project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
