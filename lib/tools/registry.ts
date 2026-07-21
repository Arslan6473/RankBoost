import type { LucideIcon } from "lucide-react";
import { Search, Type, BookOpen, Sparkles } from "lucide-react";
import type { ToolCategory, ToolDefinition } from "@/types/tool";
import { textTools } from "@/features/tools/text";
import { seoTools } from "@/features/tools/seo";
import { readabilityTools } from "@/features/tools/readability";
import { aiTools } from "@/features/tools/ai";

/** Every tool in the app, in display order. */
export const allTools: ToolDefinition[] = [
  ...seoTools,
  ...textTools,
  ...readabilityTools,
  ...aiTools,
];

const bySlug = new Map(allTools.map((t) => [t.slug, t]));

export function getTool(slug: string): ToolDefinition | undefined {
  return bySlug.get(slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return allTools.filter((t) => t.category === category);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
}

export function getAllToolSlugs(): string[] {
  return allTools.map((t) => t.slug);
}

export interface CategoryMeta {
  slug: ToolCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind gradient stops for accents. */
  gradient: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: "seo",
    label: "SEO Tools",
    shortLabel: "SEO",
    description:
      "Meta tags, keyword analysis, SERP previews, schema and everything you need for on-page SEO.",
    icon: Search,
    gradient: "from-blue-500 to-sky-400",
  },
  {
    slug: "text",
    label: "Text Tools",
    shortLabel: "Text",
    description:
      "Counters, converters and cleaners for fast, everyday text manipulation.",
    icon: Type,
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    slug: "readability",
    label: "Readability",
    shortLabel: "Readability",
    description:
      "Readability scores, grade levels and clarity checks to make your writing easy to read.",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    slug: "ai",
    label: "AI Tools",
    shortLabel: "AI",
    description:
      "Summarize, rewrite, humanize and optimize with AI-powered writing assistants.",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-400",
  },
];

export function getCategory(slug: ToolCategory): CategoryMeta {
  return categories.find((c) => c.slug === slug)!;
}

/** Curated set of popular tools for the landing page. */
export const popularSlugs = [
  "word-counter",
  "keyword-density",
  "meta-description-generator",
  "readability-score",
  "serp-preview",
  "case-converter",
  "reading-time",
  "ai-summarizer",
];

export function getPopularTools(): ToolDefinition[] {
  return popularSlugs
    .map((s) => bySlug.get(s))
    .filter((t): t is ToolDefinition => Boolean(t));
}
