# SEO Text Tools — Design Spec

_Date: 2026-07-20_

## Product
A premium, free SEO + text-analysis web app. Commercial-SaaS feel (Ahrefs / Linear / Vercel / Stripe inspired). No signup. Fast, accessible, dark/light.

## Stack
Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Radix-based shadcn-style UI · Framer Motion · Recharts · next-themes · Zustand · React Hook Form + Zod · Lucide · MDX (next-mdx-remote). Server Components by default; client only where interactive.

## Scope (agreed)
- **All 41 deterministic tools genuinely functional** (18 SEO + 17 Text + 6 Readability), client-side compute.
- **12 AI tools mocked** behind a swappable `AiProvider` interface (one-file swap to OpenAI/Gemini).
- **Premium landing + design system** are must-be-excellent.
- Blog is light (~4 MDX posts). Testimonials placeholder. SEO infra included (sitemap/robots/manifest/RSS/JSON-LD/metadata).

## Architecture — tool engine (Hybrid registry)
Typed registry drives a single dynamic route `/tools/[slug]`. Each tool: `{ slug, category, title, description, type, keywords, example, tips[], faqs[], relatedSlugs[], compute }`.

Tool **types**:
- `analyzer` — text → metrics dashboard + charts
- `transformer` — text → transformed text
- `generator` — form → copyable code/snippet
- `ai` — mocked async response via `AiProvider`

Shared **ToolPage shell**: breadcrumbs → hero → workbench → live results → example → tips → FAQ → related → CTA → SEO copy + JSON-LD (SoftwareApplication, Breadcrumb, FAQ).

## Folder structure
`app/` routes · `components/ui` + `components/shared` · `features/tools/<category>` (compute) + `features/landing` · `hooks/` · `lib/` (registry, seo, mdx, ai, text) · `stores/` (zustand) · `types/` · `constants/` · `content/blog/` · `public/`.

## Extras
Command palette (⌘K), global `/search`, favorites + recent tools + copy history (localStorage/Zustand), toasts, animated counters, skeletons, empty states, 404 + 500, legal pages, changelog.

## Verification
`npm run build` clean + dev-server smoke test.
