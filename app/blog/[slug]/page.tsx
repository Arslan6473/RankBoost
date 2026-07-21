import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import {
  getPost,
  getPostSlugs,
  getTableOfContents,
  getRelatedPosts,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { JsonLd, articleJsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Mdx } from "@/components/blog/mdx";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/shared/cta-banner";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: "Article not found" });
  return buildMetadata({
    title: post.meta.title,
    description: post.meta.description,
    path: `/blog/${slug}`,
    keywords: post.meta.tags,
    type: "article",
    publishedTime: post.meta.date,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;
  const toc = getTableOfContents(content);
  const related = getRelatedPosts(slug, meta.tags);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={articleJsonLd({
          title: meta.title,
          description: meta.description,
          path: `/blog/${slug}`,
          date: meta.date,
          author: meta.author,
        })}
      />

      <article className="container-page py-10">
        <Breadcrumbs
          items={[
            { name: "Blog", path: "/blog" },
            { name: meta.title, path: `/blog/${slug}` },
          ]}
        />

        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{meta.description}</p>
          <div className="mt-6 flex items-center gap-3 border-y border-border py-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
              {meta.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="text-sm">
              <div className="font-semibold">{meta.author}</div>
              <div className="text-muted-foreground">{meta.role}</div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDate(meta.date)}</span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {meta.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* Body + TOC */}
        <div className="mx-auto mt-8 grid max-w-6xl gap-10 lg:grid-cols-[1fr_240px]">
          <div className="mx-auto w-full max-w-3xl">
            <Mdx source={content} />

            <div className="mt-10 border-t border-border pt-6">
              <ShareButtons path={`/blog/${slug}`} title={meta.title} />
            </div>

            {/* Author box */}
            <div className="mt-8 flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                {meta.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <div className="font-semibold">{meta.author}</div>
                <div className="text-sm text-muted-foreground">{meta.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Writing about SEO, content strategy and the craft of clear
                  writing at SEO Text Tools.
                </p>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="mb-6 text-xl font-semibold">Related articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((r) => (
                <PostCard key={r.slug} post={r} />
              ))}
            </div>
          </div>
        )}
      </article>

      <CtaBanner />
    </>
  );
}
