import {
  Type,
  FileText,
  Gauge,
  Search,
  Link2,
  Bot,
  Map as MapIcon,
  Anchor,
  Share2,
  AtSign,
  Heading,
  Percent,
  KeyRound,
  BarChart3,
  Target,
  Boxes,
  MessageCircleQuestion,
  Braces,
} from "lucide-react";
import type { ToolDefinition, ToolResult } from "@/types/tool";
import { tokenizeWords, wordFrequency } from "@/lib/text/analyze";
import { slugify, round } from "@/lib/utils";

const EMPTY: ToolResult = { empty: true };

/** Rough pixel-width estimate for a Google title/description. */
function pixelWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if ("iIl.,'|!:;".includes(ch)) w += 3;
    else if ("mwMW".includes(ch)) w += 12;
    else if (ch === " ") w += 4;
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) w += 9;
    else w += 7.5;
  }
  return Math.round(w);
}

const POWER_WORDS = [
  "free", "best", "top", "ultimate", "proven", "easy", "fast", "new",
  "guide", "how", "why", "essential", "complete", "guaranteed", "instant",
  "secret", "powerful", "simple", "boost", "review", "vs", "checklist",
];

const nGrams = (words: string[], n: number): string[] => {
  const out: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    out.push(words.slice(i, i + n).join(" "));
  }
  return out;
};

