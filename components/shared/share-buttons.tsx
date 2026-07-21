"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  XIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ShareButtons({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  const url = `${siteConfig.url}${path}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const shares = [
    {
      label: "Share on X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
    {
      label: "Share on Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      {shares.map((s) => (
        <Tooltip key={s.label}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" asChild>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <s.icon className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{s.label}</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Copy link"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Link copied");
            }}
          >
            <Link2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
    </div>
  );
}
