import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Brain, Database, Shield, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = constructMetadata({
  title: "For Engineering Teams — Enterprise",
  description: "Industrial Engineering Hub for engineering teams — AI Knowledge Platform, internal standards integration, and enterprise engineering intelligence.",
  path: "/enterprise",
});

const features = [
  {
    icon: Brain,
    title: "AI Engineering Assistant",
    description: "AI-powered engineering Q&A trained on your internal standards, equipment data sheets, and project specifications. Get instant answers grounded in your company's engineering knowledge.",
  },
  {
    icon: Database,
    title: "Internal Knowledge Platform",
    description: "Upload your standards, CAD data, calculation sheets, and vendor catalogs. Build a searchable, AI-accessible knowledge base for your engineering team.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Enterprise-grade security. Your data stays private and is never used to train public models. On-premise deployment options available.",
  },
];

export default function EnterprisePage() {
  return (
    <div className="bg-dark-bg text-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-ai-glow/10 text-ai-glow border-ai-glow/30">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            For Engineering Teams
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            <span className="text-gradient-hero">AI Knowledge Platform</span>
            <br />
            <span className="text-white/90">for Engineering Organizations</span>
          </h1>
          <p className="text-lg text-slate-300/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Empower your engineering team with AI that understands your internal standards, equipment
            data, and project history. Built on the same engineering rigor as Industrial Engineering Hub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:enterprise@industrialengineeringhub.com"
              className="btn-primary-gradient text-white text-base font-medium px-8 h-12 rounded-lg inline-flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Request Enterprise Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-hero-card border-white/10 bg-white/[0.03]">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-engineering-blue to-ai-glow mb-4">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center glass-hero-card rounded-xl p-8 border-white/10">
          <h2 className="text-xl font-bold text-white mb-2">Interested?</h2>
          <p className="text-slate-400 mb-4">
            Contact us for a tailored demo and discussion of your engineering team's needs.
          </p>
          <a
            href="mailto:enterprise@industrialengineeringhub.com"
            className="text-ai-glow font-medium hover:underline"
          >
            enterprise@industrialengineeringhub.com
          </a>
        </div>
      </div>
    </div>
  );
}
