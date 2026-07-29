"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  BookOpen,
  Database,
  Building2,
  Cog,
  Droplets,
  Flame,
  Weight,
  Gauge,
  Zap,
  Box,
  ChevronRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const popularTools = [
  { name: "Steel Weight Calculator", href: "/tools/steel-weight-calculator", icon: Weight, category: "Material" },
  { name: "Pressure Drop Calculator", href: "/tools/pressure-drop-calculator", icon: Gauge, category: "Fluid" },
  { name: "Pump Power Calculator", href: "/tools/pump-power-calculator", icon: Cog, category: "Pump" },
  { name: "Pipe Velocity Calculator", href: "/tools/pipe-velocity-calculator", icon: Droplets, category: "Fluid" },
  { name: "Heat Exchanger Calculator", href: "/tools/heat-exchanger-calculator", icon: Flame, category: "Thermal" },
  { name: "Tank Volume Calculator", href: "/tools/tank-volume-calculator", icon: Box, category: "Vessel" },
  { name: "Orifice Flow Calculator", href: "/tools/orifice-flow-calculator", icon: Gauge, category: "Flow" },
  { name: "Motor Power Calculator", href: "/tools/motor-power-calculator", icon: Zap, category: "Electrical" },
];

const featuredGuides = [
  {
    title: "How to Calculate Pressure Drop in Pipes",
    description: "Complete guide to Darcy-Weisbach equation, Reynolds number, and friction factors for industrial pipe systems.",
    href: "/guides/pressure-drop-pipes",
    readTime: "8 min read",
  },
  {
    title: "Pump Selection Guide for Industrial Systems",
    description: "Learn how to select the right pump based on flow rate, head, fluid properties, and NPSH requirements.",
    href: "/guides/pump-selection-guide",
    readTime: "12 min read",
  },
  {
    title: "Steel Material Properties Reference",
    description: "Comprehensive reference for carbon steel, stainless steel, and alloy steel properties and applications.",
    href: "/guides/steel-material-properties",
    readTime: "7 min read",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 2000;
    const step = duration / 60;
    const timer = setInterval(() => {
      start += target / (duration / step);
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tools?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators: pressure drop, pump power, steel weight..."
          className="w-full h-14 pl-12 pr-28 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-engineering-blue/50 focus:border-engineering-blue/50 text-base"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 bg-engineering-blue hover:bg-engineering-blue/90 text-white rounded-lg font-medium text-sm transition-colors"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs text-slate-400">
        <span>Popular:</span>
        {["pipe velocity", "pump head", "NPSH", "heat transfer", "tank volume"].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => router.push(`/tools?search=${encodeURIComponent(term)}`)}
            className="hover:text-ai-glow transition-colors underline underline-offset-2"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-dark-bg text-white">
      <div className="absolute inset-0 hero-grid-bg opacity-40" />
      <div className="absolute inset-0 hero-radial-glow" />
      <div className="absolute top-20 -left-32 w-96 h-96 bg-engineering-blue/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-ai-glow/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-engineering-blue/15 text-ai-glow border-engineering-blue/30 hover:bg-engineering-blue/20">
            Engineering Intelligence for Modern Industry
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-gradient-hero">Engineering Calculators</span>
            <br />
            <span className="text-white/90">& Technical Guides</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Free, professional engineering calculators and in-depth technical guides for fluid mechanics,
            pump sizing, structural design, thermal engineering, and more.
          </p>

          <HeroSearch />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/tools"
              className="btn-primary-gradient text-white text-base font-medium px-8 h-12 rounded-lg shadow-2xl shadow-engineering-blue/25 inline-flex items-center justify-center"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Browse All Calculators
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/guides"
              className="border border-white/20 text-white hover:bg-white/5 text-base font-medium px-8 h-12 rounded-lg inline-flex items-center justify-center"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Read Engineering Guides
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: 53, suffix: "+", label: "Calculators" },
              { value: 30, suffix: "+", label: "Guides" },
              { value: 26, suffix: "", label: "Materials" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Link
            href="/enterprise"
            className="group block glass-hero-card rounded-xl p-5 sm:p-6 hover:border-engineering-blue/30 transition-all hover:shadow-xl hover:shadow-engineering-blue/5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-green to-ai-glow">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-ai-glow transition-colors">
                    For Engineering Teams
                  </div>
                  <div className="text-sm text-slate-400">
                    AI Knowledge Platform — Internal standards, CAD data, and engineering intelligence
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ai-glow text-sm font-medium whitespace-nowrap">
                Request Enterprise Demo
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-light-bg to-transparent" />
    </section>
  );
}

function IntroductionSection() {
  return (
    <section className="py-16 sm:py-20 bg-light-bg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">About Industrial Engineering Hub</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
            Your Trusted Engineering Resource
          </h2>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed text-center">
          Industrial Engineering Hub provides engineers, designers, and technical professionals with
          accurate, peer-reviewed engineering calculators and technical references. Our calculators are
          based on established engineering formulas and industry standards (ASTM, ASME, API), each
          verified with real-world examples. Every calculation includes clear formulas, step-by-step
          examples, and engineering context so you understand the numbers, not just the result.
        </p>
      </div>
    </section>
  );
}

function PopularToolsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <Badge variant="outline" className="mb-3">Popular Tools</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Most Used Calculators</h2>
          </div>
          <Link
            href="/tools"
            className="text-engineering-blue hover:text-engineering-blue/80 text-sm font-medium inline-flex items-center"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={tool.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/5 group-hover:bg-engineering-blue/10 transition-colors">
                        <tool.icon className="h-5 w-5 text-engineering-blue" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {tool.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-navy group-hover:text-engineering-blue transition-colors text-sm leading-snug">
                      {tool.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedGuidesSection() {
  return (
    <section className="py-16 sm:py-20 bg-light-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <Badge variant="outline" className="mb-3">Engineering Knowledge</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured Guides</h2>
          </div>
          <Link
            href="/guides"
            className="text-engineering-blue hover:text-engineering-blue/80 text-sm font-medium inline-flex items-center"
          >
            All Guides
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGuides.map((guide, index) => (
            <motion.div
              key={guide.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={guide.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 cursor-pointer group flex flex-col">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs mb-2">
                      {guide.readTime}
                    </Badge>
                    <CardTitle className="text-navy group-hover:text-engineering-blue transition-colors text-lg leading-snug">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {guide.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DatabaseSection() {
  const databases = [
    { name: "Material Properties", href: "/materials", icon: Weight, count: "26 materials" },
    { name: "Pipe Specifications", href: "/reference", icon: Droplets, count: "Schedule & sizes" },
    { name: "Engineering Standards", href: "/reference", icon: BookOpen, count: "ASTM, ASME, API" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3">Engineering Database</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">Reference Data</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Structured engineering data, material properties, and industry standards at your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {databases.map((db, index) => (
            <motion.div
              key={db.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={db.href} className="block h-full">
                <Card className="h-full card-hover border-border/60 cursor-pointer group text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-engineering-blue text-white mb-4 group-hover:scale-105 transition-transform">
                      <db.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-navy text-lg mb-1 group-hover:text-engineering-blue transition-colors">
                      {db.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{db.count}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <PopularToolsSection />
      <FeaturedGuidesSection />
      <DatabaseSection />
    </>
  );
}
