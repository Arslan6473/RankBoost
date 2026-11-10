import { getPost, getPostSlugs } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = `Guide from the ${siteConfig.name} blog`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOgImage({
    eyebrow: "Guide",
    title: post?.meta.title ?? siteConfig.tagline,
  });
}
