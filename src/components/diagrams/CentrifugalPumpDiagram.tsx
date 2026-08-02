// Centrifugal pump cross-section with animated impeller + water flow.
// Pure SVG + CSS animation — no JS interactivity, SSR-safe.
// Usage in MDX: <CentrifugalPumpDiagram />

interface Props {
  className?: string;
}

export function CentrifugalPumpDiagram({ className }: Props) {
  return (
    <svg viewBox="0 0 440 340" className={className} role="img" aria-label="Centrifugal pump cross-section showing water flow through a rotating impeller">
      <defs>
        <marker id="pump-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1677FF" />
        </marker>
        <marker id="pump-arrow-out" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#00D4FF" />
        </marker>
      </defs>

      {/* Casing outer */}
      <circle cx="220" cy="180" r="90" fill="none" stroke="#0B1F3A" strokeWidth="4" />
      {/* Casing inner */}
      <circle cx="220" cy="180" r="80" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />

      {/* Suction pipe (left) */}
      <rect x="80" y="168" width="60" height="24" fill="#F8FAFC" stroke="#0B1F3A" strokeWidth="3" />
      <rect x="75" y="164" width="10" height="32" fill="#0B1F3A" rx="2" />

      {/* Discharge pipe (top) */}
      <rect x="208" y="50" width="24" height="50" fill="#F8FAFC" stroke="#0B1F3A" strokeWidth="3" />
      <rect x="204" y="46" width="32" height="10" fill="#0B1F3A" rx="2" />

      {/* Flow path: suction -> impeller -> discharge */}
      <path d="M 85 180 L 145 180 Q 180 180 195 160 Q 210 140 220 120 L 220 60"
        fill="none" stroke="#1677FF" strokeWidth="3" strokeDasharray="8 5" className="ieh-flow-line"
        markerEnd="url(#pump-arrow-out)" />

      {/* Impeller (rotating) */}
      <g className="ieh-spin" style={{ transformOrigin: '220px 180px' }}>
        {/* Hub */}
        <circle cx="220" cy="180" r="16" fill="#1677FF" />
        <circle cx="220" cy="180" r="8" fill="#0B1F3A" />
        {/* Blades (6 curved) */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 220 + Math.cos(rad) * 16;
          const y1 = 180 + Math.sin(rad) * 16;
          const x2 = 220 + Math.cos(rad + 0.4) * 65;
          const y2 = 180 + Math.sin(rad + 0.4) * 65;
          const cx = 220 + Math.cos(rad + 0.2) * 40;
          const cy = 180 + Math.sin(rad + 0.2) * 40;
          return (
            <path key={angle}
              d={"M " + x1 + " " + y1 + " Q " + cx + " " + cy + " " + x2 + " " + y2}
              fill="none" stroke="#1677FF" strokeWidth="5" strokeLinecap="round" />
          );
        })}
      </g>

      {/* Flow arrows (inlet) */}
      <path d="M 95 180 L 130 180" fill="none" stroke="#1677FF" strokeWidth="2.5"
        strokeDasharray="6 4" className="ieh-flow-line" markerEnd="url(#pump-arrow)" />

      {/* Labels */}
      <text x="85" y="210" fontSize="11" fill="#64748B" textAnchor="middle">Suction (Inlet)</text>
      <text x="240" y="38" fontSize="11" fill="#64748B" textAnchor="middle">Discharge (Outlet)</text>
      <text x="220" y="268" fontSize="11" fill="#64748B" textAnchor="middle">Impeller (rotating)</text>
      <text x="350" y="180" fontSize="11" fill="#64748B" textAnchor="middle">Casing</text>

      {/* Rotation indicator */}
      <path d="M 285 180 A 65 65 0 0 1 270 220" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M 270 220 L 275 213 L 263 212 Z" fill="#94A3B8" />
    </svg>
  );
}
