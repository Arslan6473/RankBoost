import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "./json-ld";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {full.map((item, i) => {
          const last = i === full.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {last ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              )}
              {!last && <ChevronRight className="size-3.5 opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
