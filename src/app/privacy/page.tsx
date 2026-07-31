import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Industrial Engineering Studio privacy policy — how we handle data, cookies, Google AdSense & DoubleClick, analytics, and your consent.",
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
              Industrial Engineering Studio collects minimal personal information to provide and improve our
              services. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usage data through Google Analytics (anonymized IP addresses, pages visited, time on site) — only after you accept cookies</li>
              <li>Information you voluntarily provide when contacting us via email</li>
              <li>Non-personal browser and device information for performance optimization</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">2. Cookies & Consent</h2>
            <p>
              We use two kinds of cookies. <strong>Necessary cookies</strong> keep core site features working
              and are always on. <strong>Optional cookies</strong> (analytics and advertising) only load after
              you give consent through the cookie banner shown on your first visit. You can choose
              <strong> Accept all</strong> or <strong>Reject</strong> (essential only). To change or withdraw your
              consent at any time, use the <em>“Cookie settings”</em> link in the footer — this reopens the
              banner so you can update your choice.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">3. Google AdSense &amp; DoubleClick</h2>
            <p>
              If you accept advertising cookies, this website may display ads served by{" "}
              <strong>Google AdSense</strong>. Google and its partners, including the DoubleClick ad-serving
              platform, use cookies to serve ads based on your prior visits to this site and other sites on
              the Internet. These advertising cookies may be used to deliver{" "}
              <strong>personalized ads</strong> based on your interests.
            </p>
            <p>
              You can opt out of personalized advertising and review Google’s ad settings at{" "}
              <a href="https://www.google.com/settings/ads" className="text-engineering-blue hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              , or learn how Google uses cookies for advertising at{" "}
              <a href="https://policies.google.com/technologies/ads" className="text-engineering-blue hover:underline" target="_blank" rel="noopener noreferrer">
                Google’s advertising cookies policy
              </a>
              . Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits
              to our site and/or other sites on the Internet. Visitors in the EU/EEA, UK and similar regions
              receive non-personalized ads unless they have granted consent to personalized ads.
            </p>
            <p>
              If you <strong>Reject</strong> cookies or do not consent, no advertising cookies are set and AdSense
              scripts do not load.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">4. Google Analytics</h2>
            <p>
              With your consent (“Accept all”), we use Google Analytics to understand how visitors use our
              site. Google Analytics collects anonymized information such as pages visited, time spent, and
              general geographic region. This data helps us improve content quality and user experience. No
              personally identifiable information is shared with Google. If you reject cookies, Google
              Analytics does not load.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect any information collected. Our site is
              served over HTTPS, and we do not store sensitive personal data such as credit card
              information or passwords.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">6. Third-Party Links</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for the privacy
              practices or content of those sites. We encourage users to review the privacy policies of
              any external sites they visit.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">7. Your Rights</h2>
            <p>
              Depending on your jurisdiction (e.g. GDPR, CCPA), you may have rights to access, correct, or
              delete personal data we hold about you, and to object to or restrict certain processing. To
              exercise these rights, contact us using the email below. Withdrawing consent does not affect
              the lawfulness of processing based on consent prior to its withdrawal.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">8. Children’s Privacy</h2>
            <p>
              Industrial Engineering Studio is intended for use by engineering professionals and does not
              knowingly collect information from children under 13. Our content is technical and targeted
              at adult professionals in the engineering field.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page
              with an updated date. If we materially change how we use cookies, the consent banner version
              is bumped so you will be re-asked for consent on your next visit.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold text-navy">10. Contact</h2>
            <p>
              For questions about this privacy policy or to exercise your data rights, contact us at{" "}
              <a href="mailto:hello@industrialengineeringstudio.com" className="text-engineering-blue hover:underline">
                hello@industrialengineeringstudio.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
