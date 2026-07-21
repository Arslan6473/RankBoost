export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation links. Tool categories map to /tools/category/<slug>. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "SEO Tools", href: "/tools/category/seo" },
  { label: "Text Tools", href: "/tools/category/text" },
  { label: "AI Tools", href: "/tools/category/ai" },
  { label: "Readability", href: "/tools/category/readability" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Tools",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "SEO Tools", href: "/tools/category/seo" },
      { label: "Text Tools", href: "/tools/category/text" },
      { label: "Readability", href: "/tools/category/readability" },
      { label: "AI Tools", href: "/tools/category/ai" },
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "Word Counter", href: "/tools/word-counter" },
      { label: "Keyword Density", href: "/tools/keyword-density" },
      { label: "Readability Score", href: "/tools/readability-score" },
      { label: "SERP Preview", href: "/tools/serp-preview" },
      { label: "Case Converter", href: "/tools/case-converter" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
