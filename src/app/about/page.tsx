import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Globe, Users, Zap, Shield, Award } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Us — Industrial Engineering Studio",
  description:
    "Industrial Engineering Studio is the international brand of Muqian (Dalian) Engineering Technology Co., Ltd. — a multi-discipline Chinese engineering firm serving global industrial projects since 2003.",
  path: "/about",
  keywords: [
    "Chinese engineering firm",
    "Muqian Dalian Engineering",
    "industrial design",
    "BIM engineering",
    "multi-discipline engineering",
  ],
});

const values = [
  {
    icon: Shield,
    title: "Engineering Rigor",
    description:
      "Every deliverable is designed and checked to applicable codes and standards. We hold building, chemical/petrochemical/pharmaceutical, environmental, pressure-piping and landscape qualifications.",
  },
  {
    icon: Users,
    title: "Multi-Discipline Team",
    description:
      "Around 50 direct technical staff in Dalian plus 100+ engineers from our parent group, covering architecture, structural, MEP, process, electrical, energy, chemical, environmental, automation and digital disciplines.",
  },
  {
    icon: Zap,
    title: "Digital-First Delivery",
    description:
      "BIM-coordinated 3D models, digital twin handover and AI-assisted engineering workflows from project day one. Deliverables are data-ready for operations and maintenance.",
  },
  {
    icon: Globe,
    title: "China-Based, Globally Capable",
    description:
      "Based in Dalian, China, we deliver for foreign-invested clients and have completed overseas commissions. Available to take on projects worldwide.",
  },
];

const qualifications = [
  "Building Design (Class B)",
  "Chemical/Petrochemical/Pharmaceutical (Class B)",
  "Environmental Engineering (Class B)",
  "Special-Equipment Pressure-Piping Design",
  "Landscape Engineering (Class B)",
  "Building-Decoration, Façade & Light-Steel-Structure",
  "Building Intelligence & Lighting Design",
  "Fire-Protection Engineering",
];

const partners = [
  "Dalian University of Technology (Energy & Power)",
  "Tsinghua University",
  "Dalian Institute of Chemical Physics",
  "Xi'an Jiaotong University",
  "Chongqing University",
  "Southwest Jiaotong University",
  "Xi'an University of Architecture and Technology",
];

export default function AboutPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-navy to-[#0f2a48] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-engineering-blue/20 text-ai-glow border-engineering-blue/40">
            About Industrial Engineering Studio
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            A Real Chinese Engineering Firm, Serving Global Projects
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed max-w-2xl">
            Industrial Engineering Studio is the international brand of Muqian (Dalian) Engineering
            Technology Co., Ltd. — a multi-discipline Chinese engineering company delivering industrial
            facility design and digital engineering, in China and internationally.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-6">Who We Are</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Industrial Engineering Studio is operated by{" "}
                  <strong>Muqian (Dalian) Engineering Technology Co., Ltd.</strong> (慕骞（大连）工程技术有限公司),
                  a Chinese engineering firm spun off from the elite Dalian team of{" "}
                  <strong>Zhongwai Jianhuacheng Engineering Technology Group</strong>. The parent group holds
                  Class-A qualifications in planning, architecture, municipal and landscape engineering, and its
                  Dalian branch has operated steadily for <strong>over twenty years</strong>, designing and
                  delivering nearly <strong>700 built projects</strong>.
                </p>
                <p>
                  Our scope spans architecture, chemical, pharmaceutical, environmental, solid-waste treatment
                  and landscape design, plus specialized building-decoration, façade, light-steel-structure,
                  building-intelligence, lighting and fire-protection engineering.
                </p>
                <p>
                  We combine deep domain experience in structural, MEP, process and digital engineering with a
                  digital-first delivery approach. We also publish a free suite of{" "}
                  <Link href="/tools" className="text-engineering-blue hover:underline font-medium">
                    Industrial Engineering Tools
                  </Link>{" "}
                  — calculators and reference data — and share engineering knowledge through our{" "}
                  <Link href="/guides" className="text-engineering-blue hover:underline font-medium">
                    Engineering Insights
                  </Link>
                  . Selected real projects are shown in our{" "}
                  <Link href="/projects" className="text-engineering-blue hover:underline font-medium">
                    case studies
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">Professional Qualifications</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {qualifications.map((qual) => (
                  <div key={qual} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-engineering-blue mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{qual}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-24 bg-light-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Why We Stand Out</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <Card key={value.title} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-engineering-blue/10 text-engineering-blue mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Research */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy mb-8">Team & Research Partnerships</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Our team is stable and multi-disciplinary: <strong>around 50 direct technical staff in Dalian</strong> plus{" "}
              <strong>100+ engineers available from the parent group</strong>, covering architecture, structural,
              MEP, energy, chemical, environmental, automation and digital-modeling disciplines.
            </p>
            <div>
              <h3 className="text-lg font-semibold text-navy mb-4">Research & Academic Partners</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {partners.map((partner) => (
                  <div key={partner} className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-engineering-blue mt-1 shrink-0" />
                    <span className="text-sm">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Capability */}
      <section className="py-16 sm:py-24 bg-light-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy mb-8">Global Capability</h2>
          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Based in <strong>Dalian, China</strong>, we deliver for both domestic and foreign-invested clients
              — including Sino-US joint ventures (BAC), Japanese enterprises (Satake), Korean-owned projects
              (STX) and German-invested clients (Müller Weingarten, Dräxlmaier). We have also completed an
              overseas commission in <strong>Seychelles (2019)</strong>: hotel, yacht marina and office project.
            </p>
            <p>
              We are set up to take on engineering design projects worldwide. Our deliverables conform to
              international codes and standards, and our team is experienced in managing cross-border
              collaboration, local permitting and multi-language coordination.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to discuss your project?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you're in China or anywhere globally, our engineering team is ready to collaborate on your
            industrial facility design or digital engineering challenge.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-engineering-blue px-6 py-3 text-sm font-medium text-white hover:bg-engineering-blue/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Contact Info Footer */}
      <section className="bg-white py-12 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8 text-center sm:text-left">
            <div>
              <h3 className="font-semibold text-navy mb-2">Company Name (English)</h3>
              <p className="text-sm text-muted-foreground">Industrial Engineering Studio</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Company Name (Chinese)</h3>
              <p className="text-sm text-muted-foreground">慕骞（大连）工程技术有限公司</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">Dalian, China</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Get in Touch</h3>
              <p className="text-sm">
                <a href="mailto:hello@industrialengineeringstudio.com" className="text-engineering-blue hover:underline">
                  hello@industrialengineeringstudio.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
