"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommandStore } from "@/stores/command-store";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  const setOpen = useCommandStore((s) => s.setOpen);

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background */}
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-x-0 -top-40 h-[400px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_65%)]"
        aria-hidden
      />
      <div className="container-page relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm shadow-soft"
          >
            <span className="flex items-center gap-1 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-warning" />
              ))}
            </span>
            <span className="text-muted-foreground">
              Loved by 50,000+ writers & marketers
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          >
            The complete toolkit for{" "}
            <span className="text-gradient">SEO & text analysis</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            50+ free, lightning-fast tools to write, optimize and analyze your
            content. Count words, check readability, generate meta tags and more
            — all in your browser, no signup required.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/tools">
                Explore all tools <ArrowRight />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setOpen(true)}
              className="gap-2"
            >
              <Search className="size-4" /> Quick search
              <kbd className="ml-1 rounded border border-border px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" /> AI-powered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" /> 100% free
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" /> No signup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" /> Private &
              secure
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
