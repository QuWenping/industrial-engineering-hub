"use client";

/**
 * Renders the exact statistic value in both server-rendered HTML (crawlers
 * and no-JS clients) and the hydrated client. A purely client-side animated
 * counter starting at 0 produced "0+" in the static HTML, which contradicted
 * the advertised 54+/50+ tool counts during AdSense review.
 */
export function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  return (
    <span>
      {target}
      {suffix}
    </span>
  );
}

