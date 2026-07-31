import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Disclaimer — Engineering Calculations",
  description: "Important disclaimer: engineering calculations on this site are for reference only and must be verified by qualified engineers.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Badge variant="outline" className="mb-4">Important</Badge>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Engineering Disclaimer</h1>
        </div>

        <div className="bg-white rounded-xl border border-border/60 p-8 space-y-6 text-muted-foreground leading-relaxed">
          <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
            <p className="font-semibold text-navy text-sm">
              ⚠️ All calculators and engineering information on this site are for educational and
              reference purposes ONLY. They must NOT be used as the sole basis for any engineering
              design, construction, or operational decisions without independent verification by a
              licensed professional engineer.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Calculation Accuracy</h2>
            <p>
              While we make every effort to ensure formulas and calculations are accurate based on
              established engineering principles and standards (ASTM, ASME, API, ISO), calculators may
              contain errors, may use simplified models, or may not account for all conditions relevant
              to your specific application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">No Professional Engineering Relationship</h2>
            <p>
              Use of this site does not create a professional engineer-client relationship. The
              information provided does not constitute professional engineering advice. For projects
              involving public safety, structural integrity, pressure systems, or any regulated
              engineering work, consult a licensed professional engineer in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">User Responsibility</h2>
            <p>
              You are solely responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Verifying all calculation results independently</li>
              <li>Ensuring designs comply with applicable codes, standards, and regulations</li>
              <li>Applying appropriate safety factors for your specific application</li>
              <li>Consulting qualified professionals for critical engineering decisions</li>
              <li>Understanding the limitations and assumptions of each calculator</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">No Warranty</h2>
            <p>
              Calculators and content are provided "as is" without warranty of any kind, either express
              or implied. We do not warrant that calculators will be error-free, uninterrupted, or
              suitable for any particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Reporting Errors</h2>
            <p>
              If you find a calculation error or inaccuracy, please report it to{" "}
              <a href="mailto:hello@industrialengineeringstudio.com" className="text-engineering-blue hover:underline">
                hello@industrialengineeringstudio.com
              </a>. We take accuracy seriously and will investigate and correct verified errors promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
