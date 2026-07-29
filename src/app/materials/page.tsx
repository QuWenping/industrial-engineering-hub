import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Weight } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Material Database",
  description: "Engineering material database — carbon steel, stainless steel, aluminum, copper, and other industrial material properties.",
  path: "/materials",
});

export default function MaterialsPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <Badge variant="outline" className="mb-4">Material Database</Badge>
        <div className="flex items-center justify-center mb-4">
          <Weight className="h-12 w-12 text-engineering-blue" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Material Database</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          Properties for carbon steel, stainless steel, aluminum, copper, and other engineering
          materials. Density, yield strength, thermal properties, and applications. Coming soon.
        </p>
      </div>
    </div>
  );
}
