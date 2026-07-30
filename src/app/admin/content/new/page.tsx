import { ContentForm } from "@/components/admin/ContentForm";

export const runtime = "nodejs";

export default function NewContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Content</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a blank content item. You can then generate an AI draft from the detail page.
        </p>
      </div>
      <ContentForm />
    </div>
  );
}
