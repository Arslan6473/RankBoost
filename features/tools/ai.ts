import {
  Sparkles,
  PenLine,
  UserRoundCheck,
  SpellCheck,
  CheckCheck,
  Palette,
  Expand,
  Shrink,
  Rocket,
  Heading1,
  Tags,
  ListTree,
} from "lucide-react";
import type { AiTool, ToolResult } from "@/types/tool";
import { aiProvider } from "@/lib/ai/provider";

const SAMPLE = `Search engine optimization is really quite important for any business that wants to grow online. Basically, it helps your website show up when people search for things. In order to succeed, you need good content, a fast website, and links from other sites.`;

function toResult(output: string, suggestions?: string[]): ToolResult {
  if (!output.trim() && !(suggestions && suggestions.length)) return { empty: true };
  return {
    output,
    outputLanguage: "text",
    lists: suggestions?.length
      ? [{ title: "AI notes", items: suggestions, tone: "accent" }]
      : undefined,
  };
}

/** Shared runner: forwards to the swappable AI provider. */
function aiRun(slug: string) {
  return async (
    input: string,
    options: Record<string, string>,
  ): Promise<ToolResult> => {
    if (!input.trim()) return { empty: true };
    const res = await aiProvider.complete({ tool: slug, input, options });
    return toResult(res.output, res.suggestions);
  };
}

const commonFaqs = [
  {
    question: "Is this a real AI model?",
    answer:
      "This demo uses a built-in mock so the interface is fully functional with no API key. The code is structured so an OpenAI or Gemini key can be dropped into a single provider file to make it live.",
  },
  {
    question: "Does my text get sent anywhere?",
    answer:
      "In this demo, no — everything runs locally in your browser. With a real provider connected, requests would go to your chosen AI API.",
  },
];

