import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { constructMetadata } from "@/components/seo/SEO";
import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { Calculator, ArrowRight, Box, Layers, Cog } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Metal Weight Calculator Hub — Steel, Aluminum, Copper & More",
  description: "Complete metal weight calculation hub. Calculate weight for steel plates, aluminum, copper, brass, stainless steel, round bars and pipes. Density tables and formulas for all metals.",
  path: "/tools/metal-weight-cluster",
  keywords: ["metal weight calculator", "steel weight", "aluminum weight", "copper weight", "metal density", "weight calculation"],
});

const calculators = [
  { slug: "steel-weight-calculator", icon: "box", label: "Steel" },
  { slug: "aluminum-weight-calculator", icon: "layers", label: "Aluminum" },
  { slug: "copper-weight-calculator", icon: "box", label: "Copper" },
  { slug: "stainless-steel-weight-calculator", icon: "box", label: "Stainless Steel" },
  { slug: "round-bar-weight-calculator", icon: "cog", label: "Round Bar" },
  { slug: "steel-plate-weight-calculator", icon: "layers", label: "Steel Plate" },
  { slug: "pipe-weight-calculator", icon: "cog", label: "Pipe" },
  { slug: "metal-weight-calculator", icon: "box", label: "All Metals" },
];

const iconMap: Record<string, typeof Calculator> = { box: Box, layers: Layers, cog: Cog };

const densityTable = [
  { material: "Carbon Steel", density: "7,850 kg/m3", note: "Most common structural steel (A36, Q235, S275)" },
  { material: "Stainless Steel 304", density: "7,930 kg/m3", note: "Austenitic, food grade, general purpose" },
  { material: "Stainless Steel 316", density: "7,990 kg/m3", note: "Marine grade, better corrosion resistance" },
  { material: "Aluminum 6061-T6", density: "2,700 kg/m3", note: "1/3 weight of steel, excellent strength-to-weight" },
  { material: "Copper", density: "8,960 kg/m3", note: "Heaviest common engineering metal" },
  { material: "Brass (C360)", density: "8,500 kg/m3", note: "Machinable brass, decorative + electrical" },
  { material: "Titanium Grade 5", density: "4,430 kg/m3", note: "Aerospace, between aluminum and steel" },
  { material: "Zinc", density: "7,140 kg/m3", note: "Galvanizing, die casting" },
];

export default function MetalWeightClusterPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Metal Weight Calculation Hub</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Metal Weight Calculator Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calculate the weight of any metal section — steel, aluminum, copper, brass and more.
            Use our density reference table and specialized calculators for accurate fabrication and cost estimation.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Metal Density Reference Table</h2>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr><th className="px-4 py-3 text-left font-semibold">Material</th><th className="px-4 py-3 text-left font-semibold">Density</th><th className="px-4 py-3 text-left font-semibold">Notes</th></tr>
              </thead>
              <tbody className="bg-white">
                {densityTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="px-4 py-3 font-medium text-navy">{row.material}</td>
                    <td className="px-4 py-3 font-mono text-engineering-blue">{row.density}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Weight Calculators by Metal Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-4">Universal Metal Weight Formula</h2>
          <div className="rounded-lg bg-navy p-6 text-center">
            <p className="text-ai-glow font-mono text-lg mb-3">Weight (kg) = Volume (m3) x Density (kg/m3)</p>
            <p className="text-muted-foreground text-sm">For plates: W = L x W x T x r | For round bars: W = pi x (D/2)^2 x L x r | For pipes: W = pi x (OD^2 - ID^2)/4 x L x r</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-4">Related References</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/materials/aluminum"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Aluminum Properties</Badge></Link>
            <Link href="/materials/copper"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Copper Properties</Badge></Link>
            <Link href="/materials/brass"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Brass Properties</Badge></Link>
            <Link href="/tools/material-volume-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Material Volume Calculator</Badge></Link>
            <Link href="/tools/density-calculator"><Badge variant="outline" className="hover:bg-engineering-blue/5 cursor-pointer">Density Calculator</Badge></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

