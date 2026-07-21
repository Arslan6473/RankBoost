"use client";

import { motion } from "framer-motion";
import type { ScoreSpec } from "@/types/tool";
import { cn } from "@/lib/utils";
import { toneText } from "@/lib/tone";
import { Card } from "@/components/ui/card";

const STROKE: Record<string, string> = {
  default: "var(--primary)",
  primary: "var(--primary)",
  accent: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
};

export function ScoreGauge({ score }: { score: ScoreSpec }) {
  const tone = score.tone ?? "primary";
  const pct = Math.max(0, Math.min(1, score.value / score.max));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative size-32 shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={STROKE[tone]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold tabular-nums", toneText[tone])}>
            {score.value}
          </span>
          {score.max === 100 && (
            <span className="text-xs text-muted-foreground">/ 100</span>
          )}
        </div>
      </div>
      <div className="text-center sm:text-left">
        <div className="text-sm font-medium text-muted-foreground">
          {score.label}
        </div>
        {score.grade && (
          <div className={cn("text-xl font-semibold", toneText[tone])}>
            {score.grade}
          </div>
        )}
        {score.description && (
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {score.description}
          </p>
        )}
      </div>
    </Card>
  );
}
