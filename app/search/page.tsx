import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { PageHeader } from "@/components/shared/page-header";
import { SearchView } from "@/features/search/search-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search all 50+ tools, articles and FAQs on SEO Text Tools.",
  path: "/search",
});

export default function SearchPage() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
  }));

  return (
    <>
      <PageHeader
        title="Search"
        description="Find any tool, article or answer across the site."
        crumbs={[{ name: "Search", path: "/search" }]}
      />
      <section className="container-page max-w-3xl py-10">
        <Suspense fallback={<Skeleton className="h-14 w-full" />}>
          <SearchView posts={posts} />
        </Suspense>
      </section>
    </>
  );
}