export const aiTools: AiTool[] = [
  {
    slug: "ai-summarizer",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Summarizer",
    description: "Condense long text into a concise summary.",
    longDescription:
      "Paste an article or document and get a clean summary. Choose how long the summary should be, from a single sentence to a short paragraph.",
    keywords: ["ai summarizer", "text summarizer", "summary generator"],
    icon: Sparkles,
    badge: "ai",
    example: SAMPLE,
    controls: [
      { type: "select", key: "length", label: "Summary length", default: "short", options: [
        { label: "Short (1 sentence)", value: "short" },
        { label: "Medium (2–3 sentences)", value: "medium" },
        { label: "Long (paragraph)", value: "long" },
      ] },
    ],
    tips: ["Longer inputs produce better summaries.", "Try each length to find the right level of detail."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-rewriter", "ai-simplify-text", "ai-outline-generator"],
    run: aiRun("ai-summarizer"),
  },
  {
    slug: "ai-rewriter",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Rewriter",
    description: "Rephrase text while keeping the meaning.",
    longDescription:
      "Rewrite sentences to sound fresh and clear. Great for paraphrasing, avoiding repetition and tightening wordy prose.",
    keywords: ["ai rewriter", "paraphrasing tool", "rephrase text"],
    icon: PenLine,
    badge: "ai",
    example: SAMPLE,
    tips: ["Rewrite one paragraph at a time for the best control."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-humanizer", "ai-simplify-text", "ai-tone-changer"],
    run: aiRun("ai-rewriter"),
  },
  {
    slug: "ai-humanizer",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Humanizer",
    description: "Make robotic text sound natural and human.",
    longDescription:
      "Add natural rhythm, connectors and variation to stiff or AI-sounding text so it reads like a real person wrote it.",
    keywords: ["ai humanizer", "humanize ai text", "make text human"],
    icon: UserRoundCheck,
    badge: "ai",
    example: SAMPLE,
    tips: ["Review the output — humanizing is a starting point, not a final draft."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-rewriter", "ai-tone-changer", "ai-simplify-text"],
    run: aiRun("ai-humanizer"),
  },
  {
    slug: "ai-grammar-checker",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Grammar Checker",
    description: "Catch and fix common grammar mistakes.",
    longDescription:
      "Scan your text for grammar and punctuation issues and get a corrected version with a list of what changed.",
    keywords: ["ai grammar checker", "grammar check", "fix grammar"],
    icon: CheckCheck,
    badge: "ai",
    example: "me and him went to the store . it was fun,we bought alot of stuff",
    tips: ["Always proofread the corrected version yourself."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-spell-checker", "ai-rewriter", "passive-voice-checker"],
    run: aiRun("ai-grammar-checker"),
  },
  {
    slug: "ai-spell-checker",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Spell Checker",
    description: "Find and correct spelling errors.",
    longDescription:
      "Detect misspelled words and get instant corrections, with a list of every fix applied.",
    keywords: ["ai spell checker", "spell check", "spelling corrector"],
    icon: SpellCheck,
    badge: "ai",
    example: "I recieve alot of emails and definately need to seperate them untill I have time.",
    tips: ["Combine with the grammar checker for a full proofread."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-grammar-checker", "ai-rewriter", "word-counter"],
    run: aiRun("ai-spell-checker"),
  },
  {
    slug: "ai-tone-changer",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Tone Changer",
    description: "Rewrite text in a different tone.",
    longDescription:
      "Shift the tone of your writing — professional, friendly, confident or casual — without changing the core message.",
    keywords: ["ai tone changer", "change tone", "tone of voice"],
    icon: Palette,
    badge: "ai",
    example: SAMPLE,
    controls: [
      { type: "select", key: "tone", label: "Target tone", default: "professional", options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Confident", value: "confident" },
        { label: "Casual", value: "casual" },
      ] },
    ],
    tips: ["Match tone to your audience and channel."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-rewriter", "ai-humanizer", "ai-expand-text"],
    run: aiRun("ai-tone-changer"),
  },
  {
    slug: "ai-expand-text",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Text Expander",
    description: "Flesh out brief notes into fuller prose.",
    longDescription:
      "Turn short bullet points or terse sentences into fuller, more descriptive paragraphs with added context.",
    keywords: ["ai text expander", "expand text", "lengthen text"],
    icon: Expand,
    badge: "ai",
    example: "SEO takes time. Content matters. Links help.",
    tips: ["Expansion adds detail — edit for accuracy afterward."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-simplify-text", "ai-rewriter", "ai-outline-generator"],
    run: aiRun("ai-expand-text"),
  },
  {
    slug: "ai-simplify-text",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Text Simplifier",
    description: "Make complex text easy to understand.",
    longDescription:
      "Simplify dense or jargon-heavy writing into plain language that anyone can follow.",
    keywords: ["ai text simplifier", "simplify text", "plain language"],
    icon: Shrink,
    badge: "ai",
    example: "We will utilize a comprehensive methodology in order to facilitate the optimization of the aforementioned deliverables.",
    tips: ["Aim for a grade 6–8 reading level for the widest audience."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-rewriter", "readability-score", "complex-word-finder"],
    run: aiRun("ai-simplify-text"),
  },
  {
    slug: "ai-seo-optimizer",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI SEO Optimizer",
    description: "Optimize a snippet around a target keyword.",
    longDescription:
      "Rework your copy to naturally emphasize a target keyword and improve topical relevance, with actionable SEO suggestions.",
    keywords: ["ai seo optimizer", "seo content optimizer", "optimize for keyword"],
    icon: Rocket,
    badge: "ai",
    example: SAMPLE,
    controls: [
      { type: "text", key: "keyword", label: "Target keyword", placeholder: "e.g. search engine optimization", default: "search engine optimization" },
    ],
    tips: ["Optimize for one primary keyword per page."],
    faqs: commonFaqs,
    relatedSlugs: ["keyword-density", "ai-meta-generator", "seo-title-analyzer"],
    run: aiRun("ai-seo-optimizer"),
  },
  {
    slug: "ai-blog-title-generator",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Blog Title Generator",
    description: "Generate catchy blog post titles.",
    longDescription:
      "Enter your topic and get a batch of click-worthy blog title ideas you can use or remix.",
    keywords: ["ai blog title generator", "blog title ideas", "headline generator"],
    icon: Heading1,
    badge: "ai",
    example: "beginner guide to search engine optimization",
    tips: ["Pair with the SEO Title Analyzer to score your favorites."],
    faqs: commonFaqs,
    relatedSlugs: ["meta-title-generator", "seo-title-analyzer", "ai-outline-generator"],
    run: aiRun("ai-blog-title-generator"),
  },
  {
    slug: "ai-meta-generator",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Meta Tag Generator",
    description: "Draft a title and meta description from content.",
    longDescription:
      "Paste your page content and get an AI-drafted SEO title and meta description, each within recommended length limits.",
    keywords: ["ai meta generator", "meta tag ai", "ai meta description"],
    icon: Tags,
    badge: "ai",
    example: SAMPLE,
    tips: ["Fine-tune the draft to match your brand voice."],
    faqs: commonFaqs,
    relatedSlugs: ["meta-description-generator", "meta-title-generator", "serp-preview"],
    run: aiRun("ai-meta-generator"),
  },
  {
    slug: "ai-outline-generator",
    category: "ai",
    type: "ai",
    interaction: "ai",
    title: "AI Outline Generator",
    description: "Create a structured article outline.",
    longDescription:
      "Turn a topic into a ready-to-write article outline with headings, subpoints and a logical flow.",
    keywords: ["ai outline generator", "article outline", "blog outline"],
    icon: ListTree,
    badge: "ai",
    example: "how to start a successful podcast",
    tips: ["Use the outline as a skeleton, then expand each section."],
    faqs: commonFaqs,
    relatedSlugs: ["ai-blog-title-generator", "ai-expand-text", "ai-summarizer"],
    run: aiRun("ai-outline-generator"),
  },
];
