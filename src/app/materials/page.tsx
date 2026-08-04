import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Weight, ChevronRight, Box, Fuel, Building2, Atom, Wind, Leaf } from "lucide-react";
import { getAllMaterials } from "@/lib/calculator/materials";
import { getAllDocMeta } from "@/lib/mdx";

export const metadata: Metadata = constructMetadata({
  title: "Material Engineering Hub — Density, Properties & Weight Data",
  description: "Engineering material reference hub — metals, fuels, construction materials, polymers and fluids. Density tables, mechanical properties, thermal data and weight calculators for industrial engineering.",
  path: "/materials",
  keywords: ["material properties", "density", "material engineering", "metal density", "steel properties", "aluminum density"],
});

const SUB_CLUSTERS = [
  { name: "Metals & Alloys", icon: "box", categories: ["metal"], description: "Steel, aluminum, copper, brass, titanium — density, strength, weight calculation" },
  { name: "Fuels & Fluids", icon: "fuel", categories: ["fluid", "gas"], description: "Diesel, gasoline, water, natural gas, crude oil — density, viscosity, properties" },
  { name: "Construction", icon: "building", categories: ["construction"], description: "Concrete, lightweight concrete — density, compressive strength" },
  { name: "Polymers", icon: "atom", categories: ["polymer"], description: "HDPE, PVC — density, chemical resistance" },
  { name: "Ceramics & Glass", icon: "box", categories: ["ceramic"], description: "Glass — thermal and mechanical properties" },
  { name: "Wood", icon: "leaf", categories: ["wood"], description: "Oak, pine — density, structural properties" },
];

const iconMap: Record<string, typeof Box> = { box: Box, fuel: Fuel, building: Building2, atom: Atom, wind: Wind, leaf: Leaf };

export default function MaterialsPage() {
  const materials = getAllMaterials();
  const mdxSlugs = new Set(getAllDocMeta("materials", "/materials").map(m => m.slug));

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Material Engineering Hub</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Material Engineering Reference Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Density, strength, thermal properties, and weight calculation data for {materials.length} industrial materials.
            Structured by engineering category for fast reference and design calculations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-navy">{materials.length}</p>
            <p className="text-xs text-muted-foreground">Materials</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-navy">{mdxSlugs.size}</p>
            <p className="text-xs text-muted-foreground">Detailed Guides</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-navy">6</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-navy">8+</p>
            <p className="text-xs text-muted-foreground">Weight Calculators</p>
          </CardContent></Card>
        </div>

        {/* Metal Weight Cluster Link */}
        <Card className="mb-10 border-engineering-blue/30 bg-gradient-to-br from-engineering-blue/5 to-ai-glow/5">
          <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-navy mb-1">Metal Weight Calculator Hub</h2>
              <p className="text-sm text-muted-foreground">Calculate weight for steel, aluminum, copper, brass, and more — with density tables and formulas.</p>
            </div>
            <Link href="/tools/metal-weight-cluster" className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors hover:bg-navy/90">
              Open Hub <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Sub-Clusters */}
        <div className="space-y-10">
          {SUB_CLUSTERS.map((cluster) => {
            const clusterMaterials = materials.filter((m) => cluster.categories.includes(m.category || "other"));
            if (clusterMaterials.length === 0) return null;
            const Icon = iconMap[cluster.icon] || Box;
            return (
              <section key={cluster.name}>
                <div className="flex items-center gap-3 mb-4 border-b border-border/60 pb-2">
                  <Icon className="h-5 w-5 text-engineering-blue" />
                  <h2 className="text-xl font-bold text-navy">{cluster.name}</h2>
                  <span className="text-sm text-muted-foreground">({clusterMaterials.length})</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{cluster.description}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {clusterMaterials.map((m) => {
                    const hasDetail = mdxSlugs.has(m.id);
                    return (
                      <Card key={m.id} className="border-border/60 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-navy text-sm">{m.name}</h3>
                            <Badge variant="outline" className="text-xs flex-shrink-0">{m.density} kg/m3</Badge>
                          </div>
                          {m.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">{m.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {m.yieldStrength && (
                              <span className="text-muted-foreground">Y: {m.yieldStrength} MPa</span>
                            )}
                            {m.thermalConductivity && (
                              <span className="text-muted-foreground">k: {m.thermalConductivity} W/m.K</span>
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
            );
          })}
        </div>

        {/* E-E-A-T Section */}
        <section className="mt-12 rounded-lg bg-navy/[0.03] border border-navy/10 p-6 space-y-3">
          <div className="text-sm text-muted-foreground">
            <strong className="text-navy">Engineering Disclaimer:</strong> Material property data is for reference
            and educational purposes. Verify all properties against material test reports (MTRs) and
            applicable ASTM/ASME standards for engineering design.
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border/40 pt-3">
            <div><span className="font-semibold text-navy">Reviewed by:</span> Industrial Engineering Team</div>
            <div><span className="font-semibold text-navy">References:</span> ASTM International, ASME B31, Perry's Chemical Engineers' Handbook, ASM Material Data</div>
            <div><span className="font-semibold text-navy">Methodology:</span> <Link href="/methodology" className="text-engineering-blue hover:underline">Engineering data methodology</Link></div>
          </div>
        </section>
      </div>
    </div>
  );
}
