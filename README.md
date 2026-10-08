# Skew

Minimalist, privacy-first AI text humanizer & humanity detector running natively on **Cloudflare Workers**.

Powered by **Mistral Small 3.1 24B** on Cloudflare Workers AI edge GPUs, Wikipedia's 26 editorial humanization standards, and an integrated multi-layer AI detector.

---

## Highlights

- **Edge GPU Acceleration (Default: Mistral Small 3.1 24B)**:
  - Powered by `@cf/mistralai/mistral-small-3.1-24b-instruct` on Cloudflare Workers AI.
  - Chosen for superior European & Italian linguistic fluidity, natural rhythm, and absence of synthetic anglicisms.
  - Also supports Meta Llama 3.3 70B Fast, Llama 4 Scout 17B, and Qwen 2.5 Coder 32B.
- **Offline Precision Heuristic Engine (Zero Models / Zero Token Cost)**:
  - High-precision deterministic NLP transformer running 100% locally with Unicode-aware de-nominalizations, active voice conversions, and cadence sculpting.
- **26 Wikipedia / Blader Editorial Standards**:
  - Eliminates the 26 structural tells of chatbot prose: shallow *-ing* tail riders, inflated significance, formulaic *"non solo X ma Y"*, robotic connectors (*"inoltre"*, *"in conclusione"*), and forced triads.
- **Anti-Brochure & Tech Marketing Copy Detection**:
  - Dismantles the robotic *"Feature → Generic Adjective → Vague Benefit"* SaaS trope (*"fondersi perfettamente"*, *"architettura snella"*, *"reattività istantanea"*, *"con un semplice clic"*, *"assicura uniformità"*).
- **Built-in AI Detector & Sentence-by-Sentence Heatmap**:
  - Independent detection engine inspired by GPTZero and Binoculars.
  - Measures Burstiness (Coefficient of Variation), Lexical Diversity (TTR), Cliché Density, and highlights every sentence in real-time (Green = Likely Human, Yellow = Mixed, Red = AI signature).
- **Zero Third-Party Runtime Dependencies**:
  - Everything is compiled into a single ultra-fast Cloudflare Worker (`wrangler dev` / `wrangler deploy`).

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │            Source Text Input           │
                      └──────────────────┬─────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
       ┌───────────────────────┐                   ┌───────────────────────┐
       │  Cloudflare Workers AI │                   │ Local Heuristic Engine │
       │   (Mistral Small 3.1) │                   │  (Deterministic NLP)  │
       └───────────┬───────────┘                   └───────────┬───────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    Deterministic Output Sanitizer      │
                      │  (Strips chatter & stubborn clichés)   │
                      └──────────────────┬─────────────────────┘
                                         ▼
                      ┌────────────────────────────────────────┐
                      │  AI Detector & Sentence Heatmap Audit  │
                      └──────────────────┬─────────────────────┘
                                         ▼
                      ┌────────────────────────────────────────┐
                      │     Clean, Humanized & Scored Text     │
                      └────────────────────────────────────────┘
```

---

## Configuration & Environment Variables

Skew uses Cloudflare Workers AI by default. Create a `.dev.vars` (for local development) or configure via Cloudflare dashboard:

```env
CLOUDFLARE_ACCOUNT_ID=5409693716803be3df6614f05165ccdb
CLOUDFLARE_API_TOKEN=your_cloudflare_workers_ai_token
CLOUDFLARE_MODEL=@cf/mistralai/mistral-small-3.1-24b-instruct
```

> **Note**: Users can also configure custom API keys or toggle alternative providers directly in the browser dashboard via the `⚙ CONFIG [F2]` modal (stored securely in `localStorage`).

---

## API Endpoints

### 1. `POST /api/humanize`
Rewrites and humanizes text using the selected engine.

**Request:**
```json
{
  "text": "È fondamentale adottare un approccio modulare, minimizzando il debito tecnico...",
  "provider": "cf-ai",
  "model": "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "mode": "natural",
  "aggression": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "humanizedText": "Suddividere il codice in moduli indipendenti riduce il debito tecnico alla radice...",
  "originalMetrics": { "humanScore": 5, "burstinessScore": 28, "clichesFound": ["è fondamentale"] },
  "humanizedMetrics": { "humanScore": 75, "burstinessScore": 68, "clichesFound": [] }
}
```

### 2. `POST /api/detect`
Audits and scores text humanity without rewriting.

**Request:**
```json
{
  "text": "Un modulo costruito per fondersi perfettamente nel flusso di lavoro quotidiano..."
}
```

**Response:**
```json
{
  "success": true,
  "detection": {
    "humanScore": 5,
    "aiScore": 95,
    "verdict": "DEFINITELY AI",
    "burstinessScore": 20,
    "lexicalDiversity": 70,
    "clichesDetected": ["fondersi perfettamente", "architettura snella", "reattività istantanea"],
    "sentences": [
      {
        "text": "Un modulo costruito per fondersi perfettamente...",
        "aiProbability": 95,
        "classification": "ai",
        "reasons": ["Contains AI signature: \"fondersi perfettamente\"", "Generic SaaS marketing brochure cliché"]
      }
    ]
  }
}
```

---

## Development

```bash
# Install dependencies
npm install

# Start local worker with hot-reload
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

---

## License

[MIT](LICENSE)
