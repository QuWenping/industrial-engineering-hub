"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calculator,
  FileText,
  ClipboardCheck,
  Bot,
  Database,
  Settings,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/keywords", label: "Keywords", icon: Search },
  { href: "/admin/calculators", label: "Calculators", icon: Calculator },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: ClipboardCheck },
  { href: "/admin/ai-tasks", label: "AI Tasks", icon: Bot },
  { href: "/admin/materials", label: "Materials", icon: Database },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-navy text-white flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-engineering-blue to-ai-glow flex items-center justify-center text-xs font-bold font-mono">
            Σ
          </div>
          <span className="text-sm font-semibold tracking-tight">IEH Admin</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-engineering-blue/20 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-[11px] text-slate-400">
        V0.2 · {process.env.NODE_ENV === "development" ? "Local" : "Production"}
      </div>
    </aside>
  );
}
