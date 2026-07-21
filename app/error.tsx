"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error-reporting service here.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <RotateCcw /> Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <Home /> Back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
