"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getTool, getCategory } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "./favorite-button";

const badgeLabel: Record<string, string> = {
  new: "New",
  popular: "Popular",
  ai: "AI",
};

export function ToolCard({
  slug,
  index = 0,
  showCategory = true,
}: {
  slug: string;
  index?: number;
  showCategory?: boolean;
}) {
  const tool = getTool(slug);
  if (!tool) return null;
  const Icon = tool.icon;
  const category = getCategory(tool.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.25) }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between">
          <span
            className={cn(
              "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft",
              category.gradient,
            )}
          >
            <Icon className="size-5" />
          </span>
          <div className="flex items-center gap-1">
            {tool.badge && (
              <Badge
                variant={tool.badge === "ai" ? "accent" : tool.badge === "new" ? "success" : "default"}
              >
                {badgeLabel[tool.badge]}
              </Badge>
            )}
            <FavoriteButton slug={tool.slug} />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold leading-tight">
            {tool.shortTitle ?? tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {tool.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {showCategory ? (
            <span className="text-xs font-medium text-muted-foreground">
              {category.shortLabel}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
