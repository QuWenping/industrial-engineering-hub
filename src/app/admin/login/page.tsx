import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Industrial Engineering Hub",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-slate-900 to-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow flex items-center justify-center text-xl font-bold font-mono text-white">
            Σ
          </div>
          <h1 className="text-xl font-semibold text-white">
            Industrial Engineering Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">Admin Sign-in</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          Restricted area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
