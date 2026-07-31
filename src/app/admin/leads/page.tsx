import { prisma } from "@/lib/db";
import { LeadTable } from "@/components/admin/LeadTable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const [items, byStatus] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true, name: true, company: true, email: true, industry: true,
        projectType: true, source: true, sourceRef: true, status: true,
        createdAt: true, contactedAt: true,
      },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Leads</h1>
        <p className="text-sm text-slate-500 mt-1">
          Project assessment requests from the contact form. Change status as you follow up.
          New submissions also post to the Discord webhook.
        </p>
      </div>
      <LeadTable initialItems={items as any} byStatus={byStatus as any} />
    </div>
  );
}
