"use client";

export default function HeatExchangerDiagram({ values, result }: {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}) {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground">
      Visualization coming soon — HeatExchangerDiagram
    </div>
  );
}
