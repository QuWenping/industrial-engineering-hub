"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_META, type ContentStatus } from "@/lib/admin/status-machine";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  slug: string;
  kind: "guide" | "material";
  title: string;
  description: string;
  category?: string | null;
  status: string;
  updatedAt: string;
  seoScore?: number | null;
  _count?: { Review: number };
}

interface Props {
  items: Item[];
  initialKind?: string;
}

export function ContentListClient({ items, initialKind }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setKind(k: string) {
    const url = k === "all" ? "/admin/content" : `/admin/content?kind=${k}`;
    router.push(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 text-sm">
        {(["all", "guide", "material"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={cn(
              "px-3 py-1.5 rounded capitalize",
              (!initialKind && k === "all") || initialKind === k
                ? "bg-navy text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Reviews</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No content yet.
                </td>
              </tr>
            )}
            {items.map((c) => {
              const meta = STATUS_META[c.status as ContentStatus] ?? STATUS_META.keyword;
              return (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/content/${c.id}`} className="font-medium text-navy hover:underline">
                      {c.title}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono">{c.slug}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{c.kind}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-medium", meta.color)}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c.seoScore != null ? `${c.seoScore}/100` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c._count?.Review ?? 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
