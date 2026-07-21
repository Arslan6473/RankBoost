import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PostCard } from "@/components/blog/post-card";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Practical guides on SEO, readability and content writing from the SEO Text Tools team.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container-page py-10">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The Blog
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Practical, no-fluff guides on SEO, readability and writing content
            that ranks and reads well.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {featured && (
          <div className="mb-8">
            <PostCard post={featured} />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <CtaBanner
        title="Put these tips into practice"
        description="Every guide links to a free tool. Start optimizing your content now."
      />
    </>
  );
}
