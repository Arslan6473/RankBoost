import { siteConfig } from "@/config/site";
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    title: siteConfig.tagline,
    description: siteConfig.description,
  });
}
