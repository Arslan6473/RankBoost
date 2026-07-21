/**
 * AI provider abstraction.
 *
 * The whole app talks to AI tools through this single interface. Today it is
 * backed by a deterministic mock (`MockAiProvider`) so the UI is fully
 * functional with zero API keys. To go live, implement `AiProvider` with
 * OpenAI or Gemini and swap the export at the bottom — nothing else changes.
 */

export interface AiRequest {
  /** The tool slug requesting the completion (lets a real provider route prompts). */
  tool: string;
  /** The user's primary text input. */
  input: string;
  /** Arbitrary tool options (tone, length, etc.). */
  options?: Record<string, string>;
}

export interface AiResponse {
  output: string;
  /** Optional structured suggestions rendered as chips/lists. */
  suggestions?: string[];
  model: string;
  mocked: boolean;
}

export interface AiProvider {
  complete(req: AiRequest): Promise<AiResponse>;
}

/* ------------------------------------------------------------------ */
/*  Mock provider — deterministic, offline, realistic-looking          */
/* ------------------------------------------------------------------ */

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function words(text: string): string[] {
  return text.match(/[A-Za-z0-9'’-]+/g) ?? [];
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

const TONE_LEXICON: Record<string, { intro: string; replace: [RegExp, string][] }> = {
  professional: {
    intro: "",
    replace: [
      [/\bkids\b/gi, "children"],
      [/\bstuff\b/gi, "materials"],
      [/\bget\b/gi, "obtain"],
    ],
  },
  friendly: {
    intro: "Hey there! ",
    replace: [
      [/\bhowever\b/gi, "but"],
      [/\btherefore\b/gi, "so"],
    ],
  },
  confident: {
    intro: "",
    replace: [
      [/\bmight\b/gi, "will"],
      [/\bcould\b/gi, "can"],
      [/\bwe think\b/gi, "we know"],
    ],
  },
  casual: {
    intro: "",
    replace: [
      [/\bpurchase\b/gi, "grab"],
      [/\butilize\b/gi, "use"],
    ],
  },
};

const FILLER = /\b(very|really|just|actually|basically|quite|simply|in order to|that)\b/gi;

export class MockAiProvider implements AiProvider {
  private readonly model = "mock-ai-v1";

  async complete(req: AiRequest): Promise<AiResponse> {
    // Simulate network latency for a realistic UX.
    await new Promise((r) => setTimeout(r, 500 + (req.input.length % 400)));

    const output = this.route(req);
    return { ...output, model: this.model, mocked: true };
  }

  private route(req: AiRequest): Omit<AiResponse, "model" | "mocked"> {
    const text = req.input.trim();
    const opt = req.options ?? {};
    if (!text) return { output: "" };

    switch (req.tool) {
      case "ai-summarizer":
        return this.summarize(text, opt.length ?? "short");
      case "ai-rewriter":
        return this.rewrite(text);
      case "ai-humanizer":
        return this.humanize(text);
      case "ai-grammar-checker":
        return this.grammar(text);
      case "ai-spell-checker":
        return this.spell(text);
      case "ai-tone-changer":
        return this.changeTone(text, opt.tone ?? "professional");
      case "ai-expand-text":
        return this.expand(text);
      case "ai-simplify-text":
        return this.simplify(text);
      case "ai-seo-optimizer":
        return this.seoOptimize(text, opt.keyword ?? "");
      case "ai-blog-title-generator":
        return this.blogTitles(text);
      case "ai-meta-generator":
        return this.metaGenerator(text);
      case "ai-outline-generator":
        return this.outline(text);
      default:
        return { output: text };
    }
  }

  private summarize(text: string, length: string) {
    const s = sentences(text);
    const take = length === "long" ? 4 : length === "medium" ? 2 : 1;
    const summary = s.slice(0, take).join(" ");
    return {
      output: summary || text.slice(0, 200),
      suggestions: s.slice(0, 3).map((x) => `• ${x}`),
    };
  }

  private rewrite(text: string) {
    const out = sentences(text)
      .map((s) => {
        const cleaned = s.replace(FILLER, "").replace(/\s+/g, " ").trim();
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      })
      .join(" ");
    return { output: out };
  }

  private humanize(text: string) {
    const connectors = ["Honestly, ", "In practice, ", "That said, ", "Here's the thing — "];
    const out = sentences(text)
      .map((s, i) => (i % 3 === 0 ? connectors[i % connectors.length] + s.charAt(0).toLowerCase() + s.slice(1) : s))
      .join(" ");
    return {
      output: out,
      suggestions: ["Varied sentence rhythm", "Added natural connectors", "Reduced robotic phrasing"],
    };
  }

  private grammar(text: string) {
    const issues: string[] = [];
    let fixed = text;
    if (/\bi\b/.test(fixed)) issues.push('Capitalize the pronoun "I".');
    fixed = fixed.replace(/\bi\b/g, "I");
    if (/\s{2,}/.test(fixed)) issues.push("Removed double spaces.");
    fixed = fixed.replace(/\s{2,}/g, " ");
    if (/\s+([.,!?])/.test(fixed)) issues.push("Fixed spacing before punctuation.");
    fixed = fixed.replace(/\s+([.,!?])/g, "$1");
    if (!/[.!?]$/.test(fixed.trim())) {
      issues.push("Added terminal punctuation.");
      fixed = fixed.trim() + ".";
    }
    return {
      output: fixed,
      suggestions: issues.length ? issues : ["No obvious grammar issues found."],
    };
  }

  private spell(text: string) {
    const common: Record<string, string> = {
      teh: "the",
      recieve: "receive",
      seperate: "separate",
      definately: "definitely",
      occured: "occurred",
      untill: "until",
      wich: "which",
      alot: "a lot",
      thier: "their",
      becuase: "because",
    };
    const found: string[] = [];
    const fixed = text.replace(/[A-Za-z]+/g, (w) => {
      const lower = w.toLowerCase();
      if (common[lower]) {
        found.push(`${w} → ${common[lower]}`);
        return common[lower];
      }
      return w;
    });
    return {
      output: fixed,
      suggestions: found.length ? found : ["No misspellings detected."],
    };
  }

  private changeTone(text: string, tone: string) {
    const cfg = TONE_LEXICON[tone] ?? TONE_LEXICON.professional;
    let out = text;
    for (const [re, rep] of cfg.replace) out = out.replace(re, rep);
    return {
      output: cfg.intro + out,
      suggestions: [`Tone shifted to ${titleCase(tone)}`],
    };
  }

  private expand(text: string) {
    const out = sentences(text)
      .map(
        (s) =>
          `${s} This matters because it gives readers the context they need, and it reinforces the point with a concrete, relatable detail.`,
      )
      .join(" ");
    return { output: out };
  }

  private simplify(text: string) {
    const out = sentences(text)
      .map((s) =>
        s
          .replace(/\butilize\b/gi, "use")
          .replace(/\bfacilitate\b/gi, "help")
          .replace(/\bin order to\b/gi, "to")
          .replace(/\bapproximately\b/gi, "about")
          .replace(/\bsubsequently\b/gi, "later"),
      )
      .join(" ");
    return { output: out };
  }

  private seoOptimize(text: string, keyword: string) {
    const kw = keyword.trim() || words(text)[0] || "your topic";
    const first = sentences(text)[0] ?? text;
    const optimized = `${titleCase(kw)}: ${first} Throughout this piece we naturally reference ${kw} to strengthen topical relevance without keyword stuffing.`;
    return {
      output: optimized,
      suggestions: [
        `Primary keyword: ${kw}`,
        "Add the keyword to the H1 and first 100 words",
        "Include 2–3 semantic variations",
        "Keep keyword density around 1–2%",
      ],
    };
  }

  private blogTitles(text: string) {
    const topic = titleCase(words(text).slice(0, 4).join(" ") || "Your Topic");
    const titles = [
      `The Complete Guide to ${topic} in 2026`,
      `${topic}: 10 Proven Strategies That Actually Work`,
      `How to Master ${topic} (Even If You're a Beginner)`,
      `Why ${topic} Matters More Than You Think`,
      `${topic} Explained: Everything You Need to Know`,
    ];
    return { output: titles.join("\n"), suggestions: titles };
  }

  private metaGenerator(text: string) {
    const first = (sentences(text)[0] ?? text).replace(/\s+/g, " ");
    const title = titleCase(words(text).slice(0, 6).join(" ")).slice(0, 60);
    const desc = first.slice(0, 155);
    return {
      output: `Title: ${title}\nDescription: ${desc}`,
      suggestions: [`Title length: ${title.length}/60`, `Description length: ${desc.length}/155`],
    };
  }

  private outline(text: string) {
    const topic = titleCase(words(text).slice(0, 5).join(" ") || "Your Topic");
    const outline = [
      `# ${topic}`,
      "## Introduction",
      "- Hook and problem statement",
      "- Why this matters now",
      `## What Is ${topic}?`,
      "- Definition and key concepts",
      "## Key Benefits",
      "- Benefit 1, 2, 3 with examples",
      "## Step-by-Step Approach",
      "- Actionable, numbered steps",
      "## Common Mistakes to Avoid",
      "## Conclusion",
      "- Recap and call to action",
    ];
    return { output: outline.join("\n") };
  }
}

export const aiProvider: AiProvider = new MockAiProvider();
