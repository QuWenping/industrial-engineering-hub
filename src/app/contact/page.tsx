import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectAssessmentForm } from "@/components/forms/ProjectAssessmentForm";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Project Assessment — Contact",
  description:
    "Request an engineering project assessment — industrial building design, structural, MEP, chemical, energy or digital engineering for your facility.",
  path: "/contact",
  keywords: [
    "engineering consultation",
    "industrial engineering contact",
    "project assessment",
    "engineering services inquiry",
  ],
});

export default function ContactPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Project Assessment</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Discuss Your Industrial Project
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tell us about your facility, scope and timeline. Our engineering team will review and
            follow up within one business day.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardContent className="p-6 sm:p-8">
                <ProjectAssessmentForm />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-engineering-blue" />
                  <h3 className="font-semibold text-navy">Direct Email</h3>
                </div>
                <a
                  href="mailto:hello@industrialengineeringstudio.com"
                  className="text-sm text-engineering-blue hover:underline break-all"
                >
                  hello@industrialengineeringstudio.com
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  For general inquiries, partnerships or detailed attachments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-engineering-blue" />
                  <h3 className="font-semibold text-navy">Response Time</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Project assessment requests are reviewed by our engineering team. Typical response
                  within <strong className="text-navy">1 business day</strong>.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
