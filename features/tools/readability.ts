import { GraduationCap, Gauge, ScanText, Shuffle, Puzzle } from "lucide-react";
import type { TextTool, ToolResult } from "@/types/tool";
import {
  tokenizeSentences,
  tokenizeWords,
} from "@/lib/text/analyze";
import {
  computeReadability,
  fleschBand,
  gradeBand,
  findPassiveSentences,
  findTransitionWords,
  isComplexWord,
  TRANSITION_WORDS,
} from "@/lib/text/readability";
import { round } from "@/lib/utils";

const EMPTY: ToolResult = { empty: true };

const SAMPLE = `Search engine optimization is the practice of improving a website so that it ranks higher in search results. Although the fundamentals are straightforward, execution requires patience. You should write for humans first, then optimize for machines. Content that is genuinely helpful tends to perform well over time because it earns links and engagement naturally.`;

export const readabilityTools: TextTool[] = [
  {
    slug: "readability-score",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Readability Score",
    description: "Flesch Reading Ease plus five grade-level formulas.",
    longDescription:
      "Measure how easy your writing is to read with the Flesch Reading Ease score and a consensus of grade-level formulas (Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI).",
    keywords: ["readability score", "flesch reading ease", "readability checker"],
    icon: Gauge,
    badge: "popular",
    example: SAMPLE,
    tips: [
      "Aim for a Flesch Reading Ease of 60+ for a general audience.",
      "Shorter sentences and simpler words raise your score.",
    ],
    faqs: [
      {
        question: "What is a good readability score?",
        answer:
          "60–70 (Standard) suits most web content. Marketing copy often targets 70–80; technical docs may sit lower.",
      },
      {
        question: "Which formula should I trust?",
        answer:
          "Each has strengths. We show the average grade level so you get a balanced, consensus view.",
      },
    ],
    relatedSlugs: ["reading-grade", "long-sentence-detector", "complex-word-finder"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const r = computeReadability(text);
      return {
        score: {
          label: "Flesch Reading Ease",
          value: r.fleschReadingEase,
          max: 100,
          grade: fleschBand(r.fleschReadingEase),
          tone:
            r.fleschReadingEase >= 60
              ? "success"
              : r.fleschReadingEase >= 40
                ? "warning"
                : "destructive",
          description: `Reads at roughly a grade ${Math.round(r.averageGrade)} level (${gradeBand(r.averageGrade)}).`,
        },
        metrics: [
          { label: "Flesch-Kincaid", value: `Grade ${r.fleschKincaidGrade}` },
          { label: "Gunning Fog", value: r.gunningFog },
          { label: "SMOG", value: r.smog },
          { label: "Coleman-Liau", value: r.colemanLiau },
          { label: "ARI", value: r.automatedReadability },
          { label: "Avg grade", value: r.averageGrade, tone: "primary" },
        ],
        charts: [
          {
            kind: "bar",
            title: "Grade level by formula",
            data: [
              { name: "F-K", value: r.fleschKincaidGrade },
              { name: "Fog", value: r.gunningFog },
              { name: "SMOG", value: r.smog },
              { name: "C-L", value: r.colemanLiau },
              { name: "ARI", value: r.automatedReadability },
            ],
          },
        ],
      };
    },
  },
  {
    slug: "reading-grade",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Reading Grade Level",
    description: "The US school grade needed to read your text.",
    longDescription:
      "Find the approximate US grade level required to comfortably read your content, based on a consensus of established readability formulas.",
    keywords: ["reading grade level", "grade level checker", "reading level"],
    icon: GraduationCap,
    example: SAMPLE,
    tips: [
      "Most popular content targets a grade 6–8 reading level.",
      "Lower the grade level by cutting jargon and long sentences.",
    ],
    faqs: [
      {
        question: "Why target grade 6–8?",
        answer:
          "It's the reading level of the average adult. Writing at this level maximizes comprehension and reach.",
      },
    ],
    relatedSlugs: ["readability-score", "complex-word-finder", "long-sentence-detector"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const r = computeReadability(text);
      const grade = Math.round(r.averageGrade);
      return {
        score: {
          label: "Reading grade level",
          value: grade,
          max: 18,
          grade: gradeBand(r.averageGrade),
          tone: grade <= 8 ? "success" : grade <= 12 ? "warning" : "destructive",
          description: `A reader at grade ${grade} (${gradeBand(r.averageGrade)}) can comfortably understand this text.`,
        },
        metrics: [
          { label: "Average grade", value: r.averageGrade, tone: "primary" },
          { label: "Flesch-Kincaid", value: r.fleschKincaidGrade },
          { label: "Gunning Fog", value: r.gunningFog },
          { label: "Reading ease", value: r.fleschReadingEase },
        ],
      };
    },
  },
  {
    slug: "passive-voice-checker",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Passive Voice Checker",
    description: "Highlight sentences that likely use passive voice.",
    longDescription:
      "Detect passive-voice constructions so you can rewrite them in the active voice. Active sentences are clearer, shorter and more engaging.",
    keywords: ["passive voice checker", "active voice", "passive voice detector"],
    icon: ScanText,
    example: SAMPLE,
    tips: [
      "Keep passive voice under ~10% of sentences.",
      'Passive: "Mistakes were made." Active: "We made mistakes."',
    ],
    faqs: [
      {
        question: "Is all passive voice bad?",
        answer:
          "No. Passive voice is fine when the actor is unknown or unimportant. Just use it deliberately, not by accident.",
      },
    ],
    relatedSlugs: ["long-sentence-detector", "readability-score", "transition-word-checker"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const sentences = tokenizeSentences(text);
      const passive = findPassiveSentences(text);
      const pct = sentences.length
        ? round((passive.length / sentences.length) * 100, 1)
        : 0;
      return {
        score: {
          label: "Passive voice",
          value: pct,
          max: 100,
          grade: pct <= 10 ? "Good" : pct <= 25 ? "Watch" : "Too much",
          tone: pct <= 10 ? "success" : pct <= 25 ? "warning" : "destructive",
          description: `${passive.length} of ${sentences.length} sentences appear passive.`,
        },
        metrics: [
          { label: "Passive sentences", value: passive.length, animate: true },
          { label: "Total sentences", value: sentences.length, animate: true },
          { label: "Passive %", value: `${pct}%`, tone: "primary" },
        ],
        lists: [
          {
            title: "Likely passive sentences",
            items: passive,
            empty: "No passive voice detected. ",
            tone: "warning",
          },
        ],
      };
    },
  },
  {
    slug: "long-sentence-detector",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Long Sentence Detector",
    description: "Find sentences that are too long to read easily.",
    longDescription:
      "Spot overly long sentences that hurt readability. Set your own threshold and see which sentences to break up.",
    keywords: ["long sentence detector", "sentence length checker"],
    icon: Shuffle,
    example: SAMPLE,
    controls: [
      {
        type: "number",
        key: "threshold",
        label: "Flag sentences longer than (words)",
        default: 25,
        min: 10,
        max: 60,
      },
    ],
    tips: [
      "Sentences over 25 words are hard to follow — consider splitting them.",
      "Vary sentence length to keep rhythm.",
    ],
    faqs: [
      {
        question: "What's the ideal sentence length?",
        answer:
          "15–20 words on average. The occasional longer sentence is fine, but keep them the exception.",
      },
    ],
    relatedSlugs: ["passive-voice-checker", "sentence-counter", "readability-score"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const threshold = Math.max(5, Number(options.threshold) || 25);
      const sentences = tokenizeSentences(text);
      const flagged = sentences
        .map((s) => ({ s, len: tokenizeWords(s).length }))
        .filter((x) => x.len > threshold)
        .sort((a, b) => b.len - a.len);
      const avg = sentences.length
        ? round(
            sentences.reduce((sum, s) => sum + tokenizeWords(s).length, 0) /
              sentences.length,
            1,
          )
        : 0;
      return {
        metrics: [
          {
            label: "Long sentences",
            value: flagged.length,
            tone: flagged.length ? "warning" : "success",
            animate: true,
          },
          { label: "Total sentences", value: sentences.length, animate: true },
          { label: "Avg length", value: `${avg} words` },
          { label: "Threshold", value: `${threshold} words` },
        ],
        lists: [
          {
            title: "Sentences to shorten",
            items: flagged.map((x) => `(${x.len} words) ${x.s}`),
            empty: "No overly long sentences. ",
            tone: "warning",
          },
        ],
      };
    },
  },
  {
    slug: "transition-word-checker",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Transition Word Checker",
    description: "Measure how many sentences use transition words.",
    longDescription:
      "Transition words like 'however', 'therefore' and 'for example' guide readers through your argument. This tool measures how often you use them.",
    keywords: ["transition word checker", "transition words", "linking words"],
    icon: Shuffle,
    example: SAMPLE,
    tips: [
      "Yoast recommends transition words in at least 30% of sentences.",
      "Don't force them — use transitions where they genuinely help flow.",
    ],
    faqs: [
      {
        question: "Why do transition words matter for SEO?",
        answer:
          "They improve readability, which keeps readers engaged. Search engines reward content people actually read.",
      },
    ],
    relatedSlugs: ["readability-score", "passive-voice-checker", "long-sentence-detector"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const sentences = tokenizeSentences(text);
      const withTransition = sentences.filter((s) => {
        const lower = ` ${s.toLowerCase()} `;
        return TRANSITION_WORDS.some((t) =>
          lower.includes(` ${t} `) || lower.includes(`${t},`),
        );
      }).length;
      const pct = sentences.length
        ? round((withTransition / sentences.length) * 100, 1)
        : 0;
      const found = findTransitionWords(text).sort((a, b) => b.count - a.count);
      return {
        score: {
          label: "Sentences with transitions",
          value: pct,
          max: 100,
          grade: pct >= 30 ? "Good" : "Add more",
          tone: pct >= 30 ? "success" : "warning",
          description: `${withTransition} of ${sentences.length} sentences use a transition word.`,
        },
        metrics: [
          { label: "Transition %", value: `${pct}%`, tone: "primary" },
          { label: "Sentences w/ transition", value: withTransition, animate: true },
          { label: "Unique transitions", value: found.length, animate: true },
        ],
        lists: [
          {
            title: "Transition words found",
            items: found.map((t) => `${t.phrase} — ${t.count}×`),
            empty: "No transition words found.",
            tone: "accent",
          },
        ],
      };
    },
  },
  {
    slug: "complex-word-finder",
    category: "readability",
    type: "analyzer",
    interaction: "text",
    title: "Complex Word Finder",
    description: "Find long, multi-syllable words that slow readers down.",
    longDescription:
      "Identify complex words (three or more syllables) that make text harder to read. Swapping them for simpler alternatives boosts clarity.",
    keywords: ["complex word finder", "difficult words", "hard words"],
    icon: Puzzle,
    example: SAMPLE,
    tips: [
      "Keep complex words under ~15% of your total.",
      'Prefer "use" over "utilize", "help" over "facilitate".',
    ],
    faqs: [
      {
        question: "What makes a word 'complex'?",
        answer:
          "We flag words with three or more syllables (excluding common suffixes), the standard used by the Gunning Fog index.",
      },
    ],
    relatedSlugs: ["readability-score", "reading-grade", "long-sentence-detector"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const words = tokenizeWords(text);
      const complex = words.filter(isComplexWord);
      const unique = [...new Set(complex.map((w) => w.toLowerCase()))];
      const pct = words.length
        ? round((complex.length / words.length) * 100, 1)
        : 0;
      return {
        score: {
          label: "Complex words",
          value: pct,
          max: 100,
          grade: pct <= 15 ? "Good" : pct <= 25 ? "Watch" : "High",
          tone: pct <= 15 ? "success" : pct <= 25 ? "warning" : "destructive",
          description: `${complex.length} of ${words.length} words are complex (3+ syllables).`,
        },
        metrics: [
          { label: "Complex words", value: complex.length, animate: true },
          { label: "Complex %", value: `${pct}%`, tone: "primary" },
          { label: "Unique complex", value: unique.length, animate: true },
          { label: "Total words", value: words.length, animate: true },
        ],
        lists: [
          {
            title: "Complex words to simplify",
            items: unique.slice(0, 30),
            empty: "No complex words found. ",
            tone: "warning",
          },
        ],
      };
    },
  },
];
