import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Calculators",
  description: "Browse 50+ professional engineering calculators — material weight, pipe flow, pump power, heat transfer, pressure drop, tank volume, and more.",
  path: "/tools",
});

const categories = [
  {
    name: "Material Engineering",
    slug: "material",
    description: "Steel, aluminum, copper weight and density calculators",
    count: 10,
  },
  {
    name: "Mechanical & Fluid",
    slug: "mechanical",
    description: "Pipe flow, pressure drop, pump sizing, fluid mechanics",
    count: 25,
  },
  {
    name: "Thermal Engineering",
    slug: "thermal",
    description: "Heat transfer, heat exchangers, thermal resistance",
    count: 5,
  },
  {
    name: "Storage & Vessels",
    slug: "storage",
    description: "Tank volume, cylinder volume, vessel capacity",
    count: 10,
  },
];

export default function ToolsPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Engineering Tools</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Engineering Calculators</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Professional, formula-tested engineering calculators for material, mechanical, chemical,
            and thermal engineering applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/tools/category/${cat.slug}`} className="block h-full">
              <Card className="h-full card-hover border-border/60 cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-engineering-blue/10 group-hover:bg-engineering-blue/15 transition-colors">
                      <Calculator className="h-6 w-6 text-engineering-blue" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-navy text-lg group-hover:text-engineering-blue transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{cat.count} calculators</Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-engineering-blue group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center py-12 text-muted-foreground text-sm">
          More calculators are being added weekly. Check back for updates.
        </div>
      </div>
    </div>
  );
}
