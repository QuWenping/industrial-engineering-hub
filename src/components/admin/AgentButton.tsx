"use client";

import { useState, useTransition } from "react";
import { Bot, Play, X } from "lucide-react";

interface Props {
  agent: "keyword" | "writer" | "reviewer" | "calc-writer";
  keywordId?: string;
  contentId?: string;
  input?: Record<string, unknown>;
  label?: string;
  variant?: "primary" | "secondary";
  onDone?: (output: unknown) => void;
}

export function AgentButton({
  agent,
  keywordId,
  contentId,
  input,
  label,
  variant = "primary",
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<{ type: string; data: any }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const defaultLabel = {
    keyword: "Analyze keyword",
    writer: "Draft with AI",
    reviewer: "AI Review",
    "calc-writer": "Build calculator",
  }[agent];

  async function run() {
    setOpen(true);
    setIsRunning(true);
    setEvents([]);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai-tasks/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent, keywordId, contentId, input }),
      });

      if (!res.ok || !res.body) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status}: ${t}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        let currentEvent = "message";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            try {
              const parsed = JSON.parse(data);
              setEvents((prev) => [...prev, { type: currentEvent, data: parsed }]);
              if (currentEvent === "done") {
                onDone?.(parsed.output);
              }
              if (currentEvent === "error") {
                setError(parsed.message);
              }
            } catch {
              // ignore parse errors on partial chunks
            }
          }
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <>
      <button
        onClick={run}
        disabled={isRunning}
        className={
          variant === "primary"
            ? "inline-flex items-center gap-1.5 bg-ai-glow text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-ai-glow/90 disabled:opacity-50"
            : "inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        }
      >
        <Bot className="h-4 w-4" />
        {isRunning ? "Running…" : label ?? defaultLabel}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-navy flex items-center gap-2">
                <Bot className="h-4 w-4 text-ai-glow" />
                {defaultLabel}
              </h3>
              <button
                onClick={() => setOpen(false)}
                disabled={isRunning}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-2">
              {events.length === 0 && !error && (
                <div className="text-slate-400">Waiting for response…</div>
              )}
              {events.map((e, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-slate-400 uppercase text-[10px]">{e.type}</div>
                  <pre className="bg-slate-50 p-2 rounded border border-slate-200 whitespace-pre-wrap break-words text-slate-700">
                    {summarize(e.type, e.data)}
                  </pre>
                </div>
              ))}
              {error && (
                <div className="text-red-700 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={isRunning}
                className="px-4 py-1.5 rounded bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 disabled:opacity-50"
              >
                {isRunning ? "Running…" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function summarize(type: string, data: any): string {
  if (type === "progress") {
    return `${data.stage}${data.phrase ? `: ${data.phrase}` : ""}${data.title ? `: ${data.title}` : ""}`;
  }
  if (type === "done") {
    return `✓ Done — tokens in=${data.tokensIn}, out=${data.tokensOut}, cost=$${(data.costUsd ?? 0).toFixed(4)}`;
  }
  try {
    return JSON.stringify(data, null, 2).slice(0, 2000);
  } catch {
    return String(data);
  }
}
