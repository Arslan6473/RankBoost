import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Shared 1200×630 social card used by every opengraph-image route. */
export function renderOgImage({
  title,
  eyebrow,
  description,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b1220 0%, #10224a 55%, #2563eb 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
              <path
                d="M10 46l14-14 9 9 19-19M38 22h14v14"
                stroke="#fff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow && (
            <div style={{ fontSize: 26, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: 2 }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: title.length > 48 ? 58 : 72, fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.4, maxWidth: 1000 }}>
              {description.length > 140 ? `${description.slice(0, 137)}…` : description}
            </div>
          )}
        </div>

        <div style={{ fontSize: 24, color: "#94a3b8" }}>
          {`${siteConfig.url.replace(/^https?:\/\//, "")} · Free, no signup`}
        </div>
      </div>
    ),
    ogSize,
  );
}
