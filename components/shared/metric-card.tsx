"use client";

import { motion } from "framer-motion";
import type { Metric } from "@/types/tool";
import { cn } from "@/lib/utils";
import { toneText } from "@/lib/tone";
import { AnimatedCounter } from "./animated-counter";

function MetricValue({ metric }: { metric: Metric }) {
  if (metric.animate && typeof metric.value === "number") {
    const decimals = Number.isInteger(metric.value) ? 0 : 1;
    return <AnimatedCounter value={metric.value} decimals={decimals} />;
  }
  return <>{metric.value}</>;
}

export function MetricCard({ metric, index = 0 }: { metric: Metric; index?: number }) {
  const tone = metric.tone ?? "default";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="rounded-xl border border-border bg-card p-4 shadow-soft"
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </div>
      <div
        className={cn(
          "mt-1.5 truncate text-2xl font-semibold tabular-nums",
          toneText[tone],
        )}
        title={String(metric.value)}
      >
        <MetricValue metric={metric} />
      </div>
      {metric.hint && (
        <div className="mt-1 text-xs text-muted-foreground">{metric.hint}</div>
      )}
    </motion.div>
  );
}

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <MetricCard key={`${m.label}-${i}`} metric={m} index={i} />
      ))}
    </div>
  );
}
