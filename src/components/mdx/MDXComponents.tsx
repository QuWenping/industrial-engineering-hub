import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Lightbulb } from "lucide-react";
import { CentrifugalPumpDiagram } from "@/components/diagrams/CentrifugalPumpDiagram";
import { FanDiagram } from "@/components/diagrams/FanDiagram";

function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-3xl font-bold text-navy mt-8 mb-4 scroll-mt-24", className)} {...props} />;
}
function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-2xl font-bold text-navy mt-8 mb-3 scroll-mt-24 border-b border-border/60 pb-2", className)} {...props} />;
}
function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-semibold text-navy mt-6 mb-2 scroll-mt-24", className)} {...props} />;
}
function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-lg font-semibold text-navy mt-4 mb-2 scroll-mt-24", className)} {...props} />;
}
function P({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground leading-relaxed my-3", className)} {...props} />;
}
function UL({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("list-disc pl-6 my-3 space-y-1 text-muted-foreground", className)} {...props} />;
}
function OL({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("list-decimal pl-6 my-3 space-y-1 text-muted-foreground", className)} {...props} />;
}
function LI({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("leading-relaxed", className)} {...props} />;
}
function Blockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn("border-l-4 border-engineering-blue pl-4 italic text-muted-foreground my-4", className)}
      {...props}
    />
  );
}
function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}
function TH({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("border border-border/60 bg-muted px-3 py-2 text-left font-semibold text-navy", className)}
      {...props}
    />
  );
}
function TD({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border border-border/60 px-3 py-2 text-muted-foreground", className)} {...props} />;
}
function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-engineering-blue", className)}
      {...props}
    />
  );
}
function Pre({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn("font-mono text-sm bg-dark text-white p-4 rounded-lg overflow-x-auto my-4", className)}
      {...props}
    />
  );
}
function HR() {
  return <hr className="my-8 border-border/60" />;
}

// Callout components
function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "success" | "danger" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: { bg: "bg-engineering-blue/5 border-engineering-blue/20", icon: Info, iconClass: "text-engineering-blue" },
    warning: { bg: "bg-warning/10 border-warning/30", icon: AlertTriangle, iconClass: "text-warning" },
    success: { bg: "bg-accent-green/5 border-accent-green/20", icon: CheckCircle2, iconClass: "text-accent-green" },
    danger: { bg: "bg-danger/5 border-danger/20", icon: AlertCircle, iconClass: "text-danger" },
    tip: { bg: "bg-ai-glow/5 border-ai-glow/20", icon: Lightbulb, iconClass: "text-ai-glow" },
  };
  const s = styles[type];
  const Icon = s.icon;
  return (
    <Card className={cn("border-l-4 my-4", s.bg)}>
      <CardContent className="p-4 flex gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", s.iconClass)} />
        <div>
          {title && <p className="font-semibold text-navy mb-1">{title}</p>}
          <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Calculator({ id, label }: { id: string; label?: string }) {
  return (
    <Card className="my-4 border-engineering-blue/30 bg-engineering-blue/5">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-engineering-blue/10 flex items-center justify-center">
          <span className="text-engineering-blue font-bold">∑</span>
        </div>
        <div>
          <p className="font-semibold text-navy">{label || "Try the Calculator"}</p>
          <Link href={`/tools/${id}`} className="text-sm text-engineering-blue hover:underline">
            Open {id} →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 bg-dark/90 rounded-lg text-center font-mono text-lg text-ai-glow overflow-x-auto">
      {children}
    </div>
  );
}

function CallToAction({ label = "Discuss your project", href = "/contact" }: { label?: string; href?: string }) {
  return (
    <div className="my-8 rounded-lg border border-engineering-blue/20 bg-gradient-to-br from-engineering-blue/5 via-white to-ai-glow/5 p-6 text-center">
      <p className="text-sm text-slate-600 mb-3">
        Ready to move from concept to build-ready engineering?
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  table: Table,
  th: TH,
  td: TD,
  code: Code,
  pre: Pre,
  hr: HR,
  a: ({ href = "#", children, ...props }) => {
    if (href.startsWith("/")) {
      return <Link href={href} className="text-engineering-blue hover:underline" {...props}>{children}</Link>;
    }
    return <a href={href} className="text-engineering-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
  Callout,
  Calculator,
  Formula,
  CallToAction,
  Info: (props: any) => <Callout type="info" {...props} />,
  Warning: (props: any) => <Callout type="warning" {...props} />,
  Success: (props: any) => <Callout type="success" {...props} />,
  Danger: (props: any) => <Callout type="danger" {...props} />,
  Tip: (props: any) => <Callout type="tip" {...props} />,
  CentrifugalPumpDiagram,
  FanDiagram,
};
