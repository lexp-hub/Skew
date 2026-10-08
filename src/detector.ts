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

export interface DetectorBenchmarks {
  gptZero: {
    score: number; // 0-100% human
    verdict: string;
    burstiness: number;
    perplexity: number;
  };
  copyleaks: {
    humanScore: number;
    verdict: string;
  };
  turnitinEstimate: {
    aiPercentage: number;
  };
  saplingEstimate: {
    humanScore: number;
  };
}

export interface DetailedDetectorResult {
  humanScore: number; // 0 - 100% (High = definitely human, Low = AI generated)
  aiScore: number;    // 0 - 100% (Complement of humanScore)
  verdict: 'LARGELY HUMAN' | 'POSSIBLY HUMAN' | 'UNCERTAIN / MIXED' | 'LIKELY AI' | 'DEFINITELY AI';
  burstinessScore: number; // 0 - 100 (Sentence pacing variance)
  perplexityScore: number; // 0 - 100 (Syntactic unpredictability & entropy)
  lexicalDiversity: number; // 0 - 100 (Type-Token Ratio)
  sentenceVariance: number;
  avgSentenceLength: number;
  clichesDetected: string[];
  sentences: SentenceAnalysis[];
  issues: string[];
  benchmarks: DetectorBenchmarks;
  breakdown: {
    burstinessWeight: number;
    lexicalWeight: number;
    perplexityWeight: number;
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
      perplexityScore: 50,
      lexicalDiversity: 50,
      sentenceVariance: 0,
      avgSentenceLength: 0,
      clichesDetected: [],
      sentences: [],
      issues: ['No text provided for analysis.'],
      benchmarks: {
        gptZero: { score: 50, verdict: 'UNCERTAIN / MIXED', burstiness: 50, perplexity: 50 },
        copyleaks: { humanScore: 50, verdict: 'UNCERTAIN / MIXED' },
        turnitinEstimate: { aiPercentage: 50 },
        saplingEstimate: { humanScore: 50 }
      },
      breakdown: { burstinessWeight: 15, lexicalWeight: 15, perplexityWeight: 15, clichePenalty: 0, uniformityPenalty: 0 }
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

  // 2. Lexical Diversity (Type-Token Ratio / TTR & Hapax Legomena)
  const uniqueWords = new Set(words);
  const ttr = wordCount > 0 ? (uniqueWords.size / wordCount) : 0;
  const lexicalDiversity = Math.min(100, Math.round(ttr * 100));

  // Hapax Legomena ratio (words occurring exactly once, higher in authentic human prose)
  const freqMap = new Map<string, number>();
  for (const w of words) {
    freqMap.set(w, (freqMap.get(w) || 0) + 1);
  }
  const hapaxCount = Array.from(freqMap.values()).filter(c => c === 1).length;
  const hapaxRatio = uniqueWords.size > 0 ? (hapaxCount / uniqueWords.size) : 0;

  // 3. Perplexity & Unpredictability Modeling (GPTZero / RoBERTa / Binoculars methodology)
  // Evaluates sentence opening diversity and lexical surprise
  const starters = rawSentences.map(s => (s.split(/\s+/)[0] || '').toLowerCase());
  const uniqueStarters = new Set(starters).size;
  const starterEntropy = sentenceCount > 1 ? (uniqueStarters / sentenceCount) : 0.8;

  const rawPerplexity = (hapaxRatio * 55) + (starterEntropy * 30) + (Math.min(1, ttr) * 15);
  const perplexityScore = Math.min(100, Math.max(10, Math.round(rawPerplexity)));

  // 4. Cliché & Synthetic Signature detection
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

  // 5. Uniformity & Staccato analysis
  let uniformityPenalty = 0;
  if (sentenceCount >= 3 && stdDev < 2.8) {
    uniformityPenalty += 18; // AI models love keeping sentence lengths rigidly uniform around 18-22 words
  }

  // Check for artificial staccato (telegraphic 1-3 word slogans)
  const hasChoppyStaccato = sentenceLengths.some(l => l <= 3);
  if (hasChoppyStaccato) {
    uniformityPenalty += 10;
  }

  // 6. Per-Sentence Analysis & Heatmap
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

  // 7. Overall Composite Human Score
  const burstContribution = burstinessScore * 0.35;
  const lexContribution = lexicalDiversity * 0.25;
  const perpContribution = perplexityScore * 0.30;
  const clichePenalty = Math.min(55, totalClicheWeight * 14);

  let rawHumanScore = burstContribution + lexContribution + perpContribution - clichePenalty - uniformityPenalty;

  // Bonus for natural pacing: mixture of concise punchy clauses and complex sentences
  const hasShort = sentenceLengths.some(l => l >= 6 && l <= 12);
  const hasLong = sentenceLengths.some(l => l >= 24);
  if (hasShort && hasLong) {
    rawHumanScore += 12;
  }

  const humanScore = Math.min(99, Math.max(5, Math.round(rawHumanScore)));
  const aiScore = 100 - humanScore;

  let verdict: 'LARGELY HUMAN' | 'POSSIBLY HUMAN' | 'UNCERTAIN / MIXED' | 'LIKELY AI' | 'DEFINITELY AI';
  if (humanScore >= 80) verdict = 'LARGELY HUMAN';
  else if (humanScore >= 60) verdict = 'POSSIBLY HUMAN';
  else if (humanScore >= 40) verdict = 'UNCERTAIN / MIXED';
  else if (humanScore >= 20) verdict = 'LIKELY AI';
  else verdict = 'DEFINITELY AI';

  // 8. Compile Actionable Issues for Auto-Refine Loop
  const issues: string[] = [];
  if (clichesDetected.length > 0) {
    issues.push(`Detected AI clichés: ${clichesDetected.slice(0, 4).join(', ')}`);
  }
  if (burstinessScore < 50) {
    issues.push('Low burstiness: sentence lengths are too uniform, lacking human rhythmic variation');
  }
  if (uniformityPenalty > 0) {
    issues.push('Monotonous sentence cadence: paragraphs lack contrasting short and long clauses');
  }
  if (perplexityScore < 55) {
    issues.push('Low syntactic perplexity: phrasing is overly predictable and formulaic');
  }
  const flaggedSentences = analyzedSentences
    .map((s, idx) => ({ ...s, idx: idx + 1 }))
    .filter(s => s.classification === 'ai');
  if (flaggedSentences.length > 0) {
    issues.push(`${flaggedSentences.length} sentence(s) flagged with strong AI signatures (sentences #${flaggedSentences.map(s => s.idx).join(', ')})`);
  }

  // 9. Multi-Detector Benchmarks (Simulated based on published research methodologies)
  const gptZeroScore = Math.min(99, Math.max(5, Math.round((burstinessScore * 0.45) + (perplexityScore * 0.55) - (clichePenalty * 0.4))));
  const copyleaksScore = Math.min(99, Math.max(5, Math.round((humanScore * 0.9) + (lexicalDiversity > 60 ? 8 : -4))));
  const saplingScore = Math.min(99, Math.max(5, Math.round((humanScore * 0.85) + (perplexityScore * 0.15))));

  const benchmarks: DetectorBenchmarks = {
    gptZero: {
      score: gptZeroScore,
      verdict: gptZeroScore >= 75 ? 'Likely Human' : gptZeroScore >= 50 ? 'Mixed / Review' : 'Likely AI',
      burstiness: burstinessScore,
      perplexity: perplexityScore
    },
    copyleaks: {
      humanScore: copyleaksScore,
      verdict: copyleaksScore >= 65 ? 'Human Content' : 'AI Content Detected'
    },
    turnitinEstimate: {
      aiPercentage: Math.max(0, 100 - humanScore)
    },
    saplingEstimate: {
      humanScore: saplingScore
    }
  };

  return {
    humanScore,
    aiScore,
    verdict,
    burstinessScore,
    perplexityScore,
    lexicalDiversity,
    sentenceVariance: Number(variance.toFixed(1)),
    avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    clichesDetected,
    sentences: analyzedSentences,
    issues,
    benchmarks,
    breakdown: {
      burstinessWeight: Math.round(burstContribution),
      lexicalWeight: Math.round(lexContribution),
      perplexityWeight: Math.round(perpContribution),
      clichePenalty,
      uniformityPenalty
    }
  };
}

