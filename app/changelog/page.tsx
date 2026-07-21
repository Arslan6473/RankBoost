import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = buildMetadata({
  title: "Changelog",
  description: "New tools, improvements and fixes shipped to SEO Text Tools.",
  path: "/changelog",
});

interface Release {
  version: string;
  date: string;
  tag: "New" | "Improved" | "Fixed";
  title: string;
  items: string[];
}

const releases: Release[] = [
  {
    version: "1.4.0",
    date: "2026-07-20",
    tag: "New",
    title: "AI writing suite",
    items: [
      "Added 12 AI-powered tools: summarizer, rewriter, humanizer, grammar & spell checker, tone changer and more.",
      "New command palette (⌘K) to search across every tool, category and article.",
      "Favorites, recently used and copy history now persist across sessions.",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-06-28",
    tag: "New",
    title: "SEO generators",
    items: [
      "Added SERP preview, Open Graph, Twitter Card and Schema markup generators.",
      "Introduced live social and Google snippet previews.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-06-10",
    tag: "Improved",
    title: "Readability upgrade",
    items: [
      "Added five grade-level formulas and a consensus reading grade.",
      "New passive voice, long sentence and transition word checkers.",
      "Redesigned metric cards with animated counters.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-05-22",
    tag: "New",
    title: "Text toolkit",
    items: [
      "Launched 17 text tools including counters, converters and cleaners.",
      "Added dark mode and a fully responsive, mobile-first layout.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-05-01",
    tag: "New",
    title: "Hello, world",
    items: [
      "Initial launch with the word counter, character counter and keyword density checker.",
    ],
  },
];

const tagVariant = {
  New: "success",
  Improved: "accent",
  Fixed: "warning",
} as const;

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        title="Changelog"
        description="Everything we've shipped, newest first."
        crumbs={[{ name: "Changelog", path: "/changelog" }]}
      />

      <section className="container-page py-10">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-[7px] top-2 h-full w-px bg-border sm:left-[calc(8rem+7px)]" />
          <div className="space-y-10">
            {releases.map((release) => (
              <div
                key={release.version}
                className="relative flex flex-col gap-3 sm:flex-row sm:gap-8"
              >
                <div className="flex items-center gap-3 sm:w-32 sm:flex-col sm:items-end sm:gap-1 sm:pt-0.5">
                  <span className="text-sm font-medium text-muted-foreground sm:order-2">
                    {formatDate(release.date)}
                  </span>
                  <Badge variant="outline" className="sm:order-1">
                    v{release.version}
                  </Badge>
                </div>
                <div className="relative pl-6 sm:pl-8">
                  <span className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-primary bg-background" />
                  <div className="flex items-center gap-2">
                    <Badge variant={tagVariant[release.tag]}>{release.tag}</Badge>
                    <h2 className="text-lg font-semibold">{release.title}</h2>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {release.items.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
