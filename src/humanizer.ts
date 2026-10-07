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

export function buildHumanizerSystemPrompt(options: HumanizeOptions): string {
  const { mode, aggression } = options;

  let persona = "";
  switch (mode) {
    case 'casual':
      persona = `Tone: Relaxed, friendly, conversational. Use colloquialisms, contractions (don't, can't, it's), and natural casual phrasing as if talking to a friend.`;
      break;
    case 'academic':
      persona = `Tone: Scholarly, analytical, rigorous, yet organic. Never use robotic formula transitions ('Furthermore', 'Moreover', 'In conclusion', 'It is worth noting'). Use nuanced contextual transitions and authentic subordinate clauses.`;
      break;
    case 'editorial':
      persona = `Tone: Punchy, journalistic, observant, engaging. Strong active verbs, short impactful leads paired with deeper sentences. Eliminate passive voice.`;
      break;
    case 'executive':
      persona = `Tone: Direct, clear, pragmatic executive communication. Cut all fluff and corporate buzzwords ('pivotal', 'in today's world'). Get straight to the point.`;
      break;
    case 'natural':
    default:
      persona = `Tone: Authentic, engaging, human, and balanced. Natural rhythm of organic writing mixing punchy statements with flowing thoughts.`;
      break;
  }

  let aggressionRule = "";
  switch (aggression) {
    case 'light':
      aggressionRule = `Aggressiveness: LIGHT. Retain sentence sequence. Eliminate AI markers and break monotonous lengths with subtle adjustments.`;
      break;
    case 'aggressive':
      aggressionRule = `Aggressiveness: DEEP REWRITE. Thoroughly restructure paragraphs and cadence from scratch while preserving key facts and message. Inject strong burstiness.`;
      break;
    case 'medium':
    default:
      aggressionRule = `Aggressiveness: BALANCED. Restructure sentences to vary rhythm, diversify vocabulary, and eliminate predictable patterns.`;
      break;
  }

  return `You are SKEW, an open-source text humanizer.
Your mission is to rewrite synthetic AI text into genuinely human, organic writing that breaks statistical predictability.

CRITICAL DIRECTIVES:
1. HIGH BURSTINESS:
   - Mix ultra-short sentences (2-5 words) with rich, flowing sentences (20-30 words).
   - Never write three consecutive sentences of similar word count.

2. FORBIDDEN AI MARKERS & CLICHES:
   - English: "delve", "tapestry", "testament to", "beacon", "pivotal", "in the realm of", "furthermore", "moreover", "in conclusion", "crucial/vital role", "embark", "unravel", "ever-evolving landscape", "foster", "holistic".
   - Italian: "è fondamentale sottolineare", "in conclusione", "inoltre", "un mosaico di", "svolge un ruolo cruciale/fondamentale", "vale la pena notare", "viaggio trasformativo".
   - Replace generic fluff with clear, specific, natural expressions.

3. VOCABULARY & IDIOMS:
   - Use active voice, natural idioms, and varied sentence starters.
   - Match the exact language of the original text (e.g. Italian in -> authentic Italian out; English in -> English out).

4. OUTPUT ONLY THE HUMANIZED TEXT:
   - No introductory or concluding remarks (no "Here is the rewritten text:").
   - Output pure text only.

${persona}
${aggressionRule}
`;
}

// Built-in rule-based humanizer
const REPLACEMENTS: Record<string, string[]> = {
  "delve into": ["explore", "look into", "examine", "dig into"],
  "delves into": ["explores", "looks into", "breaks down"],
  "a testament to": ["proof of", "evidence of", "shows clearly"],
  "testament to": ["proof of", "evidence of"],
  "rich tapestry": ["complex mix", "mosaic", "wide blend"],
  "tapestry of": ["collection of", "variety of", "blend of"],
  "pivotal role": ["key part", "big difference", "major impact"],
  "pivotal": ["crucial", "central", "key"],
  "in the realm of": ["in", "within", "when looking at"],
  "it is important to remember that": ["remember,", "keep in mind that,", "notably,"],
  "it is worth noting that": ["notably,", "also,", "interestingly,"],
  "furthermore,": ["also,", "on top of that,", "plus,"],
  "moreover,": ["and what's more,", "beside that,", "also,"],
  "in conclusion,": ["all in all,", "at the end of the day,", "bottom line:"],
  "plays a crucial role": ["matters a lot", "makes a big impact", "is essential"],
  "plays a vital role": ["is essential", "matters deeply", "is critical"],
  "ever-evolving landscape": ["shifting environment", "changing scene", "industry"],
  "dynamic landscape": ["fast-paced space", "active field", "scene"],

  "è fondamentale sottolineare che": ["vale la pena notare che", "ricordiamo che", "va detto che"],
  "svolge un ruolo cruciale": ["conta moltissimo", "è davvero centrale", "fa la differenza"],
  "svolge un ruolo fondamentale": ["ha un peso enorme", "è decisivo", "fa la differenza"],
  "in conclusione,": ["in sintesi,", "tirando le somme,", "in breve,"],
  "inoltre,": ["in più,", "per di più,", "d'altronde,"],
  "un mosaico di": ["un insieme vario di", "un mix di"],
  "un testamento a": ["una chiara dimostrazione di", "la prova di"],
  "nel regno di": ["nell'ambito di", "per quanto riguarda"],
  "vale la pena notare che": ["notiamo che", "interessante come"],
  "panorama in continua evoluzione": ["settore che cambia in fretta", "scenario attuale"],
};

export function heuristicHumanize(text: string, mode: string = 'natural'): string {
  let result = text;
  for (const [phrase, alternatives] of Object.entries(REPLACEMENTS)) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    if (regex.test(result)) {
      const chosen = alternatives[Math.floor(Math.random() * alternatives.length)];
      result = result.replace(regex, chosen);
    }
  }

  if (mode === 'casual' || mode === 'editorial') {
    result = result
      .replace(/\bdo not\b/g, "don't")
      .replace(/\bcannot\b/g, "can't")
      .replace(/\bit is\b/g, "it's")
      .replace(/\bthat is\b/g, "that's")
      .replace(/\bthere is\b/g, "there's")
      .replace(/\bwe are\b/g, "we're")
      .replace(/\bnon è vero che\b/gi, "non crediate che")
      .replace(/\bpertanto\b/gi, "quindi")
      .replace(/\bpoiché\b/gi, "dato che");
  }

  return result;
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
    temperature = 0.8,
  } = payload;

  const systemPrompt = buildHumanizerSystemPrompt({ mode, aggression });
  const userPrompt = `Rewrite and humanize this text following the instructions. Preserve all facts and meaning, but eliminate synthetic AI markers and inject natural burstiness:\n\n${text}`;

  // 1. Cloudflare Workers AI (Edge GPU)
  if (provider === 'cf-ai') {
    if (!env.AI) {
      throw new Error('Cloudflare Workers AI binding [env.AI] is not configured. Use heuristic or set an API key.');
    }
    const chosenModel = model || '@cf/meta/llama-3.3-70b-instruct';
    const response = await env.AI.run(chosenModel, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: Number(temperature) || 0.8,
    });
    return response.response || response.text || '';
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

  // 8. Heuristic (Offline default)
  if (provider === 'heuristic') {
    return heuristicHumanize(text, mode);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

