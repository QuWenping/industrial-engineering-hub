// Axial fan cross-section with rotating blades + airflow.
// Pure SVG + CSS animation — no JS interactivity, SSR-safe.
// Usage in MDX: <FanDiagram />

interface Props {
  className?: string;
}

export function FanDiagram({ className }: Props) {
  return (
    <svg viewBox="0 0 440 260" className={className} role="img" aria-label="Axial fan cross-section showing airflow through rotating blades">
      <defs>
        <marker id="fan-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#64748B" />
        </marker>
      </defs>

      {/* Housing (outer ring) */}
      <ellipse cx="220" cy="130" rx="120" ry="90" fill="none" stroke="#0B1F3A" strokeWidth="4" />
      {/* Housing inner */}
      <ellipse cx="220" cy="130" rx="110" ry="80" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />

      {/* Inlet side (left opening) */}
      <rect x="95" y="90" width="12" height="80" fill="#0B1F3A" rx="2" />
      {/* Outlet side (right opening) */}
      <rect x="333" y="90" width="12" height="80" fill="#0B1F3A" rx="2" />

      {/* Fan blades (rotating, 5 blades) */}
      <g className="ieh-spin" style={{ transformOrigin: '220px 130px' }}>
        {/* Hub */}
        <circle cx="220" cy="130" r="14" fill="#0B1F3A" />
        <circle cx="220" cy="130" r="7" fill="#1677FF" />
        {/* 5 blades */}
        {[0, 72, 144, 216, 288].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 220 + Math.cos(rad) * 14;
          const y1 = 130 + Math.sin(rad) * 14;
          const midX = 220 + Math.cos(rad + 0.15) * 35;
          const midY = 130 + Math.sin(rad + 0.15) * 35;
          const x2 = 220 + Math.cos(rad + 0.3) * 60;
          const y2 = 130 + Math.sin(rad + 0.3) * 60;
          return (
            <path key={angle}
              d={"M " + x1 + " " + y1 + " Q " + midX + " " + midY + " " + x2 + " " + y2 + " L " + (x2-4) + " " + (y2+2) + " Q " + (midX-3) + " " + (midY+2) + " " + (x1-2) + " " + (y1+3) + " Z"}
              fill="#1677FF" opacity="0.7" stroke="#0B1F3A" strokeWidth="1" />
          );
        })}
      </g>

      {/* Airflow arrows (left to right, multiple parallel) */}
      {[100, 130, 160].map((y, i) => (
        <path key={i}
          d={"M 115 " + y + " L 320 " + y}
          fill="none" stroke="#64748B" strokeWidth="2"
          strokeDasharray="8 5" className="ieh-flow-line"
          markerEnd="url(#fan-arrow)" />
      ))}

      {/* Labels */}
      <text x="100" y="80" fontSize="11" fill="#64748B" textAnchor="middle">Air Inlet</text>
      <text x="340" y="80" fontSize="11" fill="#64748B" textAnchor="middle">Air Outlet</text>
      <text x="220" y="220" fontSize="11" fill="#64748B" textAnchor="middle">Fan Blades (rotating)</text>
    </svg>
  );
}
