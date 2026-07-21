import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 line-clamp-3 text-sm text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-3">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingTime}
          </span>
        </span>
        <ArrowUpRight className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
