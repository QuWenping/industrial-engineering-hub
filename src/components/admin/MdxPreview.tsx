// Server component that renders raw MDX source via compileMDX.
// Used inside the client-side MdxEditor preview tab.
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export async function MdxPreview({ source }: { source: string }) {
  if (!source || source.trim().length === 0) {
    return <div className="text-sm text-slate-400 italic">Nothing to preview — start typing in the Edit tab.</div>;
  }
  try {
    const { content } = await compileMDX({
      source,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        },
      },
    });
    return <>{content}</>;
  } catch (e: any) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
        <div className="font-semibold mb-1">MDX compile error</div>
        <pre className="text-xs whitespace-pre-wrap">{e.message}</pre>
      </div>
    );
  }
}
