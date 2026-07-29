import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Reference Data",
  description: "Engineering reference data — pipe schedules, material properties, flange ratings, and industry standard tables.",
  path: "/reference",
});

export default function ReferencePage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <Badge variant="outline" className="mb-4">Reference Data</Badge>
        <div className="flex items-center justify-center mb-4">
          <Database className="h-12 w-12 text-engineering-blue" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Engineering Reference</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          Reference tables and engineering data — pipe schedules, material properties, flange ratings,
          unit conversions, and industry standards. Coming soon.
        </p>
      </div>
    </div>
  );
}
