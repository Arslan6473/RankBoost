import { Breadcrumbs, type Crumb } from "./breadcrumbs";

export function PageHeader({
  title,
  description,
  crumbs,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
}) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
      <div className="container-page py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
