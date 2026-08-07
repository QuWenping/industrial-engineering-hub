import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { constructMetadata } from "@/components/seo/SEO";
import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { Calculator, ArrowRight, Cylinder, Box, Gauge } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Pressure Vessel Engineering Hub — Volume, Heads & Sizing Calculators",
  description: "Complete pressure vessel engineering hub. Calculate vessel volume, dished head volume, tank capacity and ASME head dimensions. Formulas, sizing guides and engineering reference.",
  path: "/tools/pressure-vessel-cluster",
  keywords: ["pressure vessel calculator", "vessel volume", "dished head volume", "ASME head", "tank capacity", "pressure vessel calculation"],
});

const calculators = [
  { slug: "pressure-vessel-volume-calculator", icon: "cylinder" },
  { slug: "tank-volume-calculator", icon: "cylinder" },
  { slug: "tank-capacity-calculator", icon: "box" },
  { slug: "tank-surface-area-calculator", icon: "gauge" },
  { slug: "tank-weight-calculator", icon: "cylinder" },
  { slug: "cylinder-volume-calculator", icon: "cylinder" },
  { slug: "sphere-volume-calculator", icon: "box" },
  { slug: "cone-volume-calculator", icon: "box" },
  { slug: "storage-capacity-calculator", icon: "gauge" },
  { slug: "liquid-volume-calculator", icon: "cylinder" },
];

const iconMap: Record<string, typeof Calculator> = {
  cylinder: Cylinder,
  box: Box,
  gauge: Gauge,
};

const headTypes = [
  { type: "2:1 Elliptical (ASME Standard)", volumeFormula: "V = pi x D^3 / 24 (per head)", depthFormula: "h = D/4", note: "Most common for ASME vessels" },
  { type: "Hemispherical", volumeFormula: "V = pi x D^3 / 12 (per head)", depthFormula: "h = D/2", note: "Lowest stress, highest volume" },
  { type: "Torispherical (ASME F&D)", volumeFormula: "V approx 0.1 x D^3 (per head)", depthFormula: "h = 0.0694 x D", note: "Shallowest standard head" },
  { type: "Flat", volumeFormula: "V = 0", depthFormula: "h = 0", note: "No additional volume, highest stress" },
];

const formulas = [
  { formula: "V_shell = pi x (D/2)^2 x L", desc: "Cylindrical shell volume" },
  { formula: "V_head = pi x D^3 / 24", desc: "One 2:1 elliptical head (ASME standard)" },
  { formula: "V_total = V_shell + 2 x V_head", desc: "Total vessel volume = shell + 2 heads" },
  { formula: "MAWP = 2 x S x E x t / (D - 0.2t)", desc: "ASME maximum allowable working pressure" },
];

export default function PressureVesselClusterPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Pressure Vessel Engineering Hub</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Pressure Vessel Engineering Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calculate pressure vessel volume, dished head dimensions, tank capacity and ASME vessel sizing.
            Engineering formulas, head type reference, and calculation guides for vessel design.
          </p>
        </div>

        {/* Formulas */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Core Pressure Vessel Formulas</h2>
          <div className="space-y-3">
            {formulas.map((row, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-white p-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-80 font-mono text-sm text-ai-glow bg-navy/90 rounded-lg px-4 py-2 text-center">
                  {row.formula}
                </div>
                <p className="text-sm text-muted-foreground">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Head Types */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">ASME Vessel Head Types</h2>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr><th className="px-4 py-3 text-left">Head Type</th><th className="px-4 py-3 text-left">Volume Formula</th><th className="px-4 py-3 text-left">Depth</th><th className="px-4 py-3 text-left">Notes</th></tr>
              </thead>
              <tbody className="bg-white">
                {headTypes.map((h, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="px-4 py-3 font-medium text-navy">{h.type}</td>
                    <td className="px-4 py-3 font-mono text-engineering-blue text-xs">{h.volumeFormula}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-xs">{h.depthFormula}</td>
                    <td className="px-4 py-3 text-muted-foreground">{h.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Calculator Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Vessel & Tank Calculators</h2>
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

        {/* Related Links */}
        <section>
          <h2 className="text-xl font-bold text-navy mb-4">Related Engineering References</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/pipe-flow-cluster"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pipe Flow Hub</Badge></Link>
            <Link href="/tools/pump-efficiency-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pump Efficiency</Badge></Link>
            <Link href="/tools/pipe-weight-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pipe Weight</Badge></Link>
            <Link href="/materials/stainless-steel-304"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">SS304 Properties</Badge></Link>
            <Link href="/materials/carbon-steel"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Carbon Steel</Badge></Link>
            <Link href="/guides/pipe-stress-analysis-basics"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Pipe Stress Analysis</Badge></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
