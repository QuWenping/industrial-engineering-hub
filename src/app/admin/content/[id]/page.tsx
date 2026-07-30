import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContentDetailClient } from "@/components/admin/ContentDetailClient";

type Params = Promise<{ id: string }>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ContentDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: {
      Keyword: true,
      Review: { orderBy: { createdAt: "desc" } },
      AiTask: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!item) notFound();

  const keywords = await prisma.keyword.findMany({
    orderBy: { phrase: "asc" },
    select: { id: true, phrase: true },
    take: 500,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{item.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="capitalize">{item.kind}</span>
            <span className="mx-2">·</span>
            <span className="font-mono">{item.slug}</span>
            <span className="mx-2">·</span>
            <Link
              href={`/${item.kind === "guide" ? "guides" : "materials"}/${item.slug}`}
              target="_blank"
              className="text-engineering-blue hover:underline"
            >
              Public ↗
            </Link>
          </p>
        </div>
      </div>
      <ContentDetailClient item={JSON.parse(JSON.stringify(item))} keywords={keywords} />
    </div>
  );
}
