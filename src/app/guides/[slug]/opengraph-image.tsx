import { getDocFrontmatter } from "@/lib/mdx";
import { renderOG } from "@/components/seo/og-render";

export const alt = "Engineering Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const fm = await getDocFrontmatter(slug, "guides");

  return renderOG({
    title: fm?.title || "Engineering Guide",
    subtitle: fm?.description,
    category: fm?.category || "Guide",
    accent: "#00D4FF",
  });
}
