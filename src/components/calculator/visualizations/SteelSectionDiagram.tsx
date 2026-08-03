"use client";

import { useMemo } from "react";

/**
 * SVG cross-section diagram for steel/metal weight calculators.
 * Premium engineering-drawing style: Navy outlines, dimension lines,
 * Engineering Blue fill, hatching pattern. Zero dependency, SSR-safe.
 *
 * Detects section type from input shape:
 *  - plate: length x width x thickness
 *  - round bar: diameter
 *  - pipe: outer diameter x wall thickness
 *  - box: H x B x t
 *  - I-beam / H-beam: H x B x tw x tf
 *  - angle: B x t
 *  - channel: H x B x tw x tf
 */

interface Props {
  values: Record<string, number | string>;
  result: { value: number; unit: string; formatted: string } | null;
}

// Colors
const NAVY = "#0B1F3A";
const BLUE = "#1677FF";
const CYAN = "#00D4FF";
const GREEN = "#00B578";
const SLATE = "#64748B";
const LIGHT = "#F1F5F9";

export default function SteelSectionDiagram({ values, result }: Props) {
  const v = values as Record<string, number>;
  const length = v.length || 1000;
  const width = v.width || 1000;
  const thickness = v.thickness || 10;
  const diameter = v.diameter || v.d || 100;
  const wallThickness = v.wallThickness || v.wt || 5;
  const height = v.height || v.h || 200;
  const baseWidth = v.baseWidth || v.b || 100;
  const tw = v.tw || v.webThickness || 5;
  const tf = v.tf || v.flangeThickness || 8;

  // Auto-detect section type based on which inputs are present
  const sectionType = useMemo(() => {
    if (v.diameter || v.d) return "round";
    if (v.wallThickness || v.wt) return "pipe";
    if (v.height && v.tw && v.tf) return "ibeam";
    if (v.baseWidth && v.tw) return "channel";
    if (v.baseWidth && !v.height) return "angle";
    // default: plate (length x width x thickness)
    return "plate";
  }, [v]);

  const W = 420;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;

  return (
    <div className="p-4 bg-light-bg">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Steel cross-section visualization">
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={LIGHT} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={BLUE} strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <marker id="dim-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,4 L8,0 L8,8 Z" fill={SLATE} />
          </marker>
          <marker id="dim-arrow-rev" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
            <path d="M0,4 L8,0 L8,8 Z" fill={SLATE} />
          </marker>
        </defs>

        {/* Title */}
        <text x={cx} y={28} textAnchor="middle" fontSize="13" fontWeight="600" fill={NAVY} fontFamily="monospace">
          Cross-Section: {sectionType.toUpperCase()}
        </text>

        {sectionType === "plate" && <PlateSVG cx={cx} cy={cy} length={length} width={width} thickness={thickness} />}
        {sectionType === "round" && <RoundSVG cx={cx} cy={cy} diameter={diameter} />}
        {sectionType === "pipe" && <PipeSVG cx={cx} cy={cy} OD={diameter} WT={wallThickness} />}
        {sectionType === "ibeam" && <IBeamSVG cx={cx} cy={cy} H={height} B={baseWidth} tw={tw} tf={tf} />}
        {sectionType === "channel" && <ChannelSVG cx={cx} cy={cy} H={height} B={baseWidth} tw={tw} tf={tf} />}
        {sectionType === "angle" && <AngleSVG cx={cx} cy={cy} B={baseWidth} t={thickness} />}

        {/* Result badge */}
        {result && (
          <g>
            <rect x={W - 170} y={H - 56} width="150" height="40" rx="6" fill={GREEN} opacity="0.1" stroke={GREEN} strokeWidth="1.5" />
            <text x={W - 95} y={H - 34} textAnchor="middle" fontSize="10" fill={SLATE} fontFamily="monospace">WEIGHT</text>
            <text x={W - 95} y={H - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill={GREEN} fontFamily="monospace">
              {result.formatted}
            </text>
          </g>
        )}
      </svg>

      {/* 3D extrusion hint (isometric block) */}
      {sectionType === "plate" && (
        <div className="mt-2 text-center text-xs text-muted-foreground font-mono">
          Plate volume: {length} × {width} × {thickness} mm
        </div>
      )}
    </div>
  );
}

/* ── Plate ────────────────────────────────────────────────── */
function PlateSVG({ cx, cy, length, width, thickness }: { cx: number; cy: number; length: number; width: number; thickness: number }) {
  const scaleW = Math.min(280 / width, 1);
  const scaleT = Math.max(6, Math.min(thickness * 4 * scaleW, 60));
  const w = Math.min(width * scaleW, 280);
  const t = scaleT;

  return (
    <g>
      {/* Front face (thickness rectangle) */}
      <rect x={cx - w / 2} y={cy - t / 2} width={w} height={t} fill="url(#hatch)" stroke={NAVY} strokeWidth="2.5" />
      {/* Isometric depth lines */}
      <line x1={cx - w / 2} y1={cy - t / 2} x2={cx - w / 2 + 20} y2={cy - t / 2 - 15} stroke={NAVY} strokeWidth="1.5" />
      <line x1={cx + w / 2} y1={cy - t / 2} x2={cx + w / 2 + 20} y2={cy - t / 2 - 15} stroke={NAVY} strokeWidth="1.5" />
      <line x1={cx - w / 2 + 20} y1={cy - t / 2 - 15} x2={cx + w / 2 + 20} y2={cy - t / 2 - 15} stroke={NAVY} strokeWidth="1.5" />
      <line x1={cx + w / 2 + 20} y1={cy - t / 2 - 15} x2={cx + w / 2 + 20} y2={cy + t / 2 - 15} stroke={NAVY} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Dimension: Width */}
      <line x1={cx - w / 2} y1={cy + t / 2 + 30} x2={cx + w / 2} y2={cy + t / 2 + 30} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx} y={cy + t / 2 + 24} textAnchor="middle" fontSize="10" fill={SLATE} fontFamily="monospace">Width = {width} mm</text>

      {/* Dimension: Thickness */}
      <line x1={cx - w / 2 - 25} y1={cy - t / 2} x2={cx - w / 2 - 25} y2={cy + t / 2} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx - w / 2 - 60} y={cy + 4} textAnchor="end" fontSize="10" fill={SLATE} fontFamily="monospace" transform={`rotate(-90 ${cx - w / 2 - 60} ${cy + 4})`}>t={thickness}mm</text>

      {/* Length label */}
      <text x={cx + w / 2 + 40} y={cy - t / 2 - 18} fontSize="10" fill={BLUE} fontFamily="monospace">L={length}mm</text>
    </g>
  );
}

