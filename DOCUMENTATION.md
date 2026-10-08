# SKEW — ARCHITECTURE & TECHNICAL DOCUMENTATION
# Minimalist, privacy-first AI text humanizer & humanity detector running natively on Cloudflare Workers.

================================================================================
TABLE OF CONTENTS
================================================================================
1. High-Level Overview
2. Core Pipeline
3. Models & Provider Strategy
4. Wikipedia / Blader 26 Patterns Implementation
5. SaaS & Tech Brochure Cliché Demolition
6. Built-in AI Detector & Sentence Heatmap
7. Precision Offline Heuristic Engine
8. API Reference
9. Deployment & Configuration

================================================================================
1. HIGH-LEVEL OVERVIEW
================================================================================
Skew is engineered to eliminate synthetic AI fingerprints from text and restore authentic,
human editorial rhythm without altering technical accuracy or factual claims.

Key Architecture Characteristics:
- Single-worker Cloudflare runtime: zero node/express overhead, zero external dependencies.
- Private Edge execution: prompts and texts processed directly on edge GPUs.
- Dual-engine architecture:
  * LLM-driven humanization with Mistral Small 3.1 24B / Llama 3.3 70B
  * Offline heuristic NLP transformer running deterministically at 0 ms latency
- Multi-layer AI detection engine with sentence-by-sentence classification.

================================================================================
2. CORE PIPELINE
================================================================================
When text is submitted to Skew, it passes through four distinct phases:

[Input Text]
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Engine Transformation                         │
│ • Cloudflare Workers AI (Mistral Small 3.1 24B default)│
│ • System prompt injected with contrastive dictionary   │
│ • Strict Wikipedia 26-tell and anti-marketing rules    │
│ • (Or offline deterministic localEngine at 0 ms)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Output Sanitizer & Anti-Chatter Stripper      │
│ • Strips conversational preambles ("Ecco il testo:")   │
│ • Removes post-rewrite bullet point explanation notes  │
│ • Deterministic replacement of stubborn cliches        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Cadence & Style Polish                        │
│ • Harmonizes sentence variety (22-35 word complex vs   │
│   7-12 word direct, bans 1-2 word artificial staccato) │
│ • Preserves technical precision and grammatical gender │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 4: Verification & Metrics Audit                  │
│ • Evaluates Burstiness (Sentence Length CV)            │
│ • Evaluates Lexical Diversity (Type-Token Ratio)       │
│ • Computes AI Detector probability & Sentence Heatmap  │
└────────────────────────────────────────────────────────┘

================================================================================
3. MODELS & PROVIDER STRATEGY
================================================================================
Default Model:
- `@cf/mistralai/mistral-small-3.1-24b-instruct`
  Why: Highest natural fluency for European & Romance languages (Italian, English,
  French, Spanish). Generates organic cadence without foreign slogans or synthetic
  staccato fragments.

Alternative Edge Models Available:
- `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (Meta flagship 70B, strong reasoning)
- `@cf/meta/llama-4-scout-17b-16e-instruct` (Fast MoE architecture)
- `@cf/qwen/qwen2.5-coder-32b-instruct` (Specialized in technical & software engineering prose)
- `@cf/qwen/qwen3.8-27b`
- `@cf/openai/gpt-oss-120b`

External Providers Supported via Settings [F2]:
- Groq (`llama-3.3-70b-versatile`)
- Ollama (`http://localhost:11434`, local offline LLM)
- OpenRouter, OpenAI (`gpt-4o-mini`), Anthropic (`claude-3-5-haiku`), Gemini (`gemini-2.0-flash`)

================================================================================
4. WIKIPEDIA / BLADER 26 PATTERNS IMPLEMENTATION
================================================================================
Based on Wikipedia's editorial essay "Signs of AI writing" (blader/humanizer):

1. §1 Not X but Y:
   Formulaic rhetorical opposition ("non solo X, ma anche Y" / "It's not just X, it's Y").
   Replaced with direct declarative statements.

2. §2, §4 Staged Telegrams & One-Line Closers:
   Bans artificial chopped fragments ("Code complexity hits hard.", "La chiave? La modularità.").
   Enforces complete, cohesive thoughts.

3. §15 Shallow -ing Riders:
   Trailing participles bolted onto facts to fake depth ("..., minimizzando il rischio",
   "..., laying the groundwork for", "..., ponendo le basi per").
   Transformed into coordinated clauses or direct consequences.

