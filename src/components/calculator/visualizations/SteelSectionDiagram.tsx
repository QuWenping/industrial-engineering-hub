"use client";

import { useMemo } from "react";

/**
 * Premium SVG cross-section + isometric 3D extrusion for steel/metal weight calculators.
 * Engineering-drawing style: Navy outlines, metallic gradients, dimension lines,
 * title block, grid background. Zero dependency, SSR-safe.
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
const LIGHT = "#F1F5F9";

export default function SteelSectionDiagram({ values, result }: Props) {
  const v = values as Record<string, number>;
  const length = v.length || 1000;
  const width = v.width || 1000;
  const thickness = v.thickness || 10;
  const diameter = v.diameter || v.d || 100;

  const sectionType = useMemo(() => {
    if (v.diameter || v.d) return "round";
    return "plate";
  }, [v]);

  const W = 480;
  const H = 380;

  return (
    <div className="p-4 bg-gradient-to-b from-slate-50 to-white">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Steel cross-section visualization">
        <defs>
          {/* Metallic gradient for plate */}
          <linearGradient id="metal-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="30%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          {/* Metallic gradient for 3D top face */}
          <linearGradient id="metal-top" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          {/* Metallic gradient for 3D side face */}
          <linearGradient id="metal-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          {/* Hatching pattern */}
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <rect width="5" height="5" fill={LIGHT} />
            <line x1="0" y1="0" x2="0" y2="5" stroke={BLUE} strokeWidth="0.4" opacity="0.25" />
          </pattern>
          {/* Grid background */}
          <pattern id="grid-bg" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="none" />
            <line x1="0" y1="0" x2="20" y2="0" stroke="#E2E8F0" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="#E2E8F0" strokeWidth="0.5" />
          </pattern>
          {/* Dimension arrow markers */}
          <marker id="dim-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,5 L10,0 L10,10 Z" fill={SLATE} />
          </marker>
          <marker id="dim-arrow-rev" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
            <path d="M0,5 L10,0 L10,10 Z" fill={SLATE} />
          </marker>
          {/* Drop shadow */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="3" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid background */}
        <rect width={W} height={H} fill="url(#grid-bg)" />

        {/* Title block */}
        <rect x="10" y="10" width={W - 20} height="28" fill={NAVY} rx="4" />
        <text x={W / 2} y="29" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="monospace" letterSpacing="1">
          ENGINEERING CROSS-SECTION VIEW
        </text>

        {/* Main visualization area */}
        {sectionType === "plate" && <IsometricPlate cx={W / 2} cy={200} length={length} width={width} thickness={thickness} />}
        {sectionType === "round" && <RoundBarIso cx={W / 2} cy={200} diameter={diameter} length={length} />}

        {/* Dimension labels */}
        {sectionType === "plate" && (
          <>
            <text x={W / 2} y={330} textAnchor="middle" fontSize="11" fill={NAVY} fontFamily="monospace" fontWeight="600">
              {width} × {length} × {thickness} mm
            </text>
            <text x={W / 2} y={348} textAnchor="middle" fontSize="10" fill={SLATE} fontFamily="monospace">
              Plate Volume = {(width * length * thickness / 1e6).toFixed(3)} m³
            </text>
          </>
        )}

        {/* Result badge — premium style */}
        {result && (
          <g filter="url(#shadow)">
            <rect x={W - 165} y={H - 70} width="150" height="52" rx="8" fill={NAVY} />
            <rect x={W - 165} y={H - 70} width="150" height="52" rx="8" fill="none" stroke={GREEN} strokeWidth="2" />
            <text x={W - 90} y={H - 50} textAnchor="middle" fontSize="9" fill={CYAN} fontFamily="monospace" letterSpacing="1">TOTAL WEIGHT</text>
            <text x={W - 90} y={H - 28} textAnchor="middle" fontSize="18" fontWeight="800" fill={GREEN} fontFamily="monospace">
              {result.formatted}
            </text>
          </g>
        )}

        {/* Drawing border */}
        <rect x="1" y="1" width={W - 2} height={H - 2} fill="none" stroke={NAVY} strokeWidth="1.5" rx="2" />
      </svg>
    </div>
  );
}

/* ── Isometric Plate with 3D extrusion ─────────────────────── */

