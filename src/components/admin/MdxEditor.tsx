"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MdxPreview } from "./MdxPreview";

interface Props {
  initialBody: string;
  contentId: string;
}

export function MdxEditor({ initialBody, contentId }: Props) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [isSaving, startSave] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // Word count and simple SEO heuristics
  const stats = useMemo(() => {
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    const h2Count = (body.match(/^##\s/gm) || []).length;
    const hasFormula = /<Formula>/.test(body);
    const hasCta = /<Calculator/.test(body);
    const hasFaq = /^##\s*FAQ/m.test(body);
    return { words, h2Count, hasFormula, hasCta, hasFaq };
  }, [body]);

  async function save() {
    startSave(async () => {
      const res = await fetch(`/api/admin/content/${contentId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bodyMdx: body }),
      });
      if (res.ok) {
        setMsg("Saved ✓");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg(`Error: ${d.error ?? res.statusText}`);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-sm">
          <button
            onClick={() => setTab("edit")}
            className={`px-3 py-1.5 rounded ${tab === "edit" ? "bg-navy text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Edit
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`px-3 py-1.5 rounded ${tab === "preview" ? "bg-navy text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Preview
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{stats.words} words</span>
          <span>{stats.h2Count} H2</span>
          <span className={stats.hasFormula ? "text-green-700" : "text-amber-600"}>
            {stats.hasFormula ? "✓ Formula" : "no <Formula>"}
          </span>
          <span className={stats.hasCta ? "text-green-700" : "text-amber-600"}>
            {stats.hasCta ? "✓ CTA" : "no <Calculator>"}
          </span>
          <span className={stats.hasFaq ? "text-green-700" : "text-amber-600"}>
            {stats.hasFaq ? "✓ FAQ" : "no FAQ"}
          </span>
          <button
            onClick={save}
            disabled={isSaving}
            className="ml-2 px-3 py-1 rounded bg-navy text-white disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {msg && <div className="text-xs px-3 py-1.5 rounded bg-slate-100 text-slate-700">{msg}</div>}

      {tab === "edit" ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          spellCheck={false}
          className="w-full h-[600px] font-mono text-xs p-3 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-engineering-blue/30"
        />
      ) : (
        <div className="border border-slate-200 rounded-md p-6 prose prose-sm max-w-none bg-white min-h-[600px]">
          <MdxPreview source={body} />
        </div>
      )}
    </div>
  );
}
