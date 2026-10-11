/**
 * SKEW - AI Text & Human Metrics Analyzer
 * Deep detection of AI signatures, clichés, syntactic variance, and burstiness.
 */

import { ALL_AUDIT_CLICHES } from './lexicon';

export interface TextMetrics {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  burstinessScore: number; // 0 - 100
  lexicalDiversity: number; // 0 - 100
  clichesFound: string[];
  humanScore: number; // 0 - 100
  readingTimeMinutes: number;
}

export function analyzeTextMetrics(text: string): TextMetrics {
  const clean = (text || '').trim();
  if (!clean) {
    return {
      wordCount: 0,
      charCount: 0,
      sentenceCount: 0,
      avgSentenceLength: 0,
      burstinessScore: 0,
      lexicalDiversity: 0,
      clichesFound: [],
      humanScore: 50,
      readingTimeMinutes: 0,
    };
  }

  const words = clean
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u017F'-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;
  const charCount = clean.length;

  const rawSentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const sentenceCount = Math.max(1, rawSentences.length);

  const sentenceLengths = rawSentences.map(sentence => {
    const sWords = sentence.split(/\s+/).filter(Boolean);
    return Math.max(1, sWords.length);
  });

  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceCount;

  // Burstiness (variance of sentence lengths)
  let variance = 0;
  if (sentenceCount > 1) {
    variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceCount;
  }
  const stdDev = Math.sqrt(variance);
  const cv = avgSentenceLength > 0 ? (stdDev / avgSentenceLength) : 0;
  // Scaled burstiness score
  const burstinessScore = Math.min(100, Math.max(10, Math.round(cv * 120)));

  // Lexical Diversity (Type-Token Ratio)
  const uniqueWords = new Set(words);
  const ttr = wordCount > 0 ? (uniqueWords.size / wordCount) : 0;
  const lexicalDiversity = Math.min(100, Math.round(ttr * 100));

  // Deep Cliché & AI Signature phrase detection from massive lexicon
  const lowerText = clean.toLowerCase();
  const clichesFound: string[] = [];
  let totalClichePenalty = 0;

  for (const item of ALL_AUDIT_CLICHES) {
    if (lowerText.includes(item.phrase)) {
      // Avoid duplicate sub-phrases (e.g. "è fondamentale" if already matched "è fondamentale sottolineare")
      const alreadyCovered = clichesFound.some(existing => existing.includes(item.phrase));
      if (!alreadyCovered) {
        clichesFound.push(item.phrase);
        totalClichePenalty += item.weight * 12;
      }
    }
  }

  // Composite Human Probability Score
  let score = (burstinessScore * 0.40) + (lexicalDiversity * 0.35);
  score -= Math.min(60, totalClichePenalty);

  // Penalty if all sentences have nearly identical lengths (robotic pacing)
  if (sentenceCount >= 3 && stdDev < 3.0) {
    score -= 15;
  }

  // Bonus for natural pacing: mixture of concise punchy clauses and complex sentences
  const hasShort = sentenceLengths.some(l => l >= 6 && l <= 12);
  const hasLong = sentenceLengths.some(l => l >= 24);
  if (hasShort && hasLong) {
    score += 15;
  }

  // Penalty if artificial 1-2 word staccato telegrams are detected
  const hasChoppyStaccato = sentenceLengths.some(l => l <= 3);
  if (hasChoppyStaccato) {
    score -= 10;
  }

  const finalHumanScore = Math.min(99, Math.max(5, Math.round(score)));
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    charCount,
    sentenceCount,
    avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    burstinessScore,
    lexicalDiversity,
    clichesFound,
    humanScore: finalHumanScore,
    readingTimeMinutes,
  };
}
