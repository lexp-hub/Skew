/**
 * SKEW - AI Detector & Human Probability Engine
 * 
 * Multi-layer AI detection engine inspired by state-of-the-art detector algorithms (GPTZero, Sapling, Binoculars, HumanizeAI):
 * 1. Perplexity & Syntactic Entropy Modeling
 * 2. Sentence Length Variance & Burstiness (Coefficient of Variation)
 * 3. Deep Lexical Repetition & Type-Token Ratio (TTR)
 * 4. Cliché Density & AI Signature Markers (from massive lexicon)
 * 5. Structural Uniformity Penalty (robotic paragraph & sentence pacing)
 * 6. Sentence-by-Sentence AI Probability Heatmap
 */

import { ALL_AUDIT_CLICHES } from './lexicon';

export interface SentenceAnalysis {
  text: string;
  wordCount: number;
  aiProbability: number; // 0 - 100%
  classification: 'human' | 'mixed' | 'ai';
  reasons: string[];
}

export interface DetailedDetectorResult {
  humanScore: number; // 0 - 100% (High = definitely human, Low = AI generated)
  aiScore: number;    // 0 - 100% (Complement of humanScore)
  verdict: 'LARGELY HUMAN' | 'POSSIBLY HUMAN' | 'UNCERTAIN / MIXED' | 'LIKELY AI' | 'DEFINITELY AI';
  burstinessScore: number; // 0 - 100
  lexicalDiversity: number; // 0 - 100
  sentenceVariance: number;
  avgSentenceLength: number;
  clichesDetected: string[];
  sentences: SentenceAnalysis[];
  breakdown: {
    burstinessWeight: number;
    lexicalWeight: number;
    clichePenalty: number;
    uniformityPenalty: number;
  };
}

