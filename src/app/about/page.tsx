import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Award, Mail } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Industrial Engineering Hub",
  description:
    "Industrial Engineering Hub provides professional engineering calculators, technical references, and knowledge resources for engineers worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Engineering Intelligence for Modern Industry
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We build tools and knowledge resources that help engineers make better decisions, faster.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-navy">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Industrial Engineering Hub exists to make engineering knowledge accessible and calculations
            reliable. Every engineer — whether working in a design institute, operating a chemical plant,
            or specifying equipment for a manufacturing line — deserves access to accurate, well-explained
            engineering tools backed by real standards.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are building the engineering knowledge platform we wished existed when we were practicing:
            calculators that show their work, references that cite their sources, and guides written by
            people who have done the job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Target,
              title: "Accuracy First",
              description: "Every calculator is formula-tested against real-world examples with <0.1% tolerance. Formulas cite ASTM, ASME, API and other industry standards.",
            },
            {
              icon: Users,
              title: "Engineer Built",
              description: "Our tools are designed by practicing engineers for practicing engineers. No marketing fluff, no dumbed-down engineering.",
            },
            {
              icon: Award,
              title: "Transparent Process",
              description: "We document our editorial process, data sources, and calculation methodology openly. See how content is created and reviewed.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/60">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-engineering-blue/10 mb-3">
                  <item.icon className="h-5 w-5 text-engineering-blue" />
                </div>
                <CardTitle className="text-navy text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-border/60 p-8 text-center">
          <Mail className="h-8 w-8 text-engineering-blue mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Get in Touch</h2>
          <p className="text-muted-foreground mb-4">
            Questions, corrections, or collaboration? We'd love to hear from you.
          </p>
          <a
            href="mailto:support@industrialengineeringhub.com"
            className="text-engineering-blue font-medium hover:underline"
          >
            support@industrialengineeringhub.com
          </a>
        </div>
      </div>
    </div>
  );
}
