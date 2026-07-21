import Link from "next/link";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
        className,
      )}
      aria-label={siteConfig.name}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-soft">
        <Type className="size-[18px]" strokeWidth={2.5} />
      </span>
      <span className="text-[15px]">
        SEO<span className="text-primary">Text</span>Tools
      </span>
    </Link>
  );
}
