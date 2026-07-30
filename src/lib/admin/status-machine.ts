// Content status machine. Defines legal transitions and display metadata.
// Flow: keyword → brief_generated → ai_draft → engineering_review → seo_review → published
//                   (archived from any state)
//                   (ai_draft loops back if revision requested)

export const CONTENT_STATES = [
  "keyword",
  "brief_generated",
  "ai_draft",
  "engineering_review",
  "seo_review",
  "published",
  "archived",
] as const;

export type ContentStatus = (typeof CONTENT_STATES)[number];

// Allowed next-states for a given source state.
const TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  keyword: ["brief_generated", "archived"],
  brief_generated: ["ai_draft", "archived"],
  ai_draft: ["engineering_review", "ai_draft", "archived"], // revise loops back
  engineering_review: ["seo_review", "ai_draft", "archived"],
  seo_review: ["published", "engineering_review", "archived"],
  published: ["archived"],
  archived: [],
};

export function canTransition(from: string, to: string): boolean {
  const allowed = TRANSITIONS[from as ContentStatus];
  return !!allowed && allowed.includes(to as ContentStatus);
}

export const STATUS_META: Record<ContentStatus, { label: string; color: string }> = {
  keyword: { label: "Keyword", color: "bg-slate-100 text-slate-700" },
  brief_generated: { label: "Brief ready", color: "bg-blue-100 text-blue-700" },
  ai_draft: { label: "AI draft", color: "bg-purple-100 text-purple-700" },
  engineering_review: { label: "Eng review", color: "bg-amber-100 text-amber-700" },
  seo_review: { label: "SEO review", color: "bg-indigo-100 text-indigo-700" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-slate-200 text-slate-500" },
};

export const CALCULATOR_STATES = [
  "draft",
  "review",
  "approved",
  "published",
  "archived",
] as const;

export type CalculatorStatus = (typeof CALCULATOR_STATES)[number];

export function canTransitionCalc(from: string, to: string): boolean {
  const flow: Record<string, string[]> = {
    draft: ["review", "archived"],
    review: ["approved", "draft", "archived"],
    approved: ["published", "review", "archived"],
    published: ["archived"],
    archived: [],
  };
  const allowed = flow[from];
  return !!allowed && allowed.includes(to);
}
