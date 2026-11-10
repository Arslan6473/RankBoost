import { getTool, getAllToolSlugs, getCategory } from "@/lib/tools/registry";
import { siteConfig } from "@/config/site";
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = `Free online tool by ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return renderOgImage({ title: siteConfig.tagline });
  return renderOgImage({
    eyebrow: `Free ${getCategory(tool.category).label}`,
    title: tool.title,
    description: tool.description,
  });
}
