import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Services: [
    { href: "/services/industrial-building-design", label: "Industrial Building Design" },
    { href: "/services/structural-engineering", label: "Structural Engineering" },
    { href: "/services/hvac-mep-engineering", label: "HVAC & MEP Engineering" },
    { href: "/services/chemical-plant-engineering", label: "Chemical Plant Engineering" },
    { href: "/services/energy-facility-engineering", label: "Energy Facility Engineering" },
    { href: "/services/digital-engineering", label: "Digital Engineering" },
  ],
  Industries: [
    { href: "/industries/battery-factory", label: "Battery Manufacturing" },
    { href: "/industries/chemical-plant", label: "Chemical Plants" },
    { href: "/industries/energy-facility", label: "Energy Facilities" },
    { href: "/industries/smart-factory", label: "Smart Factories" },
  ],
  Tools: [
    { href: "/tools", label: "Engineering Calculators" },
    { href: "/guides", label: "Engineering Insights" },
    { href: "/materials", label: "Material Database" },
    { href: "/projects", label: "Project Case Studies" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/sitemap", label: "Sitemap" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow text-white font-bold text-sm">
                IES
              </div>
              <span className="text-lg font-semibold text-white">IE Studio</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Industrial facility design &amp; digital engineering solutions for factories, energy facilities and chemical plants worldwide.
            </p>
            <a
              href="mailto:hello@industrialengineeringstudio.com"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-ai-glow transition-colors"
            >
              <Mail className="h-4 w-4" />
              hello@industrialengineeringstudio.com
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
          <p>&copy; {new Date().getFullYear()} Industrial Engineering Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <CookieSettingsLink />
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 hover:text-ai-glow transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Discuss your project
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
