import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { allTools } from "@/lib/tools/registry";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ToolsExplorer } from "@/features/tools/tools-explorer";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = buildMetadata({
  title: "All Tools",
  description:
    "Browse all 50+ free SEO and text analysis tools. Search, filter by category and save your favorites.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container-page py-10">
          <Breadcrumbs items={[{ name: "All Tools", path: "/tools" }]} />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All tools
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {allTools.length} free tools for SEO, text analysis, readability and
            AI-assisted writing. Everything runs instantly in your browser.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <ToolsExplorer />
      </section>

      <CtaBanner />
    </>
  );
}
