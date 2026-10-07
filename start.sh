#!/usr/bin/env bash
# Skew Cloudflare Worker startup script
export PATH="/home/lex/.local/nodejs/bin:$PATH"

echo "============================================="
echo "  SKEW // CLOUDFLARE WORKER"
echo "  Zero-dependency Edge AI Humanizer"
echo "============================================="

npx wrangler dev --port 8787 --ip 0.0.0.0
