"use client";

import { useMemo, useState } from "react";
import { Search, Star, X } from "lucide-react";
import { allTools, categories } from "@/lib/tools/registry";
import { useAppStore } from "@/stores/app-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/shared/tool-card";
import { EmptyState } from "@/components/shared/empty-state";

type Filter = "all" | "favorites" | (typeof categories)[number]["slug"];

export function ToolsExplorer({
  initialCategory = "all",
}: {
  initialCategory?: Filter;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialCategory);
  const mounted = useMounted();
  const favorites = useAppStore((s) => s.favorites);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTools.filter((t) => {
      if (filter === "favorites" && !favorites.includes(t.slug)) return false;
      if (filter !== "all" && filter !== "favorites" && t.category !== filter)
        return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, filter, favorites]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    ...categories.map((c) => ({ key: c.slug as Filter, label: c.shortLabel })),
    { key: "favorites", label: "Favorites" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="pl-9 pr-9"
            aria-label="Search tools"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const count =
              tab.key === "favorites"
                ? mounted
                  ? favorites.length
                  : 0
                : undefined;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === tab.key
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.key === "favorites" && <Star className="size-3.5" />}
                {tab.label}
                {count !== undefined && count > 0 && (
                  <span className="rounded-full bg-background/20 px-1.5 text-xs">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "tool" : "tools"}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((tool, i) => (
            <ToolCard key={tool.slug} slug={tool.slug} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No tools found"
            description={
              filter === "favorites"
                ? "You haven't favorited any tools yet. Tap the star on any tool to save it here."
                : "Try a different search term or category."
            }
          />
        </div>
      )}
    </div>
  );
}
