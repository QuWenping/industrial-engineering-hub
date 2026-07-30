// MDX content loader — reads .mdx files from content/ and renders via next-mdx-remote/rsc
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export interface DocFrontmatter {
  title: string;
  description: string;
  slug?: string;
  category?: string;
  keywords?: string[];
  updated?: string;
  author?: string;
  related?: string[];
}

export interface DocMeta {
  slug: string;
  frontmatter: DocFrontmatter;
  urlPath: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readMDXFile(slug: string, subdir: string): { content: string; frontmatter: DocFrontmatter } | null {
  const filePath = path.join(CONTENT_ROOT, subdir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { content, frontmatter: data as DocFrontmatter };
}

export function getAllDocSlugs(subdir: string): string[] {
  const dir = path.join(CONTENT_ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllDocMeta(subdir: string, urlPrefix: string): DocMeta[] {
  return getAllDocSlugs(subdir).map((slug) => {
    const { frontmatter } = readMDXFile(slug, subdir) || { frontmatter: {} as DocFrontmatter };
    return { slug, frontmatter, urlPath: `${urlPrefix}/${slug}` };
  });
}

// Lightweight frontmatter-only read — no MDX compile (used for OG images)
export function getDocFrontmatter(slug: string, subdir: string): DocFrontmatter | null {
  const file = readMDXFile(slug, subdir);
  return file ? file.frontmatter : null;
}

export async function getDocBySlug(slug: string, subdir: string, urlPrefix: string) {
  const file = readMDXFile(slug, subdir);
  if (!file) return null;

  const { content, frontmatter } = file;

  const mdxSource = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  return {
    slug,
    frontmatter,
    content: mdxSource.content,
    urlPath: `${urlPrefix}/${slug}`,
  };
}
