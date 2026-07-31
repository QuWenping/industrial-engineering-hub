// GET /api/admin/leads — list leads (filter by status, paginated, newest first)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // new|contacted|qualified|won|lost|spam
  const take = Math.min(parseInt(searchParams.get("take") ?? "100", 10), 500);
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);

  const where = status ? { status } : {};
  const [items, total, byStatus] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true, name: true, company: true, email: true, industry: true,
        projectType: true, source: true, status: true, createdAt: true,
        contactedAt: true,
      },
    }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  return NextResponse.json({ items, total, take, skip, byStatus });
}
