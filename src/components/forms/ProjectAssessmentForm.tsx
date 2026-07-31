"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const INDUSTRIES = [
  "Battery Manufacturing",
  "Chemical / Petrochemical",
  "Energy / Power Generation",
  "Smart Manufacturing / Factory",
  "Industrial Buildings",
  "Infrastructure",
  "Other",
];

const PROJECT_TYPES = [
  "New Greenfield Facility",
  "Brownfield / Expansion",
  "Retrofit / Modernization",
  "Engineering Assessment",
  "Feasibility / Concept Study",
  "Digital Twin / BIM",
  "Other",
];

const PROJECT_SIZES = [
  "< 1,000 m²",
  "1,000 – 5,000 m²",
  "5,000 – 20,000 m²",
  "> 20,000 m²",
  "N/A",
];

const TIMELINES = [
  "Immediately",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "Exploring options",
];

const SERVICE_OPTIONS = [
  { id: "industrial-building-design", label: "Industrial Building Design" },
  { id: "structural-engineering", label: "Structural Engineering" },
  { id: "hvac-mep-engineering", label: "HVAC & MEP Engineering" },
  { id: "chemical-plant-engineering", label: "Chemical Plant Engineering" },
  { id: "energy-facility-engineering", label: "Energy Facility Engineering" },
  { id: "digital-engineering", label: "Digital Engineering / BIM / AI" },
];

function ProjectAssessmentFormInner() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const toolSlug = searchParams.get("tool");
  const presetIndustry = searchParams.get("industry");
  const presetService = searchParams.get("service");

  const initialMessage = useMemo(() => {
    if (reason === "engineering-assessment" && toolSlug) {
      return `I'd like engineering support related to the ${toolSlug.replace(/-/g, " ")} calculator result.`;
    }
    return "";
  }, [reason, toolSlug]);

  const initialProjectType =
    reason === "engineering-assessment" ? "Engineering Assessment" : undefined;

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Collect multi-select services
    const services = SERVICE_OPTIONS.map((s) => s.id).filter((id) => formData.get(`service-${id}`));

    // Honeypot anti-spam: if the hidden "website" field is filled, silently succeed.
    if (formData.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || ""),
      industry: String(formData.get("industry") || ""),
      projectType: String(formData.get("projectType") || ""),
      location: String(formData.get("location") || ""),
      projectSize: String(formData.get("projectSize") || ""),
      timeline: String(formData.get("timeline") || ""),
      services,
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || ""),
      source: reason === "engineering-assessment" ? "calculator-cta" : "contact-form",
      sourceRef: toolSlug || (presetService ? `/services/${presetService}` : ""),
    };

    // ─── Client-side validation (mirrors server Zod schema) ───────────────────
    // Prevents 400 round-trips and gives clear, field-specific feedback.
    const fieldErrors: string[] = [];
    if (!payload.name) fieldErrors.push("Full Name is required");
    if (!payload.company) fieldErrors.push("Company is required");
    if (!payload.email) fieldErrors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      fieldErrors.push("Please enter a valid email address");
    if (!payload.industry) fieldErrors.push("Please select an Industry");
    if (!payload.projectType) fieldErrors.push("Please select a Project Type");
    if (payload.message.length < 10)
      fieldErrors.push("Project Description must be at least 10 characters");
    if (fieldErrors.length > 0) {
      setStatus("error");
      setErrorMsg(fieldErrors.join(" • "));
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Surface the server's actual validation/error message when available.
        let serverMsg = `Server returned ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) serverMsg = data.error;
        } catch {}
        throw new Error(serverMsg);
      }
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Submission failed. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-navy mb-2">Thank you</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your project assessment request has been received. Our engineering team will contact you
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from real users, bots will fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required placeholder="Jane Smith" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input id="company" name="company" required placeholder="Acme Engineering Co." />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select name="industry" defaultValue={presetIndustry ? presetIndustry.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : undefined}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type *</Label>
          <Select name="projectType" defaultValue={initialProjectType}>
            <SelectTrigger id="projectType">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Country / City" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectSize">Project Size</Label>
          <Select name="projectSize">
            <SelectTrigger id="projectSize">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_SIZES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Select name="timeline">
            <SelectTrigger id="timeline">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Required Services</Label>
        <div className="grid sm:grid-cols-2 gap-2">
          {SERVICE_OPTIONS.map((s) => {
            const checked = presetService === s.id;
            return (
              <label key={s.id} className="flex items-start gap-2 text-sm text-slate-700 p-2 rounded hover:bg-slate-50">
                <input
                  type="checkbox"
                  name={`service-${s.id}`}
                  defaultChecked={checked}
                  className="mt-0.5"
                />
                {s.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Project Description *</Label>
        <textarea
          id="message"
          name="message"
          required
          defaultValue={initialMessage}
          rows={5}
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-engineering-blue"
          placeholder="Tell us about your facility scope, process requirements, key standards and what you're looking for."
        />
      </div>

      {status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            {errorMsg}
            <div className="mt-1">
              Or email us directly at <a href="mailto:hello@industrialengineeringstudio.com" className="underline">hello@industrialengineeringstudio.com</a>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit Project Assessment Request"
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        By submitting, you agree to be contacted by our engineering team. We will not share your
        information with third parties.
      </p>
    </form>
  );
}

export function ProjectAssessmentForm() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-md bg-slate-50" />}>
      <ProjectAssessmentFormInner />
    </Suspense>
  );
}
