"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronDown, Eye } from "lucide-react";
import type { CalculatorVisualization, CalculationResult } from "@/lib/calculator/types";

// Three.js components: ssr:false to prevent SSR/SSG crashes
const Beam3DVisualization = dynamic(() => import("./Beam3DVisualization"), { ssr: false });
const Tank3DVisualization = dynamic(() => import("./Tank3DVisualization"), { ssr: false });

// Zero-dependency components loaded directly (SSR-safe)
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

  const is3D = visualization.type === "three-beam" || visualization.type === "three-tank";

  return (
    <Card className="border-engineering-blue/30 bg-gradient-to-br from-navy/[0.03] via-white to-ai-glow/[0.03] shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-engineering-blue/[0.03] transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-engineering-blue to-ai-glow/60 shadow-sm">
            <Eye className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-navy text-sm font-bold tracking-tight">
              {visualization.title || "Interactive Visualization"}
            </CardTitle>
            <span className="text-xs text-engineering-blue font-mono flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              {is3D ? "3D Interactive Model" : "Live Interactive Diagram"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <CardContent className="pt-0 pb-4">
          <div className="rounded-xl bg-white border border-border/40 overflow-hidden shadow-inner">
            <Suspense fallback={
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-engineering-blue/30 border-t-engineering-blue rounded-full animate-spin" />
                <span className="text-sm">Loading {is3D ? "3D model" : "visualization"}…</span>
              </div>
            }>
              <Component values={values} result={result} />
            </Suspense>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
