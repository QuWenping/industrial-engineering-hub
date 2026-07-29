import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Tools: [
    { href: "/tools/material", label: "Material Engineering" },
    { href: "/tools/mechanical", label: "Mechanical Engineering" },
    { href: "/tools/chemical", label: "Chemical Engineering" },
    { href: "/tools", label: "All Calculators" },
  ],
  Knowledge: [
    { href: "/guides", label: "Engineering Guides" },
    { href: "/reference", label: "Reference Data" },
    { href: "/materials", label: "Material Database" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/editorial-process", label: "Editorial Process" },
    { href: "/data-sources", label: "Data Sources" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow text-white font-bold text-sm">
                IEH
              </div>
              <span className="text-lg font-semibold text-white">IEH</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Professional engineering calculators, knowledge resources and AI tools for engineers worldwide.
            </p>
            <a
              href="mailto:support@industrialengineeringhub.com"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-ai-glow transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@industrialengineeringhub.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-ai-glow transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-slate-700/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Industrial Engineering Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              For Engineering Teams
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
