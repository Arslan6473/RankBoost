import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "@/lib/utils";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  role: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  /** Slug of the tool this guide supports, if any. */
  tool?: string;
  keywords: string[];
}

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

function readFile(slug: string) {
  const full = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  return matter(raw);
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "Editorial Team"),
    role: String(data.role ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    excerpt: String(data.excerpt ?? data.description ?? ""),
    readingTime: String(data.readingTime ?? "5 min read"),
    tool: typeof data.tool === "string" ? data.tool : undefined,
    keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => toMeta(slug, readFile(slug).data))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** The guide written for a given tool, if one exists. */
export function getPostForTool(toolSlug: string): PostMeta | undefined {
  return getAllPosts().find((p) => p.tool === toolSlug);
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  try {
    const { data, content } = readFile(slug);
    return { meta: toMeta(slug, data), content };
  } catch {
    return null;
  }
}

/** Extract H2/H3 headings for a table of contents. */
export function getTableOfContents(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split("\n");
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const text = match[2].replace(/[*_`]/g, "").trim();
      items.push({ depth: match[1].length, text, id: slugify(text) });
    }
  }
  return items;
}

export function getRelatedPosts(slug: string, tags: string[], limit = 2): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
