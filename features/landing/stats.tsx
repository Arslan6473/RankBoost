import { stats } from "@/constants/landing";

export function Stats() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
