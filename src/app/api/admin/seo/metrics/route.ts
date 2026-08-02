// GET /api/admin/seo/metrics — query GSC data with aggregation
// Params: ?days=30&type=query|page&sort=impressions|clicks|position&limit=50
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");
  const type = searchParams.get("type") || "query";
  const sortBy = searchParams.get("sort") || "impressions";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

  const since = new Date();
  since.setDate(since.getDate() - days);

  if (type === "query") {
    // Aggregate by query
    const raw = await prisma.seoMetric.findMany({
      where: { date: { gte: since }, query: { not: "(not set)" } },
      select: { query: true, impressions: true, clicks: true, ctr: true, position: true },
    });

    const map = new Map<string, { impressions: number; clicks: number; ctr: number; position: number; count: number }>();
    for (const r of raw) {
      const existing = map.get(r.query) || { impressions: 0, clicks: 0, ctr: 0, position: 0, count: 0 };
      existing.impressions += r.impressions;
      existing.clicks += r.clicks;
      existing.ctr += r.ctr;
      existing.position += r.position;
      existing.count++;
      map.set(r.query, existing);
    }

    const items = Array.from(map.entries()).map(([query, v]) => ({
      query,
      impressions: v.impressions,
      clicks: v.clicks,
      ctr: v.count > 0 ? v.ctr / v.count : 0,
      avgPosition: v.count > 0 ? v.position / v.count : 0,
    }));

    items.sort((a, b) => (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number));

    return NextResponse.json({
      items: items.slice(0, limit),
      total: items.length,
      summary: {
        totalImpressions: items.reduce((s, i) => s + i.impressions, 0),
        totalClicks: items.reduce((s, i) => s + i.clicks, 0),
        avgCtr: items.length > 0 ? items.reduce((s, i) => s + i.ctr, 0) / items.length : 0,
      },
    });
  } else {
    // Aggregate by page
    const raw = await prisma.seoMetric.findMany({
      where: { date: { gte: since }, page: { not: "(not set)" } },
      select: { page: true, impressions: true, clicks: true, ctr: true, position: true },
    });

    const map = new Map<string, { impressions: number; clicks: number; ctr: number; position: number; count: number }>();
    for (const r of raw) {
      const existing = map.get(r.page) || { impressions: 0, clicks: 0, ctr: 0, position: 0, count: 0 };
      existing.impressions += r.impressions;
      existing.clicks += r.clicks;
      existing.ctr += r.ctr;
      existing.position += r.position;
      existing.count++;
      map.set(r.page, existing);
    }

    const items = Array.from(map.entries()).map(([page, v]) => ({
      page,
      impressions: v.impressions,
      clicks: v.clicks,
      ctr: v.count > 0 ? v.ctr / v.count : 0,
      avgPosition: v.count > 0 ? v.position / v.count : 0,
    }));

    items.sort((a, b) => (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number));

    return NextResponse.json({
      items: items.slice(0, limit),
      total: items.length,
      summary: {
        totalImpressions: items.reduce((s, i) => s + i.impressions, 0),
        totalClicks: items.reduce((s, i) => s + i.clicks, 0),
        avgCtr: items.length > 0 ? items.reduce((s, i) => s + i.ctr, 0) / items.length : 0,
      },
    });
  }
}
