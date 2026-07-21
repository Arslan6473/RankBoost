import { Star } from "lucide-react";
import { testimonials } from "@/constants/landing";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by writers & marketers"
          description="Here's what people say about working faster with our tools."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col gap-4 p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-warning" />
                ))}
              </div>
              <p className="flex-1 text-pretty leading-relaxed text-muted-foreground">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
