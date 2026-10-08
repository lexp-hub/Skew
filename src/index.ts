/**
 * SKEW - Cloudflare Worker Entry Point
 */

import { renderDashboardHTML } from './ui';
import { processHumanizeRequest } from './humanizer';
import { analyzeTextMetrics } from './metrics';
import { detectHumanity } from './detector';

export interface Env {
  AI?: any; // Cloudflare Workers AI binding
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_MODEL?: string;
  OLLAMA_BASE_URL?: string;
  GROQ_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    // 1. Dashboard Homepage
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(renderDashboardHTML(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // 2. Humanize API Endpoint
    if (url.pathname === '/api/humanize' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const text = (body.text || '').trim();

        if (!text) {
          return new Response(
            JSON.stringify({ error: 'Text cannot be empty' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const originalMetrics = analyzeTextMetrics(text);
        const humanizedText = await processHumanizeRequest(body, env);
        const humanizedMetrics = analyzeTextMetrics(humanizedText);

        return new Response(
          JSON.stringify({
            success: true,
            humanizedText,
            originalMetrics,
            humanizedMetrics,
          }),
          { headers: corsHeaders }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || 'Processing error' }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // 2.5 AI Detection API Endpoint
    if (url.pathname === '/api/detect' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const text = (body.text || '').trim();

        if (!text) {
          return new Response(
            JSON.stringify({ error: 'Text cannot be empty' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const detection = detectHumanity(text);
        return new Response(
          JSON.stringify({
            success: true,
            detection
          }),
          { headers: corsHeaders }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || 'Detection error' }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // 3. Models Endpoint
    if (url.pathname === '/api/models' && request.method === 'GET') {
      const models = {
        hasWorkersAI: !!env.AI,
        providers: {
          'cf-ai': [
            '@cf/mistralai/mistral-small-3.1-24b-instruct',
            '@cf/meta/llama-4-scout-17b-16e-instruct',
            '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            '@cf/qwen/qwen2.5-coder-32b-instruct',
            '@cf/qwen/qwen3.8-27b',
            '@cf/openai/gpt-oss-120b'
          ],
          'heuristic': ['precision-nlp-engine', 'built-in-rules'],
          'groq': ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
          'ollama': ['llama3.2', 'mistral', 'qwen2.5'],
          'openrouter': ['meta-llama/llama-3.3-70b-instruct'],
          'openai': ['gpt-4o-mini', 'gpt-4o'],
          'anthropic': ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest'],
          'gemini': ['gemini-2.0-flash', 'gemini-1.5-flash'],
        },
      };

      return new Response(JSON.stringify(models), { headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404 });
  },
};

