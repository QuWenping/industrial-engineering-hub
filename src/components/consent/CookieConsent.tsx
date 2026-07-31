"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { CONSENT_EVENT, getConsent, setConsent } from "@/lib/consent";

/**
 * GDPR-friendly cookie consent banner. Shows until the visitor chooses, then
 * reloads the page so consent-gated scripts (analytics, AdSense) apply cleanly.
 * Reopens on the "ieh-open-consent" event (triggered by the footer "Cookie
 * settings" link) so users can change their mind at any time.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(getConsent() === null);

    const reopen = () => setVisible(true);
    const onChange = () => setVisible(getConsent() === null);
    window.addEventListener("ieh-open-consent", reopen);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => {
      window.removeEventListener("ieh-open-consent", reopen);
      window.removeEventListener(CONSENT_EVENT, onChange);
    };
  }, []);

  function choose(choice: "all" | "necessary") {
    setConsent(choice);
    setVisible(false);
    // Reload so gated scripts load/unload per the new consent state.
    window.location.reload();
  }

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:pb-6"
    >
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-2xl">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-ai-glow">
              <Cookie className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We use cookies to run essential site functions and, with your consent, analytics and
              personalized ads via Google AdSense &amp; DoubleClick. See our{" "}
              <Link href="/privacy" className="font-medium text-engineering-blue hover:underline">
                Privacy Policy
              </Link>
              . You can change your choice anytime via “Cookie settings” in the footer.
            </p>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <button
              onClick={() => choose("necessary")}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => choose("all")}
              className="rounded-md bg-engineering-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