export const seoTools: ToolDefinition[] = [
  /* ----------------------------- Generators ----------------------------- */
  {
    slug: "meta-title-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Meta Title Generator",
    description: "Generate optimized, click-worthy SEO title tags.",
    longDescription:
      "Create SEO-friendly title tag variations from your primary keyword and brand. Every option is kept within Google's recommended length.",
    keywords: ["meta title generator", "title tag generator", "seo title"],
    icon: Type,
    badge: "popular",
    fields: [
      { type: "text", key: "keyword", label: "Primary keyword / topic", placeholder: "e.g. running shoes", default: "running shoes" },
      { type: "text", key: "brand", label: "Brand name (optional)", placeholder: "e.g. Acme", default: "" },
      { type: "text", key: "modifier", label: "Modifier (optional)", placeholder: "e.g. 2026, Best, Cheap", default: "Best" },
    ],
    tips: [
      "Keep titles under 60 characters so they don't get truncated.",
      "Put your primary keyword near the front.",
    ],
    faqs: [
      { question: "How long should a title tag be?", answer: "Aim for 50–60 characters (about 600 pixels). Longer titles get cut off in search results." },
    ],
    relatedSlugs: ["meta-description-generator", "seo-title-analyzer", "serp-preview"],
    run: (v) => {
      const kw = (v.keyword || "").trim();
      if (!kw) return EMPTY;
      const brand = (v.brand || "").trim();
      const mod = (v.modifier || "").trim();
      const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
      const base = cap(kw);
      const suffix = brand ? ` | ${brand}` : "";
      const variants = [
        `${mod ? mod + " " : ""}${base}${suffix}`,
        `${base}: ${mod || "The Complete"} Guide${suffix}`,
        `${base} — ${mod || "Top"} Picks for 2026${suffix}`,
        `Buy ${base} Online${suffix}`,
        `${base} Reviews, Tips & More${suffix}`,
      ].map((t) => t.trim());
      return {
        output: variants.join("\n"),
        outputLanguage: "text",
        metrics: variants.slice(0, 3).map((t, i) => ({
          label: `Option ${i + 1} length`,
          value: `${t.length} chars`,
          tone: t.length <= 60 ? "success" : "warning",
        })),
      };
    },
  },
  {
    slug: "meta-description-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Meta Description Generator",
    description: "Write compelling meta descriptions that earn clicks.",
    longDescription:
      "Generate meta descriptions within Google's ~155-character sweet spot, complete with your keyword and a call to action.",
    keywords: ["meta description generator", "meta description", "seo description"],
    icon: FileText,
    badge: "popular",
    fields: [
      { type: "text", key: "keyword", label: "Primary keyword / topic", placeholder: "e.g. running shoes", default: "running shoes" },
      { type: "text", key: "benefit", label: "Key benefit", placeholder: "e.g. free 30-day returns", default: "free shipping and easy returns" },
      { type: "select", key: "cta", label: "Call to action", default: "Shop now", options: [
        { label: "Shop now", value: "Shop now" },
        { label: "Learn more", value: "Learn more" },
        { label: "Get started", value: "Get started" },
        { label: "Read the guide", value: "Read the guide" },
      ] },
    ],
    tips: [
      "Keep descriptions between 120 and 155 characters.",
      "Include your keyword and a clear call to action.",
    ],
    faqs: [
      { question: "Do meta descriptions affect rankings?", answer: "Not directly, but a compelling description improves click-through rate, which matters." },
    ],
    relatedSlugs: ["meta-title-generator", "serp-preview", "open-graph-generator"],
    run: (v) => {
      const kw = (v.keyword || "").trim();
      if (!kw) return EMPTY;
      const benefit = (v.benefit || "great value").trim();
      const cta = (v.cta || "Learn more").trim();
      const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const variants = [
        `Discover ${kw} with ${benefit}. ${cta} and see why thousands trust us.`,
        `Looking for ${kw}? Enjoy ${benefit} on every order. ${cta} today.`,
        `${cap(kw)} made simple — ${benefit}, expert support and fast delivery. ${cta}.`,
      ];
      return {
        output: variants.join("\n\n"),
        outputLanguage: "text",
        metrics: variants.map((t, i) => ({
          label: `Option ${i + 1}`,
          value: `${t.length} chars`,
          tone: t.length >= 120 && t.length <= 160 ? "success" : "warning",
        })),
      };
    },
  },
  {
    slug: "serp-preview",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "SERP Snippet Preview",
    description: "Preview how your page looks in Google search results.",
    longDescription:
      "See a live Google-style preview of your title, URL and description — and check that each fits within the recommended pixel width before you publish.",
    keywords: ["serp preview", "google snippet preview", "serp simulator"],
    icon: Search,
    badge: "popular",
    fields: [
      { type: "text", key: "title", label: "Title tag", placeholder: "Your page title", default: "Best Running Shoes for 2026 | Acme" },
      { type: "text", key: "url", label: "URL", placeholder: "https://example.com/page", default: "https://acme.com/running-shoes" },
      { type: "textarea", key: "description", label: "Meta description", placeholder: "Your meta description", default: "Discover the best running shoes for 2026 with free shipping and easy returns. Shop trusted brands and find your perfect fit today." },
    ],
    tips: [
      "Titles over ~600px and descriptions over ~960px get truncated.",
      "Front-load the important words — they're what users scan first.",
    ],
    faqs: [
      { question: "Why do pixel widths matter more than character counts?", answer: "Google truncates by pixel width, and wide letters like 'W' take more space than 'i'. Pixels are the real limit." },
    ],
    relatedSlugs: ["meta-title-generator", "meta-description-generator", "seo-title-analyzer"],
    run: (v) => {
      const title = (v.title || "").trim();
      const description = (v.description || "").trim();
      const url = (v.url || "").trim();
      if (!title && !description) return EMPTY;
      const titlePx = pixelWidth(title);
      const descPx = pixelWidth(description);
      return {
        serpPreview: { title, url: url || "https://example.com", description },
        metrics: [
          { label: "Title length", value: `${title.length} chars`, tone: title.length <= 60 ? "success" : "warning" },
          { label: "Title width", value: `${titlePx}px`, tone: titlePx <= 600 ? "success" : "destructive" },
          { label: "Description length", value: `${description.length} chars`, tone: description.length <= 160 ? "success" : "warning" },
          { label: "Description width", value: `${descPx}px`, tone: descPx <= 960 ? "success" : "destructive" },
        ],
      };
    },
  },
  {
    slug: "canonical-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Canonical Tag Generator",
    description: "Generate a rel=canonical link tag.",
    longDescription:
      "Create a canonical link tag to tell search engines which URL is the primary version of a page and avoid duplicate-content issues.",
    keywords: ["canonical tag generator", "rel canonical", "canonical url"],
    icon: Anchor,
    fields: [
      { type: "text", key: "url", label: "Canonical URL", placeholder: "https://example.com/page", default: "https://example.com/blog/seo-guide" },
    ],
    tips: [
      "Always use absolute URLs in canonical tags.",
      "A page can point its canonical to itself — that's normal and recommended.",
    ],
    faqs: [
      { question: "Where does the canonical tag go?", answer: "Inside the <head> of your page. Only one canonical per page." },
    ],
    relatedSlugs: ["open-graph-generator", "schema-generator", "robots-txt-generator"],
    run: (v) => {
      const url = (v.url || "").trim();
      if (!url) return EMPTY;
      return {
        output: `<link rel="canonical" href="${url}" />`,
        outputLanguage: "html",
      };
    },
  },
  {
    slug: "open-graph-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Open Graph Generator",
    description: "Generate Open Graph meta tags for rich social shares.",
    longDescription:
      "Create Open Graph (og:) meta tags so your pages look great when shared on Facebook, LinkedIn and Slack — with a live preview card.",
    keywords: ["open graph generator", "og tags", "og meta tags"],
    icon: Share2,
    fields: [
      { type: "text", key: "title", label: "og:title", default: "Best Running Shoes for 2026" },
      { type: "textarea", key: "description", label: "og:description", default: "Discover the best running shoes for 2026 with free shipping and easy returns." },
      { type: "text", key: "url", label: "og:url", default: "https://acme.com/running-shoes" },
      { type: "text", key: "image", label: "og:image", default: "https://acme.com/og.png" },
      { type: "select", key: "type", label: "og:type", default: "website", options: [
        { label: "website", value: "website" },
        { label: "article", value: "article" },
        { label: "product", value: "product" },
      ] },
    ],
    tips: [
      "Use a 1200×630px image for the best-looking share cards.",
      "Keep og:title under 60 characters.",
    ],
    faqs: [
      { question: "Do I still need og:image if I have a Twitter card?", answer: "Yes. Open Graph covers Facebook, LinkedIn and more; Twitter falls back to og: tags but has its own too." },
    ],
    relatedSlugs: ["twitter-card-generator", "meta-description-generator", "canonical-generator"],
    run: (v) => {
      const title = (v.title || "").trim();
      if (!title) return EMPTY;
      const description = (v.description || "").trim();
      const url = (v.url || "").trim();
      const image = (v.image || "").trim();
      const type = (v.type || "website").trim();
      const domain = url ? url.replace(/^https?:\/\//, "").split("/")[0] : "example.com";
      const tags = [
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:type" content="${type}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${image}" />`,
      ].join("\n");
      return {
        output: tags,
        outputLanguage: "html",
        socialPreview: { network: "facebook", title, description, image, domain },
      };
    },
  },
  {
    slug: "twitter-card-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Twitter Card Generator",
    description: "Generate Twitter/X card meta tags with a preview.",
    longDescription:
      "Create Twitter (X) card meta tags for large-image share previews, with a live preview of how your link will appear in a tweet.",
    keywords: ["twitter card generator", "x card", "twitter meta tags"],
    icon: AtSign,
    fields: [
      { type: "select", key: "card", label: "twitter:card", default: "summary_large_image", options: [
        { label: "summary_large_image", value: "summary_large_image" },
        { label: "summary", value: "summary" },
      ] },
      { type: "text", key: "title", label: "twitter:title", default: "Best Running Shoes for 2026" },
      { type: "textarea", key: "description", label: "twitter:description", default: "Discover the best running shoes for 2026 with free shipping and easy returns." },
      { type: "text", key: "image", label: "twitter:image", default: "https://acme.com/og.png" },
      { type: "text", key: "site", label: "twitter:site (@handle)", default: "@acme" },
    ],
    tips: [
      "summary_large_image gives you a full-width photo — best for CTR.",
      "Twitter reads og: tags as a fallback, so set both.",
    ],
    faqs: [
      { question: "What image size works best?", answer: "For summary_large_image, use at least 1200×628px with a 1.91:1 ratio." },
    ],
    relatedSlugs: ["open-graph-generator", "meta-description-generator", "canonical-generator"],
    run: (v) => {
      const title = (v.title || "").trim();
      if (!title) return EMPTY;
      const description = (v.description || "").trim();
      const image = (v.image || "").trim();
      const site = (v.site || "").trim();
      const card = (v.card || "summary_large_image").trim();
      const tags = [
        `<meta name="twitter:card" content="${card}" />`,
        `<meta name="twitter:title" content="${title}" />`,
        `<meta name="twitter:description" content="${description}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        site ? `<meta name="twitter:site" content="${site}" />` : "",
      ].filter(Boolean).join("\n");
      return {
        output: tags,
        outputLanguage: "html",
        socialPreview: { network: "twitter", title, description, image, domain: site || "example.com" },
      };
    },
  },
  {
    slug: "robots-txt-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Robots.txt Generator",
    description: "Build a valid robots.txt file in seconds.",
    longDescription:
      "Generate a robots.txt file to control how search engines crawl your site, including sitemap references and common disallow rules.",
    keywords: ["robots.txt generator", "robots file", "crawl rules"],
    icon: Bot,
    fields: [
      { type: "select", key: "policy", label: "Default policy", default: "allow", options: [
        { label: "Allow all crawlers", value: "allow" },
        { label: "Block all crawlers", value: "block" },
      ] },
      { type: "textarea", key: "disallow", label: "Disallow paths (one per line)", default: "/admin\n/cart\n/checkout" },
      { type: "text", key: "sitemap", label: "Sitemap URL", default: "https://example.com/sitemap.xml" },
    ],
    tips: [
      "robots.txt lives at the root: example.com/robots.txt.",
      "Blocking a page in robots.txt does not guarantee it stays out of the index — use noindex for that.",
    ],
    faqs: [
      { question: "Does robots.txt hide pages?", answer: "No. It controls crawling, not indexing. For true removal, use a noindex meta tag or authentication." },
    ],
    relatedSlugs: ["sitemap-generator", "canonical-generator", "schema-generator"],
    run: (v) => {
      const policy = v.policy || "allow";
      const disallow = (v.disallow || "").split("\n").map((l) => l.trim()).filter(Boolean);
      const sitemap = (v.sitemap || "").trim();
      const lines = ["User-agent: *"];
      if (policy === "block") {
        lines.push("Disallow: /");
      } else {
        if (disallow.length) disallow.forEach((p) => lines.push(`Disallow: ${p}`));
        else lines.push("Disallow:");
      }
      if (sitemap) lines.push("", `Sitemap: ${sitemap}`);
      return { output: lines.join("\n"), outputLanguage: "text" };
    },
  },
  {
    slug: "sitemap-generator",
    category: "seo",
    type: "transformer",
    interaction: "text",
    title: "XML Sitemap Generator",
    description: "Turn a list of URLs into a valid XML sitemap.",
    longDescription:
      "Paste your URLs (one per line) and instantly get a valid XML sitemap you can upload to your server and submit to Google Search Console.",
    keywords: ["sitemap generator", "xml sitemap", "sitemap.xml"],
    icon: MapIcon,
    example: "https://example.com/\nhttps://example.com/about\nhttps://example.com/blog\nhttps://example.com/contact",
    controls: [
      { type: "select", key: "changefreq", label: "Change frequency", default: "weekly", options: [
        { label: "always", value: "always" },
        { label: "daily", value: "daily" },
        { label: "weekly", value: "weekly" },
        { label: "monthly", value: "monthly" },
        { label: "yearly", value: "yearly" },
      ] },
      { type: "number", key: "priority", label: "Priority (0.0–1.0)", default: 0.8, min: 0, max: 1 },
    ],
    tips: [
      "Sitemaps can hold up to 50,000 URLs or 50MB uncompressed.",
      "List only canonical, indexable URLs.",
    ],
    faqs: [
      { question: "Where do I submit my sitemap?", answer: "Upload it to your site root and submit the URL in Google Search Console and Bing Webmaster Tools." },
    ],
    relatedSlugs: ["robots-txt-generator", "canonical-generator", "slug-generator"],
    run: (text, options) => {
      const urls = text.split("\n").map((l) => l.trim()).filter((l) => /^https?:\/\//.test(l));
      if (!urls.length) return EMPTY;
      const cf = String(options.changefreq ?? "weekly");
      const pr = Math.min(1, Math.max(0, Number(options.priority) || 0.8)).toFixed(1);
      const body = urls
        .map(
          (u) =>
            `  <url>\n    <loc>${u.replace(/&/g, "&amp;")}</loc>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`,
        )
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
      return {
        output: xml,
        outputLanguage: "xml",
        metrics: [{ label: "URLs", value: urls.length, tone: "primary", animate: true }],
      };
    },
  },
  {
    slug: "schema-generator",
    category: "seo",
    type: "generator",
    interaction: "form",
    title: "Schema Markup Generator",
    description: "Generate JSON-LD structured data.",
    longDescription:
      "Create ready-to-paste JSON-LD structured data for common schema types — Article, Product and Organization — to help search engines understand your page.",
    keywords: ["schema generator", "json-ld generator", "structured data"],
    icon: Braces,
    fields: [
      { type: "select", key: "schemaType", label: "Schema type", default: "Article", options: [
        { label: "Article", value: "Article" },
        { label: "Product", value: "Product" },
        { label: "Organization", value: "Organization" },
      ] },
      { type: "text", key: "name", label: "Name / headline", default: "The Complete Guide to SEO" },
      { type: "textarea", key: "description", label: "Description", default: "Learn the fundamentals of search engine optimization." },
      { type: "text", key: "url", label: "URL", default: "https://example.com/seo-guide" },
      { type: "text", key: "extra", label: "Author / brand / price", default: "Jane Doe" },
    ],
    tips: [
      "Validate output with Google's Rich Results Test before publishing.",
      "Place the <script type=\"application/ld+json\"> tag in your <head>.",
    ],
    faqs: [
      { question: "Does schema improve rankings?", answer: "Not directly, but it enables rich results (stars, prices, FAQs) that boost click-through rate." },
    ],
    relatedSlugs: ["faq-generator", "open-graph-generator", "canonical-generator"],
    run: (v) => {
      const type = v.schemaType || "Article";
      const name = (v.name || "").trim();
      if (!name) return EMPTY;
      const description = (v.description || "").trim();
      const url = (v.url || "").trim();
      const extra = (v.extra || "").trim();
      let data: Record<string, unknown> = { "@context": "https://schema.org", "@type": type };
      if (type === "Article") {
        data = { ...data, headline: name, description, url, author: { "@type": "Person", name: extra || "Author" } };
      } else if (type === "Product") {
        data = { ...data, name, description, offers: { "@type": "Offer", price: extra || "0.00", priceCurrency: "USD" } };
      } else {
        data = { ...data, name, description, url, brand: extra || name };
      }
      const json = `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
      return { output: json, outputLanguage: "html" };
    },
  },
  {
    slug: "faq-generator",
    category: "seo",
    type: "transformer",
    interaction: "text",
    title: "FAQ Schema Generator",
    description: "Turn Q&A pairs into FAQ Page JSON-LD.",
    longDescription:
      "Paste your questions and answers (one pair per line, separated by ::) and get valid FAQPage structured data that can win FAQ rich results.",
    keywords: ["faq generator", "faq schema", "faqpage json-ld"],
    icon: MessageCircleQuestion,
    example:
      "What is SEO? :: SEO is the practice of improving your site to rank higher in search results.\nIs SEO free? :: Organic SEO doesn't require ad spend, but it takes time and effort.",
    tips: [
      "Use the format: Question :: Answer, one per line.",
      "Only mark up FAQs that are visible on the page.",
    ],
    faqs: [
      { question: "How many FAQs should I add?", answer: "There's no hard limit, but 3–8 genuinely useful questions is a good range." },
    ],
    relatedSlugs: ["schema-generator", "meta-description-generator", "heading-checker"],
    run: (text) => {
      const pairs = text
        .split("\n")
        .map((l) => l.split("::"))
        .filter((p) => p.length >= 2 && p[0].trim() && p[1].trim())
        .map((p) => ({ q: p[0].trim(), a: p.slice(1).join("::").trim() }));
      if (!pairs.length) return EMPTY;
      const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pairs.map((p) => ({
          "@type": "Question",
          name: p.q,
          acceptedAnswer: { "@type": "Answer", text: p.a },
        })),
      };
      const json = `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
      return {
        output: json,
        outputLanguage: "html",
        metrics: [{ label: "Questions", value: pairs.length, tone: "primary", animate: true }],
      };
    },
  },
  /* ----------------------------- Analyzers ----------------------------- */
  {
    slug: "seo-title-analyzer",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "SEO Title Analyzer",
    description: "Score your title for length, power words and more.",
    longDescription:
      "Paste a headline to get an instant SEO score based on length, pixel width, power words, numbers and sentiment signals.",
    keywords: ["seo title analyzer", "headline analyzer", "title checker"],
    icon: Gauge,
    example: "10 Best Running Shoes for 2026: The Complete Buyer's Guide",
    tips: [
      "Titles with numbers and power words tend to get more clicks.",
      "Keep it under 60 characters / 600 pixels.",
    ],
    faqs: [
      { question: "What's a power word?", answer: "An emotionally compelling word like 'best', 'proven' or 'ultimate' that increases click-through rate." },
    ],
    relatedSlugs: ["meta-title-generator", "serp-preview", "heading-checker"],
    run: (text) => {
      const title = text.trim().split("\n")[0]?.trim() ?? "";
      if (!title) return EMPTY;
      const len = title.length;
      const px = pixelWidth(title);
      const words = tokenizeWords(title);
      const hasNumber = /\d/.test(title);
      const power = words.filter((w) => POWER_WORDS.includes(w.toLowerCase()));
      let score = 40;
      if (len >= 30 && len <= 60) score += 25;
      else if (len < 30) score += 10;
      if (px <= 600) score += 15;
      if (hasNumber) score += 10;
      if (power.length) score += Math.min(10, power.length * 5);
      score = Math.min(100, score);
      return {
        score: {
          label: "Title score",
          value: score,
          max: 100,
          tone: score >= 75 ? "success" : score >= 50 ? "warning" : "destructive",
          grade: score >= 75 ? "Strong" : score >= 50 ? "Okay" : "Weak",
          description: `${len} characters · ${px}px wide`,
        },
        metrics: [
          { label: "Length", value: `${len} chars`, tone: len <= 60 ? "success" : "warning" },
          { label: "Pixel width", value: `${px}px`, tone: px <= 600 ? "success" : "destructive" },
          { label: "Has number", value: hasNumber ? "Yes" : "No", tone: hasNumber ? "success" : "default" },
          { label: "Power words", value: power.length, tone: power.length ? "success" : "default" },
          { label: "Word count", value: words.length },
        ],
        lists: power.length
          ? [{ title: "Power words found", items: power, tone: "success" }]
          : undefined,
      };
    },
  },
  {
    slug: "slug-generator",
    category: "seo",
    type: "transformer",
    interaction: "text",
    title: "URL Slug Generator",
    description: "Convert titles into clean, SEO-friendly URL slugs.",
    longDescription:
      "Turn any title or list of titles into clean, lowercase, hyphenated URL slugs — with stop words optionally removed for shorter, keyword-focused URLs.",
    keywords: ["slug generator", "url slug", "permalink generator"],
    icon: Link2,
    example: "10 Best Running Shoes for 2026: The Complete Guide\nHow to Choose the Right Trail Shoe",
    controls: [
      { type: "toggle", key: "stripStop", label: "Remove stop words (a, the, for…)", default: false },
    ],
    tips: [
      "Keep slugs short and keyword-rich.",
      "Use hyphens, not underscores, to separate words.",
    ],
    faqs: [
      { question: "Should I remove stop words?", answer: "Often yes — shorter slugs are cleaner. But keep them if removing changes the meaning." },
    ],
    relatedSlugs: ["case-converter", "meta-title-generator", "canonical-generator"],
    run: (text, options) => {
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return EMPTY;
      const stop = new Set(["a", "an", "the", "for", "of", "to", "in", "on", "and", "or"]);
      const out = lines.map((line) => {
        let slug = slugify(line);
        if (options.stripStop) {
          slug = slug.split("-").filter((w) => !stop.has(w)).join("-");
        }
        return slug;
      });
      return {
        output: out.join("\n"),
        metrics: [{ label: "Slugs generated", value: out.length, tone: "primary", animate: true }],
      };
    },
  },
  {
    slug: "heading-checker",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Heading Structure Checker",
    description: "Audit your H1–H6 heading hierarchy.",
    longDescription:
      "Paste HTML or Markdown to audit your heading structure. We check for a single H1, skipped levels and overall outline health.",
    keywords: ["heading checker", "h1 checker", "heading structure"],
    icon: Heading,
    example:
      "# Ultimate SEO Guide\n## What Is SEO\n## On-Page SEO\n### Title Tags\n### Meta Descriptions\n#### Length\n## Technical SEO",
    tips: [
      "Use exactly one H1 per page.",
      "Don't skip levels (e.g. H2 → H4).",
    ],
    faqs: [
      { question: "Does it read HTML and Markdown?", answer: "Both. We detect <h1>–<h6> tags and Markdown # headings automatically." },
    ],
    relatedSlugs: ["seo-title-analyzer", "keyword-density", "faq-generator"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const headings: { level: number; text: string }[] = [];
      const htmlRe = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
      let m: RegExpExecArray | null;
      while ((m = htmlRe.exec(text))) {
        headings.push({ level: Number(m[1]), text: m[2].replace(/<[^>]+>/g, "").trim() });
      }
      if (!headings.length) {
        for (const line of text.split("\n")) {
          const md = line.match(/^(#{1,6})\s+(.*)$/);
          if (md) headings.push({ level: md[1].length, text: md[2].trim() });
        }
      }
      if (!headings.length) return EMPTY;
      const counts = [0, 0, 0, 0, 0, 0];
      headings.forEach((h) => (counts[h.level - 1] += 1));
      const issues: string[] = [];
      if (counts[0] === 0) issues.push("Missing an H1 — every page should have one.");
      if (counts[0] > 1) issues.push(`Multiple H1s (${counts[0]}). Use only one.`);
      let prev = 0;
      for (const h of headings) {
        if (prev && h.level > prev + 1) issues.push(`Skipped level: H${prev} → H${h.level} ("${h.text}").`);
        prev = h.level;
      }
      return {
        metrics: counts.map((c, i) => ({
          label: `H${i + 1}`,
          value: c,
          tone: i === 0 && c !== 1 ? "warning" : "default",
          animate: true,
        })),
        lists: [
          {
            title: "Outline",
            items: headings.map((h) => `${"  ".repeat(h.level - 1)}H${h.level}: ${h.text}`),
            tone: "accent",
          },
          {
            title: "Issues",
            items: issues,
            empty: "Heading structure looks healthy. ",
            tone: "warning",
          },
        ],
      };
    },
  },
  {
    slug: "keyword-density",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Keyword Density Checker",
    description: "Analyze single and multi-word keyword density.",
    longDescription:
      "Measure how often your keywords appear relative to total words. See density for one-, two- and three-word phrases and avoid keyword stuffing.",
    keywords: ["keyword density", "keyword density checker", "keyword frequency"],
    icon: Percent,
    badge: "popular",
    example:
      "Running shoes are essential for runners. The best running shoes offer cushioning and support. When choosing running shoes, consider your gait, the terrain, and the fit of the shoes.",
    controls: [
      { type: "select", key: "gram", label: "Phrase length", default: "1", options: [
        { label: "1 word", value: "1" },
        { label: "2 words", value: "2" },
        { label: "3 words", value: "3" },
      ] },
    ],
    tips: [
      "Keep primary keyword density around 1–2%.",
      "Focus on natural language, not exact-match repetition.",
    ],
    faqs: [
      { question: "What is a good keyword density?", answer: "Roughly 1–2% for your main keyword. Higher can look like keyword stuffing." },
    ],
    relatedSlugs: ["keyword-extractor", "keyword-frequency-analyzer", "word-counter"],
    run: (text, options) => {
      const words = tokenizeWords(text).map((w) => w.toLowerCase());
      if (!words.length) return EMPTY;
      const n = Number(options.gram) || 1;
      const stop = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "are", "is", "your"]);
      const grams = nGrams(words, n).filter((g) =>
        n === 1 ? !stop.has(g) : true,
      );
      const map = new Map<string, number>();
      for (const g of grams) map.set(g, (map.get(g) ?? 0) + 1);
      const total = words.length;
      const rows = [...map.entries()]
        .map(([phrase, count]) => ({ phrase, count, density: round((count / total) * 100, 2) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);
      return {
        metrics: [
          { label: "Total words", value: total, tone: "primary", animate: true },
          { label: "Unique phrases", value: map.size, animate: true },
          { label: "Top keyword", value: rows[0]?.phrase ?? "—" },
          { label: "Top density", value: `${rows[0]?.density ?? 0}%` },
        ],
        charts: [
          {
            kind: "bar",
            title: "Keyword density (%)",
            data: rows.map((r) => ({ name: r.phrase, value: r.density })),
          },
        ],
        lists: [
          {
            title: "Keyword breakdown",
            items: rows.map((r) => `${r.phrase} — ${r.count}× (${r.density}%)`),
            tone: "accent",
          },
        ],
      };
    },
  },
  {
    slug: "keyword-extractor",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Keyword Extractor",
    description: "Pull the most important keywords from any text.",
    longDescription:
      "Extract the most relevant keywords and phrases from your content using term-frequency scoring with stop-word removal — great for understanding what a page is really about.",
    keywords: ["keyword extractor", "extract keywords", "keyword finder"],
    icon: KeyRound,
    example:
      "Content marketing is a strategic approach focused on creating valuable content. A good content marketing strategy attracts and retains a clearly defined audience. Content marketing builds trust and drives profitable customer action.",
    tips: [
      "Use extracted keywords to inform headings and internal links.",
      "Compare against your target keyword to check topical focus.",
    ],
    faqs: [
      { question: "How are keywords scored?", answer: "By frequency after removing common stop words, with multi-word phrases weighted for relevance." },
    ],
    relatedSlugs: ["keyword-density", "keyword-cluster-generator", "search-intent-analyzer"],
    run: (text) => {
      const words = tokenizeWords(text).map((w) => w.toLowerCase());
      if (!words.length) return EMPTY;
      const stop = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "are", "is", "was", "were", "be", "it", "this", "that", "with", "as", "by", "from", "at", "but", "not", "you", "your", "we", "our"]);
      const uni = words.filter((w) => !stop.has(w) && w.length > 2);
      const freq = new Map<string, number>();
      for (const w of uni) freq.set(w, (freq.get(w) ?? 0) + 1);
      const bigrams = nGrams(words, 2).filter((g) => {
        const [a, b] = g.split(" ");
        return !stop.has(a) && !stop.has(b);
      });
      const biFreq = new Map<string, number>();
      for (const g of bigrams) biFreq.set(g, (biFreq.get(g) ?? 0) + 1);
      const single = [...freq.entries()].map(([k, c]) => ({ k, c })).sort((a, b) => b.c - a.c).slice(0, 10);
      const phrases = [...biFreq.entries()].map(([k, c]) => ({ k, c })).filter((x) => x.c > 1).sort((a, b) => b.c - a.c).slice(0, 8);
      return {
        metrics: [
          { label: "Keywords found", value: freq.size, tone: "primary", animate: true },
          { label: "Top keyword", value: single[0]?.k ?? "—" },
          { label: "Key phrases", value: phrases.length, animate: true },
        ],
        charts: [
          { kind: "bar", title: "Top keywords", data: single.map((s) => ({ name: s.k, value: s.c })) },
        ],
        lists: [
          { title: "Top keywords", items: single.map((s) => `${s.k} (${s.c})`), tone: "accent" },
          { title: "Key phrases", items: phrases.map((p) => `${p.k} (${p.c})`), empty: "No repeated phrases.", tone: "accent" },
        ],
      };
    },
  },
  {
    slug: "keyword-frequency-analyzer",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Keyword Frequency Analyzer",
    description: "See a full frequency table for every word.",
    longDescription:
      "Get a complete word-frequency breakdown of your content, with counts and percentages for every unique word — perfect for spotting overuse and gaps.",
    keywords: ["keyword frequency", "word frequency analyzer", "frequency counter"],
    icon: BarChart3,
    example:
      "SEO is important. SEO helps websites rank. Good SEO combines content, links, and technical health. Learn SEO to grow your traffic.",
    tips: [
      "Sort by frequency to find your dominant themes.",
      "Combine with the density checker for a fuller picture.",
    ],
    faqs: [
      { question: "Are stop words included?", answer: "Yes — this tool shows every word. Use the Keyword Extractor if you want stop words removed." },
    ],
    relatedSlugs: ["keyword-density", "keyword-extractor", "duplicate-word-finder"],
    run: (text) => {
      const freq = wordFrequency(text);
      if (!freq.length) return EMPTY;
      const total = freq.reduce((sum, f) => sum + f.count, 0);
      const rows = freq.slice(0, 20);
      return {
        metrics: [
          { label: "Total words", value: total, tone: "primary", animate: true },
          { label: "Unique words", value: freq.length, animate: true },
          { label: "Most frequent", value: `${freq[0].word} (${freq[0].count}×)` },
        ],
        charts: [
          { kind: "bar", title: "Top 10 words", data: rows.slice(0, 10).map((r) => ({ name: r.word, value: r.count })) },
        ],
        lists: [
          {
            title: "Frequency table",
            items: rows.map((r) => `${r.word} — ${r.count}× (${round((r.count / total) * 100, 1)}%)`),
            tone: "accent",
          },
        ],
      };
    },
  },
  {
    slug: "search-intent-analyzer",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Search Intent Analyzer",
    description: "Classify keywords by search intent.",
    longDescription:
      "Analyze a list of keywords (one per line) and classify each as informational, navigational, commercial or transactional based on intent signals — so you can map content to the funnel.",
    keywords: ["search intent analyzer", "keyword intent", "search intent"],
    icon: Target,
    example: "how to tie running shoes\nbest running shoes 2026\nnike pegasus\nbuy running shoes online\nrunning shoes review",
    tips: [
      "Match content type to intent: guides for informational, product pages for transactional.",
      "Commercial-investigation keywords ('best', 'review') suit comparison posts.",
    ],
    faqs: [
      { question: "How is intent detected?", answer: "By scanning for signal words — 'how/what' (informational), 'buy/price' (transactional), 'best/review' (commercial), or navigation cues like 'login', 'official' or 'near me' (navigational). Brand-only queries aren't detected automatically, so review those by hand." },
    ],
    relatedSlugs: ["keyword-extractor", "keyword-cluster-generator", "keyword-density"],
    run: (text) => {
      const keywords = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!keywords.length) return EMPTY;
      const classify = (kw: string): string => {
        const l = kw.toLowerCase();
        if (/\b(buy|order|purchase|price|cheap|deal|coupon|discount|for sale|shipping)\b/.test(l)) return "Transactional";
        if (/\b(best|top|review|vs|compare|comparison|alternative)\b/.test(l)) return "Commercial";
        if (/\b(how|what|why|guide|tutorial|tips|ideas|examples|meaning)\b/.test(l)) return "Informational";
        if (/\b(login|sign in|website|official|near me|.com)\b/.test(l)) return "Navigational";
        return "Informational";
      };
      const counts: Record<string, number> = {};
      const rows = keywords.map((kw) => {
        const intent = classify(kw);
        counts[intent] = (counts[intent] ?? 0) + 1;
        return `${kw} → ${intent}`;
      });
      return {
        metrics: Object.entries(counts).map(([intent, c]) => ({
          label: intent,
          value: c,
          tone: intent === "Transactional" ? "success" : intent === "Commercial" ? "warning" : "primary",
          animate: true,
        })),
        charts: [
          { kind: "pie", title: "Intent distribution", data: Object.entries(counts).map(([name, value]) => ({ name, value })) },
        ],
        lists: [{ title: "Classified keywords", items: rows, tone: "accent" }],
      };
    },
  },
  {
    slug: "keyword-cluster-generator",
    category: "seo",
    type: "analyzer",
    interaction: "text",
    title: "Keyword Cluster Generator",
    description: "Group related keywords into topic clusters.",
    longDescription:
      "Paste a list of keywords and we'll group them into topic clusters based on shared terms — a fast way to plan content hubs and internal linking.",
    keywords: ["keyword cluster generator", "keyword clustering", "topic clusters"],
    icon: Boxes,
    example: "best running shoes\nrunning shoes for women\ntrail running shoes\nmarathon training plan\nmarathon training for beginners\nhow to train for a marathon\nbest running socks",
    tips: [
      "Each cluster can become a content hub with one pillar page.",
      "Clusters share a common head term — refine your list for tighter groups.",
    ],
    faqs: [
      { question: "How does clustering work here?", answer: "We group keywords by their most significant shared word. It's a lightweight, transparent method — great for planning, not a replacement for SERP-based clustering." },
    ],
    relatedSlugs: ["keyword-extractor", "search-intent-analyzer", "keyword-density"],
    run: (text) => {
      const keywords = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!keywords.length) return EMPTY;
      const stop = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "best", "how", "to", "your", "with"]);
      const clusters = new Map<string, string[]>();
      // Determine global term frequency to pick a meaningful head term per keyword.
      const globalFreq = new Map<string, number>();
      keywords.forEach((kw) =>
        tokenizeWords(kw).forEach((w) => {
          const lw = w.toLowerCase();
          if (!stop.has(lw) && lw.length > 2) globalFreq.set(lw, (globalFreq.get(lw) ?? 0) + 1);
        }),
      );
      keywords.forEach((kw) => {
        const terms = tokenizeWords(kw)
          .map((w) => w.toLowerCase())
          .filter((w) => !stop.has(w) && w.length > 2);
        const head = terms.sort((a, b) => (globalFreq.get(b) ?? 0) - (globalFreq.get(a) ?? 0))[0] ?? "misc";
        if (!clusters.has(head)) clusters.set(head, []);
        clusters.get(head)!.push(kw);
      });
      const sorted = [...clusters.entries()].sort((a, b) => b[1].length - a[1].length);
      return {
        metrics: [
          { label: "Keywords", value: keywords.length, tone: "primary", animate: true },
          { label: "Clusters", value: sorted.length, animate: true },
          { label: "Largest cluster", value: sorted[0] ? `${sorted[0][0]} (${sorted[0][1].length})` : "—" },
        ],
        charts: [
          { kind: "bar", title: "Cluster sizes", data: sorted.slice(0, 8).map(([name, arr]) => ({ name, value: arr.length })) },
        ],
        lists: sorted.map(([head, arr]) => ({
          title: `Cluster: ${head} (${arr.length})`,
          items: arr,
          tone: "accent" as const,
        })),
      };
    },
  },
];
