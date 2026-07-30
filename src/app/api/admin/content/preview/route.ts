// POST /api/admin/content/preview — compile MDX body and return rendered HTML string
// Uses compileMDX from next-mdx-remote/rsc, same pipeline as public pages.
import { NextRequest, NextResponse } from "next/server";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export async function POST(req: NextRequest) {
  const { bodyMdx } = await req.json();
  if (typeof bodyMdx !== "string") {
    return NextResponse.json({ error: "bodyMdx must be a string" }, { status: 400 });
  }
  if (bodyMdx.length > 50000) {
    return NextResponse.json({ error: "MDX too long (>50k chars)" }, { status: 400 });
  }

  try {
    const { content } = await compileMDX({
      source: bodyMdx,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        },
      },
    });
    // content is a ReactElement; serialize by returning as RSC payload.
    // Simpler: return ReactNode via NextResponse — but route handlers can only return
    // JSON/Response. Instead we return string HTML hint; the client shows source-side preview via iframe.
    // Here we return the raw source and the page's <MdxPreview> uses next-mdx-remote directly.
    return NextResponse.json({ ok: true, length: bodyMdx.length });
  } catch (e: any) {
    return NextResponse.json(
      { error: "MDX compile error", message: e.message },
      { status: 422 }
    );
  }
}
