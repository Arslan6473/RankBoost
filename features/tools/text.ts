import {
  AlignLeft,
  ArrowDownUp,
  CaseSensitive,
  Copy,
  Eraser,
  FlipVertical2,
  Hash,
  Rows3,
  Sigma,
  Timer,
  Type,
  Mic,
  ListChecks,
  TextCursorInput,
  Repeat,
  Baseline,
} from "lucide-react";
import type { TextTool, ToolResult } from "@/types/tool";
import {
  computeStats,
  formatDuration,
  tokenizeSentences,
  tokenizeWords,
  wordFrequency,
  READING_WPM,
  SPEAKING_WPM,
} from "@/lib/text/analyze";
import { round } from "@/lib/utils";

const EMPTY: ToolResult = { empty: true };

const SAMPLE = `The quick brown fox jumps over the lazy dog. This sentence is often used to test fonts and keyboards because it contains every letter of the English alphabet.

Writing clearly matters. Short sentences are easier to read. Long, winding sentences that pack in too many ideas tend to lose the reader somewhere in the middle.`;

export const textTools: TextTool[] = [
  {
    slug: "word-counter",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Word Counter",
    description:
      "Count words, characters, sentences and paragraphs in real time as you type.",
    longDescription:
      "A fast, private word counter that analyzes your text instantly in the browser. See live word counts, character totals, reading time and the most frequent words — perfect for essays, articles, and social posts.",
    keywords: ["word counter", "count words", "word count tool"],
    icon: Type,
    badge: "popular",
    example: SAMPLE,
    tips: [
      "Word count updates live — no need to press a button.",
      "Use the frequency chart to catch overused words.",
      "Everything runs locally; your text never leaves your device.",
    ],
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "We split on whitespace and punctuation, counting contractions and hyphenated words as single words — the same way most editors do.",
      },
      {
        question: "Is there a character limit?",
        answer:
          "No. The tool runs entirely in your browser, so you can paste very large documents without hitting a server limit.",
      },
    ],
    relatedSlugs: ["character-counter", "reading-time", "text-statistics"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const s = computeStats(text);
      const freq = wordFrequency(text).slice(0, 8);
      return {
        metrics: [
          { label: "Words", value: s.words, tone: "primary", animate: true },
          { label: "Characters", value: s.charsWithSpaces, animate: true },
          { label: "Sentences", value: s.sentences, animate: true },
          { label: "Paragraphs", value: s.paragraphs, animate: true },
          { label: "Unique words", value: s.uniqueWords, animate: true },
          { label: "Reading time", value: formatDuration(s.readingTimeMin) },
        ],
        charts: freq.length
          ? [
              {
                kind: "bar",
                title: "Most frequent words",
                data: freq.map((f) => ({ name: f.word, value: f.count })),
              },
            ]
          : undefined,
      };
    },
  },
  {
    slug: "character-counter",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Character Counter",
    description:
      "Count characters with and without spaces, plus letters, digits and punctuation.",
    longDescription:
      "Check character counts instantly — ideal for tweets, meta descriptions, SMS and any field with a strict character limit. See a live breakdown of letters, numbers, spaces and symbols.",
    keywords: ["character counter", "count characters", "letter counter"],
    icon: Hash,
    badge: "popular",
    example: SAMPLE,
    tips: [
      "Meta descriptions should stay under ~160 characters.",
      "Tweets allow up to 280 characters.",
      "The distribution chart shows how your characters break down.",
    ],
    faqs: [
      {
        question: "Do spaces count as characters?",
        answer:
          "Yes — we show both totals. 'Characters' includes spaces; 'Characters (no spaces)' excludes all whitespace.",
      },
    ],
    relatedSlugs: ["word-counter", "line-counter", "text-statistics"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const letters = (text.match(/[A-Za-z]/g) ?? []).length;
      const digits = (text.match(/[0-9]/g) ?? []).length;
      const spaces = (text.match(/\s/g) ?? []).length;
      const punctuation = (text.match(/[^\w\s]/g) ?? []).length;
      return {
        metrics: [
          {
            label: "Characters",
            value: text.length,
            tone: "primary",
            animate: true,
          },
          {
            label: "No spaces",
            value: text.replace(/\s/g, "").length,
            animate: true,
          },
          { label: "Letters", value: letters, animate: true },
          { label: "Digits", value: digits, animate: true },
          { label: "Spaces", value: spaces, animate: true },
          { label: "Punctuation", value: punctuation, animate: true },
        ],
        charts: [
          {
            kind: "pie",
            title: "Character distribution",
            data: [
              { name: "Letters", value: letters },
              { name: "Digits", value: digits },
              { name: "Spaces", value: spaces },
              { name: "Symbols", value: punctuation },
            ].filter((d) => d.value > 0),
          },
        ],
      };
    },
  },
  {
    slug: "sentence-counter",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Sentence Counter",
    description: "Count sentences and see the average words per sentence.",
    longDescription:
      "Count how many sentences are in your text and measure their average length. Shorter sentences generally read more easily — use this to tighten your writing.",
    keywords: ["sentence counter", "count sentences"],
    icon: AlignLeft,
    example: SAMPLE,
    tips: [
      "Aim for an average of 15–20 words per sentence.",
      "Mix short and long sentences for better rhythm.",
    ],
    faqs: [
      {
        question: "How are sentences detected?",
        answer:
          "We split on terminal punctuation (. ! ?). Abbreviations can occasionally be miscounted, but results are accurate for normal prose.",
      },
    ],
    relatedSlugs: ["paragraph-counter", "word-counter", "long-sentence-detector"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const s = computeStats(text);
      const sentences = tokenizeSentences(text);
      const lengths = sentences.map((sen) => tokenizeWords(sen).length);
      const longest = Math.max(0, ...lengths);
      return {
        metrics: [
          {
            label: "Sentences",
            value: s.sentences,
            tone: "primary",
            animate: true,
          },
          { label: "Words", value: s.words, animate: true },
          {
            label: "Avg words / sentence",
            value: s.avgWordsPerSentence,
            animate: true,
          },
          { label: "Longest sentence", value: `${longest} words` },
        ],
        charts: lengths.length
          ? [
              {
                kind: "bar",
                title: "Words per sentence",
                data: lengths
                  .slice(0, 20)
                  .map((v, i) => ({ name: `S${i + 1}`, value: v })),
              },
            ]
          : undefined,
      };
    },
  },
  {
    slug: "paragraph-counter",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Paragraph Counter",
    description: "Count paragraphs and view average sentences per paragraph.",
    longDescription:
      "Count the paragraphs in your document and see how many sentences and words each contains on average. Great for keeping content skimmable.",
    keywords: ["paragraph counter", "count paragraphs"],
    icon: Rows3,
    example: SAMPLE,
    tips: [
      "Keep web paragraphs to 2–4 sentences for readability.",
      "Break up walls of text with subheadings.",
    ],
    faqs: [
      {
        question: "What counts as a paragraph?",
        answer:
          "Any block of text separated by a blank line. Single line breaks within a block stay in the same paragraph.",
      },
    ],
    relatedSlugs: ["sentence-counter", "line-counter", "word-counter"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const s = computeStats(text);
      return {
        metrics: [
          {
            label: "Paragraphs",
            value: s.paragraphs,
            tone: "primary",
            animate: true,
          },
          { label: "Sentences", value: s.sentences, animate: true },
          { label: "Words", value: s.words, animate: true },
          {
            label: "Avg sentences / paragraph",
            value: s.paragraphs
              ? round(s.sentences / s.paragraphs, 1)
              : 0,
          },
        ],
      };
    },
  },
  {
    slug: "reading-time",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Reading Time Calculator",
    description: "Estimate how long your text takes to read.",
    longDescription:
      "Estimate reading time based on word count and a configurable reading speed. Adjust the words-per-minute to match your audience — from careful readers to skimmers.",
    keywords: ["reading time", "reading time calculator", "read time"],
    icon: Timer,
    badge: "popular",
    example: SAMPLE,
    controls: [
      {
        type: "number",
        key: "wpm",
        label: "Words per minute",
        default: READING_WPM,
        min: 100,
        max: 600,
      },
    ],
    tips: [
      "Average adults read 200–250 words per minute.",
      "Add estimated reading time to blog posts to set expectations.",
    ],
    faqs: [
      {
        question: "What reading speed should I use?",
        answer:
          "225 WPM is a good default for online prose. Technical content is slower; light content is faster.",
      },
    ],
    relatedSlugs: ["speaking-time", "word-counter", "text-statistics"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const wpm = Math.max(50, Number(options.wpm) || READING_WPM);
      const words = tokenizeWords(text).length;
      const minutes = words / wpm;
      return {
        metrics: [
          {
            label: "Reading time",
            value: formatDuration(minutes),
            tone: "primary",
          },
          { label: "Words", value: words, animate: true },
          { label: "Speed", value: `${wpm} WPM` },
          {
            label: "At a glance",
            value: `${Math.max(1, Math.round(minutes))} min`,
          },
        ],
      };
    },
  },
  {
    slug: "speaking-time",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Speaking Time Calculator",
    description: "Estimate how long your script takes to say out loud.",
    longDescription:
      "Estimate speaking time for speeches, presentations and video scripts. The default of 130 words per minute matches a comfortable presentation pace.",
    keywords: ["speaking time", "speech time calculator", "presentation time"],
    icon: Mic,
    example: SAMPLE,
    controls: [
      {
        type: "number",
        key: "wpm",
        label: "Words per minute",
        default: SPEAKING_WPM,
        min: 80,
        max: 250,
      },
    ],
    tips: [
      "Conversational speech is ~130 WPM; slow, deliberate delivery is ~100 WPM.",
      "Pauses and audience interaction add time — pad your estimate.",
    ],
    faqs: [
      {
        question: "How accurate is this?",
        answer:
          "It's a solid estimate based on word count. Your real pace depends on delivery, pauses and emphasis.",
      },
    ],
    relatedSlugs: ["reading-time", "word-counter", "text-statistics"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const wpm = Math.max(50, Number(options.wpm) || SPEAKING_WPM);
      const words = tokenizeWords(text).length;
      const minutes = words / wpm;
      return {
        metrics: [
          {
            label: "Speaking time",
            value: formatDuration(minutes),
            tone: "primary",
          },
          { label: "Words", value: words, animate: true },
          { label: "Pace", value: `${wpm} WPM` },
          {
            label: "Slides (~1/min)",
            value: Math.max(1, Math.round(minutes)),
          },
        ],
      };
    },
  },
  {
    slug: "text-statistics",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Text Statistics",
    description: "A complete statistical breakdown of your text.",
    longDescription:
      "Get every metric at once: words, characters, sentences, paragraphs, unique words, average word length, reading and speaking time, estimated pages and more — in a single dashboard.",
    keywords: ["text statistics", "text analysis", "text metrics"],
    icon: Sigma,
    badge: "popular",
    example: SAMPLE,
    tips: [
      "Use estimated pages to gauge document length.",
      "A high unique-word ratio signals varied vocabulary.",
    ],
    faqs: [
      {
        question: "What is 'estimated pages' based on?",
        answer:
          "Roughly 500 words per page (double-spaced, 12pt). Actual pages depend on formatting.",
      },
    ],
    relatedSlugs: ["word-counter", "readability-score", "reading-time"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const s = computeStats(text);
      return {
        metrics: [
          { label: "Words", value: s.words, tone: "primary", animate: true },
          { label: "Characters", value: s.charsWithSpaces, animate: true },
          { label: "Chars (no spaces)", value: s.charsNoSpaces, animate: true },
          { label: "Sentences", value: s.sentences, animate: true },
          { label: "Paragraphs", value: s.paragraphs, animate: true },
          { label: "Lines", value: s.lines, animate: true },
          { label: "Unique words", value: s.uniqueWords, animate: true },
          { label: "Avg word length", value: s.avgWordLength },
          { label: "Avg words / sentence", value: s.avgWordsPerSentence },
          { label: "Longest word", value: s.longestWord || "—" },
          { label: "Reading time", value: formatDuration(s.readingTimeMin) },
          { label: "Speaking time", value: formatDuration(s.speakingTimeMin) },
          { label: "Estimated pages", value: s.estimatedPages },
          { label: "Syllables", value: s.syllables, animate: true },
        ],
      };
    },
  },
  {
    slug: "duplicate-word-finder",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Duplicate Word Finder",
    description: "Find words you repeat too often.",
    longDescription:
      "Spot repeated words at a glance. Overusing the same word makes writing feel monotonous — this tool ranks your most-repeated words so you can vary your vocabulary.",
    keywords: ["duplicate word finder", "repeated words", "word repetition"],
    icon: Repeat,
    example: SAMPLE,
    controls: [
      {
        type: "toggle",
        key: "ignoreCommon",
        label: "Ignore common words (the, a, of…)",
        default: true,
      },
    ],
    tips: [
      "Some repetition is natural — focus on distinctive words you overuse.",
      "Toggle common words to filter out 'the', 'and', 'of' and similar.",
    ],
    faqs: [
      {
        question: "Are common words counted?",
        answer:
          "By default we hide very common stop words so you can focus on meaningful repetition. Toggle it off to see everything.",
      },
    ],
    relatedSlugs: ["keyword-density", "duplicate-sentence-finder", "word-counter"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const stop = new Set([
        "the", "a", "an", "and", "or", "but", "of", "to", "in", "on",
        "at", "for", "is", "are", "was", "were", "be", "it", "this",
        "that", "with", "as", "by", "from", "i", "you", "he", "she",
      ]);
      const ignoreCommon = options.ignoreCommon !== false;
      const freq = wordFrequency(text)
        .filter((f) => f.count > 1 && (!ignoreCommon || !stop.has(f.word)))
        .slice(0, 15);
      return {
        metrics: [
          {
            label: "Repeated words",
            value: freq.length,
            tone: "primary",
            animate: true,
          },
          {
            label: "Top repeat",
            value: freq[0] ? `${freq[0].word} (${freq[0].count}×)` : "—",
          },
        ],
        lists: [
          {
            title: "Most repeated words",
            items: freq.map((f) => `${f.word} — ${f.count} times`),
            empty: "No repeated words found.",
            tone: "warning",
          },
        ],
        charts: freq.length
          ? [
              {
                kind: "bar",
                title: "Repetition count",
                data: freq
                  .slice(0, 10)
                  .map((f) => ({ name: f.word, value: f.count })),
              },
            ]
          : undefined,
      };
    },
  },
  {
    slug: "duplicate-sentence-finder",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Duplicate Sentence Finder",
    description: "Detect sentences that appear more than once.",
    longDescription:
      "Find accidentally duplicated sentences in long documents. Useful for cleaning up copy-pasted content, merged drafts and repetitive boilerplate.",
    keywords: ["duplicate sentence finder", "repeated sentences"],
    icon: ListChecks,
    example: `We value your privacy. We value your privacy. Our team is here to help. Contact us any time. Our team is here to help.`,
    tips: [
      "Comparison ignores case and surrounding whitespace.",
      "Great for catching duplicates after merging documents.",
    ],
    faqs: [
      {
        question: "Does punctuation matter?",
        answer:
          "Sentences are compared after trimming and lowercasing, so minor spacing and capitalization differences still match.",
      },
    ],
    relatedSlugs: ["duplicate-word-finder", "remove-duplicate-lines", "sentence-counter"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const sentences = tokenizeSentences(text);
      const seen = new Map<string, number>();
      for (const s of sentences) {
        const key = s.toLowerCase().replace(/\s+/g, " ").trim();
        seen.set(key, (seen.get(key) ?? 0) + 1);
      }
      const dupes = [...seen.entries()]
        .filter(([, c]) => c > 1)
        .sort((a, b) => b[1] - a[1]);
      return {
        metrics: [
          {
            label: "Duplicated sentences",
            value: dupes.length,
            tone: dupes.length ? "warning" : "success",
            animate: true,
          },
          { label: "Total sentences", value: sentences.length, animate: true },
        ],
        lists: [
          {
            title: "Repeated sentences",
            items: dupes.map(([s, c]) => `"${s}" — ${c}×`),
            empty: "No duplicate sentences found. ",
            tone: "warning",
          },
        ],
      };
    },
  },
  {
    slug: "remove-extra-spaces",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Remove Extra Spaces",
    description: "Collapse multiple spaces and trim each line.",
    longDescription:
      "Clean up messy text by collapsing repeated spaces into one and trimming leading/trailing whitespace from every line. Tabs are normalized too.",
    keywords: ["remove extra spaces", "trim spaces", "clean whitespace"],
    icon: Eraser,
    example: `This    text   has     too   many     spaces.\n   Leading and trailing spaces too.   `,
    tips: [
      "Double spaces after periods are collapsed to single spaces.",
      "Each line is trimmed individually.",
    ],
    faqs: [
      {
        question: "Are line breaks removed?",
        answer:
          "No — line breaks are preserved. Only horizontal whitespace within lines is normalized.",
      },
    ],
    relatedSlugs: ["remove-empty-lines", "remove-duplicate-lines", "text-statistics"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const output = text
        .split("\n")
        .map((line) => line.replace(/[ \t]+/g, " ").trim())
        .join("\n");
      return {
        output,
        metrics: [
          {
            label: "Characters removed",
            value: text.length - output.length,
            tone: "success",
            animate: true,
          },
        ],
      };
    },
  },
  {
    slug: "remove-empty-lines",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Remove Empty Lines",
    description: "Delete blank lines from your text.",
    longDescription:
      "Strip out empty or whitespace-only lines to compact your text. Optionally keep single blank lines between paragraphs.",
    keywords: ["remove empty lines", "delete blank lines"],
    icon: Rows3,
    example: `First line.\n\n\nSecond line.\n   \nThird line.`,
    controls: [
      {
        type: "toggle",
        key: "keepSingle",
        label: "Keep single blank line between blocks",
        default: false,
      },
    ],
    tips: ["Whitespace-only lines are treated as empty."],
    faqs: [
      {
        question: "Can I keep paragraph spacing?",
        answer:
          "Yes — enable 'Keep single blank line' to collapse runs of blank lines down to one instead of removing them all.",
      },
    ],
    relatedSlugs: ["remove-extra-spaces", "remove-duplicate-lines", "line-counter"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const lines = text.split("\n");
      let output: string;
      if (options.keepSingle) {
        output = text.replace(/\n\s*\n\s*\n+/g, "\n\n");
      } else {
        output = lines.filter((l) => l.trim() !== "").join("\n");
      }
      const removed = lines.length - output.split("\n").length;
      return {
        output,
        metrics: [
          {
            label: "Lines removed",
            value: Math.max(0, removed),
            tone: "success",
            animate: true,
          },
        ],
      };
    },
  },
  {
    slug: "remove-duplicate-lines",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Remove Duplicate Lines",
    description: "Keep only the first occurrence of each line.",
    longDescription:
      "Deduplicate a list by removing repeated lines while preserving order. Perfect for cleaning up email lists, keyword lists and log files.",
    keywords: ["remove duplicate lines", "deduplicate lines", "unique lines"],
    icon: Copy,
    example: `apple\nbanana\napple\ncherry\nbanana\napple`,
    controls: [
      {
        type: "toggle",
        key: "caseInsensitive",
        label: "Case-insensitive matching",
        default: false,
      },
    ],
    tips: [
      "Order is preserved — the first occurrence stays.",
      "Enable case-insensitive matching to treat 'Apple' and 'apple' as duplicates.",
    ],
    faqs: [
      {
        question: "Is the original order kept?",
        answer:
          "Yes. We keep the first time each unique line appears and drop later repeats.",
      },
    ],
    relatedSlugs: ["remove-empty-lines", "sort-lines", "duplicate-sentence-finder"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const ci = Boolean(options.caseInsensitive);
      const seen = new Set<string>();
      const lines = text.split("\n");
      const kept = lines.filter((line) => {
        const key = ci ? line.toLowerCase() : line;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return {
        output: kept.join("\n"),
        metrics: [
          {
            label: "Duplicates removed",
            value: lines.length - kept.length,
            tone: "success",
            animate: true,
          },
          { label: "Unique lines", value: kept.length, animate: true },
        ],
      };
    },
  },
  {
    slug: "sort-lines",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Sort Lines",
    description: "Sort lines alphabetically, by length, or reverse.",
    longDescription:
      "Sort any list of lines alphabetically (A→Z or Z→A) or by length. Handy for organizing keyword lists, imports and CSV columns.",
    keywords: ["sort lines", "alphabetize", "sort list"],
    icon: ArrowDownUp,
    example: `banana\nApple\ncherry\ndate\nelderberry`,
    controls: [
      {
        type: "select",
        key: "mode",
        label: "Sort by",
        default: "alpha",
        options: [
          { label: "Alphabetical (A→Z)", value: "alpha" },
          { label: "Alphabetical (Z→A)", value: "alpha-desc" },
          { label: "Length (short→long)", value: "length" },
          { label: "Length (long→short)", value: "length-desc" },
        ],
      },
      {
        type: "toggle",
        key: "caseSensitive",
        label: "Case-sensitive",
        default: false,
      },
    ],
    tips: ["Combine with Remove Duplicate Lines to build clean, sorted lists."],
    faqs: [
      {
        question: "How is alphabetical sorting done?",
        answer:
          "We use locale-aware comparison so accented characters sort naturally. Toggle case-sensitivity as needed.",
      },
    ],
    relatedSlugs: ["reverse-lines", "remove-duplicate-lines", "line-counter"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const mode = String(options.mode ?? "alpha");
      const cs = Boolean(options.caseSensitive);
      const lines = text.split("\n");
      const sorted = [...lines].sort((a, b) => {
        if (mode.startsWith("length")) {
          return mode === "length" ? a.length - b.length : b.length - a.length;
        }
        const x = cs ? a : a.toLowerCase();
        const y = cs ? b : b.toLowerCase();
        const cmp = x.localeCompare(y);
        return mode === "alpha-desc" ? -cmp : cmp;
      });
      return {
        output: sorted.join("\n"),
        metrics: [{ label: "Lines sorted", value: lines.length, animate: true }],
      };
    },
  },
  {
    slug: "reverse-lines",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Reverse Lines",
    description: "Flip the order of lines top-to-bottom.",
    longDescription:
      "Reverse the order of lines so the last line becomes the first. Useful for reversing logs, chat exports and chronological lists.",
    keywords: ["reverse lines", "flip lines", "invert line order"],
    icon: FlipVertical2,
    example: `Step 1\nStep 2\nStep 3\nStep 4`,
    tips: ["Line contents are untouched — only their order changes."],
    faqs: [
      {
        question: "Does this reverse the text in each line?",
        answer:
          "No. This reverses the order of lines. To reverse characters, use the Reverse Text tool.",
      },
    ],
    relatedSlugs: ["reverse-text", "sort-lines", "line-counter"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      return {
        output: text.split("\n").reverse().join("\n"),
        metrics: [
          { label: "Lines reversed", value: text.split("\n").length, animate: true },
        ],
      };
    },
  },
  {
    slug: "reverse-text",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Reverse Text",
    description: "Reverse the characters in your text.",
    longDescription:
      "Flip your text backwards, character by character. A fun utility for puzzles, mirror writing and testing text rendering.",
    keywords: ["reverse text", "backwards text", "mirror text"],
    icon: TextCursorInput,
    example: `Hello, world!`,
    controls: [
      {
        type: "select",
        key: "mode",
        label: "Reverse",
        default: "chars",
        options: [
          { label: "Characters", value: "chars" },
          { label: "Words", value: "words" },
        ],
      },
    ],
    tips: ["Switch to 'Words' to reverse word order instead of characters."],
    faqs: [
      {
        question: "Does emoji reverse correctly?",
        answer:
          "We reverse by Unicode code points, so most characters — including many emoji — reverse cleanly.",
      },
    ],
    relatedSlugs: ["reverse-lines", "case-converter", "word-counter"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const mode = String(options.mode ?? "chars");
      const output =
        mode === "words"
          ? text.split(/(\s+)/).reverse().join("")
          : [...text].reverse().join("");
      return {
        output,
        metrics: [{ label: "Characters", value: text.length, animate: true }],
      };
    },
  },
  {
    slug: "case-converter",
    category: "text",
    type: "transformer",
    interaction: "text",
    title: "Case Converter",
    description:
      "Convert text between UPPER, lower, Title, Sentence and more.",
    longDescription:
      "Instantly convert text case: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and aLtErNaTiNg case.",
    keywords: ["case converter", "uppercase", "lowercase", "title case"],
    icon: CaseSensitive,
    badge: "popular",
    example: `the quick brown fox jumps over the lazy dog`,
    controls: [
      {
        type: "select",
        key: "mode",
        label: "Convert to",
        default: "title",
        options: [
          { label: "UPPERCASE", value: "upper" },
          { label: "lowercase", value: "lower" },
          { label: "Title Case", value: "title" },
          { label: "Sentence case", value: "sentence" },
          { label: "camelCase", value: "camel" },
          { label: "snake_case", value: "snake" },
          { label: "kebab-case", value: "kebab" },
          { label: "aLtErNaTiNg", value: "alternating" },
        ],
      },
    ],
    tips: ["Title Case keeps small words like 'of' and 'the' lowercase."],
    faqs: [
      {
        question: "What is Sentence case?",
        answer:
          "It capitalizes the first letter of each sentence and lowercases the rest — like normal prose.",
      },
    ],
    relatedSlugs: ["reverse-text", "slug-generator", "remove-extra-spaces"],
    run: (text, options) => {
      if (!text.trim()) return EMPTY;
      const mode = String(options.mode ?? "title");
      const small = new Set([
        "a", "an", "and", "as", "at", "but", "by", "for", "in", "of",
        "on", "or", "the", "to", "with", "nor", "vs",
      ]);
      let output = text;
      switch (mode) {
        case "upper":
          output = text.toUpperCase();
          break;
        case "lower":
          output = text.toLowerCase();
          break;
        case "title":
          output = text
            .toLowerCase()
            .replace(/\w[^\s]*/g, (w, i) =>
              i !== 0 && small.has(w)
                ? w
                : w.charAt(0).toUpperCase() + w.slice(1),
            );
          break;
        case "sentence":
          output = text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
          break;
        case "camel":
          output = text
            .toLowerCase()
            .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
            .replace(/[^a-z0-9]/gi, "");
          break;
        case "snake":
          output = text
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
          break;
        case "kebab":
          output = text
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          break;
        case "alternating":
          output = [...text]
            .map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase()))
            .join("");
          break;
      }
      return {
        output,
        metrics: [{ label: "Characters", value: output.length, animate: true }],
      };
    },
  },
  {
    slug: "line-counter",
    category: "text",
    type: "analyzer",
    interaction: "text",
    title: "Line Counter",
    description: "Count total, non-empty and unique lines.",
    longDescription:
      "Count the lines in your text — including totals, non-empty lines and unique lines. Ideal for code, lists and data files.",
    keywords: ["line counter", "count lines", "number of lines"],
    icon: Baseline,
    example: `apple\nbanana\n\napple\ncherry`,
    tips: ["Great for checking list sizes before importing data."],
    faqs: [
      {
        question: "Is the final line counted without a trailing newline?",
        answer:
          "Yes. We count every line, whether or not the text ends with a newline.",
      },
    ],
    relatedSlugs: ["word-counter", "remove-empty-lines", "remove-duplicate-lines"],
    run: (text) => {
      if (!text.trim()) return EMPTY;
      const lines = text.split("\n");
      const nonEmpty = lines.filter((l) => l.trim() !== "").length;
      const unique = new Set(lines.map((l) => l.trim())).size;
      return {
        metrics: [
          { label: "Total lines", value: lines.length, tone: "primary", animate: true },
          { label: "Non-empty lines", value: nonEmpty, animate: true },
          { label: "Empty lines", value: lines.length - nonEmpty, animate: true },
          { label: "Unique lines", value: unique, animate: true },
        ],
      };
    },
  },
];
