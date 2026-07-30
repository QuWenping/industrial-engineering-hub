"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ContentForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    kind: "guide" as "guide" | "material",
    title: "",
    description: "",
    category: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [isPending, start] = useTransition();

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "title" && !form.slug) {
      const slug = String(v)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      setForm((f) => ({ ...f, [k]: v, slug }));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Failed to create");
      } else {
        router.push(`/admin/content/${data.item.id}`);
      }
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 bg-white p-6 border border-slate-200 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kind</label>
        <select
          value={form.kind}
          onChange={(e) => update("kind", e.target.value as "guide" | "material")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
        >
          <option value="guide">Guide</option>
          <option value="material">Material reference</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="Pipe Flow Calculations: A Complete Guide"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Slug (kebab-case)</label>
        <input
          required
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
          placeholder="pipe-flow-guide"
          pattern="^[a-z0-9-]+$"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <input
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="Fluid Mechanics"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="Meta description, 150-320 chars…"
        />
      </div>
      {err && <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{err}</div>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
      >
        {isPending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
