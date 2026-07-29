"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calculator, BookOpen, Database, Building2 } from "lucide-react";

const navItems = [
  { href: "/tools", label: "Tools", icon: Calculator },
  { href: "/guides", label: "Knowledge", icon: BookOpen },
  { href: "/materials", label: "Database", icon: Database },
  { href: "/enterprise", label: "Enterprise", icon: Building2 },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow text-white font-bold text-sm shadow-lg shadow-engineering-blue/20">
              IEH
            </div>
            <span className="text-lg font-semibold text-navy hidden sm:block">
              Industrial Engineering Hub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-navy rounded-md hover:bg-muted/60 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tools"
              className="btn-primary-gradient text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md inline-flex items-center"
            >
              Explore Tools
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-navy rounded-md hover:bg-muted/60"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/tools"
                onClick={() => setMobileOpen(false)}
                className="btn-primary-gradient text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md w-full flex justify-center"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
