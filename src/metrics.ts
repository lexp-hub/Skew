/**
 * SKEW - AI Text & Human Metrics Analyzer
 */

export const AI_CLICHES = [
  // English markers
  "delve", "delving", "tapestry", "testament", "beacon", "pivotal",
  "in the realm of", "it's important to remember", "it is worth noting",
  "furthermore", "moreover", "in conclusion", "vital role", "crucial role",
  "embark", "unravel", "navigate the complexities", "dynamic landscape",
  "ever-evolving", "foster", "holistic", "multifaceted", "paramount",
  "rich tapestry", "game-changer", "harness", "resonate", "spearhead",
  "seamlessly", "intertwined", "transformative journey",

  // Italian markers
  "è fondamentale sottolineare", "in conclusione", "inoltre",
  "nel regno di", "un testamento a", "un mosaico di", "crocevia",
  "esplorare le complessità", "panorama in continua evoluzione",
  "svolge un ruolo cruciale", "svolge un ruolo fondamentale",
  "vale la pena notare", "è importante ricordare che", "intrecciato",
  "far luce su", "tassello fondamentale", "viaggio trasformativo",
  "armonioso", "poliedrico", "sinergia", "catalizzatore"
];

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
  const burstinessScore = Math.min(100, Math.max(10, Math.round(cv * 110)));

  // Lexical Diversity (Type-Token Ratio)
  const uniqueWords = new Set(words);
  const ttr = wordCount > 0 ? (uniqueWords.size / wordCount) : 0;
  const lexicalDiversity = Math.min(100, Math.round(ttr * 100));

  // Cliché phrase detection
  const lowerText = clean.toLowerCase();
  const clichesFound: string[] = [];
  for (const cliche of AI_CLICHES) {
    if (lowerText.includes(cliche)) {
      clichesFound.push(cliche);
    }
  }

  // Composite Human Probability Score
  let score = (burstinessScore * 0.45) + (lexicalDiversity * 0.35);
  const clichePenalty = Math.min(45, clichesFound.length * 15);
  score -= clichePenalty;

  if (sentenceCount >= 3 && stdDev < 2.5) {
    score -= 20;
  }

  const hasShort = sentenceLengths.some(l => l <= 5);
  const hasLong = sentenceLengths.some(l => l >= 20);
  if (hasShort && hasLong) {
    score += 15;
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

