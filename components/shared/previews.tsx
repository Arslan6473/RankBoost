import { Globe } from "lucide-react";
import type { SerpPreview, SocialPreview } from "@/types/tool";
import { Card } from "@/components/ui/card";

function domainOf(url: string): { domain: string; crumbs: string } {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    return {
      domain: u.hostname.replace(/^www\./, ""),
      crumbs: parts.length ? " › " + parts.join(" › ") : "",
    };
  } catch {
    return { domain: url || "example.com", crumbs: "" };
  }
}

export function SerpPreviewCard({ preview }: { preview: SerpPreview }) {
  const { domain, crumbs } = domainOf(preview.url);
  return (
    <Card className="p-5">
      <div className="mb-3 text-sm font-medium">Google preview</div>
      <div className="max-w-xl">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full border border-border bg-secondary">
            <Globe className="size-3.5 text-muted-foreground" />
          </span>
          <div className="leading-tight">
            <div className="text-sm text-foreground">{domain}</div>
            <div className="text-xs text-muted-foreground">
              {domain}
              {crumbs}
            </div>
          </div>
        </div>
        <h3 className="mt-1.5 truncate text-xl text-[#1a0dab] dark:text-[#8ab4f8]">
          {preview.title || "Your title tag appears here"}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {preview.description ||
            "Your meta description appears here. Write a compelling summary to earn more clicks from search."}
        </p>
      </div>
    </Card>
  );
}

export function SocialPreviewCard({ preview }: { preview: SocialPreview }) {
  const label =
    preview.network === "twitter"
      ? "X / Twitter preview"
      : preview.network === "linkedin"
        ? "LinkedIn preview"
        : "Facebook preview";
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-4 text-sm font-medium">
        {label}
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-secondary to-muted">
            {preview.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.image}
                alt=""
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-xs text-muted-foreground">
                og:image (1200 × 630)
              </span>
            )}
          </div>
          <div className="space-y-1 bg-card p-3">
            <div className="text-xs uppercase text-muted-foreground">
              {preview.domain}
            </div>
            <div className="line-clamp-1 text-sm font-semibold">
              {preview.title || "Your title"}
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {preview.description || "Your description text will appear here."}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
