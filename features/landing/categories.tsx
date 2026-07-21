import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, getToolsByCategory } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";

export function Categories() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Categories"
        title="Everything you need, organized"
        description="Four focused categories covering SEO, text manipulation, readability and AI writing."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const count = getToolsByCategory(cat.slug).length;
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/tools/category/${cat.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                  cat.gradient,
                )}
              >
                <Icon className="size-6" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{cat.label}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                Browse tools
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
