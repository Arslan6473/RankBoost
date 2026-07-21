"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/shared/social-icons";
import { mainNav } from "@/constants/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCommandStore } from "@/stores/command-store";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const setOpen = useCommandStore((s) => s.setOpen);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors",
        scrolled
          ? "border-border glass shadow-soft"
          : "border-transparent bg-background",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-soft transition-colors hover:text-foreground sm:flex"
            aria-label="Search"
          >
            <Search className="size-4" />
            <span className="hidden md:inline">Search tools…</span>
            <kbd className="ml-2 hidden rounded border border-border px-1.5 py-0.5 text-[10px] md:inline">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Search"
            onClick={() => setOpen(true)}
          >
            <Search className="size-[18px]" />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild aria-label="GitHub">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-[18px]" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
