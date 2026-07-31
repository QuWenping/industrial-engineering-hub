"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSENT_EVENT, hasAnalyticsConsent } from "@/lib/consent";

/**
 * Loads Google Analytics only after the visitor accepts "all" cookies.
 * Returns null until consent is granted, so no GA script/cookies are added
 * for visitors who reject or haven't decided (GDPR-safe).
 */
export function GatedAnalytics({ gaId }: { gaId?: string }) {
  const [allowed, setAllowed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAllowed(hasAnalyticsConsent());
    const onChange = () => setAllowed(hasAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!mounted || !gaId || !allowed) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
