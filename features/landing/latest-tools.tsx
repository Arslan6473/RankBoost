import { allTools } from "@/lib/tools/registry";
import { SectionHeading } from "@/components/shared/section-heading";
import { ToolCard } from "@/components/shared/tool-card";

export function LatestTools() {
  // Showcase the AI tools as the "latest additions".
  const latest = allTools.filter((t) => t.category === "ai").slice(0, 4);
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Just added"
        title="Latest AI tools"
        description="Our newest AI-powered writing assistants — summarize, rewrite, humanize and optimize in one click."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {latest.map((tool, i) => (
          <ToolCard key={tool.slug} slug={tool.slug} index={i} />
        ))}
      </div>
    </section>
  );
}
