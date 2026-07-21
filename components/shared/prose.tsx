import { cn } from "@/lib/utils";

/**
 * Lightweight prose container for legal / long-form pages.
 * Styles headings, paragraphs and lists consistently without a plugin.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        "[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted-foreground",
        "[&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul>li]:list-disc [&_ul]:text-muted-foreground [&_ul]:marker:text-primary",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
