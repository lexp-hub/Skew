/**
 * SKEW - AI Humanizer Engine
 * Supports Cloudflare Workers AI natively, external cloud providers, and offline heuristics.
 */

import { localPrecisionHumanize } from './localEngine';
import { getPromptContrastiveExamples, ITALIAN_AI_LEXICON, ENGLISH_AI_LEXICON, findLexiconAlternative } from './lexicon';
import { detectHumanity, DetailedDetectorResult } from './detector';

export type HumanizeMode = 'natural' | 'casual' | 'academic' | 'editorial' | 'executive';
export type AggressionLevel = 'light' | 'medium' | 'aggressive';

export interface HumanizeOptions {
  mode: HumanizeMode;
  aggression: AggressionLevel;
}

export function buildHumanizerSystemPrompt(options: HumanizeOptions, isItalian: boolean = false): string {
  const { mode, aggression } = options;

  let persona = "";
  switch (mode) {
    case 'casual':
      persona = isItalian
        ? "Tono: Colloquiale, naturale, diretto ed espressivo. Usa formule spontanee come nel parlato colto."
        : "Tone: Conversational, warm, direct, and engaging. Use natural flow as if explaining to a trusted peer.";
      break;
    case 'academic':
      persona = isItalian
        ? "Tono: Saggistico, analitico, rigoroso e organico. Elimina formule scolastiche e transizioni rigide."
        : "Tone: Scholarly and analytical, yet organic. Never use robotic formula transitions.";
      break;
    case 'editorial':
      persona = isItalian
        ? "Tono: Giornalistico d'autore, incisivo, con verbi attivi forti e aperture di grande impatto."
        : "Tone: Punchy, journalistic, observant, engaging. Strong active verbs, eliminate passive voice.";
      break;
    case 'executive':
      persona = isItalian
        ? "Tono: Diretto, pragmatico, essenziale, senza fronzoli o buzzword aziendali."
        : "Tone: Direct, clear, pragmatic executive communication. Cut all fluff and corporate buzzwords.";
      break;
    case 'natural':
    default:
      persona = isItalian
        ? "Tono: Autentico, fluido, elegante e scorrevole. Il testo deve sembrare scritto da un autore umano esperto."
        : "Tone: Authentic, fluent, cohesive, and balanced human writing.";
      break;
  }

  let aggressionRule = "";
  switch (aggression) {
    case 'light':
      aggressionRule = isItalian
        ? "Aggressività: LIEVE. Preserva la struttura logica del testo eliminando solo i cliché da IA e le formule stereotipate."
        : "Aggressiveness: LIGHT. Retain structure, smooth transitions, and eliminate formulaic AI markers.";
      break;
    case 'aggressive':
      aggressionRule = isItalian
        ? "Aggressività: RISCRITTURA PROFONDA. Rielabora i periodi in modo profondo con verbi attivi e ritmo dinamico, preservando il significato."
        : "Aggressiveness: DEEP REWRITE. Thoroughly restructure paragraphs and cadence while preserving core facts.";
      break;
    case 'medium':
    default:
      aggressionRule = isItalian
        ? "Aggressività: BILANCIATA. Varia il ritmo in modo organico, arricchisci il lessico ed elimina le frasi ripetitive."
        : "Aggressiveness: BALANCED. Restructure sentences for organic rhythm and natural human expression.";
      break;
  }

  const contrastiveGuide = getPromptContrastiveExamples(isItalian);

  if (isItalian) {
    return `Sei SKEW, un editor letterario professionista e saggista di madrelingua italiana di massimo livello.
Il tuo compito è riscrivere il testo fornito in un italiano impeccabile, autentico e naturale, eliminando sistematicamente tutti i 26 "segnali rivelatori" della scrittura da chatbot (Wikipedia "Signs of AI writing" / Blader Humanizer), senza alterare i fatti tecnici o le informazioni.

REGOLE TASSATIVE DI SCRITTURA UMANA:
1. CADENZA E RITMO ORGANICO (VARIETÀ REALE, NO SPEZZATINO):
   - Alterna periodi composti ed eleganti (22-35 parole) a proposizioni brevi e incisive (7-12 parole).
   - VIETATO lo spezzatino telegrafico artificiale di 2-3 parole (NO a slogan come: "Code complexity hits hard.", "La chiave? La modularità.", "Perché? Semplice.", "Risultato? Netto."). Scrivi sempre frasi di senso compiuto.
2. ELIMINA LA FORMULA "NON SOLO X, MA ANCHE Y" (§1 Not X but Y):
   - Evita la costruzione retorica fissa "non solo X, ma Y" o "non si limita a X, ma Y". Esprimi i concetti direttamente.
3. ELIMINA I GERUNDI DI CODA "SHALLOW -ING RIDERS" (§15):
   - Rimuovi i gerundi appesi a fine frase per dare finta profondità ("..., minimizzando il rischio", "..., ponendo le basi per", "..., garantendo che"). Trasforma le conseguenze in proposizioni coordinate o coordinate congiunte.
4. SMONTA LE PERIFRASI E I VERBI GONFIATI (§12, §13, §18):
   - I chatbot evitano sistematicamente i verbi diretti: usano "rappresenta una sfida", "si pone come obiettivo", "si configura come". Trasformali in verbi diretti ("è una sfida", "punta a", "è").
   - VIETATE parole spia da IA: "svolge un ruolo cruciale/fondamentale", "gioca un ruolo chiave", "inoltre", "in conclusione", "tassello essenziale", "viaggio trasformativo", "mosaico di", "a 360 gradi", "alla luce di ciò".
5. NO COPYWRITING DA BROCHURE SAAS O SCHEMA "FEATURE -> BENEFICIO GENERICO":
   - VIETATE le collocazioni pubblicitarie vuote: "fondersi perfettamente nel flusso di lavoro", "architettura snella", "reattività istantanea", "interfaccia pulita e intuitiva", "con un semplice clic".
   - VIETATA la catena di connettori funzionali: "permettendo di monitorare...", "consentendo di gestire...", "assicurando che...". Esprimi ciò che il software fa con verbi finiti concreti ("mostra i parametri", "salva i file in locale").
   - PRECISIONE TECNICA > PLAUSIBILITÀ VAGA: non usare espressioni che suonano plausibili ma non dicono nulla (es. "assicura uniformità in ogni sessione" -> specifica che "mantiene coerente lo stato dell'applicazione").
6. PUREZZA LINGUISTICA AL 100%:
   - Scrivi in italiano naturale e corretto. Non inserire MAI titoli, slogan o motti in lingua inglese a meno che non siano termini tecnici originali (es. "debug", "deployment").
7. ZERO PREAMBOLI O CHATTER:
   - VIETATO iniziare con "Ecco il testo:", "Certamente,", "Ecco la riscrittura:" o formule simili.
   - VIETATO inserire note finali, elenchi di spiegazioni o resoconti sulle modifiche apportate.
   - RESTITUISCI ESCLUSIVAMENTE IL TESTO FINALE RISCRITTO.
8. MAI INVENTARE DEFINIZIONI ENCICLOPEDICHE O SPIEGAZIONI (REGOLA PAROLE ISOLATE):
   - Se l'utente inserisce una singola parola, un frammento breve o un termine comune che NON è un cliché (es. "calcio", "pizza", "computer", "roma"), NON spiegare che cos'è (MAI produrre "Il calcio è uno sport...", "La pizza è un piatto...").
   - Se il termine o frammento non contiene formule stereotipate da IA, restituiscilo TAL QUALE senza inventare una voce di Wikipedia. Modificalo SOLO se è un cliché registrato (es. "inoltre" -> "in più", "fondamentale" -> "determinante").

${contrastiveGuide}

${persona}
${aggressionRule}
`;
  }

  return `You are SKEW, a master human editor and author based on Wikipedia's 26 patterns ("Signs of AI writing" / Humanizer).
Your task is to rewrite AI-sounding prose so it reads like a living, skilled human writer without changing what it says, systematically eliminating AI writing tells.

STRICT EDITORIAL DIRECTIVES:
1. ORGANIC CADENCE (NO TELEGRAPHIC STACCATO):
   - Balance longer flowing sentences (22-35 words) with crisp, direct sentences (7-12 words).
   - NEVER write artificial 1-3 word bullet fragments ("Complexity hits hard.", "Why? Simple.", "Result? Clear."). Write cohesive, complete thoughts.
2. CUT "NOT X BUT Y" CONTRASTS (§1):
   - Remove formulaic "It's not just X, it's Y" or "not only X, but also Y". State claims directly.
3. CUT SHALLOW -ING RIDERS (§15):
   - Remove artificial trailing participles bolted onto facts ("..., highlighting the importance", "..., minimizing the risk", "..., laying the groundwork for"). State the consequence directly.
4. STRIP INFLATED VERBS & ROBOTIC BUZZWORDS (§12, §13, §18):
   - Drop "stands as a testament", "plays a crucial/pivotal role", "rich tapestry", "furthermore", "in conclusion", "delve".
   - Avoid dodging direct verbs: replace "serves as", "acts as", "represents" with direct verbs.
5. 100% LANGUAGE FIDELITY:
   - Match the source language completely. Never inject random foreign words or slogans.
6. NO CHATTER OR COMMENTARY:
   - NEVER start with "Here is the rewritten text:", "Sure!", or provide post-rewrite bullet points explaining your edits.
   - OUTPUT ONLY THE FINAL REWRITTEN TEXT.
7. NO ENCYCLOPEDIC DEFINITIONS FOR ISOLATED WORDS:
   - If the user provides a single word or short phrase that is not an AI cliché (e.g. "soccer", "pizza", "computer"), DO NOT generate an encyclopedia definition ("Soccer is a team sport...").
   - If there is no AI cliché to rewrite, return the term AS IS. Only rewrite if the word matches a known AI marker (e.g. "furthermore" -> "also", "delve" -> "explore").

${contrastiveGuide}

${persona}
${aggressionRule}
`;
}

