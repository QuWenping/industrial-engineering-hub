import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Industrial Engineering Hub privacy policy — how we handle data, cookies, Google AdSense, and analytics.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-navy">1. Information We Collect</h2>
            <p>
              Industrial Engineering Hub collects minimal personal information to provide and improve our
              services. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usage data through Google Analytics (anonymized IP addresses, pages visited, time on site)</li>
              <li>Information you voluntarily provide when contacting us via email</li>
              <li>Non-personal browser and device information for performance optimization</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">2. Google AdSense & Cookies</h2>
            <p>
              This website uses Google AdSense to display advertisements. Google uses cookies to serve ads
              based on your visit to this site and other sites on the Internet. You may opt out of
              personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-engineering-blue hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>.
            </p>
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior
              visits. Advertising cookies enable Google and its partners to serve ads based on your visit
              to our site and/or other sites on the Internet.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">3. Google Analytics</h2>
            <p>
              We use Google Analytics to understand how visitors use our site. Google Analytics collects
              anonymized information such as pages visited, time spent, and general geographic region.
              This data helps us improve content quality and user experience. No personally identifiable
              information is shared with Google.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect any information collected. Our site is
              served over HTTPS, and we do not store sensitive personal data such as credit card
              information or passwords.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">5. Third-Party Links</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for the privacy
              practices or content of those sites. We encourage users to review the privacy policies of
              any external sites they visit.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">6. Children's Privacy</h2>
            <p>
              Industrial Engineering Hub is intended for use by engineering professionals and does not
              knowingly collect information from children under 13. Our content is technical and targeted
              at adult professionals in the engineering field.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page
              with an updated date. Continued use of the site constitutes acceptance of any changes.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">8. Contact</h2>
            <p>
              For questions about this privacy policy, contact us at{" "}
              <a href="mailto:support@industrialengineeringhub.com" className="text-engineering-blue hover:underline">
                support@industrialengineeringhub.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
