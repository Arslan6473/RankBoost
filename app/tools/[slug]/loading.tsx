import { Skeleton } from "@/components/ui/skeleton";

export default function ToolLoading() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container-page py-8">
          <Skeleton className="h-4 w-48" />
          <div className="mt-6 flex gap-4">
            <Skeleton className="size-14 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-72 max-w-full" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </section>
    </>
  );
}
