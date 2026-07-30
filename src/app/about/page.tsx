import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Cpu, Globe, ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Industrial Engineering Studio",
  description:
    "Industrial Engineering Studio delivers multi-discipline engineering for factories, energy facilities, chemical plants and infrastructure — structural, MEP, process and digital engineering.",
  path: "/about",
});

const principles = [
  {
    icon: Target,
    title: "Engineering Rigor",
    description:
      "Every deliverable is designed and checked to applicable international codes and standards (ASME, API, IBC, ISO, NEC). We build engineering assets that are buildable and permit-ready.",
  },
  {
    icon: Users,
    title: "Multi-Discipline Team",
    description:
      "Architectural, structural, MEP, process, electrical, I&C and digital engineers working as one coordinated team — fewer handoffs, faster delivery, fewer RFIs during construction.",
  },
  {
    icon: Cpu,
    title: "Digital-First Delivery",
    description:
      "BIM-coordinated 3D models, digital twin handover and AI-assisted engineering workflows from project day one. Our deliverables are data-ready for your operations and maintenance teams.",
  },
  {
    icon: Globe,
    title: "Global Project Delivery",
    description:
      "Engineering support for projects across Asia, Middle East, Europe and the Americas. Experience delivering to international owner-operators and EPCs.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Multi-Discipline Industrial Engineering
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We deliver industrial facility design and digital engineering solutions for factories,
            chemical plants, energy facilities and infrastructure projects worldwide.
          </p>
        </div>

        <div className="prose prose-slate max-w-none mb-12">
          <h2 className="text-2xl font-bold text-navy">Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed">
            Industrial Engineering Studio is a multi-discipline engineering practice focused on
            industrial facilities — from concept feasibility through detailed design, construction
            support and digital handover. We combine deep domain experience in structural, MEP,
            process and digital engineering with a digital-first delivery approach (BIM, digital
            twin, AI-assisted workflows).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We also publish the free <Link href="/tools" className="text-engineering-blue hover:underline">
            Industrial Engineering Tools</Link> used by tens of thousands of engineers worldwide,
            and share engineering knowledge through our <Link href="/guides" className="text-engineering-blue hover:underline">
            Engineering Insights</Link>.
          </p>

          <h2 className="text-2xl font-bold text-navy">How We Work</h2>
          <p className="text-muted-foreground leading-relaxed">
            We engage at every stage of an industrial project — from concept and FEED, through
            detailed engineering, procurement support, construction supervision and digital handover.
            Our digital engineering practice ensures that every facility we design is delivered with
            a coordinated BIM model and structured asset data ready for your CMMS and IoT platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {principles.map((item) => (
            <Card key={item.title} className="border-border/60">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10 mb-3">
                  <item.icon className="h-5 w-5 text-engineering-blue" />
                </div>
                <CardTitle className="text-navy text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-navy rounded-xl p-8 text-center text-white">
          <Mail className="h-8 w-8 text-ai-glow mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Let's discuss your industrial project</h2>
          <p className="text-slate-300 mb-4 text-sm">
            Share your facility scope, location and timeline — our engineering team will follow up within one business day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy hover:bg-slate-100 transition-colors"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
