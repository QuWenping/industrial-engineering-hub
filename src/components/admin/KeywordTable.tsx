"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Row = {
  id: string;
  phrase: string;
  intent: string | null;
  priority: string | null;
  volume: number | null;
  difficulty: number | null;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  analyzed: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  published: "bg-green-100 text-green-700",
};

export function KeywordTable({ initialItems }: { initialItems: Row[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function analyze(id: string) {
    setPendingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/keywords/${id}/analyze`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Analyze failed: ${res.status}`);
      }
      const data = await res.json();
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...data.keyword } : r)));
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPendingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this keyword?")) return;
    const res = await fetch(`/api/admin/keywords/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {error && (
        <div className="px-4 py-2 bg-red-50 text-sm text-red-700 border-b border-red-200">
          {error}
        </div>
      )}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
            <th className="px-4 py-3">Keyword</th>
            <th className="px-4 py-3">Intent</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Vol</th>
            <th className="px-4 py-3">Diff</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                No keywords yet. Add your first SEO target phrase to get started.
              </td>
            </tr>
          )}
          {items.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-navy">
                <Link
                  href={`/admin/keywords/${row.id}`}
                  className="hover:text-engineering-blue"
                >
                  {row.phrase}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{row.intent || "—"}</td>
              <td className="px-4 py-3">
                {row.priority ? <Badge variant="outline">{row.priority}</Badge> : "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {row.volume?.toLocaleString() ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">{row.difficulty ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    STATUS_COLORS[row.status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => analyze(row.id)}
                    disabled={pendingId === row.id}
                    title="Analyze with Claude"
                    className="p-1.5 rounded hover:bg-engineering-blue/10 text-engineering-blue disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/admin/keywords/${row.id}`}
                    title="Details"
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => remove(row.id)}
                    title="Delete"
                    className="p-1.5 rounded hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
