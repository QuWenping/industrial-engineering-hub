import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { GatedAnalytics } from "@/components/consent/GatedAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { constructMetadata, schemaOrganization, schemaWebsiteSearch } from "@/components/seo/SEO";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = constructMetadata({
  title: "Industrial Engineering Studio",
  description:
    "Industrial engineering services for factories, energy facilities, chemical plants and infrastructure projects. Structural, MEP, process and digital engineering, plus 50+ free engineering calculators.",
  path: "/",
  keywords: [
    "industrial engineering",
    "industrial building design",
    "structural engineering",
    "battery factory design",
    "chemical plant engineering",
    "HVAC engineering",
    "MEP design",
    "digital engineering",
    "engineering calculator",
    "steel weight calculator",
    "pipe flow calculator",
  ],
});

metadata.metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringstudio.com"
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-light-bg">
        <TooltipProvider>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </TooltipProvider>
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization()) }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebsiteSearch()) }}
        />
        <GatedAnalytics gaId={GA_ID} />
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}
