// POST /api/admin/publish — commit approved content/calculator to GitHub main,
// optionally trigger a Vercel deploy hook.
// Payload: { kind: "content"|"calculator", id: string }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commitFiles } from "@/lib/publish/git";
import { serializeMdx } from "@/lib/publish/mdx-serialize";
import { serializeCalculatorJson } from "@/lib/publish/calc-serialize";
import { validateCalculator } from "@/lib/calculator/validation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kind, id } = body;
  if (!kind || !id) {
    return NextResponse.json({ error: "kind and id required" }, { status: 400 });
  }

  let files: { path: string; content: string }[] = [];
  let commitMessage = "";
  let newStatus: string | null = null;

  if (kind === "content") {
    const item = await prisma.contentItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Content not found" }, { status: 404 });
    if (item.status !== "seo_review" && item.status !== "published") {
      return NextResponse.json(
        { error: `Cannot publish from status "${item.status}". Reach seo_review first.` },
        { status: 400 }
      );
    }

    // Smoke-compile MDX before committing
    try {
      await compileMDX({
        source: item.bodyMdx,
        components: mdxComponents,
        options: {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        },
      });
    } catch (e: any) {
      return NextResponse.json(
        { error: `MDX compile failed: ${e.message}` },
        { status: 422 }
      );
    }

    files = [
      serializeMdx({
        slug: item.slug,
        kind: item.kind as "guide" | "material",
        title: item.title,
        description: item.description,
        category: item.category,
        keywords: item.keywords,
        bodyMdx: item.bodyMdx,
        frontmatter: item.frontmatter as Record<string, unknown> | null,
      }),
    ];
    commitMessage = `publish(${item.kind}): ${item.slug} — ${item.title}`;
    newStatus = "published";
  } else if (kind === "calculator") {
    const calc = await prisma.calculator.findUnique({ where: { id } });
    if (!calc) return NextResponse.json({ error: "Calculator not found" }, { status: 404 });
    if (calc.status !== "approved" && calc.status !== "published") {
      return NextResponse.json(
        { error: `Cannot publish from status "${calc.status}". Reach approved first.` },
        { status: 400 }
      );
    }

    const v = validateCalculator(calc.schema);
    if (!v.valid) {
      return NextResponse.json(
        { error: "Calculator tests fail — refusing to publish", errors: v.errors },
        { status: 422 }
      );
    }

    files = [serializeCalculatorJson(calc.schema as any)];
    commitMessage = `publish(calc): ${calc.id} — ${calc.name}`;
    newStatus = "published";
  } else {
    return NextResponse.json({ error: `Unknown kind: ${kind}` }, { status: 400 });
  }

  // Commit to git
  let commit;
  try {
    commit = await commitFiles({ files, message: commitMessage });
  } catch (e: any) {
    return NextResponse.json(
      { error: `GitHub commit failed: ${e.message}` },
      { status: 502 }
    );
  }

  // Update DB status
  if (newStatus === "published") {
    if (kind === "content") {
      await prisma.contentItem.update({
        where: { id },
        data: { status: "published", publishedAt: new Date() },
      });
    } else {
      await prisma.calculator.update({
        where: { id },
        data: { status: "published", publishedAt: new Date() },
      });
    }
  }

  // Fire-and-forget Vercel deploy hook
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (hookUrl) {
    try {
      await fetch(hookUrl, { method: "POST" });
    } catch (e) {
      // deploy hook failure doesn't roll back the commit
      console.warn("Vercel deploy hook failed:", e);
    }
  }

  return NextResponse.json({
    committed: true,
    commitSha: commit.sha,
    commitUrl: commit.url,
    deployedHookFired: !!hookUrl,
  });
}
