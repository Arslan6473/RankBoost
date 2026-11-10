# RankBoost

A premium, free toolkit of 50+ SEO and text-analysis tools. Built with Next.js 15, TypeScript, Tailwind CSS v4 and a config-driven tool engine. Fast, private (deterministic tools run entirely in the browser), fully responsive, dark/light, and optimized for SEO.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## What's inside

- **41 deterministic tools** (SEO, Text, Readability) that genuinely work client-side.
- **12 AI tools** with a polished UI and a built-in mock provider — swappable for a real API.
- Premium landing page, blog (MDX), command palette (⌘K), global search, favorites, recent tools, copy history.
- Full SEO infra: dynamic metadata, JSON-LD (SoftwareApplication, Breadcrumb, FAQ, Article), `sitemap.xml`, `robots.txt`, `rss.xml`, web manifest.
- 63 statically generated pages.

## Architecture

The heart of the app is a **typed tool registry** (`lib/tools/registry.ts`). Every tool is a plain object implementing one of four interaction shapes (`types/tool.ts`):

| Type | Interaction | Input | Output |
|------|-------------|-------|--------|
| `analyzer` | `text` | textarea + option controls | metrics, charts, lists, score |
| `transformer` | `text` | textarea + option controls | transformed text |
| `generator` | `form` | structured fields | copyable code/snippet + previews |
| `ai` | `ai` | textarea + controls | async mocked AI result |

A single dynamic route `app/tools/[slug]/page.tsx` renders the shared page shell (hero, breadcrumbs, workbench, tips, FAQ, related, JSON-LD) for all 53 tools, with `generateStaticParams` for static generation.

```
app/                 routes (App Router)
components/ui/        Radix-based shadcn-style primitives
components/shared/    reusable app components (metric card, charts, previews…)
components/layout/    header + footer
features/tools/       tool compute logic + the workbench
features/landing/     landing page sections
lib/                  registry, seo, text analysis, readability, ai, blog, search
stores/               Zustand (favorites, recent, copy history, command palette)
content/blog/         MDX articles
config/ constants/ types/
```

### Adding a new tool

1. Add a definition to the relevant file in `features/tools/` (`text.ts`, `seo.ts`, `readability.ts`, `ai.ts`) — provide `slug`, meta, `tips`, `faqs`, `relatedSlugs`, and a pure `run()`.
2. That's it. It's automatically registered, routed at `/tools/<slug>`, statically generated, added to search, the command palette, its category page, and the sitemap.

### Connecting a real AI provider

The AI tools talk to a single interface (`lib/ai/provider.ts`). Replace `MockAiProvider` with an implementation backed by OpenAI or Gemini and export it as `aiProvider` — nothing else changes. Move the call behind a route handler / server action to keep API keys server-side.

## Tech stack

Next.js 15 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Radix UI · Framer Motion · Recharts · next-themes · Zustand · React Hook Form + Zod · next-mdx-remote · Lucide.

## Notes

- Config lives in `next.config.mjs` (kept as `.mjs` rather than `.ts` to avoid a chunk-resolution issue in this Next patch).
- Tool pages ship the full registry + Recharts in the client bundle (~354 kB first load). To trim it, lazy-load `components/shared/tool-chart.tsx` with `next/dynamic`.
- The newsletter and contact forms are UI-complete with placeholder submit handlers — wire them to your ESP/email backend.

## Deploy

Zero-config on Vercel. `npm run build` produces static/SSG output for everything except the on-demand `rss.xml`.
