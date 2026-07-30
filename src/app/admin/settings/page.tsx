import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Database, Bot, GitBranch, Globe } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function check(name: string, present: boolean) {
  return { name, present };
}

export default async function SettingsPage() {
  const checks = [
    check("DATABASE_URL (Neon Postgres)", !!process.env.DATABASE_URL),
    check("ADMIN_PASSWORD_HASH", !!process.env.ADMIN_PASSWORD_HASH),
    check("ADMIN_SECRET (HMAC key)", !!process.env.ADMIN_SECRET),
    check("ANTHROPIC_API_KEY", !!process.env.ANTHROPIC_API_KEY),
    check("GITHUB_TOKEN (contents:write)", !!process.env.GITHUB_TOKEN),
    check("GITHUB_REPO (owner/repo)", !!process.env.GITHUB_REPO),
    check("VERCEL_DEPLOY_HOOK_URL", !!process.env.VERCEL_DEPLOY_HOOK_URL),
    check("REVALIDATE_SECRET", !!process.env.REVALIDATE_SECRET),
  ];

  // DB ping
  let dbOk = false;
  let dbErr = "";
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e: any) {
    dbErr = e.message;
  }

  const missing = checks.filter((c) => !c.present).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Settings & Health</h1>
        <p className="text-sm text-slate-500 mt-1">
          Environment configuration and connectivity status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HealthCard icon={Database} label="Database" ok={dbOk} detail={dbOk ? "Connected" : dbErr.slice(0, 60)} />
        <HealthCard icon={Bot} label="Anthropic" ok={!!process.env.ANTHROPIC_API_KEY} detail={process.env.ANTHROPIC_API_KEY ? "Key present" : "Missing"} />
        <HealthCard icon={GitBranch} label="GitHub" ok={!!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)} detail={process.env.GITHUB_REPO ?? "Not configured"} />
        <HealthCard icon={Globe} label="Deploy hook" ok={!!process.env.VERCEL_DEPLOY_HOOK_URL} detail={process.env.VERCEL_DEPLOY_HOOK_URL ? "Ready" : "Missing"} />
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Environment variables</CardTitle>
        </CardHeader>
        <CardContent>
          {missing > 0 && (
            <div className="mb-3 px-3 py-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {missing} variable(s) missing. See <code>.env.example</code> for required values.
            </div>
          )}
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {checks.map((c) => (
                <tr key={c.name}>
                  <td className="py-2 pr-4 font-mono text-xs">{c.name}</td>
                  <td className="py-2">
                    {c.present ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs">
                        <XCircle className="h-3.5 w-3.5" /> missing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  label,
  ok,
  detail,
}: {
  icon: any;
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <Card className={ok ? "border-green-200 bg-green-50/40" : "border-red-200 bg-red-50/40"}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${ok ? "text-green-700" : "text-red-600"}`} />
          <div>
            <div className="text-sm font-semibold text-navy">{label}</div>
            <div className="text-xs text-slate-500">{detail}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
