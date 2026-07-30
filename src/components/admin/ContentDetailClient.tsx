"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MdxEditor } from "./MdxEditor";
import { SeoPreview } from "./SeoPreview";
import { StatusPill } from "./StatusPill";
import { AgentButton } from "./AgentButton";
import { PublishButton } from "./PublishButton";
import type { CONTENT_STATES, ContentStatus } from "@/lib/admin/status-machine";

// Map current status to allowed next states (mirror status-machine.ts transitions)
const NEXT_STATES: Record<string, string[]> = {
  keyword: ["brief_generated", "archived"],
  brief_generated: ["ai_draft", "archived"],
  ai_draft: ["engineering_review", "archived"],
  engineering_review: ["seo_review", "ai_draft", "archived"],
  seo_review: ["published", "engineering_review", "archived"],
  published: ["archived"],
  archived: [],
};

interface Keyword {
  id: string;
  phrase: string;
}

interface ReviewItem {
  id: string;
  reviewer: string;
  scoreAccuracy: number | null;
  scoreLogic: number | null;
  scoreSeo: number | null;
  scoreOrig: number | null;
  overall: number | null;
  verdict: string | null;
  comments: any;
  createdAt: string;
}

interface ContentItem {
  id: string;
  slug: string;
  kind: "guide" | "material";
  title: string;
  description: string;
  category: string | null;
  keywords: string[];
  bodyMdx: string;
  frontmatter: any;
  status: string;
  seoScore: number | null;
  keywordId: string | null;
  Review: ReviewItem[];
}

interface Props {
  item: ContentItem;
  keywords: Keyword[];
}

export function ContentDetailClient({ item, keywords }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"write" | "seo" | "reviews" | "meta">("write");
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category ?? "");
  const [isTransition, startTransition] = useTransition();

  async function patch(data: Record<string, unknown>) {
    await fetch(`/api/admin/content/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  }

  function handleTransition(to: ContentStatus) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/content/${item.id}/transition`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to }),
      });
      if (res.ok) router.refresh();
    });
  }

  async function saveMeta() {
    await patch({ title, description, category });
    router.refresh();
  }

  const allowedNext = NEXT_STATES[item.status] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <StatusPill
          status={item.status}
          onTransition={handleTransition}
          allowedNext={allowedNext}
          isPending={isTransition}
        />
        <div className="flex items-center gap-2">
          {item.bodyMdx && item.bodyMdx.length > 200 && (
            <AgentButton agent="reviewer" contentId={item.id} label="AI Review" variant="secondary" />
          )}
          {(item.status === "seo_review" || item.status === "approved" || item.status === "published") && (
            <PublishButton kind="content" id={item.id} slug={item.slug} />
          )}
          <label className="text-sm text-slate-500">Linked keyword:</label>
          <select
            defaultValue={item.keywordId ?? ""}
            onChange={(e) => patch({ keywordId: e.target.value || null })}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="">— none —</option>
            {keywords.map((k) => (
              <option key={k.id} value={k.id}>
                {k.phrase}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-1 text-sm border-b border-slate-200">
        {(["write", "seo", "reviews", "meta"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 border-b-2 transition-colors capitalize ${
              tab === t
                ? "border-engineering-blue text-engineering-blue font-medium"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "write" && <MdxEditor initialBody={item.bodyMdx} contentId={item.id} />}

      {tab === "seo" && (
        <div className="space-y-4">
          <SeoPreview title={title} description={description} slug={item.slug} kind={item.kind} />
          <div className="max-w-xl space-y-3 bg-white p-4 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">SEO Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => patch({ title })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Meta description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => patch({ description })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {tab === "reviews" && <ReviewsTab item={item} />}

      {tab === "meta" && (
        <div className="max-w-xl space-y-3 bg-white p-4 border border-slate-200 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Slug</label>
            <input value={item.slug} disabled className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded text-sm font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={saveMeta}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Keywords (comma-separated)</label>
            <input
              defaultValue={item.keywords.join(", ")}
              onBlur={(e) =>
                patch({
                  keywords: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ item }: { item: ContentItem }) {
  const router = useRouter();
  const [scores, setScores] = useState({ acc: 80, log: 80, seo: 80, orig: 80 });
  const [verdict, setVerdict] = useState<"publish" | "revise" | "rewrite">("revise");
  const [comments, setComments] = useState("");
  const [isPending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: item.id,
          scoreAccuracy: scores.acc,
          scoreLogic: scores.log,
          scoreSeo: scores.seo,
          scoreOrig: scores.orig,
          verdict,
          comments: comments.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      setComments("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {item.Review.length === 0 && (
          <div className="text-sm text-slate-400 italic">No reviews yet. Submit one below or run an AI review from AI Tasks.</div>
        )}
        {item.Review.map((r) => (
          <div key={r.id} className="bg-white p-4 border border-slate-200 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium text-navy capitalize">{r.reviewer}</div>
              <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-3 text-xs">
              <Score label="Accuracy" v={r.scoreAccuracy} />
              <Score label="Logic" v={r.scoreLogic} />
              <Score label="SEO" v={r.scoreSeo} />
              <Score label="Originality" v={r.scoreOrig} />
              <Score label="Overall" v={r.overall} bold />
            </div>
            {r.verdict && (
              <div className="mt-2 text-xs">
                Verdict: <span className="font-mono font-semibold">{r.verdict}</span>
              </div>
            )}
            {r.comments?.items && (
              <ul className="mt-2 list-disc list-inside text-xs text-slate-600 space-y-0.5">
                {r.comments.items.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="bg-white p-4 border border-slate-200 rounded-lg space-y-3 max-w-xl">
        <h3 className="font-medium text-sm text-navy">Add human review</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <NumInput label="Accuracy (40%)" v={scores.acc} set={(v) => setScores({ ...scores, acc: v })} />
          <NumInput label="Logic (30%)" v={scores.log} set={(v) => setScores({ ...scores, log: v })} />
          <NumInput label="SEO (20%)" v={scores.seo} set={(v) => setScores({ ...scores, seo: v })} />
          <NumInput label="Originality (10%)" v={scores.orig} set={(v) => setScores({ ...scores, orig: v })} />
        </div>
        <select
          value={verdict}
          onChange={(e) => setVerdict(e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="publish">Publish</option>
          <option value="revise">Revise</option>
          <option value="rewrite">Rewrite</option>
        </select>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          placeholder="Comments (one per line)…"
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {isPending ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </div>
  );
}

function Score({ label, v, bold }: { label: string; v: number | null; bold?: boolean }) {
  return (
    <div>
      <div className="text-slate-500">{label}</div>
      <div className={bold ? "font-bold text-navy text-base" : "text-navy font-mono"}>{v ?? "—"}</div>
    </div>
  );
}

function NumInput({ label, v, set }: { label: string; v: number; set: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-600">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={v}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
      />
    </label>
  );
}