/* ── Round Bar ────────────────────────────────────────────── */
function RoundSVG({ cx, cy, diameter }: { cx: number; cy: number; diameter: number }) {
  const r = Math.min(diameter * 0.8, 120);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#hatch)" stroke={NAVY} strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={BLUE} strokeWidth="0.5" opacity="0.3" />
      {/* Diameter dimension */}
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx - 8} y={cy + 4} textAnchor="end" fontSize="10" fill={SLATE} fontFamily="monospace">Ø{diameter}mm</text>
    </g>
  );
}

/* ── Pipe ─────────────────────────────────────────────────── */
function PipeSVG({ cx, cy, OD, WT }: { cx: number; cy: number; OD: number; WT: number }) {
  const r = Math.min(OD * 0.8, 120);
  const innerR = r - Math.max(4, (WT / OD) * r);
  return (
    <g>
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={r} fill="url(#hatch)" stroke={NAVY} strokeWidth="2.5" />
      {/* Inner hole */}
      <circle cx={cx} cy={cy} r={innerR} fill={LIGHT} stroke={NAVY} strokeWidth="2" />
      {/* OD dimension */}
      <line x1={cx + r + 15} y1={cy - r} x2={cx + r + 15} y2={cy + r} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx + r + 20} y={cy + 4} fontSize="10" fill={SLATE} fontFamily="monospace">OD={OD}</text>
      {/* WT dimension */}
      <line x1={cx} y1={cy + r + 10} x2={cx + r} y2={cy + r + 10} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx + r / 2} y={cy + r + 24} textAnchor="middle" fontSize="9" fill={SLATE} fontFamily="monospace">WT={WT}</text>
    </g>
  );
}

