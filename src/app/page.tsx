export const dynamic = "force-static";

import Link from "next/link";
import Image from "next/image";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { MotionSection } from "@/components/home/MotionSection";
import {
  ArrowRight,
  Calculator,
  Send,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsCarousel } from "@/components/home/ProjectsCarousel";
import { UnifiedIcon } from "@/components/icons/UnifiedIcon";

// ─── Capabilities (section 1) ─────────────────────────────────────────────────
const capabilities = [
  {
    icon: 'industrial-building' as const,
    title: "Industrial Building Design",
    description: "Factory layout, architecture, envelope and site planning for manufacturing and process facilities.",
    href: "/services/industrial-building-design",
  },
  {
    icon: 'structural' as const,
    title: "Structural Engineering",
    description: "Steel, concrete and foundation design for industrial superstructures, equipment supports and seismic loads.",
    href: "/services/structural-engineering",
  },
  {
    icon: 'hvac' as const,
    title: "HVAC & MEP Engineering",
    description: "Process HVAC, electrical distribution, plumbing, fire protection and industrial utility systems.",
    href: "/services/hvac-mep-engineering",
  },
  {
    icon: 'chemical' as const,
    title: "Chemical Plant Engineering",
    description: "Process, piping, safety (HAZOP/LOPA), pressure relief and utility design for chemical facilities.",
    href: "/services/chemical-plant-engineering",
  },
  {
    icon: 'energy' as const,
    title: "Energy Facility Engineering",
    description: "Balance-of-plant, BESS, substation and SCADA for generation, storage and renewable energy projects.",
    href: "/services/energy-facility-engineering",
  },
  {
    icon: 'digital' as const,
    title: "Digital Engineering & AI",
    description: "BIM coordination, digital twin, AI-assisted workflows and data-ready handover for operations.",
    href: "/services/digital-engineering",
  },
];

// ─── Industries (section 2) ───────────────────────────────────────────────────
const industries = [
  { icon: 'battery' as const, title: "Battery Manufacturing", href: "/industries/battery-factory" },
  { icon: 'chemical-plant' as const, title: "Chemical Plants", href: "/industries/chemical-plant" },
  { icon: 'energy-facility' as const, title: "Energy Facilities", href: "/industries/energy-facility" },
  { icon: 'smart-factory' as const, title: "Smart Factories", href: "/industries/smart-factory" },
  { icon: 'building' as const, title: "Industrial Buildings", href: "/services/industrial-building-design" },
  { icon: 'infrastructure' as const, title: "Infrastructure", href: "/services/structural-engineering" },
];

// ─── Free engineering tools (section 4) ──────────────────────────────────────
const popularTools = [
  { name: "Steel Weight Calculator", href: "/tools/steel-weight-calculator", icon: "structural" as const },
  { name: "Pressure Drop Calculator", href: "/tools/pressure-drop-calculator", icon: "hvac" as const },
  { name: "Pipe Flow Calculator", href: "/tools/pipe-flow-calculator", icon: "energy" as const },
  { name: "Pump Power Calculator", href: "/tools/pump-power-calculator", icon: "digital" as const },
  { name: "Heat Exchanger Calculator", href: "/tools/heat-exchanger-calculator", icon: "energy" as const },
  { name: "Tank Volume Calculator", href: "/tools/tank-volume-calculator", icon: "building" as const },
  { name: "Beam Deflection Calculator", href: "/tools/beam-deflection-calculator", icon: "structural" as const },
  { name: "Motor Power Calculator", href: "/tools/motor-power-calculator", icon: "digital" as const },
];

