import { getCalculatorBySlug } from "@/lib/calculator/loader";
import { renderOG } from "@/components/seo/og-render";

export const alt = "Engineering Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  return renderOG({
    title: calc?.name || "Engineering Calculator",
    subtitle: calc?.description,
    category: calc?.category || "Calculator",
    accent: "#1677FF",
  });
}
