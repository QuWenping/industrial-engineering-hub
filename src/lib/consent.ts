// Lightweight cookie-consent state (GDPR-friendly). Stored in localStorage so
// it survives reloads; scripts that set cookies (analytics, AdSense) load only
// after the visitor chooses "Accept all".

export type ConsentChoice = "all" | "necessary";

export const CONSENT_KEY = "ieh-consent";
export const CONSENT_VERSION = 1; // bump to re-ask if the policy changes
export const CONSENT_EVENT = "ieh-consent-change";

function readRaw(): { value: ConsentChoice; v: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.value === "all" || parsed.value === "necessary")) {
      return { value: parsed.value, v: Number(parsed.v) || 0 };
    }
    return null;
  } catch {
    return null;
  }
}

/** Returns the visitor's consent, or null if they haven't decided yet. */
export function getConsent(): ConsentChoice | null {
  const r = readRaw();
  if (!r) return null;
  // Re-ask if the stored version is older than the current policy version.
  if (r.v < CONSENT_VERSION) return null;
  return r.value;
}

export function setConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ value: choice, v: CONSENT_VERSION, ts: Date.now() })
    );
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
  } catch {
    /* ignore quota errors */
  }
}

/** Analytics (Google Analytics) — needs "Accept all". */
export function hasAnalyticsConsent(): boolean {
  return getConsent() === "all";
}

/** Advertising (Google AdSense, DoubleClick) — needs "Accept all". */
export function hasAdsConsent(): boolean {
  return getConsent() === "all";
}
