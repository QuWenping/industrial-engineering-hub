import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Industrial Engineering Studio - Free Engineering Calculators & Guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
            background: "linear-gradient(90deg, #1677FF 0%, #00D4FF 100%)",
            borderRadius: "3px",
            marginBottom: "40px",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Industrial Engineering
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            background: "linear-gradient(90deg, #1677FF 0%, #00D4FF 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
          }}
        >
          Studio
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: "32px", color: "#94A3B8", marginBottom: "50px" }}>
          Free Online Engineering Calculators & Guides
        </div>

        {/* Stats — each card is a flex column (Satori requires explicit display
            on any div with more than one child) */}
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { value: "53+", label: "Calculators", color: "#1677FF" },
            { value: "50+", label: "Guides", color: "#00D4FF" },
            { value: "26+", label: "Materials", color: "#00B578" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px",
                background: `${s.color}20`,
                borderRadius: "12px",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "16px", color: "#94A3B8" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* URL footer */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            fontSize: "20px",
            color: "#64748B",
            fontWeight: 500,
          }}
        >
          www.industrialengineeringstudio.com
        </div>
      </div>
    ),
    { ...size }
  );
}
