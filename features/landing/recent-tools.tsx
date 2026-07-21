"use client";

import { History } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useMounted } from "@/hooks/use-mounted";
import { getTool } from "@/lib/tools/registry";
import { ToolCard } from "@/components/shared/tool-card";

export function RecentTools() {
  const mounted = useMounted();
  const recent = useAppStore((s) => s.recent);
  const valid = recent.filter((slug) => getTool(slug));

  if (!mounted || valid.length === 0) return null;

  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-center gap-2">
        <History className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recently used</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {valid.slice(0, 4).map((slug, i) => (
          <ToolCard key={slug} slug={slug} index={i} />
        ))}
      </div>
    </section>
  );
}