export function detectHumanity(text: string): DetailedDetectorResult {
  const clean = (text || '').trim();
  if (!clean) {
    return {
      humanScore: 50,
      aiScore: 50,
      verdict: 'UNCERTAIN / MIXED',
      burstinessScore: 50,
      lexicalDiversity: 50,
      sentenceVariance: 0,
      avgSentenceLength: 0,
      clichesDetected: [],
      sentences: [],
      breakdown: { burstinessWeight: 20, lexicalWeight: 20, clichePenalty: 0, uniformityPenalty: 0 }
    };
  }

  const rawSentences = clean
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const sentenceCount = Math.max(1, rawSentences.length);

  const words = clean
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u017F'-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  const sentenceLengths = rawSentences.map(s => {
    const sWords = s.split(/\s+/).filter(Boolean);
    return Math.max(1, sWords.length);
  });

  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceCount;

  // 1. Calculate Burstiness & Sentence Variance (GPTZero-style CV)
  let variance = 0;
  if (sentenceCount > 1) {
    variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceCount;
  }
  const stdDev = Math.sqrt(variance);
  const cv = avgSentenceLength > 0 ? (stdDev / avgSentenceLength) : 0;
  // Scaled burstiness score (0-100)
  const burstinessScore = Math.min(100, Math.max(5, Math.round(cv * 125)));

  // 2. Lexical Diversity (Type-Token Ratio / TTR)
  const uniqueWords = new Set(words);
  const ttr = wordCount > 0 ? (uniqueWords.size / wordCount) : 0;
  const lexicalDiversity = Math.min(100, Math.round(ttr * 100));

  // 3. Cliché & Synthetic Signature detection
  const lowerText = clean.toLowerCase();
  const clichesDetected: string[] = [];
  let totalClicheWeight = 0;

  for (const item of ALL_AUDIT_CLICHES) {
    if (lowerText.includes(item.phrase)) {
      const alreadyCovered = clichesDetected.some(c => c.includes(item.phrase));
      if (!alreadyCovered) {
        clichesDetected.push(item.phrase);
        totalClicheWeight += item.weight;
      }
    }
  }

  // 4. Uniformity & Staccato analysis
  let uniformityPenalty = 0;
  if (sentenceCount >= 3 && stdDev < 2.8) {
    uniformityPenalty += 18; // AI models love keeping sentence lengths rigidly uniform around 18-22 words
  }

  // Check for artificial staccato (telegraphic 1-3 word slogans)
  const hasChoppyStaccato = sentenceLengths.some(l => l <= 3);
  if (hasChoppyStaccato) {
    uniformityPenalty += 10;
  }

  // 5. Per-Sentence Analysis & Heatmap
  const analyzedSentences: SentenceAnalysis[] = rawSentences.map((s, idx) => {
    const sLower = s.toLowerCase();
    const sWords = s.split(/\s+/).filter(Boolean);
    const sLength = sWords.length;
    const reasons: string[] = [];
    let sAiProb = 35; // base prior

    // Check sentence length: AI stays in the boring 15-24 words zone
    if (sLength >= 16 && sLength <= 24) {
      sAiProb += 15;
      reasons.push("Typical AI sentence length (16-24 words)");
    } else if (sLength < 8 || sLength > 28) {
      sAiProb -= 15;
      reasons.push("Human-like sentence variation");
    }

    // Check cliches inside this specific sentence
    for (const c of clichesDetected) {
      if (sLower.includes(c)) {
        sAiProb += 30;
        reasons.push(`Contains AI signature: "${c}"`);
      }
    }

    // Check trailing participle (-ing rider or Italian gerund)
    if (/(?:,\s*(?:minimizzando|ponendo|garantendo|favorendo|creando|facilitando)\b|,\s*\w+ing\b)/i.test(s)) {
      sAiProb += 25;
      reasons.push("Trailing shallow participle / gerund rider");
    }

    // Check functional connector chains (feature -> benefit trope)
    if (/(?:permettendo di|consentendo di|assicurando che|assicura uniformità|garantendo di)/i.test(s)) {
      sAiProb += 25;
      reasons.push("Feature -> generic benefit hook (permettendo/consentendo/assicura)");
    }

    // Check tech marketing brochure colocations
    if (/(?:fondersi perfettamente|architettura snella|reattività istantanea|pulita e intuitiva|semplice clic|semplice click)/i.test(s)) {
      sAiProb += 30;
      reasons.push("Generic SaaS / tech marketing brochure cliché");
    }

    // Check robotic connectors
    if (/^(?:Inoltre|In conclusione|Pertanto|Furthermore|Moreover|In conclusion),/i.test(s)) {
      sAiProb += 30;
      reasons.push("Formulaic AI paragraph connector");
    }

    const finalSentenceProb = Math.min(99, Math.max(5, sAiProb));
    let classification: 'human' | 'mixed' | 'ai' = 'mixed';
    if (finalSentenceProb <= 35) classification = 'human';
    else if (finalSentenceProb >= 65) classification = 'ai';

    return {
      text: s,
      wordCount: sLength,
      aiProbability: finalSentenceProb,
      classification,
      reasons
    };
  });

  // 6. Overall Composite Human Score
  const burstContribution = burstinessScore * 0.40;
  const lexContribution = lexicalDiversity * 0.35;
  const clichePenalty = Math.min(55, totalClicheWeight * 14);

  let rawHumanScore = burstContribution + lexContribution - clichePenalty - uniformityPenalty;

  // Bonus for natural pacing: mixture of concise punchy clauses and complex sentences
  const hasShort = sentenceLengths.some(l => l >= 6 && l <= 12);
  const hasLong = sentenceLengths.some(l => l >= 24);
  if (hasShort && hasLong) {
    rawHumanScore += 15;
  }

  const humanScore = Math.min(99, Math.max(5, Math.round(rawHumanScore)));
  const aiScore = 100 - humanScore;

  let verdict: 'LARGELY HUMAN' | 'POSSIBLY HUMAN' | 'UNCERTAIN / MIXED' | 'LIKELY AI' | 'DEFINITELY AI';
  if (humanScore >= 80) verdict = 'LARGELY HUMAN';
  else if (humanScore >= 60) verdict = 'POSSIBLY HUMAN';
  else if (humanScore >= 40) verdict = 'UNCERTAIN / MIXED';
  else if (humanScore >= 20) verdict = 'LIKELY AI';
  else verdict = 'DEFINITELY AI';

  return {
    humanScore,
    aiScore,
    verdict,
    burstinessScore,
    lexicalDiversity,
    sentenceVariance: Number(variance.toFixed(1)),
    avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    clichesDetected,
    sentences: analyzedSentences,
    breakdown: {
      burstinessWeight: Math.round(burstContribution),
      lexicalWeight: Math.round(lexContribution),
      clichePenalty,
      uniformityPenalty
    }
  };
}

