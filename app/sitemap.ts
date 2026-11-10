import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllToolSlugs, categories } from "@/lib/tools/registry";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0] ? new Date(posts[0].date) : undefined;

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
    ...(path === "/blog" && latestPost ? { lastModified: latestPost } : {}),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Tool and category pages have no tracked edit date; omitting lastModified
  // beats reporting "today" on every build, which crawlers learn to ignore.
  const toolPages = getAllToolSlugs().map((slug) => ({
    url: absoluteUrl(`/tools/${slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: absoluteUrl(`/tools/category/${c.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...blogPages];
}
