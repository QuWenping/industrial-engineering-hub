"use client";

import Script from "next/script";

/**
 * Google Consent Mode v2 bootstrap. Runs BEFORE the gtag.js / AdSense scripts
 * (strategy: beforeInteractive) so that:
 *   1. The scripts are present in the page (Google can detect the code), and
 *   2. Tracking is DENIED by default — no ad/analytics cookies until the
 *      visitor accepts via CookieConsent (which pushes a 'granted' update).
 *
 * This keeps the site GDPR/EEA-compliant while still letting Google verify
 * the tag. See src/lib/consent.ts -> pushConsentUpdate.
 */
const CONSENT_DEFAULT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
`;

export function ConsentBootstrap() {
  return (
    <Script
      id="consent-mode-defaults"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT }}
    />
  );
}
