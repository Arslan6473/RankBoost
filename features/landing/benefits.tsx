import { benefits } from "@/constants/landing";
import { SectionHeading } from "@/components/shared/section-heading";

export function Benefits() {
  return (
    <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why us"
          title="Built for people who write"
          description="Fast, private and free — the way great tools should be."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
