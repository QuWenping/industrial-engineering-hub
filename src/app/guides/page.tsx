import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Engineering Guides",
  description: "In-depth engineering guides on pump selection, pressure drop calculation, pipe sizing, material properties, and industrial engineering best practices.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <Badge variant="outline" className="mb-4">Engineering Knowledge</Badge>
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-12 w-12 text-engineering-blue" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Engineering Guides</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          In-depth engineering guides covering pump selection, pressure drop, pipe sizing, material
          selection, and industrial engineering fundamentals. Content is being published weekly.
        </p>
        <p className="text-sm text-muted-foreground">
          Guides are coming soon. Check back as we build out the knowledge library.
        </p>
      </div>
    </div>
  );
}
