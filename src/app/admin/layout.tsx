// Admin layout — Node runtime (Prisma may be used in children). No public-site header/footer.
// Proxy already gates access; this provides defense in depth (e.g. for static export edge cases)
// and renders the shell (sidebar + content area).
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/Sidebar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Industrial Engineering Hub",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">Industrial Engineering Hub Admin</div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="text-sm text-slate-600 hover:text-navy transition-colors"
            >
              Sign out
            </button>
          </form>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
