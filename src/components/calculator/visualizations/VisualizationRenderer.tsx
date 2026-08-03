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
  const [expanded, setExpanded] = useState(true);

  const Component = componentMap[visualization.component];
  if (!Component) return null;

  return (
    <Card className="border-engineering-blue/20 bg-gradient-to-br from-navy/[0.02] to-ai-glow/[0.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-engineering-blue/[0.03] transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-engineering-blue/10">
            <Eye className="h-4 w-4 text-engineering-blue" />
          </div>
          <div>
            <CardTitle className="text-navy text-sm font-semibold">
              {visualization.title || "Interactive Visualization"}
            </CardTitle>
            <span className="text-xs text-engineering-blue font-mono flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              Live Interactive Model
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
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


