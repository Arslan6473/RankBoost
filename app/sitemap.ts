import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllToolSlugs, categories } from "@/lib/tools/registry";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/tools",
    "/blog",
    "/about",
    "/contact",
    "/changelog",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const toolPages = getAllToolSlugs().map((slug) => ({
    url: absoluteUrl(`/tools/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: absoluteUrl(`/tools/category/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...blogPages];
}
