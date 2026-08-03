"use client";

export default function Beam3DVisualization({ values, result }: {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}) {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground">
      3D beam deflection model — Sprint 3
    </div>
  );
}
