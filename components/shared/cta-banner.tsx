import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner({
  title = "Explore 50+ free SEO & text tools",
  description = "No signup, no limits. Everything runs instantly in your browser.",
  primaryHref = "/tools",
  primaryLabel = "Browse all tools",
  secondaryHref = "/tools/word-counter",
  secondaryLabel = "Try the word counter",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="container-page py-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-accent p-8 text-center shadow-soft-lg sm:p-14">
        <div className="bg-dots absolute inset-0 opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Sparkles className="size-3.5" /> 100% free forever
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-white/85">
            {description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href={primaryHref}>
                {primaryLabel} <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
