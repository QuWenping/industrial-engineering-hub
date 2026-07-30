import { ImageResponse } from "next/og";

type OGData = {
  title: string;
  subtitle?: string;
  category?: string;
  accent?: string; // hex color e.g. "#1677FF"
};

export function renderOG({ title, subtitle, category, accent = "#1677FF" }: OGData) {
  // Split title into lines that fit within ~1040px width.
  // Use a rough character count (large font = ~18 chars per line for 64px).
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > 24) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  const titleLines = lines.slice(0, 3); // max 3 lines

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0B1F3A 0%, #0F2B52 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: "120px",
            height: "6px",
            background: `linear-gradient(90deg, ${accent} 0%, #00D4FF 100%)`,
            borderRadius: "3px",
            marginBottom: category ? "24px" : "40px",
          }}
        />

        {/* Category badge */}
        {category && (
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: accent,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            {category}
          </div>
        )}

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "24px" }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: i === titleLines.length - 1 && titleLines.length > 1 ? "60px" : "68px",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-2px",
                color: i === 0 ? "white" : accent,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              lineHeight: 1.4,
              maxWidth: "900px",
              marginBottom: "40px",
            }}
          >
            {subtitle.length > 120 ? subtitle.slice(0, 117) + "…" : subtitle}
          </div>
        )}

        {/* Brand footer */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: "white" }}>
            Industrial Engineering Hub
          </div>
          <div style={{ fontSize: "20px", color: "#64748B", fontWeight: 500 }}>
            industrialengineeringhub.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
