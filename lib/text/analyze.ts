import { round } from "@/lib/utils";

/** Average adult silent reading speed (words per minute). */
export const READING_WPM = 225;
/** Average speaking/presentation speed (words per minute). */
export const SPEAKING_WPM = 130;
/** Rough words per printed page (double-spaced, 12pt). */
export const WORDS_PER_PAGE = 500;

const WORD_RE = /[A-Za-z0-9'’]+(?:-[A-Za-z0-9'’]+)*/g;

/** Split into word tokens (handles apostrophes and hyphenated words). */
export function tokenizeWords(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

/** Split into sentences using terminal punctuation, keeping it simple & robust. */
export function tokenizeSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const matches = trimmed.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g);
  return matches ? matches.map((s) => s.trim()).filter(Boolean) : [trimmed];
}

/** Split into paragraphs on blank lines. */
export function tokenizeParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Estimate the syllables in a single English word. Heuristic (Flesch-style). */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;

  const cleaned = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const groups = cleaned.match(/[aeiouy]{1,2}/g);
  return groups ? Math.max(1, groups.length) : 1;
}

/** Total syllables across all words. */
export function totalSyllables(words: string[]): number {
  return words.reduce((sum, w) => sum + countSyllables(w), 0);
}

export interface TextStats {
  charsWithSpaces: number;
  charsNoSpaces: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  syllables: number;
  avgWordLength: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  longestWord: string;
  readingTimeMin: number;
  speakingTimeMin: number;
  estimatedPages: number;
}

/** Compute the full base statistics bundle for a piece of text. */
export function computeStats(text: string): TextStats {
  const words = tokenizeWords(text);
  const sentences = tokenizeSentences(text);
  const paragraphs = tokenizeParagraphs(text);
  const lines = text.length ? text.split(/\r\n|\r|\n/).length : 0;
  const syllables = totalSyllables(words);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

  const totalWordChars = words.reduce((sum, w) => sum + w.length, 0);
  const longestWord = words.reduce(
    (longest, w) => (w.length > longest.length ? w : longest),
    "",
  );

  return {
    charsWithSpaces: text.length,
    charsNoSpaces: text.replace(/\s/g, "").length,
    words: words.length,
    uniqueWords,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines,
    syllables,
    avgWordLength: words.length ? round(totalWordChars / words.length, 1) : 0,
    avgWordsPerSentence: sentences.length
      ? round(words.length / sentences.length, 1)
      : 0,
    avgSyllablesPerWord: words.length ? round(syllables / words.length, 2) : 0,
    longestWord,
    readingTimeMin: words.length / READING_WPM,
    speakingTimeMin: words.length / SPEAKING_WPM,
    estimatedPages: round(words.length / WORDS_PER_PAGE, 2),
  };
}

/** Word frequency, sorted descending. Lowercased. */
export function wordFrequency(text: string): { word: string; count: number }[] {
  const words = tokenizeWords(text).map((w) => w.toLowerCase());
  const map = new Map<string, number>();
  for (const w of words) map.set(w, (map.get(w) ?? 0) + 1);
  return [...map.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

/** Format a minutes value (float) into a human "m s" string. */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0s";
  const totalSeconds = Math.round(minutes * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}
