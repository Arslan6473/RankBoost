"use client";

import { Info } from "lucide-react";
import type { ResultList, ToolResult } from "@/types/tool";
import { cn } from "@/lib/utils";
import { toneBadge } from "@/lib/tone";
import { Card } from "@/components/ui/card";
import { MetricGrid } from "./metric-card";
import { ToolChart } from "./tool-chart";
import { ScoreGauge } from "./score-gauge";
import { OutputBlock } from "./output-block";
import { SerpPreviewCard, SocialPreviewCard } from "./previews";

function ListCard({ list }: { list: ResultList }) {
  const tone = list.tone ?? "default";
  if (!list.items.length && !list.empty) return null;
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", toneBadge[tone])}>
          {list.items.length}
        </span>
        <h3 className="text-sm font-semibold">{list.title}</h3>
      </div>
      {list.items.length ? (
        <ul className="space-y-1.5">
          {list.items.map((item, i) => (
            <li
              key={i}
              className="whitespace-pre-wrap break-words rounded-lg bg-secondary/60 px-3 py-2 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{list.empty}</p>
      )}
    </Card>
  );
}

export function ResultView({
  result,
  tool,
}: {
  result: ToolResult;
  tool: string;
}) {
  return (
    <div className="space-y-5">
      {result.score && <ScoreGauge score={result.score} />}

      {result.serpPreview && <SerpPreviewCard preview={result.serpPreview} />}
      {result.socialPreview && (
        <SocialPreviewCard preview={result.socialPreview} />
      )}

      {result.output !== undefined && result.output !== "" && (
        <OutputBlock
          value={result.output}
          language={result.outputLanguage}
          tool={tool}
        />
      )}

      {result.metrics && result.metrics.length > 0 && (
        <MetricGrid metrics={result.metrics} />
      )}

      {result.notes && result.notes.length > 0 && (
        <Card className="flex gap-3 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" />
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Card>
      )}

      {result.charts && result.charts.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {result.charts.map((c, i) => (
            <ToolChart key={i} spec={c} />
          ))}
        </div>
      )}

      {result.lists && result.lists.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {result.lists.map((l, i) => (
            <ListCard key={i} list={l} />
          ))}
        </div>
      )}
    </div>
  );
}
