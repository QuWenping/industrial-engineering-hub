import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, FileText, Building2 } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Contact Industrial Engineering Hub",
  description: "Contact Industrial Engineering Hub for questions, feedback, or enterprise inquiries.",
  path: "/contact",
});

const contactMethods = [
  {
    icon: Mail,
    title: "General Inquiries",
    detail: "support@industrialengineeringhub.com",
    href: "mailto:support@industrialengineeringhub.com",
    description: "Questions about calculators, content corrections, or general feedback.",
  },
  {
    icon: Building2,
    title: "Enterprise",
    detail: "enterprise@industrialengineeringhub.com",
    href: "mailto:enterprise@industrialengineeringhub.com",
    description: "Engineering teams, enterprise AI knowledge platform demos, and partnerships.",
  },
  {
    icon: FileText,
    title: "Content Contributions",
    detail: "content@industrialengineeringhub.com",
    href: "mailto:content@industrialengineeringhub.com",
    description: "Engineering contributors, technical reviewers, and subject matter experts.",
  },
  {
    icon: MessageSquare,
    title: "Report an Issue",
    detail: "support@industrialengineeringhub.com",
    href: "mailto:support@industrialengineeringhub.com",
    description: "Found a calculation error, broken link, or have a suggestion?",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Contact</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We value feedback from engineers. Whether you've found an error, have a suggestion, or want
            to discuss enterprise solutions, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((method) => (
            <Card key={method.title} className="border-border/60 card-hover">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10 shrink-0">
                    <method.icon className="h-5 w-5 text-engineering-blue" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-navy text-lg mb-1">{method.title}</h2>
                    <a
                      href={method.href}
                      className="text-engineering-blue font-medium hover:underline text-sm"
                    >
                      {method.detail}
                    </a>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-navy text-white rounded-xl p-8">
          <h2 className="text-xl font-bold mb-4">Response Time</h2>
          <p className="text-slate-300 leading-relaxed">
            We typically respond to emails within 2-3 business days. For urgent correction of
            calculation errors, please include the calculator URL and a description of the issue in
            your message — engineering accuracy is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
}
