import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { STATUS_META, type ContentStatus } from "@/lib/admin/status-machine";
import { ContentListClient } from "@/components/admin/ContentListClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const kindFilter = sp.kind as "guide" | "material" | undefined;

  const where = {
    ...(kindFilter ? { kind: kindFilter } : {}),
    ...(sp.status ? { status: sp.status } : {}),
  };

  const items = await prisma.contentItem.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { _count: { select: { Review: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Content</h1>
          <p className="text-sm text-slate-500 mt-1">
            Guides and material references — draft with AI, review, then publish.
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-navy/90"
        >
          <Plus className="h-4 w-4" /> New content
        </Link>
      </div>

      <ContentListClient items={items as any} initialKind={kindFilter} />
    </div>
  );
}
