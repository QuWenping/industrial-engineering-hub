"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Check, AlertTriangle } from "lucide-react";

interface Props {
  kind: "content" | "calculator";
  id: string;
  slug: string;
  disabled?: boolean;
}

export function PublishButton({ kind, id, slug, disabled }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string; url?: string } | null>(null);

  function doPublish() {
    setResult(null);
    start(async () => {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({
          ok: true,
          message: `Committed ${data.commitSha?.slice(0, 7)} — deploying now.`,
          url: data.commitUrl,
        });
        router.refresh();
      } else {
        setResult({ ok: false, message: data.error ?? "Publish failed" });
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> Publish
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-navy">Publish to production</h3>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm text-slate-700">
              <p>
                This will commit <span className="font-mono bg-slate-100 px-1 rounded">{slug}</span> to GitHub <code>main</code> and trigger a Vercel deploy.
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                The public site will update after deploy completes (~60-90s).
              </p>
              {result && (
                <div className={`p-3 rounded border text-xs ${result.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                  <div className="flex items-center gap-1.5 font-medium">
                    {result.ok ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {result.ok ? "Published!" : "Failed"}
                  </div>
                  <p className="mt-1">{result.message}</p>
                  {result.url && (
                    <a href={result.url} target="_blank" className="underline mt-1 block">
                      View commit on GitHub ↗
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-1.5 rounded bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
              >
                {result?.ok ? "Close" : "Cancel"}
              </button>
              {!result?.ok && (
                <button
                  onClick={doPublish}
                  disabled={isPending}
                  className="px-4 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {isPending ? "Publishing…" : "Confirm & publish"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
