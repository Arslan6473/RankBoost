import { allTools, categories } from "@/lib/tools/registry";

export type SearchKind = "tool" | "category" | "page" | "blog" | "faq";

export interface SearchItem {
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
  group: string;
}

const STATIC_PAGES: SearchItem[] = [
  { kind: "page", title: "All Tools", href: "/tools", keywords: "tools browse all", group: "Pages" },
  { kind: "page", title: "Blog", href: "/blog", keywords: "blog articles guides", group: "Pages" },
  { kind: "page", title: "About", href: "/about", keywords: "about company", group: "Pages" },
  { kind: "page", title: "Contact", href: "/contact", keywords: "contact support email", group: "Pages" },
  { kind: "page", title: "Changelog", href: "/changelog", keywords: "changelog updates releases", group: "Pages" },
];

/** Build the full client-side search index (tools, categories, pages, FAQs). */
export function buildSearchIndex(
  posts: { slug: string; title: string; excerpt: string }[] = [],
): SearchItem[] {
  const toolItems: SearchItem[] = allTools.map((t) => ({
    kind: "tool",
    title: t.title,
    subtitle: t.description,
    href: `/tools/${t.slug}`,
    keywords: `${t.title} ${t.keywords.join(" ")} ${t.category}`.toLowerCase(),
    group: "Tools",
  }));

  const categoryItems: SearchItem[] = categories.map((c) => ({
    kind: "category",
    title: c.label,
    subtitle: c.description,
    href: `/tools/category/${c.slug}`,
    keywords: `${c.label} ${c.slug} category`.toLowerCase(),
    group: "Categories",
  }));

  const faqItems: SearchItem[] = allTools.flatMap((t) =>
    t.faqs.map((f) => ({
      kind: "faq" as const,
      title: f.question,
      subtitle: `${t.title}`,
      href: `/tools/${t.slug}`,
      keywords: `${f.question} ${t.title}`.toLowerCase(),
      group: "FAQs",
    })),
  );

  const blogItems: SearchItem[] = posts.map((p) => ({
    kind: "blog",
    title: p.title,
    subtitle: p.excerpt,
    href: `/blog/${p.slug}`,
    keywords: `${p.title} ${p.excerpt}`.toLowerCase(),
    group: "Blog",
  }));

  return [
    ...toolItems,
    ...categoryItems,
    ...blogItems,
    ...STATIC_PAGES,
    ...faqItems,
  ];
}
