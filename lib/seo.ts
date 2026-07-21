import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

/** Absolute URL for a given path on the site. */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return path ? `${base}${suffix}` : base;
}

/** Build a complete, consistent Metadata object for any page. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  type = "website",
  publishedTime,
  noindex = false,
}: SeoOptions = {}): Metadata {
  const fullTitle = title
    ? `${title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: siteConfig.twitter,
    },
  };
}
