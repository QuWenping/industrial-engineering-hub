import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, FlaskConical, Gauge } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Data Sources & References",
  description: "Standards, references, and data sources used by Industrial Engineering Hub calculators — ASTM, ASME, API, ISO, and engineering textbooks.",
  path: "/data-sources",
});

const standardBodies = [
  {
    icon: Gauge,
    name: "ASME (American Society of Mechanical Engineers)",
    description: "Boiler and Pressure Vessel Code, B31 piping standards, pump standards",
    standards: ["ASME B31.1 Power Piping", "ASME B31.3 Process Piping", "ASME BPVC Section VIII"],
    url: "https://www.asme.org",
  },
  {
    icon: FlaskConical,
    name: "ASTM International",
    description: "Material properties, testing standards, and material specifications",
    standards: ["ASTM A36 Carbon Steel", "ASTM A312 Stainless Steel Pipe", "ASTM material property tables"],
    url: "https://www.astm.org",
  },
  {
    icon: BookOpen,
    name: "API (American Petroleum Institute)",
    description: "Petroleum and chemical industry standards for pumps, valves, and equipment",
    standards: ["API 610 Centrifugal Pumps", "API 6D Pipeline Valves", "API 650 Storage Tanks"],
    url: "https://www.api.org",
  },
];

const dataCategories = [
  {
    title: "Material Properties",
    sources: [
      "ASM International Materials Handbook",
      "ASTM material specifications (A36, A53, A106, A312, etc.)",
      "Manufacturer data sheets and published material properties",
      "MatWeb material property database",
    ],
  },
  {
    title: "Fluid Mechanics & Hydraulics",
    sources: [
      "Crane Technical Paper 410 — Flow of Fluids",
      "Darcy-Weisbach equation (standard fluid mechanics)",
      "Moody friction factor charts and Colebrook-White equation",
      "Idelchik Handbook of Hydraulic Resistance",
    ],
  },
  {
    title: "Pump Engineering",
    sources: [
      "API 610 — Centrifugal Pumps for Petroleum, Chemical and Gas Industry",
      "Hydraulic Institute Standards",
      "Karassik, I.J. — Pump Handbook",
      "Gulich, J.F. — Centrifugal Pumps",
    ],
  },
  {
    title: "Heat Transfer",
    sources: [
      "Incropera & DeWitt — Fundamentals of Heat and Mass Transfer",
      "TEMA Standards for heat exchangers",
      "LMTD method (standard thermal design)",
      "Perry's Chemical Engineers' Handbook",
    ],
  },
  {
    title: "Structural & Mechanical",
    sources: [
      "AISC Steel Construction Manual",
      "Roark's Formulas for Stress and Strain",
      "Beer/Johnston — Mechanics of Materials",
      "Shigley's Mechanical Engineering Design",
    ],
  },
];

export default function DataSourcesPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Transparency</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Data Sources & References</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engineering calculators are only as good as their data sources. We document where our
            formulas, constants, and material properties come from.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-navy mb-6">Standards Organizations</h2>
        <div className="grid grid-cols-1 gap-4 mb-12">
          {standardBodies.map((body) => (
            <Card key={body.name} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5">
                      <body.icon className="h-5 w-5 text-navy" />
                    </div>
                    <CardTitle className="text-navy text-base">{body.name}</CardTitle>
                  </div>
                  <a
                    href={body.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-engineering-blue hover:underline text-sm flex items-center gap-1"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{body.description}</p>
                <div className="flex flex-wrap gap-2">
                  {body.standards.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-navy mb-6">Reference Sources by Category</h2>
        <div className="space-y-4 mb-12">
          {dataCategories.map((cat) => (
            <Card key={cat.title} className="border-border/60">
              <CardHeader>
                <CardTitle className="text-navy text-base">{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {cat.sources.map((source) => (
                    <li key={source} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-engineering-blue mt-1">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/60 bg-navy text-white">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-3">Corrections & Updates</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Standards are updated periodically, and we strive to keep our calculators current with
              the latest editions. If you find a reference that is out of date or a formula that does
              not match the current standard, please report it.
            </p>
            <a
              href="mailto:support@industrialengineeringhub.com"
              className="text-ai-glow hover:underline font-medium"
            >
              support@industrialengineeringhub.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