// ─── Why work with us (section 5) ────────────────────────────────────────────
const whyUs = [
  { title: "Engineering Experience", description: "Decades of industrial project delivery across Asia, Middle East, Europe and the Americas. Our engineering team brings real-world design experience to every calculation and reference." },
  { title: "Industrial Project Knowledge", description: "Deep domain expertise in battery, chemical, energy and manufacturing facility design. Our calculators are based on standard engineering formulas validated by professional practice." },
  { title: "Engineering Calculation Platform", description: "Built for engineers, designers and technical professionals. All calculators use SI base units with automatic conversion, following ASME, ASTM and ISO engineering standards." },
  { title: "Multi-Disciplinary Team", description: "Architectural, structural, MEP, process, electrical and digital engineers under one roof." },
  { title: "Digital Engineering Approach", description: "BIM-first delivery, digital twin handover and AI-assisted workflows from project day one." },
];


function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-b from-[#0B1F3A] via-[#102B50] to-[#06080E] text-white">
      {/* z1: Background image with Ken Burns slow zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/hero-bg.webp" alt="" fill priority sizes="100vw" className="ieh-kenburns object-cover opacity-70" />
      </div>
      {/* z2: Overlay layers for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/30 to-transparent" />
      <div className="absolute inset-0 hero-grid-bg opacity-15" />
      <div className="absolute inset-0 hero-radial-glow" />
      <div className="absolute top-16 -left-40 w-[28rem] h-[28rem] bg-engineering-blue/10 rounded-full blur-3xl" />
      <div className="absolute top-32 -right-40 w-[28rem] h-[28rem] bg-ai-glow/6 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <MotionSection className="max-w-2xl" duration={0.8}>
          <Badge className="mb-6 bg-engineering-blue/15 text-ai-glow border-engineering-blue/30 hover:bg-engineering-blue/20">
            Industrial Facility Design &amp; Digital Engineering Solutions
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-gradient-hero">Industrial Engineering</span>
            <br />
            <span className="text-white/90">Studio</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Engineering solutions for factories, chemical plants, energy facilities and industrial
            projects — structural, MEP, process and digital engineering, delivered with digital-first methods.
          </p>

          <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-md mb-10">
            {[
              { value: 54, suffix: "+", label: "Engineering Tools" },
              { value: 50, suffix: "+", label: "Technical Guides" },
              { value: 14, suffix: "", label: "Featured Projects" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient-hero">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
            <Link
              href="/contact"
              className="btn-primary-gradient text-white text-base font-medium px-8 h-12 rounded-lg shadow-2xl shadow-engineering-blue/25 inline-flex items-center justify-center transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              <Send className="mr-2 h-5 w-5" />
              Discuss Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/tools"
              className="border border-white/20 text-white hover:bg-white/5 text-base font-medium px-8 h-12 rounded-lg inline-flex items-center justify-center transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Explore Engineering Tools
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-start gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ai-glow" /> Multi-discipline engineering</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ai-glow" /> Digital-first delivery</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ai-glow" /> Global project delivery</span>
          </div>
        </MotionSection>
      </div>

      {/* z5: Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="ieh-scroll-bounce h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function CapabilitySection() {
  return (
    <section className="py-16 sm:py-24 bg-light-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Our Capabilities</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Industrial Engineering Capability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Six integrated engineering disciplines delivered as one coordinated team — from concept to digital handover.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <MotionSection key={cap.title} delay={i * 0.06}>
              <Link href={cap.href} className="block h-full">
                <Card className="h-full card-hover border-slate-200 hover:border-engineering-blue/40 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-engineering-blue/10 to-ai-glow/10 text-engineering-blue mb-4 group-hover:scale-105 transition-transform">
                      <UnifiedIcon name={cap.icon} size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-navy group-hover:text-engineering-blue transition-colors mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <Badge variant="outline" className="mb-4">Industries</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Industries We Serve
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We engineer facilities across the industrial spectrum — from gigafactories to chemical plants, energy storage to smart manufacturing.
            </p>
            <Link
              href="/industries"
              className="inline-flex items-center gap-1.5 text-sm text-engineering-blue font-medium hover:underline"
            >
              All industries <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {industries.map((ind, i) => (
              <MotionSection key={ind.title} y={10} duration={0.3} delay={i * 0.05}>
                <Link href={ind.href} className="block h-full">
                  <Card className="h-full card-hover border-slate-200 hover:border-engineering-blue/40 cursor-pointer group">
                    <CardContent className="p-5 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-engineering-blue/5 text-engineering-blue mb-3 group-hover:bg-engineering-blue/10 transition-colors">
                        <UnifiedIcon name={ind.icon} size={20} />
                      </div>
                      <div className="text-sm font-medium text-navy group-hover:text-engineering-blue transition-colors">
                        {ind.title}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsPreviewSection() {
  return (
    <section className="py-16 sm:py-24 bg-light-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="outline" className="mb-3">Case Studies</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Engineering Project Case Studies</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              A selection of real projects — industrial, chemical, energy, steel-structure, public-building and cultural-tourism work, including overseas and foreign-invested clients.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-engineering-blue hover:text-engineering-blue/80 text-sm font-medium inline-flex items-center whitespace-nowrap"
          >
            All Projects <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <ProjectsCarousel />
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10 items-start mb-10">
          <div className="lg:col-span-2">
            <Badge variant="outline" className="mb-3">Engineering Tools</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">Free Engineering Tools</h2>
            <p className="text-muted-foreground leading-relaxed">
              Supporting engineers with preliminary calculations and design verification across
              structural, fluid, thermal, electrical and process engineering.
            </p>
          </div>
          <div className="lg:text-right">
            <Link
              href="/tools"
              className="text-engineering-blue hover:text-engineering-blue/80 text-sm font-medium inline-flex items-center"
            >
              All 50+ Calculators <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularTools.map((tool, i) => (
            <MotionSection key={tool.href} y={10} duration={0.3} delay={i * 0.04}>
              <Link href={tool.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 hover:border-engineering-blue/30 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/5 group-hover:bg-engineering-blue/10 transition-colors mb-3 text-engineering-blue">
                      <UnifiedIcon name={tool.icon} size={16} />
                    </div>
                    <h3 className="text-sm font-medium text-navy group-hover:text-engineering-blue transition-colors leading-snug">
                      {tool.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  return (
    <section className="py-16 sm:py-24 bg-light-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Why Work With Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Engineering Partners for Industrial Projects
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item, i) => (
            <MotionSection key={item.title} delay={i * 0.08}>
              <Card className="h-full border-slate-200">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-6 w-6 text-engineering-blue mb-3" />
                  <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsPreviewSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="outline" className="mb-3">Insights</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Engineering Insights</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Technical guides and engineering references for industrial projects.
            </p>
          </div>
          <Link
            href="/guides"
            className="text-engineering-blue hover:text-engineering-blue/80 text-sm font-medium inline-flex items-center whitespace-nowrap"
          >
            All Insights <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { title: "HVAC Design Principles for Clean Manufacturing", href: "/guides", icon: 'hvac' as const },
            { title: "Structural Load Considerations for Heavy Industrial Equipment", href: "/guides", icon: 'structural' as const },
            { title: "AI Agent Applications in Engineering Design", href: "/guides", icon: 'digital' as const },
          ].map((g, i) => (
            <MotionSection key={g.title} delay={i * 0.1}>
              <Link href={g.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 cursor-pointer group">
                  <CardHeader>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/5 mb-2 text-engineering-blue">
                      <UnifiedIcon name={g.icon} size={18} />
                    </div>
                    <CardTitle className="text-navy group-hover:text-engineering-blue transition-colors text-base leading-snug">
                      {g.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-muted-foreground text-sm">
                      Engineering guide — part of our Industrial Engineering Insights series.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have an industrial project to discuss?</h2>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto">
          Tell us about your facility, scope and timeline. Our engineering team will respond within one business day.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy hover:bg-slate-100 transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          Start a Project Assessment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilitySection />
      <IndustriesSection />
      <ProjectsPreviewSection />
      <ToolsSection />
      <WhyUsSection />
      <InsightsPreviewSection />
      <CTASection />
    </>
  );
}



