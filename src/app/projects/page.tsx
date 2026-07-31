import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  ShoppingCart,
  HardHat,
  Database,
  CheckCircle2,
  Factory,
  Flame,
  Zap,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "How We Deliver Engineering Projects",
  description:
    "How Industrial Engineering Studio delivers industrial facility projects — from concept and FEED through detailed engineering, procurement support, construction supervision and digital handover.",
  path: "/projects",
});

const phases = [
  {
    icon: ClipboardList,
    title: "1. Concept & FEED",
    body: "Front-End Engineering Design: scope definition, technology selection, plot plans, equipment lists, CAPEX/footprint estimates, and feasibility screening against codes and site constraints. Output: a design basis and a Class 4/5 estimate that de-risk the investment decision.",
    deliverables: ["Design basis & process flow diagrams", "Plot plan & equipment layout", "Class 4/5 cost & schedule estimate", "Hazard identification (HAZID)"],
  },
  {
    icon: FileText,
    title: "2. Detailed Engineering",
    body: "Multi-discipline design across structural, MEP/MEP, process and digital. We produce coordinated, code-compliant deliverables with clash detection and a single source of truth, ready for tender and construction.",
    deliverables: ["Structural & foundation calculations", "MEP/MEP layouts & load schedules", "Piping & equipment isometrics", "BIM model (LOD 300–400)"],
  },
  {
    icon: ShoppingCart,
    title: "3. Procurement Support",
    body: "Technical specification of long-lead and engineered equipment, vendor technical bid evaluation, and drawing review. We translate the design into purchase-ready packages and clarify deviations before PO release.",
    deliverables: ["Equipment technical specifications", "Vendor bid evaluation (TBE)", "Material take-off (MTO)", "Drawing review & ITP"],
  },
  {
    icon: HardHat,
    title: "4. Construction Supervision",
    body: "On-site support during installation: RFIs and field design changes, inspection and test plans, snagging and commissioning readiness. We close the loop between the model and what is actually built.",
    deliverables: ["RFI & field change management", "Inspection & test plans (ITP)", "Snag list & close-out", "Commissioning handover packs"],
  },
  {
    icon: Database,
    title: "5. Digital Handover",
    body: "A consolidated digital asset package: as-built BIM, equipment data, O&M manuals and indexed engineering data — structured for facility management, future revamps and a future AI/digital-twin layer.",
    deliverables: ["As-built BIM model", "Tagged equipment data register", "O&M manuals (indexed)", "Engineering data export"],
  },
];

const projectTypes = [
  { icon: Factory, title: "Battery Manufacturing", href: "/industries/battery-factory", text: "Gigafactory and cell-line layout, dry-room HVAC, utility and fire-safety integration." },
  { icon: Flame, title: "Chemical & Petrochemical", href: "/industries/chemical-plant", text: "Process buildings, piping and pressure-safety design to API/ASME practice." },
  { icon: Zap, title: "Energy & Power", href: "/industries/energy-facility", text: "Energy facility structural and MEP engineering, auxiliaries and balance-of-plant." },
  { icon: Cpu, title: "Smart Factory", href: "/industries/smart-factory", text: "Digital-twin-ready layouts, data infrastructure and retrofit modernization." },
];

const standards = [
  "ASCE 7", "AISC 360", "ACI 318", "ASME B31.3", "API 520/521", "NFPA", "ISO 12944",
  "ASHRAE", "IEC 61511", "BIM LOD 300–400",
];

export default function ProjectsPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20">
            How We Deliver
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">
            How We Deliver Engineering Projects
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            A consistent, phase-gated delivery model for industrial facilities — from concept and FEED
            through detailed engineering, procurement support, construction supervision and digital
            handover. The same methodology is applied across battery, chemical, energy and smart-factory
            projects.
          </p>
        </div>
      </section>

      {/* Delivery phases */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">Delivery Phases</h2>
        <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Each phase has defined deliverables and a clear gate before the next. This keeps scope, cost and
          risk visible to the owner at every step.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {phases.map((p) => (
            <Card key={p.title} className="border-slate-200 bg-white">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy mb-2">
                  <p.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.body}</p>
                <ul className="space-y-1.5">
                  {p.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-engineering-blue" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Project types */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">Project Types We Deliver</h2>
          <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            The delivery model above is tailored to the facility type. Detailed, named case studies are
            added as projects clear confidentiality; the categories below describe the work we cover today.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projectTypes.map((t) => (
              <Link key={t.title} href={t.href} className="group">
                <Card className="h-full border-slate-200 bg-light-bg/40 transition-colors hover:border-engineering-blue/40">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy mb-3">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-navy mb-1">{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Standards & tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">Standards &amp; Methods We Apply</h2>
        <p className="text-muted-foreground max-w-2xl mb-6 leading-relaxed">
          Design is governed by recognised international standards. Our free{" "}
          <Link href="/tools" className="text-engineering-blue hover:underline">engineering calculators</Link>{" "}
          implement many of these for preliminary sizing and verification.
        </p>
        <div className="flex flex-wrap gap-2">
          {standards.map((s) => (
            <Badge key={s} variant="outline" className="border-slate-300 text-slate-700">{s}</Badge>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          For the calculation methodology behind each tool, see our{" "}
          <Link href="/methodology" className="text-engineering-blue hover:underline">calculation methodology</Link>{" "}
          and <Link href="/data-sources" className="text-engineering-blue hover:underline">data sources</Link>.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Discuss your project</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Tell us about your facility scope, process requirements and standards. We will scope the right
            delivery phases and come back within one business day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-slate-100 transition-colors"
          >
            Request an assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
