import { KeywordForm } from "@/components/admin/KeywordForm";

export const runtime = "nodejs";

export default function NewKeywordPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">New keyword</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add an SEO target phrase. After creating it, run Analyze to generate a content brief.
        </p>
      </div>
      <KeywordForm />
    </div>
  );
}
