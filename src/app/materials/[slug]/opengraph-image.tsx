import { getDocFrontmatter } from "@/lib/mdx";
import { renderOG } from "@/components/seo/og-render";

export const alt = "Engineering Material";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const fm = await getDocFrontmatter(slug, "materials");

  return renderOG({
    title: fm?.title || "Engineering Material",
    subtitle: fm?.description,
    category: fm?.category || "Material",
    accent: "#00B578",
  });
}
