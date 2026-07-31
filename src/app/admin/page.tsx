import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText, Database, Bot, DollarSign, Clock } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    calcCount,
    guideCount,
    materialCount,
    pendingReview,
    publishedContent,
    aiTasksToday,
    costAggregate,
  ] = await Promise.all([
    prisma.calculator.count(),
    prisma.contentItem.count({ where: { kind: "guide" } }),
    prisma.contentItem.count({ where: { kind: "material" } }),
    prisma.contentItem.count({
      where: { status: { in: ["engineering_review", "seo_review"] } },
    }),
    prisma.contentItem.count({ where: { status: "published" } }),
    prisma.aiTask.count({ where: { createdAt: { gte: today } } }),
    prisma.aiTask.aggregate({
      _sum: { costUsd: true },
      where: { createdAt: { gte: today } },
    }),
  ]);

  const todayCost = costAggregate._sum.costUsd ?? 0;

  const stats = [
    { label: "Calculators", value: calcCount, icon: Calculator, color: "text-engineering-blue", href: "/admin/calculators" },
    { label: "Guides", value: guideCount, icon: FileText, color: "text-ai-glow", href: "/admin/content?kind=guide" },
    { label: "Materials", value: materialCount, icon: Database, color: "text-accent-green", href: "/admin/content?kind=material" },
    { label: "Pending review", value: pendingReview, icon: Clock, color: "text-amber-600", href: "/admin/content" },
    { label: "AI tasks today", value: aiTasksToday, icon: Bot, color: "text-purple-600", href: "/admin/ai-tasks" },
    { label: "Cost today", value: `$${todayCost.toFixed(3)}`, icon: DollarSign, color: "text-slate-700", href: "/admin/ai-tasks" },
  ];

  const recentTasks = await prisma.aiTask.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { Keyword: true, ContentItem: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Industrial Engineering Studio admin console · {now.toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="border-slate-200 hover:border-engineering-blue/40 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${s.color}`} />
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy">{s.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-ai-glow" />
            Recent AI tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No AI tasks yet. Start from a <Link href="/admin/keywords" className="text-engineering-blue underline">keyword</Link>.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-sm">
              {recentTasks.map((t) => (
                <div key={t.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{t.agent}</span>
                    <span className="text-slate-700">
                      {t.Keyword?.phrase ?? t.ContentItem?.title ?? "(unlinked)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className={`font-medium ${
                      t.status === "done" ? "text-green-700" :
                      t.status === "failed" ? "text-red-700" :
                      t.status === "running" ? "text-blue-700" : "text-slate-500"
                    }`}>
                      {t.status}
                    </span>
                    <span className="font-mono">{t.costUsd ? `$${t.costUsd.toFixed(4)}` : "—"}</span>
                    <span>{new Date(t.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Workflow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p>1. Add seed keywords in <Link href="/admin/keywords" className="text-engineering-blue underline">Keywords</Link> and run <strong>Analyze with Haiku</strong> to generate a brief.</p>
          <p>2. From the keyword, click <strong>Draft guide →</strong> or <strong>Build calculator</strong> to run Sonnet agents.</p>
          <p>3. Review AI output in <Link href="/admin/content" className="text-engineering-blue underline">Content</Link>; use <strong>AI Review</strong> for scoring.</p>
          <p>4. Move through states: ai_draft → eng review → seo review → published, then click <strong>Publish</strong> to commit to GitHub and trigger Vercel deploy.</p>
          <p className="text-xs text-slate-400 mt-3">Admin runs locally (Vercel Hobby 10s limit). Content truth source is git.</p>
        </CardContent>
      </Card>
    </div>
  );
}
