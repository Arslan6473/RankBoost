import { features } from "@/constants/landing";
import { SectionHeading } from "@/components/shared/section-heading";

export function Features() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Features"
        title="Thoughtful details, everywhere"
        description="A premium experience in every corner of the app."
      />
      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-soft">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
