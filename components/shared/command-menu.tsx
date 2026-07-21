"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Wrench,
  FolderOpen,
  FileText,
  Newspaper,
  HelpCircle,
} from "lucide-react";
import { useCommandStore } from "@/stores/command-store";
import { buildSearchIndex, type SearchKind } from "@/lib/search";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const ICONS: Record<SearchKind, typeof Search> = {
  tool: Wrench,
  category: FolderOpen,
  page: FileText,
  blog: Newspaper,
  faq: HelpCircle,
};

export function CommandMenu({
  posts = [],
}: {
  posts?: { slug: string; title: string; excerpt: string }[];
}) {
  const { open, setOpen, toggle } = useCommandStore();
  const router = useRouter();
  const index = useMemo(() => buildSearchIndex(posts), [posts]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  const groups = useMemo(() => {
    const order = ["Tools", "Categories", "Blog", "Pages", "FAQs"];
    const map = new Map<string, typeof index>();
    for (const item of index) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return order
      .filter((g) => map.has(g))
      .map((g) => ({ group: g, items: map.get(g)! }));
  }, [index]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="max-w-xl gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search tools</DialogTitle>
        <Command
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          filter={(value, search) =>
            value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Search tools, categories, articles…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            {groups.map(({ group, items }) => (
              <Command.Group key={group} heading={group}>
                {items.map((item, i) => {
                  const Icon = ICONS[item.kind];
                  return (
                    <Command.Item
                      key={`${item.href}-${i}`}
                      value={`${item.title} ${item.keywords}`}
                      onSelect={() => go(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-secondary"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
