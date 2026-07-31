import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Beaker, BookOpen, AlertTriangle } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Calculation Methodology",
  description:
    "How Industrial Engineering Studio calculators work: SI base-unit conversion, formula evaluation with mathjs, validation tolerance, and engineering assumptions.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Engineering Standards</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Calculation Methodology</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This page documents exactly how our calculators work internally, what assumptions they make,
            and where their formulas come from.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10">
                  <Calculator className="h-5 w-5 text-engineering-blue" />
                </div>
                <CardTitle className="text-navy text-xl">Engine Architecture</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All 53 calculators on this site share a single JSON-driven calculation engine.
                When you enter values, the engine performs the following steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-navy">Input parsing</strong> — numeric inputs are validated against min/max/required rules;
                  select inputs are mapped to their numeric values; material selectors pull density from the materials database.
                </li>
                <li>
                  <strong className="text-navy">SI conversion</strong> — every input is automatically converted to its SI base unit
                  (meters, kilograms, seconds, Pascals, Kelvin, Watts). This ensures formulas always operate in a consistent unit system.
                </li>
                <li>
                  <strong className="text-navy">Formula evaluation</strong> — the formula expression is evaluated with{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">mathjs</code>.
                  Formulas are written exactly as they appear in standard engineering references, so they are easy to verify.
                </li>
                <li>
                  <strong className="text-navy">Output formatting</strong> — the result is converted from SI to the display unit specified in the calculator
                  configuration and formatted to the configured precision (decimal places and optional prefix like &ldquo;k&rdquo; for thousands).
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10">
                  <Beaker className="h-5 w-5 text-engineering-blue" />
                </div>
                <CardTitle className="text-navy text-xl">Validation & Testing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every calculator includes at least one test case with known inputs and an expected output taken from a published
                engineering reference (textbook worked example, standard example problem, or manufacturer data). The engine
                verifies that computed results match expected values within 0.1% tolerance.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For example, the Pressure Drop Calculator is validated against worked examples in Crane Technical Paper 410,
                and the Pump Power Calculator against examples in the Cameron Hydraulic Data Book.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground border border-border/60">
                <strong className="text-navy block mb-1">Tolerance policy:</strong>
                We use 0.1% numerical tolerance to account for differences in friction factor correlations,
                interpolation in standard tables, and floating-point arithmetic. Calculators with empirical
                correlations (e.g., Hazen-Williams) may show larger deviations and document this explicitly.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10">
                  <BookOpen className="h-5 w-5 text-engineering-blue" />
                </div>
                <CardTitle className="text-navy text-xl">Formula Sources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Calculators implement formulas from the following primary sources:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                <li><strong className="text-navy">Fluid flow</strong> — Darcy-Weisbach equation; Crane TP-410; Moody friction factor (Colebrook-White approximation)</li>
                <li><strong className="text-navy">Pump hydraulics</strong> — affinity laws; NPSH per Hydraulic Institute standards</li>
                <li><strong className="text-navy">Heat transfer</strong> — LMTD method; Fourier&rsquo;s law; thermal resistance networks</li>
                <li><strong className="text-navy">Pressure vessels</strong> — ASME BPVC Section VIII Div. 1 thin-cylinder formulas (preliminary design only)</li>
                <li><strong className="text-navy">Material properties</strong> — ASM International materials data; MatWeb; manufacturer data sheets</li>
                <li><strong className="text-navy">Structural/mechanical</strong> — Shigley&rsquo;s Mechanical Engineering Design; bolt torque per ISO 898-1</li>
                <li><strong className="text-navy">Tank volumes</strong> — Standard geometric formulas for cylinders, cones, spheres, ellipsoids</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                See <a href="/data-sources" className="text-engineering-blue hover:underline">Data Sources & References</a> for a complete list of standards and references.
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning/30 bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <CardTitle className="text-navy text-xl">Engineering Disclaimer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Calculators on this site provide <strong className="text-navy">preliminary engineering estimates</strong> for educational
                and reference purposes. They are not a substitute for professional engineering judgment, stamped design calculations,
                or certification by a licensed professional engineer. Results must be independently verified before use in any
                safety-critical application, including but not limited to pressure vessel design, structural loading, piping system design,
                or any application where failure could cause injury, death, or property damage.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Material properties are typical values at 20°C unless otherwise stated; actual properties vary by grade,
                manufacturing process, temperature, and supplier. Always confirm design values against the specific material
                certification and applicable code requirements.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-sm text-muted-foreground text-center">
          Last updated: July 2026
        </div>
      </div>
    </div>
  );
}
