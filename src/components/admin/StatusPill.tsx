"use client";

import { cn } from "@/lib/utils";
import { STATUS_META, CONTENT_STATES, type ContentStatus } from "@/lib/admin/status-machine";

interface Props {
  status: string;
  onTransition?: (to: ContentStatus) => void;
  allowedNext?: string[];
  isPending?: boolean;
}

export function StatusPill({ status, onTransition, allowedNext, isPending }: Props) {
  const meta = STATUS_META[status as ContentStatus] ?? STATUS_META.keyword;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-medium", meta.color)}>
        {meta.label}
      </span>
      {onTransition && allowedNext && allowedNext.length > 0 && (
        <div className="flex gap-1">
          {allowedNext.map((s) => {
            const m = STATUS_META[s as ContentStatus];
            return (
              <button
                key={s}
                disabled={isPending}
                onClick={() => onTransition(s as ContentStatus)}
                className="text-[11px] px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                title={`Move to ${m?.label ?? s}`}
              >
                → {m?.label ?? s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { CONTENT_STATES };
