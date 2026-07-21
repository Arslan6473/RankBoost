"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "!bg-popover !text-popover-foreground !border-border !rounded-xl !shadow-soft-lg",
          },
        }}
      />
    </ThemeProvider>
  );
}
