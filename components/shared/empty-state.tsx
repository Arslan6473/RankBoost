import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title = "Your results will appear here",
  description = "Start typing or paste your text above to see live analysis.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed bg-card/50 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Card>
  );
}
