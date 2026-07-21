import Link from "next/link";
import { Home, Search, Compass } from "lucide-react";
import { getPopularTools } from "@/lib/tools/registry";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/shared/tool-card";

export default function NotFound() {
  const popular = getPopularTools().slice(0, 4);
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <span className="text-7xl font-bold tracking-tight text-gradient sm:text-8xl">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try one
        of these instead.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <Home /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/tools">
            <Compass /> Browse tools
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/search">
            <Search /> Search
          </Link>
        </Button>
      </div>

      <div className="mt-16 w-full max-w-5xl text-left">
        <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Popular tools
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((tool, i) => (
            <ToolCard key={tool.slug} slug={tool.slug} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
