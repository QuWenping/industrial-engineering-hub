import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { constructMetadata } from "@/components/seo/SEO";
import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { Calculator, ArrowRight, Gauge, Waves, Activity, Droplets } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Pipe Flow Calculator Hub — Flow Rate, Pressure Drop, Reynolds Number",
  description: "Complete pipe flow engineering hub. Calculate flow rate, velocity, pressure drop, Reynolds number, friction loss and pump requirements. Darcy-Weisbach, Hazen-Williams formulas.",
  path: "/tools/pipe-flow-cluster",
  keywords: ["pipe flow calculator", "flow rate calculator", "pressure drop", "reynolds number", "friction loss", "pipe sizing"],
});

const calculators = [
  { slug: "pipe-flow-calculator", icon: "waves" },
  { slug: "flow-rate-calculator", icon: "waves" },
  { slug: "pipe-velocity-calculator", icon: "gauge" },
  { slug: "pipe-diameter-calculator", icon: "gauge" },
  { slug: "pressure-drop-calculator", icon: "activity" },
  { slug: "friction-loss-calculator", icon: "activity" },
  { slug: "head-loss-calculator", icon: "activity" },
  { slug: "reynolds-number-calculator", icon: "droplets" },
  { slug: "darcy-weisbach-calculator", icon: "activity" },
  { slug: "orifice-flow-calculator", icon: "gauge" },
  { slug: "pipe-volume-calculator", icon: "droplets" },
  { slug: "hydraulic-diameter-calculator", icon: "gauge" },
];

const iconMap: Record<string, typeof Calculator> = {
  waves: Waves,
  gauge: Gauge,
  activity: Activity,
  droplets: Droplets,
};

const formulaTable = [
  { formula: "Q = A x v", desc: "Continuity equation: Flow rate = Area x Velocity" },
  { formula: "Re = rho x v x D / mu", desc: "Reynolds number: Laminar (Re<2300) vs Turbulent (Re>4000)" },
  { formula: "hf = f x (L/D) x v^2/(2g)", desc: "Darcy-Weisbach: Major friction head loss" },
  { formula: "dp = f x (L/D) x (rho x v^2)/2", desc: "Pressure drop from friction" },
  { formula: "v = Q / A = 4Q / (pi x D^2)", desc: "Velocity from flow rate and diameter" },
];

export default function PipeFlowClusterPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Pipe Flow Engineering Hub</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Pipe Flow Calculator Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete pipe flow engineering calculations — flow rate, velocity, pressure drop,
            Reynolds number, friction loss and pump sizing. Based on Darcy-Weisbach and continuity equations.
          </p>
        </div>

        {/* Formula Reference */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Core Pipe Flow Formulas</h2>
          <div className="space-y-3">
            {formulaTable.map((row, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-white p-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-64 font-mono text-sm text-ai-glow bg-navy/90 rounded-lg px-4 py-2 text-center">
                  {row.formula}
                </div>
                <p className="text-sm text-muted-foreground">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Pipe Flow Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => {
              const c = getCalculatorBySlug(calc.slug);
              if (!c) return null;
              const Icon = iconMap[calc.icon] || Calculator;
              return (
                <Link key={calc.slug} href={`/tools/${calc.slug}`}>
                  <Card className="h-full card-hover border-border/60 cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/5 group-hover:bg-engineering-blue/10 transition-colors">
                          <Icon className="h-4 w-4 text-engineering-blue" />
                        </div>
                        <span className="font-semibold text-navy group-hover:text-engineering-blue transition-colors text-sm">{c.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="mt-3 flex items-center text-xs text-engineering-blue">Calculate <ArrowRight className="ml-1 h-3 w-3" /></div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Flow Regime Guide */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Flow Regime Classification</h2>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr><th className="px-4 py-3 text-left">Reynolds Number</th><th className="px-4 py-3 text-left">Flow Regime</th><th className="px-4 py-3 text-left">Characteristics</th></tr>
              </thead>
              <tbody className="bg-white">
                <tr><td className="px-4 py-3 font-mono text-accent-green">Re &lt; 2300</td><td className="px-4 py-3 font-medium text-navy">Laminar</td><td className="px-4 py-3 text-muted-foreground">Smooth parallel streamlines, parabolic velocity profile, f = 64/Re</td></tr>
                <tr className="bg-muted/30"><td className="px-4 py-3 font-mono text-warning">2300 &le; Re &le; 4000</td><td className="px-4 py-3 font-medium text-navy">Transitional</td><td className="px-4 py-3 text-muted-foreground">Unstable flow, intermittent turbulence, use safety factor</td></tr>
                <tr><td className="px-4 py-3 font-mono text-danger">Re &gt; 4000</td><td className="px-4 py-3 font-medium text-navy">Turbulent</td><td className="px-4 py-3 text-muted-foreground">Chaotic mixing, flat velocity profile, use Colebrook or Swamee-Jain for f</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-xl font-bold text-navy mb-4">Related References</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/pump-efficiency-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pump Efficiency</Badge></Link>
            <Link href="/tools/pump-power-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pump Power</Badge></Link>
            <Link href="/tools/pump-head-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pump Head</Badge></Link>
            <Link href="/tools/npsh-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">NPSH Calculator</Badge></Link>
            <Link href="/tools/water-velocity-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Water Velocity</Badge></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
