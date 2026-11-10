/** Production origin. Set NEXT_PUBLIC_SITE_URL on Vercel (e.g. https://rankboost.tools). */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://rankboost.tools")
).replace(/\/$/, "");

export const siteConfig = {
  name: "RankBoost",
  shortName: "RankBoost",
  description:
    "RankBoost offers 50+ free SEO and text analysis tools — meta tag generators, keyword density, readability scoring, word counters and more. No signup required.",
  tagline: "Free SEO & Text Analysis Tools",
  url: siteUrl,
  ogImage: "/opengraph-image",
  author: "RankBoost",
  email: "hello@rankboost.tools",
  twitter: "@rankboosttools",
  github: "https://github.com/Arslan6473/RankBoost",
  keywords: [
    "RankBoost",
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
