"use client";

import { Download } from "lucide-react";
import type { OutputLanguage } from "@/types/tool";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";
import { downloadText } from "@/lib/download";

interface OutputBlockProps {
  value: string;
  language?: OutputLanguage;
  tool: string;
  title?: string;
}

const EXT: Record<OutputLanguage, string> = {
  text: "txt",
  html: "html",
  xml: "xml",
  json: "json",
  markdown: "md",
};

export function OutputBlock({
  value,
  language = "text",
  tool,
  title = "Output",
}: OutputBlockProps) {
  const isCode = language !== "text";
  return (
    <div className="rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => downloadText(value, `${tool}.${EXT[language]}`)}
            disabled={!value}
          >
            <Download />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <CopyButton value={value} tool={tool} />
        </div>
      </div>
      <pre
        className={`max-h-[420px] overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-sm ${
          isCode ? "font-mono text-[13px] leading-relaxed" : "leading-relaxed"
        }`}
      >
        {value}
      </pre>
    </div>
  );
}
