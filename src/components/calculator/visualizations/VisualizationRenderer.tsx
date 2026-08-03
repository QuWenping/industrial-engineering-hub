"use client";

import { useState, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Eye } from "lucide-react";
import type { CalculatorVisualization, CalculationResult } from "@/lib/calculator/types";

// Lazy-load Three.js components (only loaded when needed)
const Beam3DVisualization = lazy(() => import("./Beam3DVisualization"));
const Tank3DVisualization = lazy(() => import("./Tank3DVisualization"));

// Zero-dependency components loaded directly
import SteelSectionDiagram from "./SteelSectionDiagram";
import PipeFlowCanvas from "./PipeFlowCanvas";
import ReynoldsFlowCanvas from "./ReynoldsFlowCanvas";
import PumpPerformanceCurve from "./PumpPerformanceCurve";
import HeatExchangerDiagram from "./HeatExchangerDiagram";

const componentMap: Record<string, React.ComponentType<any>> = {
  SteelSectionDiagram,
  PipeFlowCanvas,
  ReynoldsFlowCanvas,
  PumpPerformanceCurve,
  HeatExchangerDiagram,
  Beam3DVisualization,
  Tank3DVisualization,
};

interface Props {
  visualization: CalculatorVisualization;
  result: CalculationResult | null;
  values: Record<string, number | string>;
}

export function VisualizationRenderer({ visualization, result, values }: Props) {
  const [expanded, setExpanded] = useState(false);

  const Component = componentMap[visualization.component];
  if (!Component) return null;

  return (
    <Card className="border-engineering-blue/20 bg-gradient-to-br from-navy/[0.02] to-ai-glow/[0.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-engineering-blue" />
          <CardTitle className="text-navy text-sm">
            {visualization.title || "Interactive Visualization"}
          </CardTitle>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <CardContent className="pt-0">
          <div className="rounded-lg bg-white border border-border/40 overflow-hidden">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading 3D model…</div>}>
              <Component values={values} result={result} />
            </Suspense>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
