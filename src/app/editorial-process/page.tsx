import type { Metadata } from "next";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users, FileCheck, Brain, Eye, GitBranch } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Editorial Process",
  description: "How Industrial Engineering Studio creates, reviews, and publishes engineering content — AI assistance, human engineering review, and quality standards.",
  path: "/editorial-process",
});

const processSteps = [
  {
    icon: Brain,
    title: "1. AI-Assisted Drafting",
    description:
      "Initial content drafts may be generated with AI assistance. AI helps structure articles, format formulas, and organize engineering knowledge — but never publishes directly.",
  },
  {
    icon: FileCheck,
    title: "2. Formula & Calculation Verification",
    description:
      "Every formula is checked against established engineering references. Calculators are tested with known inputs and verified against textbook examples and industry standard results.",
  },
  {
    icon: Users,
    title: "3. Engineering Review",
    description:
      "Content is reviewed by engineers with domain expertise. Reviewers verify engineering logic, identify edge cases, check unit consistency, and ensure practical accuracy.",
  },
  {
    icon: Eye,
    title: "4. Human Approval",
    description:
      "Nothing is published without explicit human approval. Every article and calculator is reviewed by a human editor before going live.",
  },
  {
    icon: GitBranch,
    title: "5. Ongoing Maintenance",
    description:
      "Content is periodically re-reviewed. Errors reported by users are investigated and corrected. Standards and references are updated as new editions are released.",
  },
];

const scoringCriteria = [
  { name: "Formula Check", weight: "40%", description: "Formula correctness, unit consistency, variable completeness, calculation accuracy" },
  { name: "Engineering Logic", weight: "30%", description: "Conformance with engineering practice, appropriate limitations stated, no misleading simplifications" },
  { name: "SEO Quality", weight: "20%", description: "Keyword coverage, article structure, FAQ coverage, internal linking" },
  { name: "Originality", weight: "10%", description: "Not AI-generated boilerplate, includes real engineering insight and explanation" },
];

export default function EditorialProcessPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Transparency</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Our Editorial Process</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe engineering content deserves the same rigor as engineering itself. This page
            explains exactly how we create, review, and publish every calculator and article.
          </p>
        </div>

        <div className="rounded-xl border border-accent-green/20 bg-accent-green/5 p-6 mb-12">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-accent-green shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-navy mb-1">Our Commitment</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI assists our process — it does not replace engineering judgment. Every formula is
                tested, every article is reviewed by an engineer, and nothing reaches publication
                without human approval. We do not operate an "AI auto-publish" pipeline.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-navy mb-6">Content Creation Process</h2>
        <div className="space-y-4 mb-12">
          {processSteps.map((step) => (
            <Card key={step.title} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-engineering-blue/10">
                    <step.icon className="h-5 w-5 text-engineering-blue" />
                  </div>
                  <CardTitle className="text-navy text-base">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-navy mb-6">Review Scoring Criteria</h2>
        <p className="text-muted-foreground mb-6">
          Every piece of content receives a quality score before publication:
        </p>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-semibold text-navy">Criterion</th>
                <th className="text-left py-3 pr-4 font-semibold text-navy">Weight</th>
                <th className="text-left py-3 font-semibold text-navy">Description</th>
              </tr>
            </thead>
            <tbody>
              {scoringCriteria.map((item) => (
                <tr key={item.name} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-navy">{item.name}</td>
                  <td className="py-3 pr-4 text-engineering-blue font-semibold">{item.weight}</td>
                  <td className="py-3 text-muted-foreground">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card className="border-border/60 bg-white">
          <CardHeader>
            <CardTitle className="text-navy">Publication Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-accent-green font-bold">≥85</span>
              <span>Publish — meets engineering accuracy and quality standards</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-warning font-bold">70-84</span>
              <span>Review — requires revision before publication</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-danger font-bold">{"<70"}</span>
              <span>Rewrite — does not meet standards and must be rewritten</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Found an error? Report it to{" "}
            <a href="mailto:hello@industrialengineeringstudio.com" className="text-engineering-blue hover:underline">
              hello@industrialengineeringstudio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
