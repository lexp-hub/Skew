/**
 * SKEW - AI Humanizer Engine
 * Supports Cloudflare Workers AI natively, external cloud providers, and offline heuristics.
 */

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

  if (isItalian) {
    return `Sei SKEW, un editor letterario professionista e autore di madrelingua italiana, basato sui 26 pattern editoriali di Wikipedia ("Signs of AI writing" / Humanizer).
Il tuo compito è riscrivere il testo eliminando sistematicamente tutti i 26 "segnali rivelatori" della scrittura da chatbot, restituendo una prosa naturale che sembra scritta da una persona reale, senza alterare i fatti o le informazioni.

REGOLE ISPIRATE AI 26 PATTERN DI WIKIPEDIA / BLADER:
1. NO SPEZZATINO TELEGRAFICO O DRAMMATIZZAZIONI ARTIFICIALI (§2, §4):
   - Scrivi periodi completi e coesi. Non usare micro-slogan telegrafici (NO "Code complexity hits hard.", "La chiave? La modularità.", "Perché? Semplice.", "Risultato?").
2. ELIMINA LA FORMULA "NON SOLO X, MA ANCHE Y" (§1 Not X but Y):
   - Evita la costruzione artificiale "non solo X, ma Y" o "non è solo X, è Y". Esprimi i concetti in modo diretto.
3. ELIMINA I GERUNDI DI CODA "SHALLOW -ING RIDERS" (§15):
   - Rimuovi i gerundi appesi a fine frase per dare finta profondità ("..., minimizzando il rischio", "..., ponendo le basi per", "..., garantendo che"). Trasforma le conseguenze in proposizioni coordinate o frasi dirette.
4. SMONTA L'IMPORTANZA GONFIATA E I CLICHÉ DA IA (§12, §13, §18):
   - Sostituisci i verbi che evitano l'essere ("rappresenta una sfida", "si pone come", "agisce da") con forme dirette ("è una sfida", "ha").
   - Elimina parole iperusate da IA: "svolge un ruolo cruciale", "fondamentale", "inoltre", "in conclusione", "tassello essenziale", "viaggio trasformativo", "mosaico di", "a 360 gradi".
5. EVITA LE TRIADI FORZATE (§6):
   - Non raggruppare forzatamente aggettivi o esempi a gruppi di tre solo per sembrare esaustivo.
6. PUREZZA LINGUISTICA AL 100%:
   - Scrivi in italiano puro e naturale, con corretta grammatica e articoli (es. "tra gli sviluppatori", mai "tra sviluppatori"). Nessun motto o titolo in inglese.
7. FEDELTÀ INFORMATIVA:
   - Mantieni ogni dato, fatto, numero e termine tecnico originale. Non inventare dettagli.
8. OUTPUT:
   - Restituisci ESCLUSIVAMENTE il testo finale revisionato.

${persona}
${aggressionRule}
`;
  }

  return `You are SKEW, a master human editor and author based on Wikipedia's 26 patterns ("Signs of AI writing" / Humanizer).
Your task is to rewrite AI-sounding prose so it reads like a human writer without changing what it says, systematically eliminating AI writing tells.

CORE DIRECTIVES (BASED ON WIKIPEDIA / BLADER 26 PATTERNS):
1. NO STAGED TELEGRAMS OR DRAMATIC CLOSERS (§2, §4):
   - Write cohesive, complete sentences and paragraphs. Never write choppy 1-3 word bullet fragments ("Complexity hits hard.", "Why? Simple.", "Result? Clear.").
2. CUT "NOT X BUT Y" CONTRASTS (§1):
   - Remove formulaic "It's not just X, it's Y" or "not only X, but also Y". State the claims directly.
3. CUT SHALLOW -ING RIDERS (§15):
   - Remove artificial trailing participles bolted onto facts ("..., highlighting the importance", "..., minimizing the risk", "..., laying the groundwork for"). State the consequence directly.
4. STRIP INFLATED SIGNIFICANCE & OVERUSED WORDS (§12, §13, §18):
   - Drop "stands as a testament", "plays a crucial/pivotal role", "rich tapestry", "furthermore", "in conclusion", "delve".
   - Avoid dodging "is, are, has" by replacing with "serves as", "acts as", "represents".
5. NO FORCED TRIADS (§6):
   - Do not group concepts into threes by rule.
6. 100% LANGUAGE FIDELITY:
   - Match the source language completely. Never invent English headlines for non-English text.
7. FACTUAL INTEGRITY:
   - Keep every technical term, fact, and claim. Do not invent details.
8. OUTPUT ONLY THE REWRITTEN TEXT without chatter or wrappers.

${persona}
${aggressionRule}
`;
}

