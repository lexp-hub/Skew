# Skew

Minimalist, privacy-first AI text humanizer & humanity detector running natively on **Cloudflare Workers**.

Powered by **Mistral Small 3.1 24B** on Cloudflare Workers AI edge GPUs, Wikipedia's 26 editorial humanization standards, and an integrated multi-layer AI detector.

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

## License

[MIT](LICENSE)