/**
 * Sanitizes and cleans the raw LLM output:
 * 1. Strips conversational chatter, greetings, and preambles ("Ecco il testo:", "Sure, here is...")
 * 2. Removes trailing explanation bullet points or post-analysis notes
 * 3. Deterministically replaces stubborn surviving AI clichés using the lexicon database
 */
/**
 * Sanitizes and cleans the raw LLM output:
 * 1. Strips conversational chatter, greetings, and preambles ("Ecco il testo:", "Sure, here is...")
 * 2. Removes trailing explanation bullet points or post-analysis notes
 * 3. Deterministically replaces stubborn surviving AI clichés using the lexicon database
 * 4. Filters out hallucinated encyclopedia definitions if original input was a short phrase/word
 */
export function sanitizeAndHarmonizeOutput(rawText: string, isItalian: boolean, originalText: string = ''): string {
  if (!rawText) return '';

  let cleaned = rawText.trim();

  // Strip Markdown code fence wrappers if present
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  // 1. Strip common conversational preambles (IT & EN)
  cleaned = cleaned.replace(/^(?:Ecco il testo(?: revisionato| umanizzato| modificato)?:?|Certamente,? ecco(?: la riscrittura| il testo)?:?|Di seguito il testo(?: revisionato)?:?)\s*\n*/i, '');
  cleaned = cleaned.replace(/^(?:Here is the (?:rewritten|humanized|edited) text:?|Sure,? here is the (?:rewrite|text)?:?|Below is the (?:revised|edited) text:?)\s*\n*/i, '');

  // 2. Filter out hallucinated encyclopedia definitions (e.g. input "calcio" -> output "Il calcio è uno sport...")
  if (originalText) {
    const origWords = originalText.trim().split(/\s+/).filter(Boolean);
    const outWords = cleaned.split(/\s+/).filter(Boolean);

    // If original input is short (<= 6 words) and output exploded into a long explanation (> 18 words)
    // and begins with a definition pattern ("Il X è un...", "X is a..."), filter it
    if (origWords.length <= 6 && outWords.length > 18) {
      const defPattern = isItalian
        ? /^(?:[IilL'’dD]+(?:\s+\w+)?\s+è\s+(?:un|uno|una|lo|il|la|uno sport|un piatto|un concetto|un termine|un dispositivo|un sistema|definito come)\b)/i
        : /^(?:(?:The\s+)?\w+\s+is\s+(?:a|an|the|defined as|a sport|a concept|a tool)\b)/i;

      if (defPattern.test(cleaned)) {
        return originalText.trim();
      }
    }
  }

  // 3. Strip trailing explanatory sections (e.g. "Ho apportato le seguenti modifiche: ...", "Key changes made: ...")
  const trailingSplitRegex = /\n\s*(?:(?:Ho apportato le seguenti modifiche|Modifiche principali|Note di revisione|Key changes made|Here is what I changed|Changes applied):?[\s\S]*)$/i;
  cleaned = cleaned.replace(trailingSplitRegex, '').trim();

  // 4. Deterministic cleanup of stubborn surviving cliches from the lexicon
  if (isItalian) {
    for (const item of ITALIAN_AI_LEXICON) {
      if (item.pattern.test(cleaned)) {
        const replacement = item.alternatives.natural[0] || '';
        cleaned = cleaned.replace(item.pattern, replacement);
      }
    }
  } else {
    for (const item of ENGLISH_AI_LEXICON) {
      if (item.pattern.test(cleaned)) {
        const replacement = item.alternatives.natural[0] || '';
        cleaned = cleaned.replace(item.pattern, replacement);
      }
    }
  }

  // Final trim and whitespace normalization
  cleaned = cleaned.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

export function heuristicHumanize(
  text: string,
  mode: HumanizeMode = 'natural',
  aggression: AggressionLevel = 'medium'
): string {
  return localPrecisionHumanize(text, {
    mode,
    aggression,
    seed: Date.now()
  });
}

export interface HumanizeRequestPayload {
  text: string;
  provider?: string;
  model?: string;
  apiKey?: string;
  ollamaBaseUrl?: string;
  customEndpoint?: string;
  mode?: HumanizeMode;
  aggression?: AggressionLevel;
  temperature?: number;
}

export async function processHumanizeRequest(
  payload: HumanizeRequestPayload,
  env: any
): Promise<string> {
  const {
    text,
    provider = 'cf-ai',
    model,
    apiKey,
    ollamaBaseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434',
    customEndpoint,
    mode = 'natural',
    aggression = 'medium',
    temperature = 0.65,
  } = payload;

  const cleanInput = (text || '').trim();
  const inputWords = cleanInput.split(/\s+/).filter(Boolean);

  const isItalian = /(?<!\p{L})(?:di|che|il|la|per|un|in|con|non|del|della|dei|sono|questo|questa|dobbiamo|sviluppatori|architettura|codice|inoltre|calcio|tuttavia|fondamentale|cruciale)(?!\p{L})/giu.test(text);

  // If input is a short fragment (up to 6 words), check if it matches a known AI cliché in the lexicon
  if (inputWords.length <= 6) {
    const directAlt = findLexiconAlternative(cleanInput, isItalian, mode) || findLexiconAlternative(cleanInput, !isItalian, mode);
    if (directAlt) {
      return directAlt;
    }
    // If it's a short entity or isolated words (1-3 words) without an AI cliché pattern, return it as is
    // Prevents the model from generating dictionary/encyclopedia definitions for simple terms (e.g. "calcio", "pizza", "computer")
    if (inputWords.length <= 3) {
      return cleanInput;
    }
  }

  const systemPrompt = buildHumanizerSystemPrompt({ mode, aggression }, isItalian);
  const userPrompt = isItalian
    ? `Riscrivi e umanizza questo testo in un italiano naturale, fluido e professionale, preservando tutti i concetti tecnici:\n\n${text}`
    : `Rewrite and humanize this text into natural, fluent, and engaging human writing, preserving all facts and technical terms:\n\n${text}`;

  let rawOutput = '';

  // 1. Cloudflare Workers AI (Edge GPU Binding or Direct REST API)
  if (provider === 'cf-ai') {
    const chosenModel = model || env.CLOUDFLARE_MODEL || '@cf/mistralai/mistral-small-3.1-24b-instruct';

    if (env.AI) {
      try {
        const response = await env.AI.run(chosenModel, {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2048,
          temperature: Number(temperature) || 0.65,
        });
        rawOutput = response.response || response.choices?.[0]?.message?.content || response.text || '';
      } catch (err: any) {
        // Fallback to REST API if AI binding is unavailable in local dev
        if (!env.CLOUDFLARE_ACCOUNT_ID && !env.CLOUDFLARE_API_TOKEN && !apiKey) throw err;
      }
    }

    if (!rawOutput) {
      const accountId = env.CLOUDFLARE_ACCOUNT_ID;
      const token = apiKey || env.CLOUDFLARE_API_TOKEN;

      if (accountId && token) {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${chosenModel}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2048,
            temperature: Number(temperature) || 0.65,
          })
        });

        if (!res.ok) {
          throw new Error(`Cloudflare Workers AI error: ${await res.text()}`);
        }

        const data: any = await res.json();
        rawOutput = data.result?.response || data.result?.choices?.[0]?.message?.content || data.result?.text || '';
      } else {
        throw new Error('Cloudflare Workers AI binding [env.AI] or CLOUDFLARE_ACCOUNT_ID & CLOUDFLARE_API_TOKEN is not configured.');
      }
    }
  } else if (provider === 'groq') {
    // 2. Groq
    const key = apiKey || env.GROQ_API_KEY;
    if (!key) throw new Error('Groq API Key required. Enter your key in Settings.');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: Number(temperature) || 0.7,
      })
    });
    if (!res.ok) throw new Error(`Groq error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data.choices?.[0]?.message?.content || '';
  } else if (provider === 'openai' || provider === 'custom') {
    // 3. OpenAI or Custom
    const key = apiKey || env.OPENAI_API_KEY;
    const url = provider === 'custom' && customEndpoint ? customEndpoint : 'https://api.openai.com/v1/chat/completions';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: Number(temperature) || 0.7,
      })
    });
    if (!res.ok) throw new Error(`OpenAI error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data.choices?.[0]?.message?.content || '';
  } else if (provider === 'anthropic') {
    // 4. Anthropic
    const key = apiKey || env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('Anthropic API Key required.');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-latest',
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 4096,
        temperature: Number(temperature) || 0.7,
      })
    });
    if (!res.ok) throw new Error(`Anthropic error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data.content?.[0]?.text || '';
  } else if (provider === 'openrouter') {
    // 5. OpenRouter
    const key = apiKey || env.OPENROUTER_API_KEY;
    if (!key) throw new Error('OpenRouter API Key required.');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model || 'meta-llama/llama-3.3-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: Number(temperature) || 0.7,
      })
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data.choices?.[0]?.message?.content || '';
  } else if (provider === 'gemini') {
    // 6. Gemini
    const key = apiKey || env.GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API Key required.');
    const m = model || 'gemini-2.0-flash';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }] }],
        generationConfig: { temperature: Number(temperature) || 0.7 }
      })
    });
    if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (provider === 'ollama') {
    // 7. Ollama
    const res = await fetch(`${ollamaBaseUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3.2',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: { temperature: Number(temperature) || 0.7 }
      })
    });
    if (!res.ok) throw new Error(`Ollama error: ${await res.text()}`);
    const data: any = await res.json();
    rawOutput = data?.message?.content || '';
  } else if (provider === 'heuristic' || provider === 'local') {
    // 8. Precision Local Engine (Offline / zero-model)
    return heuristicHumanize(text, mode, aggression);
  } else {
    throw new Error(`Unknown provider: ${provider}`);
  }

  // Pass through the deterministic sanitization & harmonization pipeline
  return sanitizeAndHarmonizeOutput(rawOutput, isItalian, cleanInput);
}

