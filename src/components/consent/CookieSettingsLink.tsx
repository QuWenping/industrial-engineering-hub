"use client";

/**
 * Footer "Cookie settings" control — reopens the consent banner so visitors
 * can change or withdraw consent at any time (GDPR requirement).
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ieh-open-consent"))}
      className="hover:text-ai-glow transition-colors"
    >
      Cookie settings
    </button>
  );
}
