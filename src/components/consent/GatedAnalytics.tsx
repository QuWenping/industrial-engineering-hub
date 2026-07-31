"use client";

import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Loads the Google Analytics (gtag.js) script unconditionally so Google can
 * DETECT the tag on the site. Tracking is gated by Google Consent Mode v2
 * (see ConsentBootstrap + consent.ts pushConsentUpdate): denied by default,
 * granted only after the visitor accepts cookies. This is Google's
 * recommended pattern for EEA/UK compliance and for tag-verification.
 */
export function GatedAnalytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
