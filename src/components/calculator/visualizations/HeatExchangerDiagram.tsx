"use client";

import { useMemo } from "react";

/**
 * SVG heat exchanger temperature field diagram.
 * Shows counter-flow heat exchanger with hot/cold fluid temperature profiles.
 * Premium engineering style with temperature gradient color coding.
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";
const RED = "#EF4444";
const AMBER = "#F59E0B";
const SLATE = "#64748B";

function tempColor(t: number, min: number, max: number): string {
  const r = (t - min) / (max - min);
  if (r < 0.25) return BLUE;
  if (r < 0.5) return CYAN;
  if (r < 0.75) return AMBER;
  return RED;
}

export default function HeatExchangerDiagram({ values, result }: Props) {
  const v = values as Record<string, number>;
  const hotIn = v.hotInlet || v.t1 || v.T_hot_in || 120;
  const hotOut = v.hotOutlet || v.t2 || v.T_hot_out || 70;
  const coldIn = v.coldInlet || v.t3 || v.T_cold_in || 20;
  const coldOut = v.coldOutlet || v.t4 || v.T_cold_out || 60;
  const lmtd = result?.value || 25;

  const W = 520;
  const H = 340;
  const margin = { top: 40, right: 70, bottom: 50, left: 70 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const tMin = Math.min(coldIn, hotOut) - 10;
  const tMax = Math.max(hotIn, coldOut) + 10;

  const toX = (pos: number) => margin.left + pos * plotW;
  const toY = (t: number) => margin.top + plotH - ((t - tMin) / (tMax - tMin)) * plotH;

  // Hot fluid profile (left to right, decreasing)
  const hotPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const pos = i / 30;
      const t = hotIn - (hotIn - hotOut) * pos;
      pts.push(`${i === 0 ? "M" : "L"} ${toX(pos)} ${toY(t)}`);
    }
    return pts.join(" ");
  }, [hotIn, hotOut]);

  // Cold fluid profile (right to left = counter-flow, increasing right to left)
  const coldPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 30; i >= 0; i--) {
      const pos = i / 30;
      const t = coldIn + (coldOut - coldIn) * (1 - pos);
      pts.push(`${30 - i === 0 ? "M" : "L"} ${toX(pos)} ${toY(t)}`);
    }
    return pts.join(" ");
  }, [coldIn, coldOut]);

  // Temperature gradient bars
  const gradientBars = useMemo(() => {
    const bars: { x: number; color: string }[] = [];
    for (let i = 0; i <= 20; i++) {
      const pos = i / 20;
      const hotT = hotIn - (hotIn - hotOut) * pos;
      bars.push({ x: toX(pos), color: tempColor(hotT, tMin, tMax) });
    }
    return bars;
  }, [hotIn, hotOut]);

  return (
    <div className="p-4 bg-light-bg">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Heat exchanger temperature field">
        <defs>
          <marker id="he-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,4 L8,0 L8,8 Z" fill={SLATE} />
          </marker>
          <linearGradient id="hot-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={RED} />
            <stop offset="100%" stopColor={AMBER} />
          </linearGradient>
          <linearGradient id="cold-grad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={CYAN} />
            <stop offset="100%" stopColor={BLUE} />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x={W / 2} y={22} textAnchor="middle" fontSize="13" fontWeight="600" fill={NAVY} fontFamily="monospace">
          Counter-Flow Heat Exchanger
        </text>

        {/* Plot area */}
        <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" rx="4" />

        {/* Temperature gradient strip (top) */}
        {gradientBars.map((bar, i) => (
          <rect key={i} x={bar.x} y={margin.top} width={plotW / 20 + 1} height={6} fill={bar.color} opacity="0.3" />
        ))}

        {/* Hot fluid curve */}
        <path d={hotPath} fill="none" stroke="url(#hot-grad)" strokeWidth="3" strokeLinecap="round" />
        <text x={toX(0.5)} y={toY(hotIn) - 12} textAnchor="middle" fontSize="10" fill={RED} fontFamily="monospace">Hot Fluid</text>

        {/* Cold fluid curve */}
        <path d={coldPath} fill="none" stroke="url(#cold-grad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="0" />
        <text x={toX(0.5)} y={toY(coldIn) + 18} textAnchor="middle" fontSize="10" fill={BLUE} fontFamily="monospace">Cold Fluid</text>

        {/* Inlet/Outlet markers */}
        <circle cx={toX(0)} cy={toY(hotIn)} r="4" fill={RED} stroke={NAVY} strokeWidth="1" />
        <circle cx={toX(1)} cy={toY(hotOut)} r="4" fill={AMBER} stroke={NAVY} strokeWidth="1" />
        <circle cx={toX(1)} cy={toY(coldIn)} r="4" fill={BLUE} stroke={NAVY} strokeWidth="1" />
        <circle cx={toX(0)} cy={toY(coldOut)} r="4" fill={CYAN} stroke={NAVY} strokeWidth="1" />

        {/* Flow direction arrows */}
        <line x1={toX(0) - 25} y1={toY(hotIn)} x2={toX(0) - 5} y2={toY(hotIn)} stroke={RED} strokeWidth="2" markerEnd="url(#he-arrow)" />
        <text x={toX(0) - 28} y={toY(hotIn) - 8} fontSize="9" fill={RED} fontFamily="monospace" textAnchor="end">{hotIn}°C</text>

        <line x1={toX(1) + 25} y1={toY(coldIn)} x2={toX(1) + 5} y2={toY(coldIn)} stroke={BLUE} strokeWidth="2" markerEnd="url(#he-arrow)" />
        <text x={toX(1) + 28} y={toY(coldIn) - 8} fontSize="9" fill={BLUE} fontFamily="monospace">{coldIn}°C</text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke={SLATE} strokeWidth="1.5" markerEnd="url(#he-arrow)" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left} y2={margin.top} stroke={SLATE} strokeWidth="1.5" markerEnd="url(#he-arrow)" />

        <text x={margin.left + plotW / 2} y={H - 12} fontSize="11" fill={NAVY} fontFamily="monospace" textAnchor="middle">Heat Exchanger Length →</text>
        <text x={22} y={margin.top + plotH / 2} fontSize="11" fill={NAVY} fontFamily="monospace" textAnchor="middle" transform={`rotate(-90 22 ${margin.top + plotH / 2})`}>Temperature (°C)</text>

        {/* LMTD badge */}
        {result && (
          <g>
            <rect x={W - 160} y={H - 50} width="145" height="38" rx="6" fill={GREEN} opacity="0.1" stroke={GREEN} strokeWidth="1.5" />
            <text x={W - 153} y={H - 36} fontSize="9" fill={SLATE} fontFamily="monospace">LMTD / RESULT</text>
            <text x={W - 153} y={H - 20} fontSize="13" fontWeight="700" fill={GREEN} fontFamily="monospace">{result.formatted}</text>
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${margin.left + 8}, ${margin.top + 8})`}>
          <rect x="0" y="0" width="10" height="10" fill={RED} rx="2" />
          <text x="14" y="9" fontSize="9" fill={SLATE} fontFamily="monospace">Hot inlet {hotIn}°C</text>
          <rect x="0" y="16" width="10" height="10" fill={BLUE} rx="2" />
          <text x="14" y="25" fontSize="9" fill={SLATE} fontFamily="monospace">Cold inlet {coldIn}°C</text>
        </g>
      </svg>
    </div>
  );
}
