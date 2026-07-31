import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

// ─── Rate limit: per-IP, 5 submissions per hour (rolling window) ─────────────
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipHits = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipHits.get(ip) ?? [];
  const window = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (window.length >= RATE_LIMIT_MAX) return false;
  window.push(now);
  ipHits.set(ip, window);
  return true;
}

// ─── Zod schema matching ProjectAssessmentForm ───────────────────────────────
const LeadSchema = z.object({
  name: z.string().min(1, "Name required").max(120),
  company: z.string().min(1, "Company required").max(160),
  email: z.string().email("Valid email required").max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  industry: z.string().min(1, "Industry required").max(120),
  projectType: z.string().min(1, "Project type required").max(120),
  location: z.string().max(120).optional().or(z.literal("")),
  projectSize: z.string().max(60).optional().or(z.literal("")),
  timeline: z.string().max(60).optional().or(z.literal("")),
  services: z.array(z.string().max(80)).max(10).default([]),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  source: z.string().max(60).optional().default("contact-form"),
  sourceRef: z.string().max(200).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: if "website" field is filled, silently succeed (bot).
  if (body && typeof body === "object" && "website" in body && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true, leadId: "honeypot-accepted" });
  }

  // Client IP (x-forwarded-for set by Vercel)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later or email hello@industrialengineeringstudio.com." },
      { status: 429 }
    );
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first ? `${first.path.join(".")}: ${first.message}` : "Invalid form data" },
      { status: 400 }
    );
  }
  const d = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: d.name.trim(),
        company: d.company.trim(),
        email: d.email.trim().toLowerCase(),
        phone: d.phone?.trim() || null,
        industry: d.industry,
        projectType: d.projectType,
        location: d.location?.trim() || null,
        projectSize: d.projectSize || null,
        services: d.services,
        timeline: d.timeline || null,
        message: d.message.trim(),
        source: d.source || "contact-form",
        sourceRef: d.sourceRef?.trim() || null,
        userAgent: request.headers.get("user-agent")?.slice(0, 400) || null,
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err: any) {
    console.error("Lead create failed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please email hello@industrialengineeringstudio.com." },
      { status: 500 }
    );
  }
}