4. §12, §13, §18 Inflated Significance & Verb Evasions:
   Replaces periphrastic evasions ("rappresenta una sfida" -> "è una sfida",
   "stands as a testament" -> "proves that").
   Bans robotic buzzwords ("inoltre", "in conclusione", "tassello essenziale", "delve").

5. §6 Forced Triads:
   Prevents grouping concepts or adjectives into artificial groups of three.

================================================================================
5. SAAS & TECH BROCHURE CLICHÉ DEMOLITION
================================================================================
Dismantles the robotic "Feature → Positive Adjective → Generic Benefit" copywriting trope:

- "fondersi perfettamente nel flusso di lavoro"
  -> "integrarsi nel lavoro quotidiano" / "lavorare nel proprio ambiente"
- "architettura snella / reattività istantanea"
  -> "struttura leggera" / "risposta immediata" (avoids absolute claims like "senza latenza")
- "interfaccia pulita e intuitiva"
  -> "I comandi sono subito a portata di mano" / "interfaccia essenziale"
- "con un semplice clic"
  -> "rapide" / "subito" / "con un solo comando"
- "permettendo di monitorare / consentendo di gestire"
  -> ", così controlli" / "e permettono di organizzare"
- "assicura uniformità in ogni sessione"
  -> "mantiene allineato e coerente lo stato dell'applicazione"
  (replaces vague semantic plausibility with exact engineering precision)

================================================================================
6. BUILT-IN AI DETECTOR & SENTENCE HEATMAP
================================================================================
Located in `src/detector.ts`:
- Burstiness Index:
  Measures sentence length Coefficient of Variation (CV = stdDev / mean).
  AI models rigidly cluster around 16-24 words per sentence.
- Lexical Diversity:
  Type-Token Ratio (unique words / total words).
- Signature Cliché Density:
  Weighted audit from `src/lexicon.ts`.
- Sentence-by-Sentence Heatmap:
  Each sentence is evaluated independently:
  * 🟩 Human (<= 35% AI probability)
  * 🟨 Mixed (36% - 64% AI probability)
  * 🟥 AI (>= 65% AI probability with explicit reason tooltips)

================================================================================
7. PRECISION OFFLINE HEURISTIC ENGINE
================================================================================
Located in `src/localEngine.ts`:
- Operates at zero latency and zero token cost.
- Utilizes Unicode-aware regex transformation rules with grammatical agreement.
- 5 stylistic modes:
  * `natural`: balanced, organic human prose
  * `casual`: conversational, peer-to-peer tone
  * `academic`: scholarly, analytical, zero rigidity
  * `editorial`: journalistic, active verbs, punchy
  * `executive`: concise, pragmatic, zero fluff
- 3 aggression levels (`light`, `medium`, `aggressive`).

================================================================================
8. API REFERENCE
================================================================================
1. POST /api/humanize
   Payload:
   {
     "text": string,
     "provider"?: "cf-ai" | "heuristic" | "groq" | "ollama" | "openai" | ...,
     "model"?: string,
     "mode"?: "natural" | "casual" | "academic" | "editorial" | "executive",
     "aggression"?: "light" | "medium" | "aggressive",
     "temperature"?: number
   }
   Returns:
   {
     "success": true,
     "humanizedText": string,
     "originalMetrics": TextMetrics,
     "humanizedMetrics": TextMetrics
   }

2. POST /api/detect
   Payload:
   {
     "text": string
   }
   Returns:
   {
     "success": true,
     "detection": {
       "humanScore": number,
       "aiScore": number,
       "verdict": string,
       "burstinessScore": number,
       "lexicalDiversity": number,
       "clichesDetected": string[],
       "sentences": SentenceAnalysis[]
     }
   }

================================================================================
9. DEPLOYMENT & CONFIGURATION
================================================================================
Environment Variables (.dev.vars or Cloudflare Dashboard):
  CLOUDFLARE_ACCOUNT_ID=5409693716803be3df6614f05165ccdb
  CLOUDFLARE_API_TOKEN=<your_workers_ai_token>
  CLOUDFLARE_MODEL=@cf/mistralai/mistral-small-3.1-24b-instruct

Commands:
  npm install        # Install dev dependencies
  npm run dev        # Local dev worker with hot-reload
  npm run deploy     # Deploy directly to Cloudflare edge

