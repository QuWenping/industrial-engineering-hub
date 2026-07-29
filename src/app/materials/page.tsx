import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Weight, ChevronRight } from "lucide-react";
import { getAllMaterials } from "@/lib/calculator/materials";
import { getAllDocMeta } from "@/lib/mdx";

export const metadata: Metadata = constructMetadata({
  title: "Material Database",
  description: "Engineering material database — carbon steel, stainless steel, aluminum, copper, water, and other industrial material properties including density, strength, and thermal conductivity.",
  path: "/materials",
});

export default function MaterialsPage() {
  const materials = getAllMaterials();
  const mdxSlugs = new Set(getAllDocMeta("materials", "/materials").map(m => m.slug));

  // Group by category
  const categories = new Map<string, typeof materials>();
  for (const m of materials) {
    const cat = m.category || "other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(m);
  }

  const categoryLabels: Record<string, string> = {
    metal: "Metals & Alloys",
    construction: "Construction Materials",
    fluid: "Fluids",
    gas: "Gases",
    polymer: "Polymers",
    ceramic: "Ceramics & Glass",
    wood: "Wood",
  };

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Engineering Reference</Badge>
          <div className="flex items-center justify-center mb-4">
            <Weight className="h-12 w-12 text-engineering-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">Material Database</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Density, strength, thermal properties, and engineering applications for {materials.length} industrial materials.
            Click a material for detailed property data.
          </p>
        </div>

        <div className="space-y-10">
          {Array.from(categories.entries()).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-xl font-bold text-navy mb-4 border-b border-border/60 pb-2">
                {categoryLabels[cat] || cat} <span className="text-sm font-normal text-muted-foreground ml-2">({items.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((m) => {
                  const hasDetail = mdxSlugs.has(m.id);
                  return (
                    <Card key={m.id} className="border-border/60 h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-navy text-sm">{m.name}</h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">{m.density} kg/m³</Badge>
                        </div>
                        {m.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">{m.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {m.yieldStrength && (
                            <span className="text-muted-foreground">σ<sub>y</sub> = {m.yieldStrength} MPa</span>
                          )}
                          {m.thermalConductivity && (
                            <span className="text-muted-foreground">k = {m.thermalConductivity} W/m·K</span>
                          )}
                        </div>
                        {hasDetail ? (
                          <Link href={`/materials/${m.id}`} className="inline-flex items-center gap-1 text-xs text-engineering-blue hover:underline mt-2">
                            View details <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground mt-2 inline-block">Properties reference</span>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-engineering-blue/5 to-ai-glow/5 border-engineering-blue/20 inline-block max-w-2xl">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-navy mb-2">Weight Calculators</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Calculate weight of steel, stainless, aluminum, copper, and other materials with our online calculators.
              </p>
              <Link href="/tools" className="inline-flex items-center gap-2 bg-engineering-blue hover:bg-engineering-blue/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
                Browse Calculators <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
