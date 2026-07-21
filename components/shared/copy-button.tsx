"use client";

import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  value: string;
  tool?: string;
  label?: string;
}

export function CopyButton({
  value,
  tool,
  label = "Copy",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const { copy, copied } = useCopy();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => copy(value, tool)}
      disabled={!value}
      {...props}
    >
      {copied ? (
        <Check className="text-success" />
      ) : (
        <Copy />
      )}
      {label}
    </Button>
  );
}
