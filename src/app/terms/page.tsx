import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service",
  description: "Industrial Engineering Studio terms of service — engineering calculation disclaimer, user responsibilities, and content usage terms.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-navy">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Industrial Engineering Studio, you accept and agree to these Terms of
              Service. If you do not agree to these terms, please do not use the site.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">2. Engineering Disclaimer</h2>
            <p>
              <strong className="text-navy">
                The calculators, formulas, and information on this site are provided for educational and
                reference purposes only. They are not a substitute for professional engineering judgment.
              </strong>
            </p>
            <p>
              All engineering calculations should be independently verified by a qualified professional
              engineer before use in design, construction, or operation of any system. Calculators may
              not account for all factors relevant to a specific application, including but not limited
              to safety factors, material degradation, environmental conditions, and code requirements.
            </p>
            <p>
              Industrial Engineering Studio does not guarantee the accuracy, completeness, or suitability of
              any calculation for any particular purpose. Users assume full responsibility for any
              decisions made based on information from this site.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use calculations with appropriate engineering judgment and verification</li>
              <li>Do not rely solely on this site for safety-critical or life-safety applications</li>
              <li>Consult applicable codes and standards (ASME, API, ASTM, etc.) for final design</li>
              <li>Report calculation errors or inaccuracies so they can be corrected</li>
              <li>Do not attempt to misuse, hack, or disrupt the site's functionality</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">4. Intellectual Property</h2>
            <p>
              Content on Industrial Engineering Studio, including calculators, articles, and reference data,
              is protected by copyright. Engineering formulas themselves are based on public engineering
              knowledge and industry standards. Users may reference calculations for personal and
              professional use but may not reproduce or redistribute site content without permission.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">5. Limitation of Liability</h2>
            <p>
              Industrial Engineering Studio and its contributors shall not be liable for any direct,
              indirect, incidental, consequential, or punitive damages arising from the use of or
              inability to use this site, including but not limited to damages from engineering
              decisions made using calculated results.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this
              page. Continued use of the site after changes constitutes acceptance.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">7. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:hello@industrialengineeringstudio.com" className="text-engineering-blue hover:underline">
                hello@industrialengineeringstudio.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
