"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Wrench, FolderOpen, FileText, Newspaper, HelpCircle } from "lucide-react";
import { buildSearchIndex, type SearchKind } from "@/lib/search";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<SearchKind, typeof Search> = {
  tool: Wrench,
  category: FolderOpen,
  page: FileText,
  blog: Newspaper,
  faq: HelpCircle,
};

export function SearchView({
  posts,
}: {
  posts: { slug: string; title: string; excerpt: string }[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const index = useMemo(() => buildSearchIndex(posts), [posts]);

  useEffect(() => {
    const q = query.trim();
    const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    window.history.replaceState(null, "", url);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [query, index]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, articles, FAQs…"
          className="h-14 pl-12 text-base"
          aria-label="Search"
        />
      </div>

      {query.trim() ? (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for
            &quot;{query.trim()}&quot;
          </p>
          {results.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {results.map((item, i) => {
                const Icon = ICONS[item.kind];
                return (
                  <li key={`${item.href}-${i}`}>
                    <Link
                      href={item.href}
                      onClick={() => router.push(item.href)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/30"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">
                            {item.title}
                          </span>
                          <Badge variant="secondary" className="capitalize">
                            {item.kind}
                          </Badge>
                        </div>
                        {item.subtitle && (
                          <p className="truncate text-sm text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="No results"
                description="Try a different search term, or browse all tools."
              />
            </div>
          )}
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Search everything"
            description="Find any tool, article or FAQ. Start typing above."
          />
        </div>
      )}
    </div>
  );
}
