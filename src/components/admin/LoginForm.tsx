"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Admin Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "w-full pl-9 pr-3 py-2.5 rounded-md border text-sm",
              "bg-white border-slate-300",
              "focus:outline-none focus:ring-2 focus:ring-engineering-blue/40 focus:border-engineering-blue"
            )}
            placeholder="Enter admin password"
            autoFocus
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !password}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors",
          "bg-navy text-white hover:bg-navy/90",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <LogIn className="h-4 w-4" />
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