/* ── I-Beam / H-Beam ──────────────────────────────────────── */
function IBeamSVG({ cx, cy, H, B, tw, tf }: { cx: number; cy: number; H: number; B: number; tw: number; tf: number }) {
  const scale = Math.min(240 / H, 200 / B, 1);
  const sH = H * scale;
  const sB = B * scale;
  const stw = Math.max(4, tw * scale);
  const stf = Math.max(4, tf * scale);

  return (
    <g>
      {/* Top flange */}
      <rect x={cx - sB / 2} y={cy - sH / 2} width={sB} height={stf} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />
      {/* Web */}
      <rect x={cx - stw / 2} y={cy - sH / 2 + stf} width={stw} height={sH - 2 * stf} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />
      {/* Bottom flange */}
      <rect x={cx - sB / 2} y={cy + sH / 2 - stf} width={sB} height={stf} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />

      {/* H dimension */}
      <line x1={cx - sB / 2 - 25} y1={cy - sH / 2} x2={cx - sB / 2 - 25} y2={cy + sH / 2} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx - sB / 2 - 30} y={cy + 4} textAnchor="end" fontSize="10" fill={SLATE} fontFamily="monospace" transform={`rotate(-90 ${cx - sB / 2 - 30} ${cy + 4})`}>H={H}</text>
      {/* B dimension */}
      <line x1={cx - sB / 2} y1={cy + sH / 2 + 25} x2={cx + sB / 2} y2={cy + sH / 2 + 25} stroke={SLATE} strokeWidth="1" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx} y={cy + sH / 2 + 40} textAnchor="middle" fontSize="10" fill={SLATE} fontFamily="monospace">B={B}</text>
      {/* Labels */}
      <text x={cx + sB / 2 + 10} y={cy - sH / 2 + 14} fontSize="9" fill={BLUE} fontFamily="monospace">tf={tf}</text>
      <text x={cx + stw / 2 + 6} y={cy + 4} fontSize="9" fill={BLUE} fontFamily="monospace">tw={tw}</text>
    </g>
  );
}

/* ── Channel ───────────────────────────────────────────────── */
function ChannelSVG({ cx, cy, H, B, tw, tf }: { cx: number; cy: number; H: number; B: number; tw: number; tf: number }) {
  const scale = Math.min(240 / H, 200 / B, 1);
  const sH = H * scale;
  const sB = B * scale;
  const stw = Math.max(4, tw * scale);
  const stf = Math.max(4, tf * scale);

  return (
    <g>
      {/* Web */}
      <rect x={cx - sB / 2} y={cy - sH / 2} width={stw} height={sH} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />
      {/* Top flange */}
      <rect x={cx - sB / 2} y={cy - sH / 2} width={sB} height={stf} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />
      {/* Bottom flange */}
      <rect x={cx - sB / 2} y={cy + sH / 2 - stf} width={sB} height={stf} fill="url(#hatch)" stroke={NAVY} strokeWidth="2" />
      <text x={cx} y={cy + sH / 2 + 40} textAnchor="middle" fontSize="10" fill={SLATE} fontFamily="monospace">B={B}  H={H}</text>
    </g>
  );
}

/* ── Angle ────────────────────────────────────────────────── */
function AngleSVG({ cx, cy, B, t }: { cx: number; cy: number; B: number; t: number }) {
  const scale = Math.min(200 / B, 1);
  const sB = B * scale;
  const st = Math.max(5, t * scale);
  return (
    <g>
      <polygon
        points={`${cx - sB / 2},${cy + sB / 2} ${cx - sB / 2},${cy - sB / 2} ${cx - sB / 2 + st},${cy - sB / 2} ${cx - sB / 2 + st},${cy + sB / 2 - st} ${cx + sB / 2},${cy + sB / 2 - st} ${cx + sB / 2},${cy + sB / 2}`}
        fill="url(#hatch)" stroke={NAVY} strokeWidth="2"
      />
      <text x={cx + sB / 2 + 12} y={cy + sB / 2} fontSize="10" fill={SLATE} fontFamily="monospace">B={B}</text>
      <text x={cx - sB / 2 - 8} y={cy + sB / 2 + 16} fontSize="9" fill={BLUE} fontFamily="monospace">t={t}</text>
    </g>
  );
}
