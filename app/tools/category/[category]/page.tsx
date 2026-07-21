import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  categories,
  getCategory,
  getToolsByCategory,
} from "@/lib/tools/registry";
import type { ToolCategory } from "@/types/tool";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ToolCard } from "@/components/shared/tool-card";
import { CtaBanner } from "@/components/shared/cta-banner";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

function isValidCategory(slug: string): slug is ToolCategory {
  return categories.some((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return buildMetadata({ title: "Not found" });
  const meta = getCategory(category);
  return buildMetadata({
    title: meta.label,
    description: meta.description,
    path: `/tools/category/${category}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const meta = getCategory(category);
  const tools = getToolsByCategory(category);
  const Icon = meta.icon;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container-page py-10">
          <Breadcrumbs
            items={[
              { name: "Tools", path: "/tools" },
              { name: meta.label, path: `/tools/category/${category}` },
            ]}
          />
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                meta.gradient,
              )}
            >
              <Icon className="size-7" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {meta.label}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {tools.length} tools · {meta.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} slug={tool.slug} index={i} showCategory={false} />
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
