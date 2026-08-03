"use client";

import { useMemo } from "react";

/**
 * SVG pump performance curve with animated impeller.
 * Shows H-Q curve, efficiency curve, and operating point.
 * Premium engineering-drawing style. Zero dependency.
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";
const SLATE = "#64748B";
const AMBER = "#F59E0B";

export default function PumpPerformanceCurve({ values, result }: Props) {
  const v = values as Record<string, number>;
  const flow = v.flow || v.flowRate || v.Q || 50;
  const head = v.head || v.H || 30;
  const efficiency = v.efficiency || v.eta || result?.value || 75;

  // Generate H-Q curve (parabolic: H = H0 - k*Q^2)
  const curveData = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const H0 = head * 1.3; // shutoff head
    const Qmax = flow * 1.8;
    for (let i = 0; i <= 40; i++) {
      const Q = (Qmax * i) / 40;
      const H = H0 - (H0 - head * 0.3) * Math.pow(Q / Qmax, 2);
      points.push({ x: Q, y: H });
    }
    return points;
  }, [flow, head]);

  // Efficiency curve (parabolic peak at ~BEP)
  const effData = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const Qmax = flow * 1.8;
    const bep = flow * 0.9;
    for (let i = 0; i <= 40; i++) {
      const Q = (Qmax * i) / 40;
      const ratio = Q / bep;
      const eff = efficiency * Math.exp(-Math.pow(ratio - 1, 2) * 1.5);
      points.push({ x: Q, y: Math.max(0, eff) });
    }
    return points;
  }, [flow, efficiency]);

  const W = 480;
  const H = 320;
  const margin = { top: 30, right: 60, bottom: 50, left: 60 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const Qmax = flow * 1.8;
  const Hmax = head * 1.4;
  const EffMax = 100;

  const toX = (q: number) => margin.left + (q / Qmax) * plotW;
  const toYH = (h: number) => margin.top + plotH - (h / Hmax) * plotH;
  const toYEff = (e: number) => margin.top + plotH - (e / EffMax) * plotH;

  const hqPath = curveData.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.x)} ${toYH(p.y)}`).join(" ");
  const effPath = effData.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.x)} ${toYEff(p.y)}`).join(" ");

  // Operating point
  const opX = toX(flow);
  const opYH = toYH(head);
  const opYEff = toYEff(efficiency);

  // Impeller rotation
  const impellerCx = W - 85;
  const impellerCy = 80;

  return (
    <div className="p-4 bg-light-bg">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Pump performance curve">
        <defs>
          <marker id="axis-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,4 L8,0 L8,8 Z" fill={SLATE} />
          </marker>
        </defs>

        {/* Plot area background */}
        <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" rx="4" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`gh${f}`} x1={margin.left} y1={margin.top + plotH * f} x2={margin.left + plotW} y2={margin.top + plotH * f} stroke="#F1F5F9" strokeWidth="1" />
        ))}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`gv${f}`} x1={margin.left + plotW * f} y1={margin.top} x2={margin.left + plotW * f} y2={margin.top + plotH} stroke="#F1F5F9" strokeWidth="1" />
        ))}

        {/* H-Q curve */}
        <path d={hqPath} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
        <text x={margin.left + plotW - 5} y={toYH(head * 1.2)} fontSize="10" fill={BLUE} fontFamily="monospace" textAnchor="end">H-Q Curve</text>

        {/* Efficiency curve */}
        <path d={effPath} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 3" />
        <text x={margin.left + plotW - 5} y={toYEff(efficiency * 0.6)} fontSize="10" fill={GREEN} fontFamily="monospace" textAnchor="end">η Curve</text>

        {/* Operating point */}
        <line x1={opX} y1={margin.top} x2={opX} y2={margin.top + plotH} stroke={CYAN} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <circle cx={opX} cy={opYH} r="5" fill={CYAN} stroke={NAVY} strokeWidth="1.5" />
        <circle cx={opX} cy={opYEff} r="4" fill={GREEN} stroke={NAVY} strokeWidth="1" />

        {/* BEP marker */}
        <text x={opX} y={margin.top - 8} fontSize="9" fill={NAVY} fontFamily="monospace" textAnchor="middle">Operating Point</text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke={SLATE} strokeWidth="1.5" markerEnd="url(#axis-arrow)" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left} y2={margin.top} stroke={SLATE} strokeWidth="1.5" markerEnd="url(#axis-arrow)" />

        {/* Axis labels */}
        <text x={margin.left + plotW / 2} y={H - 12} fontSize="11" fill={NAVY} fontFamily="monospace" textAnchor="middle">Flow Rate Q (m³/h)</text>
        <text x={20} y={margin.top + plotH / 2} fontSize="11" fill={NAVY} fontFamily="monospace" textAnchor="middle" transform={`rotate(-90 20 ${margin.top + plotH / 2})`}>Head H (m) / η (%)</text>

        {/* Impeller animation (top-right) */}
        <g style={{ transformOrigin: `${impellerCx}px ${impellerCy}px` }} className="ieh-spin">
          <circle cx={impellerCx} cy={impellerCy} r="28" fill="none" stroke={NAVY} strokeWidth="2" />
          <circle cx={impellerCx} cy={impellerCy} r="6" fill={BLUE} />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = impellerCx + Math.cos(rad) * 6;
            const y1 = impellerCy + Math.sin(rad) * 6;
            const x2 = impellerCx + Math.cos(rad + 0.3) * 24;
            const y2 = impellerCy + Math.sin(rad + 0.3) * 24;
            const cx = impellerCx + Math.cos(rad + 0.15) * 16;
            const cy = impellerCy + Math.sin(rad + 0.15) * 16;
            return (
              <path key={angle} d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
            );
          })}
        </g>
        <text x={impellerCx} y={impellerCy + 42} fontSize="9" fill={SLATE} fontFamily="monospace" textAnchor="middle">Impeller</text>

        {/* Result badge */}
        {result && (
          <g>
            <rect x={margin.left + 8} y={margin.top + 8} width="140" height="36" rx="6" fill={GREEN} opacity="0.1" stroke={GREEN} strokeWidth="1.5" />
            <text x={margin.left + 16} y={margin.top + 22} fontSize="9" fill={SLATE} fontFamily="monospace">RESULT</text>
            <text x={margin.left + 16} y={margin.top + 36} fontSize="13" fontWeight="700" fill={GREEN} fontFamily="monospace">{result.formatted}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
