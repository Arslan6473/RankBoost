"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardPaste,
  Upload,
  Trash2,
  Wand2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { ToolDefinition, ToolResult } from "@/types/tool";
import { getTool } from "@/lib/tools/registry";
import { readTextFile } from "@/lib/download";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { OptionControls, FormFields } from "@/components/shared/tool-inputs";
import { ResultView } from "@/components/shared/result-view";
import { EmptyState } from "@/components/shared/empty-state";
import { formatNumber } from "@/lib/utils";

export function ToolWorkbench({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const visitTool = useAppStore((s) => s.visitTool);

  useEffect(() => {
    visitTool(slug);
  }, [slug, visitTool]);

  if (!tool) return null;
  if (tool.interaction === "form") return <FormWorkbench tool={tool} />;
  return <TextWorkbench tool={tool} />;
}

/* ------------------------------------------------------------------ */
/*  Text + AI workbench                                                */
/* ------------------------------------------------------------------ */
function TextWorkbench({
  tool,
}: {
  tool: Extract<ToolDefinition, { interaction: "text" | "ai" }>;
}) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<Record<string, string | number | boolean>>(
    () => defaultsFrom(tool.controls),
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const isAi = tool.interaction === "ai";
  const [aiResult, setAiResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const liveResult = useMemo<ToolResult>(() => {
    if (isAi) return { empty: true };
    if (!text.trim()) return { empty: true };
    try {
      return (tool as Extract<ToolDefinition, { interaction: "text" }>).run(
        text,
        options,
      );
    } catch {
      return { empty: true };
    }
  }, [isAi, text, options, tool]);

  async function runAi() {
    if (!text.trim()) {
      toast.error("Enter some text first");
      return;
    }
    setLoading(true);
    setAiResult(null);
    try {
      const opts: Record<string, string> = {};
      for (const [k, v] of Object.entries(options)) opts[k] = String(v);
      const res = await (
        tool as Extract<ToolDefinition, { interaction: "ai" }>
      ).run(text, opts);
      setAiResult(res);
    } catch {
      toast.error("Something went wrong generating the result");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setText(clip);
        toast.success("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard access denied");
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setText(await readTextFile(file));
      toast.success(`Loaded ${file.name}`);
    } catch {
      toast.error("Could not read file");
    }
    e.target.value = "";
  }

  const charCount = text.length;
  const result = isAi ? aiResult : liveResult;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePaste}>
            <ClipboardPaste /> Paste
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload /> Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setText(tool.example)}
          >
            <Wand2 /> Try sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setText("");
              setAiResult(null);
            }}
            disabled={!text}
          >
            <Trash2 /> Clear
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,text/plain"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tool.placeholder ?? "Type or paste your text here…"}
          className="min-h-[320px] resize-y"
          aria-label={`${tool.title} input`}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatNumber(charCount)} characters</span>
          {isAi && <span>Powered by AI (demo)</span>}
        </div>

        {tool.controls && tool.controls.length > 0 && (
          <OptionControls
            controls={tool.controls}
            values={options}
            onChange={(k, v) => setOptions((prev) => ({ ...prev, [k]: v }))}
          />
        )}

        {isAi && (
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={runAi}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            {loading ? "Generating…" : "Generate"}
          </Button>
        )}
      </div>

      <div>
        {loading ? (
          <AiSkeleton />
        ) : result && !result.empty ? (
          <ResultView result={result} tool={tool.slug} />
        ) : (
          <EmptyState
            description={
              isAi
                ? "Enter text and press Generate to see the AI result."
                : "Start typing or paste your text to see live analysis."
            }
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form (generator) workbench                                         */
/* ------------------------------------------------------------------ */
function FormWorkbench({
  tool,
}: {
  tool: Extract<ToolDefinition, { interaction: "form" }>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of tool.fields) v[f.key] = f.default != null ? String(f.default) : "";
    return v;
  });

  const result = useMemo<ToolResult>(() => {
    try {
      return tool.run(values);
    } catch {
      return { empty: true };
    }
  }, [values, tool]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <FormFields
          fields={tool.fields}
          values={values}
          onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))}
        />
      </div>
      <div>
        {result && !result.empty ? (
          <ResultView result={result} tool={tool.slug} />
        ) : (
          <EmptyState description="Fill in the fields to generate your output." />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function defaultsFrom(
  controls?: Extract<ToolDefinition, { interaction: "text" | "ai" }>["controls"],
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const c of controls ?? []) {
    if (c.type === "toggle") out[c.key] = c.default ?? false;
    else out[c.key] = c.default ?? "";
  }
  return out;
}

function AiSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
