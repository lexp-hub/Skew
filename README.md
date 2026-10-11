<div align="center">
  <img src="logo.svg" alt="Skew Logo" width="140" />
  <p align="center">
    <strong>Minimalist AI Text Humanizer &amp; Humanity Detector on Cloudflare Workers</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
    <img src="https://img.shields.io/badge/Default_Model-Mistral_Small_3.1_24B-FF7000?style=flat-square&logo=mistralai&logoColor=white" alt="Mistral Small 3.1 24B" />
    <img src="https://img.shields.io/badge/Standards-26_Wikipedia_Rules-3b82f6?style=flat-square&logo=wikipedia" alt="Wikipedia Standards" />
    <img src="https://img.shields.io/badge/Local_Engine-Offline_Precision_NLP-10b981?style=flat-square" alt="Offline Engine" />
    <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="License" />
  </p>
</div>

---

**Skew** is a lightweight, edge-native text humanizer and AI detector built on Cloudflare Workers. It strips synthetic chatbot markers, generic SaaS brochure clichés, and rigid transitional formulas, rewriting text with authentic human cadence.

- **Edge GPU Powered**: Uses `@cf/mistralai/mistral-small-3.1-24b-instruct` on Cloudflare Workers AI by default.
- **Offline Heuristic NLP**: Zero-model deterministic engine that runs with 0 ms latency and zero token cost.
- **Auto-Refinement Loop**: Iteratively benchmarks candidate text against AI detection heuristics until the target human probability is achieved.
- **Wikipedia Editorial Standards**: Enforces the 26 structural rules from Wikipedia's *"Signs of AI writing"* (no shallow *-ing* riders, no *"Not X but Y"*, no inflated verbs).
- **Ensemble Multi-Detector Consensus**: Real-time sentence heatmap that models 5 major detector architectures (GPTZero, Copyleaks, Turnitin, Sapling, Zero-Shot/Wikipedia) and computes the consensus average across all of them.

For architecture details, regex models, and full API documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).

---

## Citations & Methodology Attribution

Skew's detector evaluation and burstiness metrics are inspired by published open methodologies and research from:
- **GPTZero** (Edward Tian) — Perplexity & Burstiness analysis framework.
- **Binoculars & RoBERTa** — Zero-shot cross-entropy detection baselines.
- **Wikipedia WikiProject AI Cleanup** — 26 stylistic markers of AI-generated prose.

> **Legal Disclaimer:** Skew is an independent open-source tool and is **NOT** affiliated with, sponsored by, or endorsed by GPTZero, Copyleaks, Turnitin, Sapling, or OpenAI. All trademarks and brand names belong to their respective owners and are referenced solely for technical context and educational comparison.

---

## License

[MIT](LICENSE)