export interface AutoRefineIteration {
  pass: number;
  text: string;
  humanScore: number;
  burstinessScore: number;
  perplexityScore: number;
  verdict: string;
  issues: string[];
}

export interface AutoRefineResult {
  humanizedText: string;
  iterations: AutoRefineIteration[];
  finalDetection: DetailedDetectorResult;
}

/**
 * Automated Refinement Loop:
 * Benchmarks text against multi-detector heuristics (GPTZero, Copyleaks, Turnitin),
 * and automatically iterates rewriting until the target human score is achieved.
 */
export async function autoRefineHumanize(
  payload: HumanizeRequestPayload & { targetScore?: number; maxPasses?: number },
  env: any
): Promise<AutoRefineResult> {
  const targetScore = Math.min(99, Math.max(50, payload.targetScore || 85));
  const maxPasses = Math.min(4, Math.max(1, payload.maxPasses || 3));
  const iterations: AutoRefineIteration[] = [];

  let currentText = payload.text;
  let lastResultText = '';
  let finalDetection: DetailedDetectorResult | null = null;

  for (let pass = 1; pass <= maxPasses; pass++) {
    let currentPayload = { ...payload };

    if (pass > 1 && finalDetection && finalDetection.issues.length > 0) {
      const isItalian = /(?<!\p{L})(?:di|che|il|la|per|un|in|con|non|del|della|dei|sono|questo|questa|dobbiamo|sviluppatori|architettura|codice)(?!\p{L})/giu.test(currentText);
      const refinementGuidance = isItalian
        ? `\n\n[DIRETTIVA DI AUTO-RAFFINAMENTO]: Nella bozza precedente i rilevatori IA (stile GPTZero/Copyleaks) hanno evidenziato:\n- ${finalDetection.issues.join('\n- ')}\n\nRiformula le frasi migliorando drasticamente la burstiness (alterna periodi lunghi e ricchi a frasi brevissime e incisive), elimina ogni formula prevedibile e restituisci SOLO la nuova riscrittura perfezionata.`
        : `\n\n[AUTO-REFINEMENT DIRECTIVE]: In the previous draft, AI detectors (GPTZero/Copyleaks heuristics) flagged:\n- ${finalDetection.issues.join('\n- ')}\n\nDrastically improve sentence burstiness (mix concise punchy sentences with complex clauses), eliminate formulaic transitions, and return ONLY the perfected text.`;

      currentPayload.text = lastResultText + refinementGuidance;
      currentPayload.temperature = Math.min(1.0, (payload.temperature || 0.65) + (pass * 0.05));
      if (currentPayload.aggression === 'light') currentPayload.aggression = 'medium';
      else if (currentPayload.aggression === 'medium' && pass >= 3) currentPayload.aggression = 'aggressive';
    }

    lastResultText = await processHumanizeRequest(currentPayload, env);
    finalDetection = detectHumanity(lastResultText);

    iterations.push({
      pass,
      text: lastResultText,
      humanScore: finalDetection.humanScore,
      burstinessScore: finalDetection.burstinessScore,
      perplexityScore: finalDetection.perplexityScore,
      verdict: finalDetection.verdict,
      issues: finalDetection.issues
    });

    const words = lastResultText.trim().split(/\s+/).filter(Boolean);
    // Exit early if target score reached or if it's a short isolated phrase
    if (finalDetection.humanScore >= targetScore || words.length <= 6) {
      break;
    }
  }

  return {
    humanizedText: lastResultText,
    iterations,
    finalDetection: finalDetection || detectHumanity(lastResultText)
  };
}
