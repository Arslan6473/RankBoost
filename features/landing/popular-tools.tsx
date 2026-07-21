import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPopularTools, allTools } from "@/lib/tools/registry";
import { SectionHeading } from "@/components/shared/section-heading";
import { ToolCard } from "@/components/shared/tool-card";
import { Button } from "@/components/ui/button";

export function PopularTools() {
  const popular = getPopularTools();
  return (
    <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Most popular"
            title="Popular tools"
            description="The tools our users reach for most often."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/tools">
              View all {allTools.length} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((tool, i) => (
            <ToolCard key={tool.slug} slug={tool.slug} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
