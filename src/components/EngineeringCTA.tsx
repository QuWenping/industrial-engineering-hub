"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, HardHat } from "lucide-react";

interface EngineeringCTAProps {
  toolName?: string;
}

/**
 * Marketing CTA placed under calculator results. Turns free-tool traffic into
 * potential leads by offering professional engineering assessment.
 * Destructive-safe: does not depend on calculator engine state.
 */
export function EngineeringCTA({ toolName }: EngineeringCTAProps) {
  const href = toolName
    ? `/contact?reason=engineering-assessment&tool=${encodeURIComponent(toolName)}`
    : "/contact";

  return (
    <section
      aria-label="Engineering consultation"
      className="mt-10 rounded-xl border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-engineering-blue/10 text-engineering-blue">
          <HardHat className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-navy">
            Need engineering design support?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {toolName
              ? `Our engineering team validates results like these with full multi-disciplinary design review. Beyond the ${toolName}, we deliver build-ready engineering.`
              : "Our engineering team provides full multi-disciplinary design review and build-ready engineering deliverables."}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Industrial Building Design",
              "Structural Optimization",
              "HVAC & MEP Engineering",
              "Chemical & Energy Projects",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-engineering-blue" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-navy/90 transition-colors"
          >
            Request Engineering Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
