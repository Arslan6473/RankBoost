"use client";

import { Star } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const mounted = useMounted();
  const favorites = useAppStore((s) => s.favorites);
  const toggle = useAppStore((s) => s.toggleFavorite);
  const active = mounted && favorites.includes(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "text-warning",
        className,
      )}
    >
      <Star className={cn("size-4", active && "fill-warning")} />
    </button>
  );
}
