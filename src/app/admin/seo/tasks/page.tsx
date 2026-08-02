import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SeoTasksPage() {
  const decisions = await prisma.seoAiDecision.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">SEO AI Decisions</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-generated SEO opportunities from GSC data analysis. Review and approve before execution.
        </p>
      </div>

      {decisions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-400">
            No AI decisions yet. Go to the SEO dashboard and click "Run AI Analysis" to generate opportunities.
          </CardContent>
        </Card>
      ) : (
        decisions.map((d) => {
          const opportunities = (d.actions as any[]) || [];
          return (
            <Card key={d.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{d.recommendation || d.type}</CardTitle>
                  <Badge variant={d.status === "pending" ? "outline" : "secondary"}>{d.status}</Badge>
                </div>
                <p className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleString()}</p>
              </CardHeader>
              <CardContent>
                {opportunities.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="text-slate-500 text-left">
                      <tr>
                        <th className="py-1.5 font-medium">Priority</th>
                        <th className="font-medium">Action</th>
                        <th className="font-medium">Target</th>
                        <th className="font-medium">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {opportunities.map((o: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-1.5">
                            <Badge variant="outline" className={o.priority > 70 ? "text-red-600 border-red-300" : o.priority > 40 ? "text-amber-600 border-amber-300" : "text-slate-500"}>
                              {o.priority}
                            </Badge>
                          </td>
                          <td className="text-slate-700 text-xs">{o.action}</td>
                          <td className="text-navy font-medium text-xs">{o.target}</td>
                          <td className="text-slate-500 text-xs">{o.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-slate-400">No opportunities in this decision.</p>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
