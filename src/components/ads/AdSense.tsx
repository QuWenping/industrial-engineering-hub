"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, hasAdsConsent } from "@/lib/consent";

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function useAdsConsent() {
  const [ok, setOk] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setOk(hasAdsConsent());
    const f = () => setOk(hasAdsConsent());
    window.addEventListener(CONSENT_EVENT, f);
    return () => window.removeEventListener(CONSENT_EVENT, f);
  }, []);
  return mounted && ok;
}

/**
 * AdSense "Auto ads" loader. Injects the adsbygoogle.js script ONLY after the
 * visitor accepts "all" cookies. With Auto ads enabled in the AdSense dashboard,
 * Google places ad units automatically — no per-slot markup needed.
 */
export function AdSenseAutoAds({ client }: { client?: string }) {
  const ok = useAdsConsent();
  if (!client || !ok) return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
    />
  );
}

/**
 * Manual AdSense ad unit (for hand-placed slots). Gated by the same consent as
 * Auto ads. Usage: <AdSenseAd client="ca-pub-..." slot="1234567890" format="auto" />
 */
export function AdSenseAd({
  client,
  slot,
  format = "auto",
  style,
}: {
  client?: string;
  slot: string;
  format?: string;
  style?: React.CSSProperties;
}) {
  const ok = useAdsConsent();
  useEffect(() => {
    if (!client || !ok) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [client, ok]);

  if (!client || !ok) return null;
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
