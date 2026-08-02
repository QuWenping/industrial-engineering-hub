// POST /api/admin/seo/gsc-import — import GSC CSV data into SeoMetric table
// Accepts CSV text in the body. GSC CSV format:
//   Top queries: Query,Clicks,Impressions,CTR,Position
//   Top pages:   Page URL,Clicks,Impressions,CTR,Position
// The 	ype query param (query|page) determines parsing mode.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "query"; // query|page
  const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const date = new Date(dateStr);

  let text: string;
  try {
    text = await request.text();
  } catch {
    return NextResponse.json({ error: "No body" }, { status: 400 });
  }

  // Parse CSV (simple — GSC exports are clean CSV)
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return NextResponse.json({ error: "CSV has no data rows" }, { status: 400 });
  }

  // Skip header row
  const rows = lines.slice(1);
  const records: { query: string; page: string; impressions: number; clicks: number; ctr: number; position: number }[] = [];

  for (const line of rows) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 5) continue;

    if (type === "query") {
      const [query, clicks, impressions, ctr, position] = cols;
      records.push({
        query,
        page: "(not set)",
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        ctr: parseFloat(ctr.replace("%", "")) || 0,
        position: parseFloat(position) || 0,
      });
    } else {
      const [page, clicks, impressions, ctr, position] = cols;
      records.push({
        query: "(not set)",
        page,
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        ctr: parseFloat(ctr.replace("%", "")) || 0,
        position: parseFloat(position) || 0,
      });
    }
  }

  if (records.length === 0) {
    return NextResponse.json({ error: "No valid rows parsed" }, { status: 400 });
  }

  // Bulk upsert (create or update on unique [date, query, page])
  let created = 0;
  let updated = 0;
  for (const r of records) {
    try {
      await prisma.seoMetric.upsert({
        where: { date_query_page: { date, query: r.query, page: r.page } },
        create: { date, ...r },
        update: { impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position },
      });
      created++;
    } catch {
      updated++;
    }
  }

  return NextResponse.json({ ok: true, imported: records.length, created, updated, type, date: dateStr });
}