import { localPrecisionHumanize } from './localEngine';

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

  const isItalian = /(?<!\p{L})(?:di|che|il|la|per|un|in|con|non|del|della|dei|sono|questo|questa|dobbiamo|sviluppatori|architettura|codice)(?!\p{L})/giu.test(text);
  const systemPrompt = buildHumanizerSystemPrompt({ mode, aggression }, isItalian);
  const userPrompt = isItalian
    ? `Riscrivi e umanizza questo testo in un italiano naturale, fluido e professionale, preservando tutti i concetti tecnici:\n\n${text}`
    : `Rewrite and humanize this text into natural, fluent, and engaging human writing, preserving all facts and technical terms:\n\n${text}`;

  // 1. Cloudflare Workers AI (Edge GPU Binding or Direct REST API)
  if (provider === 'cf-ai') {
    const chosenModel = model || env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

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
        const textOut = response.response || response.choices?.[0]?.message?.content || response.text;
        if (textOut) return textOut;
      } catch (err: any) {
        // Fallback to REST API if AI binding is unavailable in local dev
        if (!env.CLOUDFLARE_ACCOUNT_ID && !env.CLOUDFLARE_API_TOKEN && !apiKey) throw err;
      }
    }

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
      return data.result?.response || data.result?.choices?.[0]?.message?.content || data.result?.text || '';
    }

    throw new Error('Cloudflare Workers AI binding [env.AI] or CLOUDFLARE_ACCOUNT_ID & CLOUDFLARE_API_TOKEN is not configured.');
  }

  // 2. Groq
  if (provider === 'groq') {
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
        temperature: Number(temperature) || 0.8,
      })
    });
    if (!res.ok) throw new Error(`Groq error: ${await res.text()}`);
    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // 3. OpenAI or Custom
  if (provider === 'openai' || provider === 'custom') {
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
        temperature: Number(temperature) || 0.8,
      })
    });
    if (!res.ok) throw new Error(`OpenAI error: ${await res.text()}`);
    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // 4. Anthropic
  if (provider === 'anthropic') {
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
        temperature: Number(temperature) || 0.8,
      })
    });
    if (!res.ok) throw new Error(`Anthropic error: ${await res.text()}`);
    const data: any = await res.json();
    return data.content?.[0]?.text || '';
  }

  // 5. OpenRouter
  if (provider === 'openrouter') {
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
        temperature: Number(temperature) || 0.8,
      })
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${await res.text()}`);
    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // 6. Gemini
  if (provider === 'gemini') {
    const key = apiKey || env.GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API Key required.');
    const m = model || 'gemini-2.0-flash';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }] }],
        generationConfig: { temperature: Number(temperature) || 0.8 }
      })
    });
    if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
    const data: any = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // 7. Ollama
  if (provider === 'ollama') {
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
        options: { temperature: Number(temperature) || 0.8 }
      })
    });
    if (!res.ok) throw new Error(`Ollama error: ${await res.text()}`);
    const data: any = await res.json();
    return data?.message?.content || '';
  }

  // 8. Precision Local Engine (Offline / zero-model)
  if (provider === 'heuristic' || provider === 'local') {
    return heuristicHumanize(text, mode, aggression);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

