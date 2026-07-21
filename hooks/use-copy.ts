"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app-store";

/** Copy-to-clipboard with toast feedback and history tracking. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const addCopy = useAppStore((s) => s.addCopy);

  const copy = useCallback(
    async (text: string, tool = "clipboard") => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        addCopy({ text, tool });
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error("Couldn't copy — check browser permissions");
      }
    },
    [addCopy],
  );

  return { copy, copied };
}
