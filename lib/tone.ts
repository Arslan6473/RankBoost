import type { MetricTone } from "@/types/tool";

/** Text-color class per tone. */
export const toneText: Record<MetricTone, string> = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

/** Subtle background + text badge classes per tone. */
export const toneBadge: Record<MetricTone, string> = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/12 text-accent",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  destructive: "bg-destructive/12 text-destructive",
};

/** Solid-ish fill for progress/score bars per tone. */
export const toneBar: Record<MetricTone, string> = {
  default: "bg-foreground/40",
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};
