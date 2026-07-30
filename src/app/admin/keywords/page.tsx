import Link from "next/link";
import { prisma } from "@/lib/db";
import { KeywordTable } from "@/components/admin/KeywordTable";
import { Plus } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function KeywordsPage() {
  const items = await prisma.keyword.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { AiTask: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Keywords</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your SEO keyword library and analyze with the Haiku agent.
          </p>
        </div>
        <Link
          href="/admin/keywords/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-navy/90"
        >
          <Plus className="h-4 w-4" /> New keyword
        </Link>
      </div>

      <KeywordTable initialItems={items as any} />
    </div>
  );
}
