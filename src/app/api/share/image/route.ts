// POST /api/share/image — generate shareable result image (SVG-based)
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { calculatorName, inputData, resultData, formula } = body;
  if (!calculatorName || !resultData) {
    return NextResponse.json({ error: "calculatorName and resultData required" }, { status: 400 });
  }

  // Build SVG image
  const inputRows = Object.entries(inputData || {})
    .map(([k, v]) => '<text x="40" y="' + (0) + '" font-size="13" fill="#64748B">' + k + ': ' + v + '</text>')
    .join("");

  const inputs = Object.entries(inputData || {});
  const inputY = 280;
  const inputLines = inputs.map((entry, i) => {
    const y = inputY + i * 24;
    return '<text x="50" y="' + y + '" font-size="14" fill="#475569">' + entry[0] + ': ' + entry[1] + '</text>';
  }).join("");

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="' + (350 + inputs.length * 24) + '" viewBox="0 0 600 ' + (350 + inputs.length * 24) + '">'
    + '<rect width="600" height="' + (350 + inputs.length * 24) + '" fill="#0B1F3A" rx="16"/>'
    + '<rect x="0" y="0" width="600" height="4" fill="#1677FF"/>'
    + '<text x="50" y="60" font-family="Inter,sans-serif" font-size="16" font-weight="600" fill="#94A3B8">Industrial Engineering Studio</text>'
    + '<text x="50" y="100" font-family="Inter,sans-serif" font-size="14" fill="#94A3B8">' + calculatorName + '</text>'
    + '<line x1="50" y1="120" x2="550" y2="120" stroke="#1E3A5F" stroke-width="1"/>'
    + '<text x="50" y="170" font-family="Inter,sans-serif" font-size="14" fill="#64748B">Result</text>'
    + '<text x="50" y="230" font-family="Inter,sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">' + resultData.value + '</text>'
    + '<text x="50" y="260" font-family="Inter,sans-serif" font-size="20" fill="#00D4FF">' + resultData.unit + '</text>'
    + '<text x="50" y="300" font-family="Inter,sans-serif" font-size="13" fill="#64748B">Inputs</text>'
    + inputLines
    + '<text x="50" y="' + (350 + inputs.length * 24 - 10) + '" font-family="Inter,sans-serif" font-size="11" fill="#475569">www.industrialengineeringstudio.com</text>'
    + '</svg>';

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": 'attachment; filename="' + calculatorName.toLowerCase().replace(/\s+/g, "-") + '-result.svg"',
    },
  });
}
