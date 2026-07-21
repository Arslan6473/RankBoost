import { round } from "@/lib/utils";
import {
  countSyllables,
  tokenizeSentences,
  tokenizeWords,
  totalSyllables,
} from "./analyze";

export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smog: number;
  colemanLiau: number;
  automatedReadability: number;
  /** Average of the grade-level formulas, rounded. */
  averageGrade: number;
}

/** Words with 3+ syllables (excluding common suffix inflections) = "complex". */
export function isComplexWord(word: string): boolean {
  const w = word.toLowerCase();
  if (w.length < 3) return false;
  return countSyllables(w) >= 3;
}

/** Map a Flesch Reading Ease score to a human-readable band. */
export function fleschBand(score: number): string {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very confusing";
}

/** Map an approximate US grade level to a school band. */
export function gradeBand(grade: number): string {
  if (grade <= 5) return "Elementary school";
  if (grade <= 8) return "Middle school";
  if (grade <= 12) return "High school";
  if (grade <= 16) return "College";
  return "Postgraduate";
}

export function computeReadability(text: string): ReadabilityScores {
  const words = tokenizeWords(text);
  const sentences = tokenizeSentences(text);
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const syllables = totalSyllables(words);
  const characters = words.reduce((sum, w) => sum + w.length, 0);
  const complexWords = words.filter(isComplexWord).length;

  if (wordCount === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      gunningFog: 0,
      smog: 0,
      colemanLiau: 0,
      automatedReadability: 0,
      averageGrade: 0,
    };
  }

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllables / wordCount;

  const fleschReadingEase =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const fleschKincaidGrade =
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const gunningFog =
    0.4 * (wordsPerSentence + 100 * (complexWords / wordCount));
  const smog =
    1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;
  const l = (characters / wordCount) * 100;
  const s = (sentenceCount / wordCount) * 100;
  const colemanLiau = 0.0588 * l - 0.296 * s - 15.8;
  const automatedReadability =
    4.71 * (characters / wordCount) + 0.5 * wordsPerSentence - 21.43;

  const grades = [
    fleschKincaidGrade,
    gunningFog,
    smog,
    colemanLiau,
    automatedReadability,
  ].map((g) => Math.max(0, g));
  const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;

  return {
    fleschReadingEase: round(Math.max(0, Math.min(100, fleschReadingEase)), 1),
    fleschKincaidGrade: round(Math.max(0, fleschKincaidGrade), 1),
    gunningFog: round(Math.max(0, gunningFog), 1),
    smog: round(Math.max(0, smog), 1),
    colemanLiau: round(Math.max(0, colemanLiau), 1),
    automatedReadability: round(Math.max(0, automatedReadability), 1),
    averageGrade: round(averageGrade, 1),
  };
}

/* ------------------------------------------------------------------ */
/*  Passive voice (heuristic)                                          */
/* ------------------------------------------------------------------ */
const BE_VERBS = [
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
];

const IRREGULAR_PARTICIPLES = new Set([
  "been",
  "done",
  "gone",
  "known",
  "grown",
  "shown",
  "thrown",
  "given",
  "taken",
  "written",
  "spoken",
  "broken",
  "chosen",
  "driven",
  "eaten",
  "fallen",
  "forgotten",
  "hidden",
  "seen",
  "made",
  "sent",
  "built",
  "found",
  "held",
  "kept",
  "left",
  "told",
  "sold",
  "paid",
  "said",
  "read",
  "set",
  "put",
  "cut",
  "led",
  "met",
  "lost",
  "won",
  "run",
  "begun",
]);

function looksLikeParticiple(word: string): boolean {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  return w.endsWith("ed") || IRREGULAR_PARTICIPLES.has(w);
}

/** Return sentences that appear to contain passive voice. */
export function findPassiveSentences(text: string): string[] {
  const sentences = tokenizeSentences(text);
  return sentences.filter((sentence) => {
    const words = tokenizeWords(sentence).map((w) => w.toLowerCase());
    for (let i = 0; i < words.length - 1; i++) {
      if (BE_VERBS.includes(words[i])) {
        // Allow an optional adverb between the be-verb and participle.
        const next = words[i + 1];
        const after = words[i + 2];
        if (looksLikeParticiple(next)) return true;
        if (next.endsWith("ly") && after && looksLikeParticiple(after))
          return true;
      }
    }
    return false;
  });
}

/* ------------------------------------------------------------------ */
/*  Transition words                                                   */
/* ------------------------------------------------------------------ */
export const TRANSITION_WORDS = [
  "accordingly",
  "additionally",
  "afterward",
  "also",
  "although",
  "as a result",
  "besides",
  "consequently",
  "conversely",
  "finally",
  "first",
  "for example",
  "for instance",
  "furthermore",
  "hence",
  "however",
  "in addition",
  "in conclusion",
  "in contrast",
  "in fact",
  "indeed",
  "instead",
  "likewise",
  "meanwhile",
  "moreover",
  "namely",
  "nevertheless",
  "next",
  "nonetheless",
  "on the other hand",
  "otherwise",
  "similarly",
  "specifically",
  "still",
  "subsequently",
  "that is",
  "then",
  "therefore",
  "thus",
  "ultimately",
  "whereas",
  "while",
];

/** Count transition-word occurrences across the text. */
export function findTransitionWords(
  text: string,
): { phrase: string; count: number }[] {
  const lower = ` ${text.toLowerCase()} `;
  return TRANSITION_WORDS.map((phrase) => {
    const re = new RegExp(
      `\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "g",
    );
    const count = (lower.match(re) ?? []).length;
    return { phrase, count };
  }).filter((t) => t.count > 0);
}
