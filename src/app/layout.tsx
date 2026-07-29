import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  title: "Industrial Engineering Hub",
  description:
    "53 free engineering calculators, 30+ technical guides, and 26 material property references. Professional calculators for pipe flow, pump power, steel weight, heat transfer, pressure drop, and more.",
  path: "/",
  keywords: [
    "engineering calculator",
    "industrial engineering",
    "steel weight calculator",
    "pipe flow calculator",
    "pump power",
    "heat exchanger",
    "material density",
    "pressure drop",
    "tank volume",
  ],
});

metadata.metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://industrialengineeringhub.com"
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
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
