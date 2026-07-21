export const siteConfig = {
  name: "SEO Text Tools",
  shortName: "SEO Tools",
  description:
    "50+ free, fast, and beautiful SEO and text analysis tools. Meta generators, keyword analysis, readability scoring, word counters and more — no signup required.",
  tagline: "The complete free toolkit for SEO & text analysis",
  url: "https://seotexttools.com",
  ogImage: "/og.png",
  author: "SEO Text Tools",
  email: "hello@seotexttools.com",
  twitter: "@seotexttools",
  github: "https://github.com/seotexttools/seo-text-tools",
  keywords: [
    "SEO tools",
    "free SEO tools",
    "text analysis",
    "word counter",
    "keyword density",
    "meta description generator",
    "readability score",
    "SERP preview",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
