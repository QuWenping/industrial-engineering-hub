import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { constructMetadata } from "@/components/seo/SEO";
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

export const metadata: Metadata = constructMetadata({
  title: "Industrial Engineering Hub",
  description:
    "Professional engineering calculators, knowledge resources and AI tools for engineers worldwide. Material weight, pipe flow, pump power, heat transfer, and more.",
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
      </body>
    </html>
  );
}
