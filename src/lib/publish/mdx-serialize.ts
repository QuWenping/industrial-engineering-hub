// Serialize a ContentItem DB row into frontmatter + MDX body for commit.
import type { DocFrontmatter } from "@/lib/mdx";

export interface SerializeContentArgs {
  slug: string;
  kind: "guide" | "material";
  title: string;
  description: string;
  category?: string | null;
  keywords: string[];
  bodyMdx: string;
  frontmatter?: Record<string, unknown> | null;
}

/**
 * Build the full .mdx file content: YAML frontmatter + body.
 */
export function serializeMdx(args: SerializeContentArgs): { path: string; content: string } {
  const subdir = args.kind === "guide" ? "guides" : "materials";
  const path = `content/${subdir}/${args.slug}.mdx`;

  const fm: Record<string, unknown> = {
    title: args.title,
    description: args.description,
    ...(args.category ? { category: args.category } : {}),
    ...(args.keywords.length > 0 ? { keywords: args.keywords } : {}),
    updated: new Date().toISOString().slice(0, 10),
    ...(args.frontmatter ?? {}),
  };

  const yaml = toYaml(fm);
  const content = `---\n${yaml}---\n\n${args.bodyMdx.trim()}\n`;

  return { path, content };
}

function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) {
        out += `${pad}${k}: []\n`;
      } else {
        out += `${pad}${k}:\n`;
        for (const item of v) {
          if (typeof item === "string") {
            out += `${pad}  - ${yamlString(item)}\n`;
          } else {
            out += `${pad}  - ${JSON.stringify(item)}\n`;
          }
        }
      }
    } else if (typeof v === "object") {
      out += `${pad}${k}:\n${toYaml(v as Record<string, unknown>, indent + 1)}`;
    } else if (typeof v === "string") {
      out += `${pad}${k}: ${yamlString(v)}\n`;
    } else {
      out += `${pad}${k}: ${v}\n`;
    }
  }
  return out;
}

function yamlString(s: string): string {
  // Quote if contains special chars
  if (/[:#\[\]{}&*!|>'"%@`,\n]/.test(s) || s.trim() !== s || s === "") {
    return JSON.stringify(s);
  }
  return s;
}