function IsometricPlate({ cx, cy, length, width, thickness }: { cx: number; cy: number; length: number; width: number; thickness: number }) {
  // Scale to fit
  const maxW = 240;
  const maxH = 100;
  const scale = Math.min(maxW / width, maxH / length, 1);
  const w = width * scale;
  const l = length * scale * 0.6; // isometric foreshortening
  const t = Math.max(8, Math.min(thickness * scale * 3, 50));
  const isoAngle = 30; // degrees
  const dx = Math.cos(isoAngle * Math.PI / 180) * t;
  const dy = Math.sin(isoAngle * Math.PI / 180) * t;

  // Front face corners
  const f1 = [cx - w / 2, cy - l / 2];
  const f2 = [cx + w / 2, cy - l / 2];
  const f3 = [cx + w / 2, cy + l / 2];
  const f4 = [cx - w / 2, cy + l / 2];
  // Back face corners (extruded)
  const b1 = [f1[0] + dx, f1[1] - dy];
  const b2 = [f2[0] + dx, f2[1] - dy];
  const b3 = [f3[0] + dx, f3[1] - dy];
  const b4 = [f4[0] + dx, f4[1] - dy];

  return (
    <g>
      {/* Top face (visible) */}
      <polygon
        points={`${f1[0]},${f1[1]} ${f2[0]},${f2[1]} ${b2[0]},${b2[1]} ${b1[0]},${b1[1]}`}
        fill="url(#metal-top)" stroke={NAVY} strokeWidth="2"
      />
      {/* Right side face */}
      <polygon
        points={`${f2[0]},${f2[1]} ${f3[0]},${f3[1]} ${b3[0]},${b3[1]} ${b2[0]},${b2[1]}`}
        fill="url(#metal-side)" stroke={NAVY} strokeWidth="2"
      />
      {/* Front face */}
      <polygon
        points={`${f1[0]},${f1[1]} ${f2[0]},${f2[1]} ${f3[0]},${f3[1]} ${f4[0]},${f4[1]}`}
        fill="url(#metal-plate)" stroke={NAVY} strokeWidth="2.5"
      />
      {/* Hatching on front face */}
      <polygon
        points={`${f1[0]},${f1[1]} ${f2[0]},${f2[1]} ${f3[0]},${f3[1]} ${f4[0]},${f4[1]}`}
        fill="url(#hatch)" opacity="0.5"
      />

      {/* Dimension: Width (bottom) */}
      <line x1={f4[0]} y1={f4[1] + 25} x2={f3[0]} y2={f3[1] + 25} stroke={SLATE} strokeWidth="1.2" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <line x1={f4[0]} y1={f4[1] + 5} x2={f4[0]} y2={f4[1] + 25} stroke={SLATE} strokeWidth="0.5" strokeDasharray="3 2" />
      <line x1={f3[0]} y1={f3[1] + 5} x2={f3[0]} y2={f3[1] + 25} stroke={SLATE} strokeWidth="0.5" strokeDasharray="3 2" />
      <text x={cx} y={f4[1] + 20} textAnchor="middle" fontSize="10" fill={NAVY} fontFamily="monospace" fontWeight="600">W = {width} mm</text>

      {/* Dimension: Length (right side, along extrusion) */}
      <line x1={f3[0] + 30} y1={f3[1]} x2={b3[0] + 30} y2={b3[1]} stroke={SLATE} strokeWidth="1.2" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <line x1={f3[0] + 5} y1={f3[1]} x2={f3[0] + 30} y2={f3[1]} stroke={SLATE} strokeWidth="0.5" strokeDasharray="3 2" />
      <line x1={b3[0] + 5} y1={b3[1]} x2={b3[0] + 30} y2={b3[1]} stroke={SLATE} strokeWidth="0.5" strokeDasharray="3 2" />
      <text x={f3[0] + 45} y={(f3[1] + b3[1]) / 2 + 4} fontSize="10" fill={NAVY} fontFamily="monospace" fontWeight="600">L = {length}</text>

      {/* Thickness label on top */}
      <text x={(f1[0] + b1[0]) / 2} y={(f1[1] + b1[1]) / 2 - 8} textAnchor="middle" fontSize="9" fill={BLUE} fontFamily="monospace">t = {thickness} mm</text>

      {/* Edge highlight lines */}
      <line x1={f1[0]} y1={f1[1]} x2={f2[0]} y2={f2[1]} stroke={CYAN} strokeWidth="0.5" opacity="0.4" />
      <line x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} stroke={CYAN} strokeWidth="0.5" opacity="0.4" />
    </g>
  );
}

/* ── Isometric Round Bar ───────────────────────────────────── */

function RoundBarIso({ cx, cy, diameter, length }: { cx: number; cy: number; diameter: number; length: number }) {
  const r = Math.min(diameter * 0.5, 50);
  const l = Math.min(length * 0.15, 160);
  const dx = Math.cos(Math.PI / 6) * l;
  const dy = Math.sin(Math.PI / 6) * l;

  return (
    <g>
      {/* Back ellipse */}
      <ellipse cx={cx + dx} cy={cy - dy} rx={r} ry={r * 0.35} fill="url(#metal-top)" stroke={NAVY} strokeWidth="2" />
      {/* Cylinder body */}
      <path
        d={`M ${cx - r} ${cy} L ${cx - r + dx} ${cy - dy} M ${cx + r} ${cy} L ${cx + r + dx} ${cy - dy}`}
        stroke={NAVY} strokeWidth="2" fill="none"
      />
      <rect x={cx - r} y={cy - dy} width={dx + r} height={dy * 2} fill="url(#metal-side)" opacity="0.3" />
      {/* Top edge */}
      <line x1={cx - r} y1={cy} x2={cx - r + dx} y2={cy - dy} stroke={NAVY} strokeWidth="2" />
      <line x1={cx + r} y1={cy} x2={cx + r + dx} y2={cy - dy} stroke={NAVY} strokeWidth="2" />
      {/* Front ellipse */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.35} fill="url(#metal-plate)" stroke={NAVY} strokeWidth="2.5" />
      {/* Hatching on front */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.35} fill="url(#hatch)" opacity="0.4" />

      {/* Dimension */}
      <line x1={cx} y1={cy + r * 0.35 + 20} x2={cx} y2={cy - r * 0.35 - 20} stroke={SLATE} strokeWidth="1.2" markerStart="url(#dim-arrow-rev)" markerEnd="url(#dim-arrow)" />
      <text x={cx - 12} y={cy + 4} textAnchor="end" fontSize="10" fill={NAVY} fontFamily="monospace" fontWeight="600">Ø{diameter}</text>
      <text x={cx + dx + 20} y={cy - dy + 4} fontSize="10" fill={NAVY} fontFamily="monospace" fontWeight="600">L={length}</text>
    </g>
  );
}
