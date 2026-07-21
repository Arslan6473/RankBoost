import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb, ArrowRight } from "lucide-react";
import {
  getTool,
  getAllToolSlugs,
  getRelatedTools,
  getCategory,
} from "@/lib/tools/registry";
import { buildMetadata } from "@/lib/seo";
import {
  JsonLd,
  softwareAppJsonLd,
  faqJsonLd,
} from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ToolWorkbench } from "@/features/tools/tool-workbench";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ShareButtons } from "@/components/shared/share-buttons";
import { ToolCard } from "@/components/shared/tool-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return buildMetadata({ title: "Tool not found" });
  return buildMetadata({
    title: tool.title,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const Icon = tool.icon;
  const path = `/tools/${tool.slug}`;

  return (
    <>
      <JsonLd
        data={softwareAppJsonLd(tool.title, tool.description, path)}
      />
      {tool.faqs.length > 0 && <JsonLd data={faqJsonLd(tool.faqs)} />}

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { name: category.label, path: `/tools/category/${category.slug}` },
              { name: tool.title, path },
            ]}
          />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                  category.gradient,
                )}
              >
                <Icon className="size-7" />
              </span>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">{category.label}</Badge>
                  {tool.badge && (
                    <Badge variant={tool.badge === "ai" ? "accent" : "default"}>
                      {tool.badge === "ai"
                        ? "AI"
                        : tool.badge === "new"
                          ? "New"
                          : "Popular"}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {tool.title}
                </h1>
                <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
                  {tool.longDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton
                slug={tool.slug}
                className="size-10 border border-border bg-card shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workbench */}
      <section className="container-page py-8 sm:py-10">
        <ToolWorkbench slug={tool.slug} />
      </section>

      {/* Tips + FAQ + Related */}
      <section className="container-page grid gap-10 pb-4 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {tool.tips.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Tips & best practices</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {tool.tips.map((tip, i) => (
                  <Card key={i} className="flex gap-3 p-4">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tool.seoContent && tool.seoContent.length > 0 && (
            <div className="prose-tool space-y-4">
              <h2 className="text-xl font-semibold">
                About the {tool.title}
              </h2>
              {tool.seoContent.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          )}

          {tool.faqs.length > 0 && (
            <div>
              <h2 className="mb-2 text-xl font-semibold">
                Frequently asked questions
              </h2>
              <FaqAccordion faqs={tool.faqs} />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <ShareButtons path={path} title={tool.title} />
            <Link
              href={`/tools/category/${category.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              More {category.label} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Related tools
            </h2>
            <div className="grid gap-3">
              {related.map((r, i) => (
                <ToolCard key={r.slug} slug={r.slug} index={i} />
              ))}
            </div>
          </aside>
        )}
      </section>

      <div className="mt-6">
        <SectionHeading
          className="container-page"
          eyebrow="Keep going"
          title="Discover more tools"
          description={`Browse every ${category.label.toLowerCase()} tool, or explore the full toolkit.`}
        />
      </div>
      <CtaBanner />
    </>
  );
}
