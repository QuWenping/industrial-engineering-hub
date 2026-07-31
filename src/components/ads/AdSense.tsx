"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * AdSense loader + manual ad unit. With Google Consent Mode v2 (see
 * ConsentBootstrap), the adsbygoogle.js script loads unconditionally so Google
 * can verify the code; ad cookies/personalization are denied by default and
 * granted only after the visitor accepts cookies (consent.ts pushConsentUpdate).
 */
export function AdSenseAutoAds({ client }: { client?: string }) {
  if (!client) return null;
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
 * Manual AdSense ad unit (for hand-placed slots). Usage:
 *   <AdSenseAd client="ca-pub-..." slot="1234567890" format="auto" />
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
  useEffect(() => {
    if (!client) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ignore */
    }
  }, [client]);

  if (!client) return null;
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
