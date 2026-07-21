import type { LucideIcon } from "lucide-react";

export type ToolCategory = "seo" | "text" | "readability" | "ai";

export type ToolInteraction = "text" | "form";

export type MetricTone =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "destructive";

/** A single dashboard metric card. */
export interface Metric {
  label: string;
  value: string | number;
  hint?: string;
  tone?: MetricTone;
  /** When true and value is numeric, animate a counter up to it. */
  animate?: boolean;
}

export type ChartKind = "bar" | "line" | "area" | "pie";

export interface ChartSpec {
  kind: ChartKind;
  title: string;
  data: { name: string; value: number }[];
  /** Optional caption shown under the chart. */
  caption?: string;
}

export interface ResultList {
  title: string;
  items: string[];
  tone?: MetricTone;
  empty?: string;
}

export interface ScoreSpec {
  label: string;
  value: number;
  max: number;
  tone?: MetricTone;
  description?: string;
  /** Optional band label, e.g. "Very easy to read". */
  grade?: string;
}

export type OutputLanguage = "text" | "html" | "xml" | "json" | "markdown";

export interface SerpPreview {
  title: string;
  url: string;
  description: string;
}

export interface SocialPreview {
  network: "facebook" | "twitter" | "linkedin";
  title: string;
  description: string;
  image?: string;
  domain: string;
}

/** The unified shape every tool's `run` returns. */
export interface ToolResult {
  /** True when there is no input yet — the shell shows an empty state. */
  empty?: boolean;
  score?: ScoreSpec;
  metrics?: Metric[];
  charts?: ChartSpec[];
  lists?: ResultList[];
  notes?: string[];
  /** Transformed / generated text output (transformers & generators). */
  output?: string;
  outputLanguage?: OutputLanguage;
  /** Google-style SERP snippet preview. */
  serpPreview?: SerpPreview;
  /** Social share card preview. */
  socialPreview?: SocialPreview;
}

/* ------------------------------------------------------------------ */
/*  Interaction controls                                               */
/* ------------------------------------------------------------------ */
export type OptionControl =
  | { type: "toggle"; key: string; label: string; default?: boolean }
  | {
      type: "text";
      key: string;
      label: string;
      placeholder?: string;
      default?: string;
    }
  | {
      type: "select";
      key: string;
      label: string;
      options: { label: string; value: string }[];
      default?: string;
    }
  | {
      type: "number";
      key: string;
      label: string;
      default?: number;
      min?: number;
      max?: number;
    };

export type FormField =
  | {
      type: "text";
      key: string;
      label: string;
      placeholder?: string;
      default?: string;
      description?: string;
      maxLength?: number;
    }
  | {
      type: "textarea";
      key: string;
      label: string;
      placeholder?: string;
      default?: string;
      description?: string;
    }
  | {
      type: "select";
      key: string;
      label: string;
      options: { label: string; value: string }[];
      default?: string;
      description?: string;
    }
  | {
      type: "number";
      key: string;
      label: string;
      default?: number;
      min?: number;
      max?: number;
      description?: string;
    };

/* ------------------------------------------------------------------ */
/*  Tool definition                                                    */
/* ------------------------------------------------------------------ */
export interface ToolFaq {
  question: string;
  answer: string;
}

interface ToolMeta {
  slug: string;
  category: ToolCategory;
  type: "analyzer" | "transformer" | "generator" | "ai";
  title: string;
  /** Shorter label for cards/nav. */
  shortTitle?: string;
  description: string;
  /** Longer intro paragraph for the tool hero / SEO. */
  longDescription: string;
  keywords: string[];
  icon: LucideIcon;
  badge?: "new" | "popular" | "ai";
  tips: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
  /** Extra SEO body copy (plain paragraphs). */
  seoContent?: string[];
}

export interface TextTool extends ToolMeta {
  interaction: "text";
  example: string;
  placeholder?: string;
  controls?: OptionControl[];
  run: (text: string, options: Record<string, unknown>) => ToolResult;
}

export interface FormTool extends ToolMeta {
  interaction: "form";
  fields: FormField[];
  run: (values: Record<string, string>) => ToolResult;
}

export interface AiTool extends ToolMeta {
  interaction: "ai";
  example: string;
  placeholder?: string;
  controls?: OptionControl[];
  /** Async — talks to the swappable AI provider. */
  run: (input: string, options: Record<string, string>) => Promise<ToolResult>;
}

export type ToolDefinition = TextTool | FormTool | AiTool;
