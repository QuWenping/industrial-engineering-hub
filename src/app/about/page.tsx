import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/components/seo/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Cpu, Globe, ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Industrial Engineering Studio",
  description:
    "Industrial Engineering Studio is the international brand of Muqian (Dalian) Engineering Technology Co., Ltd. — a real Chinese engineering firm with Class-B qualifications in building, chemical, environmental and landscape engineering, ~50 engineers in Dalian, and overseas project experience, serving global clients.",
  path: "/about",
});

const principles = [
  {
    icon: Target,
    title: "Engineering Rigor",
    description:
      "Every deliverable is designed and checked to applicable codes and standards. We hold building, chemical/petrochemical/pharmaceutical, environmental, pressure-piping and landscape qualifications, and our deliverables are buildable and permit-ready.",
  },
  {
    icon: Users,
    title: "Multi-Discipline Team",
    description:
      "Around 50 direct technical staff in Dalian plus 100+ engineers from our parent group, with architecture, structural, MEP, process, electrical, energy, chemical, environmental, automation and digital engineers working as one coordinated team.",
  },
  {
    icon: Cpu,
    title: "Digital-First Delivery",
    description:
      "BIM-coordinated 3D models, digital twin handover and AI-assisted engineering workflows from project day one. Deliverables are data-ready for your operations and maintenance teams.",
  },
  {
    icon: Globe,
    title: "China-Based, Globally Capable",
    description:
      "Based in Dalian, China, we deliver for foreign-invested clients (Sino-US, Japanese, Korean, German) and have completed an overseas commission in Seychelles (2019). We are available to take on projects worldwide.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-light-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            A Real Chinese Engineering Firm, Serving Global Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Industrial Engineering Studio is the international brand of Muqian (Dalian) Engineering
            Technology Co., Ltd. — a multi-discipline Chinese engineering company delivering industrial
            facility design and digital engineering, in China and internationally.
          </p>
        </div>

        <div className="prose prose-slate max-w-none mb-12">
          <h2 className="text-2xl font-bold text-navy">Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed">
            Industrial Engineering Studio is operated by <strong>Muqian (Dalian) Engineering
            Technology Co., Ltd.</strong> (慕骞（大连）工程技术有限公司), a Chinese engineering firm spun off from
            the elite Dalian team of <strong>Zhongwai Jianhuacheng Engineering Technology Group</strong>.
            The parent group holds Class-A qualifications in planning, architecture, municipal and
            landscape engineering, and its Dalian branch has operated steadily for over twenty years,
            designing and delivering nearly 700 built projects.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our scope spans architecture, chemical, pharmaceutical, environmental, solid-waste
            treatment and landscape design, plus specialized building-decoration, façade,
            light-steel-structure, building-intelligence, lighting and fire-protection engineering.
            We hold building (Class B), chemical/petrochemical/pharmaceutical (Class B),
            environmental-engineering (Class B), special-equipment pressure-piping design and
            landscape-engineering (Class B) qualifications.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We combine deep domain experience in structural, MEP, process and digital engineering
            with a digital-first delivery approach. We also publish a free suite of{" "}
            <Link href="/tools" className="text-engineering-blue hover:underline">Industrial Engineering
            Tools</Link> — calculators and reference data — and share engineering knowledge through our{" "}
            <Link href="/guides" className="text-engineering-blue hover:underline">Engineering Insights</Link>.
            Selected real projects are shown in our{" "}
            <Link href="/projects" className="text-engineering-blue hover:underline">case studies</Link>.
          </p>

          <h2 className="text-2xl font-bold text-navy">Team &amp; Research</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our team is stable and multi-disciplinary: around 50 direct technical staff in Dalian plus
            100+ engineers available from the parent group, covering architecture, structural, MEP,
            energy, chemical, environmental, automation and digital-modeling disciplines. We partner
            on R&amp;D with leading institutions including Dalian University of Technology (Energy &amp;
            Power), Tsinghua University, Dalian Institute of Chemical Physics, Xi’an Jiaotong
            University, Chongqing University, Southwest Jiaotong University and Xi’an University of
            Architecture and Technology.
          </p>

          <h2 className="text-2xl font-bold text-navy">Global Capability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Based in Dalian, China, we deliver for both domestic and foreign-invested clients —
            including Sino-US joint ventures (BAC), Japanese enterprises (Satake), Korean-owned
            projects (STX) and German-invested clients (Müller Weingarten, Dräxlmaier) — and we have
            completed an overseas commission in <strong>Seychelles</strong> (2019: hotel, yacht marina
            and office). We are set up to take on engineering design projects worldwide; contact us
            to discuss your location and standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {principles.map((item) => (
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

        <div className="mt-12 bg-navy rounded-xl p-8 text-center text-white">
          <Mail className="h-8 w-8 text-ai-glow mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Let's discuss your industrial project</h2>
          <p className="text-slate-300 mb-4 text-sm">
            Share your facility scope, location and timeline — our engineering team will follow up within one business day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy hover:bg-slate-100 transition-colors"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
