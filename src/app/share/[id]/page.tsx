import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calculator } from "lucide-react";
import { constructMetadata, BASE_URL } from "@/components/seo/SEO";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// noindex — share pages should not be indexed (thin content), but pass link
// equity to the original calculator page via the "Try your own" link.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

type Props = { params: Promise<{ id: string }> };

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const share = await prisma.shareResult.findUnique({ where: { id } });
  if (!share) notFound();

  // Increment views
  prisma.shareResult.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const inputs = share.inputData as Record<string, number | string>;
  const result = share.resultData as { value: number | string; unit: string; label: string };

  return (
    <div className="bg-light-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow flex items-center justify-center text-white font-bold text-sm">
              IES
            </div>
            <span className="text-lg font-semibold text-navy">Industrial Engineering Studio</span>
          </Link>
        </div>

        {/* Shared result card */}
        <Card className="border-engineering-blue/20 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{share.calculatorName}</Badge>
            </div>

            <div>
              <h1 className="text-sm font-medium text-slate-500 mb-1">Calculation Result</h1>
              <div className="text-4xl font-bold text-navy">
                {result.value} <span className="text-xl text-slate-500">{result.unit}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{result.label}</p>
            </div>

            {share.formula && (
              <div className="rounded-md bg-dark-bg/90 p-3 font-mono text-sm text-ai-glow text-center">
                {share.formula}
              </div>
            )}

            {/* Inputs used */}
            <div>
              <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-2">Inputs</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(inputs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm border-b border-slate-100 py-1">
                    <span className="text-slate-500 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium text-navy">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA — link to original calculator (passes link equity) */}
        <div className="rounded-xl border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-navy mb-2">Try your own calculation</h2>
          <p className="text-sm text-slate-600 mb-4">
            Use the {share.calculatorName} with your own parameters.
          </p>
          <Link
            href={"/tools/" + share.calculator}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
          >
            <Calculator className="h-4 w-4" />
            Open {share.calculatorName}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          Powered by{" "}
          <Link href="/" className="text-engineering-blue hover:underline">Industrial Engineering Studio</Link>
          {" — "}{" "}
          <Link href="/tools" className="text-engineering-blue hover:underline">54+ free engineering calculators</Link>
        </p>
      </div>
    </div>
  );
}
