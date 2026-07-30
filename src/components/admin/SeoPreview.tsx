"use client";

import { useMemo } from "react";

interface Props {
  title: string;
  description: string;
  slug: string;
  kind: "guide" | "material";
}

export function SeoPreview({ title, description, slug, kind }: Props) {
  const url = useMemo(() => {
    const prefix = kind === "guide" ? "/guides" : "/materials";
    return `industrial-engineering-hub.com${prefix}/${slug}`;
  }, [slug, kind]);

  const titleOk = title.length >= 30 && title.length <= 65;
  const descOk = description.length >= 120 && description.length <= 170;

  return (
    <div className="max-w-xl p-4 border border-slate-200 rounded-lg bg-white">
      <div className="text-sm text-[#1a0dab] font-medium truncate">{title || "(no title)"}</div>
      <div className="text-xs text-[#006621] mt-0.5">{url}</div>
      <div className="text-xs text-slate-600 mt-1 line-clamp-2">
        {description || "(no description)"}
      </div>
      <div className="mt-3 flex gap-3 text-[11px]">
        <span className={titleOk ? "text-green-700" : "text-amber-600"}>
          Title: {title.length}/65 {titleOk ? "✓" : "!"}
        </span>
        <span className={descOk ? "text-green-700" : "text-amber-600"}>
          Desc: {description.length}/170 {descOk ? "✓" : "!"}
        </span>
      </div>
    </div>
  );
}
