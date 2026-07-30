"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function KeywordForm() {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase, notes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }
      router.push("/admin/keywords");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 bg-white p-6 rounded-lg border border-slate-200">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Keyword phrase <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="e.g. pipe pressure drop calculator"
          className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-engineering-blue/40 focus:border-engineering-blue"
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Seed intent, target page type, related keywords..."
          className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-engineering-blue/40 focus:border-engineering-blue"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading || !phrase.trim()}
          className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create keyword"}
        </button>
        <Link
          href="/admin/keywords"
          className="px-4 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
