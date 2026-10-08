/**
 * SKEW - Minimalist Monospace Dashboard
 * Embedded directly in the Cloudflare Worker with zero external runtime dependencies.
 */

import { ALL_AUDIT_CLICHES } from './lexicon';

export function renderDashboardHTML(): string {
  const clientClichesJson = JSON.stringify(ALL_AUDIT_CLICHES.map(c => c.phrase));
  return `<!DOCTYPE html>

<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SKEW // Open-Source AI Text Humanizer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0c0d12;
      --surface: #13151c;
      --card: #181a24;
      --border: #242735;
      --border-hover: #3b3f54;
      --accent: #10b981;
      --accent-hover: #059669;
      --accent-text: #000000;
      --text: #f1f3f9;
      --muted: #81889c;
      --danger: #ef4444;
      --danger-bg: #450a0a;
      --warning: #f59e0b;
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--mono);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: var(--accent); color: #000; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); }
    ::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }

    /* Layout Components */
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 10px 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      user-select: none;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-badge {
      background: var(--accent);
      color: #000;
      font-weight: 800;
      font-size: 11px;
      padding: 3px 8px;
      letter-spacing: 1px;
    }
    .brand-sub {
      color: var(--muted);
      font-size: 11px;
    }
    .provider-pill {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 11px;
      padding: 3px 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
    }
    .provider-pill:hover { border-color: var(--accent); }
    .provider-dot {
      width: 6px;
      height: 6px;
      background: var(--accent);
      display: inline-block;
    }
    .nav-controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn-group {
      display: flex;
      border: 1px solid var(--border);
      background: var(--bg);
    }
    .btn-group button {
      background: transparent;
      border: none;
      color: var(--muted);
      font-family: inherit;
      font-size: 11px;
      padding: 5px 10px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-group button.active {
      background: #e2e8f0;
      color: #000;
      font-weight: 700;
    }
    .btn-group.aggression button.active {
      background: var(--accent);
      color: #000;
      font-weight: 700;
    }
    .btn-icon {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: inherit;
      font-size: 11px;
      padding: 5px 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-icon:hover { background: #1f222e; }

    /* Workspace */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 14px;
      gap: 12px;
      max-width: 1700px;
      width: 100%;
      margin: 0 auto;
    }
    .workspace {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      min-height: 520px;
    }
    @media (max-width: 900px) {
      .workspace { grid-template-columns: 1fr; }
    }
    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      background: var(--card);
      border-bottom: 1px solid var(--border);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      user-select: none;
    }
    .panel-title {
      font-weight: 700;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .panel-tools {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tag-sm {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 10px;
      padding: 2px 6px;
      cursor: pointer;
      font-family: inherit;
    }
    .tag-sm:hover { color: #fff; border-color: #555; }
    .tag-cliche {
      background: var(--danger-bg);
      border: 1px solid var(--danger);
      color: #fca5a5;
      font-size: 10px;
      padding: 2px 6px;
    }

    .editor-container {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    textarea {
      width: 100%;
      height: 100%;
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      line-height: 1.6;
      padding: 14px;
      resize: none;
    }
    .panel-footer {
      background: var(--card);
      border-top: 1px solid var(--border);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--muted);
    }

    /* Output Tabs */
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--muted);
      font-family: inherit;
      font-size: 11px;
      padding: 4px 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .tab-btn.active {
      background: #e2e8f0;
      color: #000;
    }

    /* Diff View */
    .diff-container {
      padding: 14px;
      overflow-y: auto;
      font-size: 13px;
      line-height: 1.7;
      white-space: pre-wrap;
      flex: 1;
    }
    .diff-ins {
      background: #064e3b;
      color: #6ee7b7;
      border-bottom: 2px solid var(--accent);
      padding: 1px 4px;
      margin: 0 1px;
    }
    .diff-del {
      background: #450a0a;
      color: #fca5a5;
      text-decoration: line-through;
      border-bottom: 2px solid #ef4444;
      padding: 1px 4px;
      margin: 0 1px;
      opacity: 0.8;
    }

    /* Metrics Audit */
    .metrics-container {
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 12px;
      flex: 1;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .metric-box {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 12px;
    }
    .metric-box.after { border-color: var(--accent); }
    .metric-val {
      font-size: 26px;
      font-weight: 800;
      margin: 4px 0;
    }
    .metric-progress {
      width: 100%;
      height: 6px;
      background: var(--card);
      border: 1px solid var(--border);
      margin-top: 6px;
    }
    .metric-fill {
      height: 100%;
      background: var(--accent);
      transition: width 0.3s;
    }

    /* AI Detector View */
    .detector-container {
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 12px;
      flex: 1;
    }
    .detector-scorecard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .verdict-badge {
      display: inline-block;
      padding: 4px 10px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.5px;
      border: 1px solid currentColor;
      margin-top: 6px;
    }
    .heat-text {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 14px;
      line-height: 1.8;
      font-size: 13px;
    }
    .heat-sent {
      padding: 2px 4px;
      border-radius: 2px;
      margin: 0 1px;
      transition: background 0.2s;
      cursor: help;
    }
    .heat-sent.ai { background: rgba(239, 68, 68, 0.25); border-bottom: 2px solid #ef4444; }
    .heat-sent.mixed { background: rgba(234, 179, 8, 0.22); border-bottom: 2px solid #eab308; }
    .heat-sent.human { background: rgba(16, 185, 129, 0.20); border-bottom: 2px solid #10b981; }

    /* Progress Bar */
    .progress-bar-container {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 8px 16px;
      display: none;
    }
    .progress-bar-header {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 6px;
      font-weight: 600;
    }
    .progress-bar-track {
      width: 100%;
      height: 6px;
      background: var(--card);
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10b981, #06b6d4, #10b981);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
      transition: width 0.35s ease;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .btn-toggle-active {
      background: rgba(16, 185, 129, 0.15) !important;
      border-color: var(--accent) !important;
      color: var(--accent) !important;
      font-weight: 700;
    }
    .citation-box {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 10px 14px;
      font-size: 11px;
      color: var(--muted);
      line-height: 1.6;
    }
    .benchmark-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-top: 6px;
    }
    .benchmark-card {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 8px;
      text-align: center;
    }
    .benchmark-val {
      font-size: 18px;
      font-weight: 800;
      margin: 2px 0;
    }
    .action-bar {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-humanize {
      background: var(--accent);
      color: #000;
      border: none;
      font-family: inherit;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 1px;
      padding: 10px 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-humanize:hover { background: var(--accent-hover); }
    .btn-humanize:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-overlay.open { display: flex; }
    .modal-card {
      background: var(--surface);
      border: 2px solid var(--border);
      max-width: 650px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .modal-head {
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
    }
    .modal-body {
      padding: 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 12px;
    }
    .modal-foot {
      background: var(--bg);
      border-top: 1px solid var(--border);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .form-group label {
      display: block;
      color: var(--muted);
      font-size: 11px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .form-group input, .form-group select {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: inherit;
      font-size: 12px;
      padding: 8px 10px;
      outline: none;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: var(--accent);
    }
    .provider-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    @media (max-width: 600px) {
      .provider-grid { grid-template-columns: 1fr 1fr; }
    }
    .provider-btn {
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: inherit;
      font-size: 11px;
      padding: 8px;
      cursor: pointer;
      text-align: left;
    }
    .provider-btn.selected {
      border-color: var(--accent);
      background: #064e3b;
      color: #6ee7b7;
    }
    .error-banner {
      background: #450a0a;
      border: 1px solid #ef4444;
      color: #fca5a5;
      padding: 8px 12px;
      font-size: 11px;
      display: none;
    }
  </style>
</head>
<body>

  <!-- Top Bar -->
  <header>
    <div class="brand">
      <span class="brand-badge">SKEW</span>
      <button class="provider-pill" id="pillConfig">
        <span class="provider-dot"></span>
        <span id="pillProviderLabel">CF-AI (MISTRAL SMALL 3.1)</span>
      </button>
    </div>

    <div class="nav-controls">
      <!-- Mode Group -->
      <div class="btn-group" id="modeGroup">
        <button class="active" data-mode="natural">NATURAL</button>
        <button data-mode="casual">CASUAL</button>
        <button data-mode="academic">ACADEMIC</button>
        <button data-mode="editorial">EDITORIAL</button>
        <button data-mode="executive">EXECUTIVE</button>
      </div>

      <!-- Aggression Group -->
      <div class="btn-group aggression" id="aggressionGroup">
        <button data-agg="light">LIGHT</button>
        <button class="active" data-agg="medium">BALANCED</button>
        <button data-agg="aggressive">DEEP</button>
      </div>

      <!-- Config button -->
      <button class="btn-icon" id="btnOpenSettings">⚙ CONFIG [F2]</button>
    </div>
  </header>

  <!-- Error banner -->
  <div id="errorBanner" class="error-banner"></div>

  <!-- Progress Bar & Multi-detector status -->
  <div id="progressWrapper" class="progress-bar-container">
    <div class="progress-bar-header">
      <span id="progressStepTitle">// AUTO-REFINING TEXT...</span>
      <span id="progressPercent">0%</span>
    </div>
    <div class="progress-bar-track">
      <div class="progress-bar-fill" id="progressBar"></div>
    </div>
  </div>

  <!-- Workspace -->
  <main>
    <div class="workspace">
      <!-- Left Panel: Input -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>// 01. SOURCE TEXT</span>
            <span id="inputClicheBadge" style="display:none;" class="tag-cliche">0 CLICHÉS</span>
          </div>
          <div class="panel-tools">
            <button class="tag-sm" id="btnTestIt">TEST IT</button>
            <button class="tag-sm" id="btnTestEn">TEST EN</button>
            <button class="tag-sm" id="btnPaste">PASTE</button>
            <button class="tag-sm" id="btnClear">CLEAR</button>
          </div>
        </div>
        <div class="editor-container">
          <textarea id="inputText" placeholder="Paste synthetic AI text here...&#10;&#10;Use TEST EN or TEST IT buttons to load sample text, then press [CTRL + ENTER]."></textarea>
        </div>
        <div class="panel-footer">
          <div>
            WORDS: <span id="inWords">0</span> | CHARS: <span id="inChars">0</span>
          </div>
          <div>
            BURSTINESS: <span id="inBurst">0%</span> | SCORE: <span id="inScore" style="color:var(--accent);">50%</span>
          </div>
        </div>
      </div>

      <!-- Right Panel: Output -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-tools">
            <button class="tab-btn active" data-tab="text">01. HUMANIZED</button>
            <button class="tab-btn" data-tab="diff">02. DIFF INSPECTOR</button>
            <button class="tab-btn" data-tab="metrics">03. METRICS AUDIT</button>
            <button class="tab-btn" data-tab="detector">04. AI DETECTOR</button>
          </div>
          <div class="panel-tools">
            <button class="tag-sm" id="btnCopy">COPY</button>
            <button class="tag-sm" id="btnDownload">EXPORT</button>
          </div>
        </div>

        <div class="editor-container">
          <!-- Text View -->
          <textarea id="outputText" placeholder="Humanized text will appear here..." readonly></textarea>

          <!-- Diff View -->
          <div id="diffView" class="diff-container" style="display:none;"></div>

          <!-- Metrics View -->
          <div id="metricsView" class="metrics-container" style="display:none;">
            <div class="metric-grid">
              <div class="metric-box">
                <div style="color:var(--muted); font-size:10px;">BEFORE (ORIGINAL)</div>
                <div class="metric-val" id="auditScoreBefore" style="color:var(--warning);">--%</div>
                <div style="color:var(--muted); font-size:10px;">HUMAN PROBABILITY</div>
              </div>
              <div class="metric-box after">
                <div style="color:var(--accent); font-size:10px;">AFTER (SKEW)</div>
                <div class="metric-val" id="auditScoreAfter" style="color:var(--accent);">--%</div>
                <div style="color:var(--accent); font-size:10px;">HUMAN PROBABILITY</div>
              </div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between;">
                <b>BURSTINESS INDEX</b>
                <span id="auditBurstDiff">0% → 0%</span>
              </div>
              <div class="metric-progress">
                <div class="metric-fill" id="auditBurstBar" style="width:0%;"></div>
              </div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between;">
                <b>LEXICAL DIVERSITY (TTR)</b>
                <span id="auditLexDiff">0% → 0%</span>
              </div>
              <div class="metric-progress">
                <div class="metric-fill" id="auditLexBar" style="width:0%; background:#06b6d4;"></div>
              </div>
            </div>

            <div class="metric-box">
              <b style="display:block; margin-bottom:6px;">AI CLICHÉS STRIPPED:</b>
              <div id="auditClichesList" style="color:var(--muted); font-size:11px;">No clichés detected.</div>
            </div>
          </div>

          <!-- AI Detector View -->
          <div id="detectorView" class="detector-container" style="display:none;">
            <div class="detector-scorecard">
              <div class="metric-box" style="border-left: 3px solid var(--accent);">
                <div style="color:var(--muted); font-size:10px;">CONSENSUS HUMAN SCORE (5-DETECTOR AVERAGE)</div>
                <div class="metric-val" id="detHumanScore" style="color:var(--accent);">--%</div>
                <div id="detVerdictBadge" class="verdict-badge" style="color:var(--accent);">AWAITING SCAN</div>
              </div>
              <div class="metric-box" style="border-left: 3px solid #ef4444;">
                <div style="color:var(--muted); font-size:10px;">SYNTHETIC AI PROBABILITY (AVERAGE)</div>
                <div class="metric-val" id="detAiScore" style="color:#ef4444;">--%</div>
                <div style="color:var(--muted); font-size:10px; margin-top:6px;">BURSTINESS: <span id="detBurst">--%</span> | PERPLEXITY: <span id="detPerp">--%</span></div>
              </div>
            </div>

            <!-- Multi-Detector Benchmarks -->
            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <b>MULTI-DETECTOR ENSEMBLE BENCHMARKS:</b>
                <span style="color:var(--accent); font-size:10px;">AVERAGE CONSENSUS</span>
              </div>
              <div class="benchmark-grid">
                <div class="benchmark-card">
                  <div style="color:var(--muted); font-size:10px;">GPTZERO</div>
                  <div class="benchmark-val" id="bmGptZero" style="color:var(--accent);">--%</div>
                  <div style="font-size:9px; color:var(--muted);" id="bmGptZeroVerdict">AWAITING</div>
                </div>
                <div class="benchmark-card">
                  <div style="color:var(--muted); font-size:10px;">COPYLEAKS</div>
                  <div class="benchmark-val" id="bmCopyleaks" style="color:#06b6d4;">--%</div>
                  <div style="font-size:9px; color:var(--muted);" id="bmCopyleaksVerdict">AWAITING</div>
                </div>
                <div class="benchmark-card">
                  <div style="color:var(--muted); font-size:10px;">TURNITIN</div>
                  <div class="benchmark-val" id="bmTurnitin" style="color:#f59e0b;">--%</div>
                  <div style="font-size:9px; color:var(--muted);" id="bmTurnitinVerdict">AWAITING</div>
                </div>
                <div class="benchmark-card">
                  <div style="color:var(--muted); font-size:10px;">SAPLING</div>
                  <div class="benchmark-val" id="bmSapling" style="color:#a855f7;">--%</div>
                  <div style="font-size:9px; color:var(--muted);" id="bmSaplingVerdict">AWAITING</div>
                </div>
                <div class="benchmark-card">
                  <div style="color:var(--muted); font-size:10px;">WIKI / ZERO-SHOT</div>
                  <div class="benchmark-val" id="bmZeroShot" style="color:#10b981;">--%</div>
                  <div style="font-size:9px; color:var(--muted);" id="bmZeroShotVerdict">AWAITING</div>
                </div>
                <div class="benchmark-card" style="border-color:var(--accent);">
                  <div style="color:var(--accent); font-size:10px;">ENSEMBLE MEAN</div>
                  <div class="benchmark-val" id="bmAverage" style="color:var(--accent);">--%</div>
                  <div style="font-size:9px; color:var(--accent);">5-MODEL AVERAGE</div>
                </div>
              </div>
            </div>

            <!-- Auto-Refine Iterations Box -->
            <div id="iterationHistoryBox" class="metric-box" style="display:none;">
              <b style="display:block; margin-bottom:6px; color:var(--accent);">AUTOMATED REFINEMENT HISTORY:</b>
              <div id="iterationHistoryList" style="font-size:11px;"></div>
            </div>

            <!-- Heatmap -->
            <div class="metric-box">
              <b style="display:block; margin-bottom:6px;">SENTENCE-BY-SENTENCE HEATMAP AUDIT:</b>
              <div style="color:var(--muted); font-size:10px; margin-bottom:10px;">
                <span style="color:#10b981;">■ Green: Likely Human</span> &nbsp;|&nbsp;
                <span style="color:#eab308;">■ Yellow: Uncertain / Mixed</span> &nbsp;|&nbsp;
                <span style="color:#ef4444;">■ Red: High AI Signature</span>
              </div>
              <div id="detHeatmapContainer" class="heat-text">Click "DETECTOR AUDIT" or run the humanizer to view sentence analysis.</div>
            </div>

            <!-- Legal Citations & Attribution Box -->
            <div class="citation-box">
              <b style="color:var(--text); display:block; margin-bottom:4px;">METHODOLOGY CITATIONS & LEGAL DISCLAIMER:</b>
              Detection and burstiness heuristics are inspired by research methodologies from <b>GPTZero</b> (Perplexity & Burstiness analysis by Edward Tian), <b>Binoculars</b> (zero-shot LLM detection), and the <b>Wikipedia AI Cleanup</b> stylistic guidelines.
              <span style="opacity:0.75; display:block; margin-top:4px;">Notice: Skew is an independent open-source project and is NOT affiliated with, endorsed by, or sponsored by GPTZero, Copyleaks, Turnitin, Sapling, or OpenAI. All trademarks belong to their respective owners.</span>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <div>
            WORDS: <span id="outWords">0</span> | CHARS: <span id="outChars">0</span>
          </div>
          <div>
            BURSTINESS: <span id="outBurst">0%</span> | <span id="latencyTag">READY</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div style="color:var(--muted); font-size:11px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span>SHORTCUT: <code style="background:var(--card); border:1px solid var(--border); padding:2px 6px; color:#fff;">CTRL + ENTER</code></span>
        <button class="tag-sm btn-toggle-active" id="btnToggleAutoRefine" title="Auto-refines until human probability meets target">⚡ AUTO-REFINE: ON</button>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="tag-sm" id="btnRepass" style="display:none; padding:8px 14px;">↺ RE-PASS</button>
        <button class="tag-sm" id="btnVerifyScan" style="padding:8px 14px; background:#1e293b; color:#38bdf8; border:1px solid #0284c7;">🔍 DETECTOR AUDIT</button>
        <button class="btn-humanize" id="btnRun">
          <span>HUMANIZE TEXT</span> ↵
        </button>
      </div>
    </div>
  </main>

  <!-- Settings Modal -->
  <div class="modal-overlay" id="settingsModal">
    <div class="modal-card">
      <div class="modal-head">
        <span>ENGINE CONFIGURATION</span>
        <button id="btnCloseSettings" style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px;">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>SELECT LLM PROVIDER:</label>
          <div class="provider-grid">
            <button class="provider-btn selected" data-prov="cf-ai"><b>CLOUDFLARE AI</b><br><small>Zero Setup / Free Edge GPU</small></button>
            <button class="provider-btn" data-prov="heuristic"><b>LOCAL ENGINE</b><br><small>Zero Models / Precision NLP</small></button>
            <button class="provider-btn" data-prov="groq"><b>GROQ</b><br><small>Llama 3.3 Ultra-fast</small></button>
            <button class="provider-btn" data-prov="ollama"><b>OLLAMA</b><br><small>Local (localhost:11434)</small></button>
            <button class="provider-btn" data-prov="openrouter"><b>OPENROUTER</b><br><small>Open Model Hub</small></button>
            <button class="provider-btn" data-prov="openai"><b>OPENAI</b><br><small>GPT-4o mini</small></button>
            <button class="provider-btn" data-prov="anthropic"><b>ANTHROPIC</b><br><small>Claude 3.5</small></button>
            <button class="provider-btn" data-prov="gemini"><b>GEMINI</b><br><small>Google Gemini 2.0</small></button>
          </div>
        </div>

        <div class="form-group">
          <label>MODEL:</label>
          <input type="text" id="cfgModel" list="modelSuggestions" value="@cf/mistralai/mistral-small-3.1-24b-instruct" placeholder="Model name...">
          <datalist id="modelSuggestions">
            <option value="@cf/mistralai/mistral-small-3.1-24b-instruct">Mistral Small 3.1 24B (Migliore per Italiano & Prosa fluida)</option>
            <option value="@cf/meta/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B (Nuova architettura MoE veloce)</option>
            <option value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">Llama 3.3 70B Fast (Meta flagship 70B)</option>
            <option value="@cf/qwen/qwen2.5-coder-32b-instruct">Qwen 2.5 Coder 32B (Testi tecnici & architettura software)</option>
            <option value="@cf/qwen/qwen3.8-27b">Qwen 3.8 27B (High-performance general purpose)</option>
            <option value="@cf/openai/gpt-oss-120b">OpenAI GPT-OSS 120B (Modello 120B)</option>
          </datalist>
        </div>

        <div class="form-group" id="cfgKeyGroup" style="display:none;">
          <label>API KEY (Stored locally in browser):</label>
          <input type="password" id="cfgApiKey" placeholder="Enter API Key...">
        </div>

        <div class="form-group" id="cfgOllamaGroup" style="display:none;">
          <label>OLLAMA URL:</label>
          <input type="text" id="cfgOllamaUrl" value="http://localhost:11434">
        </div>

        <div class="form-group">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <label style="margin:0;">TEMPERATURE / VARIANCE (<span id="tempVal">0.8</span>):</label>
          </div>
          <input type="range" id="cfgTemp" min="0.2" max="1.2" step="0.05" value="0.8" style="accent-color:var(--accent);">
        </div>
      </div>
      <div class="modal-foot">
        <span style="color:var(--muted); font-size:10px;">SKEW // WORKERS NATIVE</span>
        <button class="btn-humanize" id="btnSaveConfig" style="padding:6px 16px;">SAVE CONFIGURATION</button>
      </div>
    </div>
  </div>

  <script>
    // State
    const state = {
      mode: 'natural',
      aggression: 'medium',
      activeTab: 'text',
      provider: 'cf-ai',
      model: '@cf/mistralai/mistral-small-3.1-24b-instruct',
      apiKey: '',
      ollamaUrl: 'http://localhost:11434',
      temperature: 0.8,
      autoRefine: true,
      originalMetrics: null,
      humanizedMetrics: null
    };

    const SAMPLE_IT = \`È fondamentale sottolineare che, nel panorama in continua evoluzione della tecnologia moderna, l'intelligenza artificiale svolge un ruolo cruciale. Inoltre, è un mosaico di innovazione senza precedenti che testimonia il progresso umano. In conclusione, vale la pena notare che dobbiamo navigare le complessità di questo viaggio trasformativo con un approccio olistico e armonioso.\`;
    const SAMPLE_EN = \`In today's ever-evolving digital landscape, it is important to remember that artificial intelligence plays a pivotal role in shaping modern society. Furthermore, delving into this technological revolution reveals a rich tapestry of innovations. Ultimately, this serves as a testament to human ingenuity. In conclusion, we must navigate the complexities of this transformative journey.\`;

    // Elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const diffView = document.getElementById('diffView');
    const metricsView = document.getElementById('metricsView');
    const btnRun = document.getElementById('btnRun');
    const errorBanner = document.getElementById('errorBanner');
    const settingsModal = document.getElementById('settingsModal');

    // Load config from localStorage
    try {
      const saved = localStorage.getItem('desynt_cf_cfg');
      if (saved) Object.assign(state, JSON.parse(saved));
    } catch {}

    function updatePill() {
      document.getElementById('pillProviderLabel').innerText = (state.provider + ' (' + state.model + ')').toUpperCase();
    }
    updatePill();

    // Word Diff Algorithm
    function computeWordDiff(orig, hum) {
      const origWords = (orig || '').split(/(\\s+)/);
      const humWords = (hum || '').split(/(\\s+)/);
      let html = '';
      let i = 0, j = 0;

      while (i < origWords.length || j < humWords.length) {
        if (i < origWords.length && j < humWords.length && origWords[i] === humWords[j]) {
          html += origWords[i];
          i++; j++;
        } else if (j < humWords.length && (i >= origWords.length || !origWords.includes(humWords[j]))) {
          html += '<span class="diff-ins">' + humWords[j] + '</span>';
          j++;
        } else if (i < origWords.length) {
          html += '<span class="diff-del">' + origWords[i] + '</span>';
          i++;
        } else {
          break;
        }
      }
      return html;
    }

    // Input stats & Cliches from massive database
    const CLICHES = ${clientClichesJson};
    function updateInputStats() {
      const val = inputText.value || '';
      const words = val.trim() ? val.trim().split(/\\s+/).length : 0;
      document.getElementById('inWords').innerText = words;
      document.getElementById('inChars').innerText = val.length;

      const lower = val.toLowerCase();
      const found = CLICHES.filter(c => lower.includes(c));
      const badge = document.getElementById('inputClicheBadge');
      if (found.length > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = found.length + ' AI CLICHÉS';
      } else {
        badge.style.display = 'none';
      }

      // Live estimate
      const sentences = val.split(/[.!?]+/).filter(Boolean);
      let burst = 20;
      if (sentences.length > 1) {
        const lens = sentences.map(s => s.trim().split(/\\s+/).length);
        const avg = lens.reduce((a,b)=>a+b,0) / lens.length;
        const vari = lens.reduce((s,l)=>s+Math.pow(l-avg,2),0) / lens.length;
        burst = Math.min(95, Math.round((Math.sqrt(vari)/avg) * 100));
      }
      document.getElementById('inBurst').innerText = burst + '%';
    }
    inputText.addEventListener('input', updateInputStats);

    // Mode & Aggression selection
    document.querySelectorAll('#modeGroup button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#modeGroup button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.getAttribute('data-mode');
      });
    });
    document.querySelectorAll('#aggressionGroup button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#aggressionGroup button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.aggression = btn.getAttribute('data-agg');
      });
    });

    // Output Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        state.activeTab = tab;
        outputText.style.display = tab === 'text' ? 'block' : 'none';
        diffView.style.display = tab === 'diff' ? 'block' : 'none';
        metricsView.style.display = tab === 'metrics' ? 'flex' : 'none';
        detectorView.style.display = tab === 'detector' ? 'flex' : 'none';

        if (tab === 'diff') {
          diffView.innerHTML = computeWordDiff(inputText.value, outputText.value);
        }
        if (tab === 'detector') {
          runDetectorScan();
        }
      });
    });

    function renderDetectorBenchmarks(bm, det) {
      if (!bm) return;
      try {
        const setSafe = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined && val !== null) el.innerText = val;
        };
        if (bm.gptZero) {
          setSafe('bmGptZero', (bm.gptZero.score ?? '--') + '%');
          setSafe('bmGptZeroVerdict', bm.gptZero.verdict || 'AWAITING');
        }
        if (bm.copyleaks) {
          setSafe('bmCopyleaks', (bm.copyleaks.score ?? bm.copyleaks.humanScore ?? '--') + '%');
          setSafe('bmCopyleaksVerdict', bm.copyleaks.verdict || 'AWAITING');
        }
        if (bm.turnitin || bm.turnitinEstimate) {
          const tScore = bm.turnitin?.score ?? (bm.turnitinEstimate?.aiPercentage !== undefined ? (100 - bm.turnitinEstimate.aiPercentage) : (bm.turnitin?.aiPercentage !== undefined ? (100 - bm.turnitin.aiPercentage) : '--'));
          setSafe('bmTurnitin', tScore + '%');
          setSafe('bmTurnitinVerdict', bm.turnitin?.verdict || 'ESTIMATED');
        }
        if (bm.sapling || bm.saplingEstimate) {
          setSafe('bmSapling', (bm.sapling?.score ?? bm.saplingEstimate?.humanScore ?? '--') + '%');
          setSafe('bmSaplingVerdict', bm.sapling?.verdict || 'AWAITING');
        }
        if (bm.zeroShot) {
          setSafe('bmZeroShot', (bm.zeroShot.score ?? '--') + '%');
          setSafe('bmZeroShotVerdict', bm.zeroShot.verdict || 'AWAITING');
        }
        const avg = bm.ensembleAverage ?? (det ? det.humanScore : '--');
        setSafe('bmAverage', avg + '%');
      } catch (err) {
        console.warn('Benchmark rendering notice:', err);
      }
    }

    // AI Detector Runner
    async function runDetectorScan() {
      const textToScan = outputText.value.trim() || inputText.value.trim();
      if (!textToScan) return;

      const btn = document.getElementById('btnVerifyScan');
      btn.innerText = 'SCANNING...';

      try {
        const res = await fetch('/api/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToScan })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Scan error');

        const det = data.detection;
        document.getElementById('detHumanScore').innerText = det.humanScore + '%';
        document.getElementById('detAiScore').innerText = det.aiScore + '%';
        document.getElementById('detBurst').innerText = det.burstinessScore + '%';
        if (document.getElementById('detPerp')) {
          document.getElementById('detPerp').innerText = (det.perplexityScore || 50) + '%';
        }

        renderDetectorBenchmarks(det.benchmarks, det);

        const badge = document.getElementById('detVerdictBadge');
        badge.innerText = det.verdict;
        if (det.humanScore >= 70) {
          badge.style.color = 'var(--accent)';
          badge.style.borderColor = 'var(--accent)';
        } else if (det.humanScore >= 40) {
          badge.style.color = '#eab308';
          badge.style.borderColor = '#eab308';
        } else {
          badge.style.color = '#ef4444';
          badge.style.borderColor = '#ef4444';
        }

        // Render heatmap
        const heatContainer = document.getElementById('detHeatmapContainer');
        if (det.sentences && det.sentences.length > 0) {
          heatContainer.innerHTML = det.sentences.map((s) => {
            const reasonsText = s.reasons.length > 0 ? ' [ ' + s.reasons.join(', ') + ' ]' : '';
            return '<span class="heat-sent ' + s.classification + '" title="AI Prob: ' + s.aiProbability + '%' + reasonsText + '">' + s.text + '</span> ';
          }).join('');
        } else {
          heatContainer.innerText = 'No sentences detected.';
        }
      } catch (err) {
        console.error(err);
      } finally {
        btn.innerText = '🔍 DETECTOR AUDIT';
      }
    }

    document.getElementById('btnVerifyScan').addEventListener('click', () => {
      // Switch to detector tab and run scan
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === 'detector'));
      state.activeTab = 'detector';
      outputText.style.display = 'none';
      diffView.style.display = 'none';
      metricsView.style.display = 'none';
      detectorView.style.display = 'flex';
      runDetectorScan();
    });

    // Auto-Refine Toggle
    const btnToggleAutoRefine = document.getElementById('btnToggleAutoRefine');
    if (btnToggleAutoRefine) {
      btnToggleAutoRefine.addEventListener('click', () => {
        state.autoRefine = !state.autoRefine;
        btnToggleAutoRefine.classList.toggle('btn-toggle-active', state.autoRefine);
        btnToggleAutoRefine.innerText = state.autoRefine ? '⚡ AUTO-REFINE: ON' : '⚡ AUTO-REFINE: OFF';
      });
    }

    // Sample buttons
    document.getElementById('btnTestIt').addEventListener('click', () => { inputText.value = SAMPLE_IT; updateInputStats(); });
    document.getElementById('btnTestEn').addEventListener('click', () => { inputText.value = SAMPLE_EN; updateInputStats(); });
    document.getElementById('btnClear').addEventListener('click', () => { inputText.value = ''; updateInputStats(); });
    document.getElementById('btnPaste').addEventListener('click', async () => {
      try { const t = await navigator.clipboard.readText(); if (t) { inputText.value = t; updateInputStats(); } } catch {}
    });

    // Copy & Export
    document.getElementById('btnCopy').addEventListener('click', () => {
      if (!outputText.value) return;
      navigator.clipboard.writeText(outputText.value);
      const b = document.getElementById('btnCopy');
      b.innerText = 'COPIED!';
      setTimeout(() => b.innerText = 'COPY', 1500);
    });
    document.getElementById('btnDownload').addEventListener('click', () => {
      if (!outputText.value) return;
      const blob = new Blob([outputText.value], {type:'text/markdown'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'skew-humanized.md';
      a.click();
    });

    // Re-pass button
    document.getElementById('btnRepass').addEventListener('click', () => {
      if (!outputText.value) return;
      inputText.value = outputText.value;
      outputText.value = '';
      updateInputStats();
      document.getElementById('btnRepass').style.display = 'none';
    });

    // Run Humanizer
    async function runHumanize() {
      const text = inputText.value.trim();
      if (!text) return;

      btnRun.disabled = true;
      btnRun.innerText = 'PROCESSING...';
      errorBanner.style.display = 'none';
      const t0 = performance.now();

      // Progress bar animation
      const progressWrapper = document.getElementById('progressWrapper');
      const progressBar = document.getElementById('progressBar');
      const progressStepTitle = document.getElementById('progressStepTitle');
      const progressPercent = document.getElementById('progressPercent');

      progressWrapper.style.display = 'block';
      progressBar.style.width = '25%';
      progressPercent.innerText = '25%';
      progressStepTitle.innerText = state.autoRefine 
        ? '// PASS 1: REWRITING SYNTHETIC AI MARKERS...'
        : '// GENERATING HUMANIZED REWRITE...';

      let pVal = 25;
      const progressTimer = setInterval(() => {
        if (pVal < 85) {
          pVal += 15;
          progressBar.style.width = pVal + '%';
          progressPercent.innerText = pVal + '%';
          if (pVal >= 45 && state.autoRefine) {
            progressStepTitle.innerText = '// BENCHMARKING CANDIDATE AGAINST GPTZERO & COPYLEAKS HEURISTICS...';
          }
          if (pVal >= 75 && state.autoRefine) {
            progressStepTitle.innerText = '// PASS 2/3: RESTRUCTURING CADENCE & SYNTACTIC PERPLEXITY...';
          }
        }
      }, 700);

      try {
        const res = await fetch('/api/humanize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            provider: state.provider,
            model: state.model,
            apiKey: state.apiKey,
            ollamaBaseUrl: state.ollamaUrl,
            mode: state.mode,
            aggression: state.aggression,
            temperature: state.temperature,
            autoRefine: state.autoRefine
          })
        });

        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        document.getElementById('latencyTag').innerText = latency + 'ms';

        if (!res.ok) {
          throw new Error(data.error || 'Transformation error');
        }

        clearInterval(progressTimer);
        progressBar.style.width = '100%';
        progressPercent.innerText = '100%';
        const finalScore = data.detection?.humanScore || data.humanizedMetrics?.humanScore || 90;
        progressStepTitle.innerText = '// TARGET REACHED: ' + finalScore + '% HUMAN PROBABILITY (' + latency + 'ms)';
        setTimeout(() => { progressWrapper.style.display = 'none'; }, 2200);

        outputText.value = data.humanizedText;
        const outWordCount = data.humanizedText.trim() ? data.humanizedText.trim().split(/\s+/).filter(Boolean).length : 0;
        document.getElementById('outWords').innerText = outWordCount;
        document.getElementById('outChars').innerText = data.humanizedText.length;
        if (data.detection) {
          document.getElementById('outBurst').innerText = data.detection.burstinessScore + '%';
        }
        document.getElementById('btnRepass').style.display = 'inline-block';

        // Audit stats
        if (data.originalMetrics && data.humanizedMetrics) {
          document.getElementById('auditScoreBefore').innerText = data.originalMetrics.humanScore + '%';
          document.getElementById('auditScoreAfter').innerText = data.humanizedMetrics.humanScore + '%';
          document.getElementById('auditBurstDiff').innerText = data.originalMetrics.burstinessScore + '% → ' + data.humanizedMetrics.burstinessScore + '%';
          document.getElementById('auditBurstBar').style.width = data.humanizedMetrics.burstinessScore + '%';
          document.getElementById('auditLexDiff').innerText = data.originalMetrics.lexicalDiversity + '% → ' + data.humanizedMetrics.lexicalDiversity + '%';
          document.getElementById('auditLexBar').style.width = data.humanizedMetrics.lexicalDiversity + '%';

          const stripped = data.originalMetrics.clichesFound.filter(c => !data.humanizedMetrics.clichesFound.includes(c));
          if (stripped.length > 0) {
            document.getElementById('auditClichesList').innerHTML = stripped.map(c => '<span class="tag-cliche" style="margin-right:4px;">' + c + ' ✓</span>').join('');
          } else {
            document.getElementById('auditClichesList').innerText = 'No clichés found or all neutralized.';
          }
        }

        // Update AI Detector tab with full benchmarks & iterations
        if (data.detection) {
          const det = data.detection;
          document.getElementById('detHumanScore').innerText = det.humanScore + '%';
          document.getElementById('detAiScore').innerText = det.aiScore + '%';
          document.getElementById('detBurst').innerText = det.burstinessScore + '%';
          if (document.getElementById('detPerp')) {
            document.getElementById('detPerp').innerText = (det.perplexityScore || 50) + '%';
          }

          const badge = document.getElementById('detVerdictBadge');
          badge.innerText = det.verdict;
          if (det.humanScore >= 70) {
            badge.style.color = 'var(--accent)';
            badge.style.borderColor = 'var(--accent)';
          } else if (det.humanScore >= 40) {
            badge.style.color = '#eab308';
            badge.style.borderColor = '#eab308';
          } else {
            badge.style.color = '#ef4444';
            badge.style.borderColor = '#ef4444';
          }

          renderDetectorBenchmarks(det.benchmarks, det);

          // Auto-refine iterations display
          const iterBox = document.getElementById('iterationHistoryBox');
          const iterList = document.getElementById('iterationHistoryList');
          if (data.iterations && data.iterations.length > 0) {
            iterBox.style.display = 'block';
            iterList.innerHTML = data.iterations.map(it => {
              const color = it.humanScore >= 75 ? 'var(--accent)' : it.humanScore >= 50 ? '#eab308' : '#ef4444';
              return '<div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding:4px 0;">' +
                '<span><b>Pass ' + it.pass + ':</b> ' + it.verdict + '</span>' +
                '<span style="color:' + color + ';"><b>' + it.humanScore + '% Human</b> (Burst: ' + it.burstinessScore + '%, Perp: ' + it.perplexityScore + '%)</span>' +
              '</div>';
            }).join('');
          } else {
            iterBox.style.display = 'none';
          }

          // Heatmap
          const heatContainer = document.getElementById('detHeatmapContainer');
          if (det.sentences && det.sentences.length > 0) {
            heatContainer.innerHTML = det.sentences.map((s) => {
              const reasonsText = s.reasons.length > 0 ? ' [ ' + s.reasons.join(', ') + ' ]' : '';
              return '<span class="heat-sent ' + s.classification + '" title="AI Prob: ' + s.aiProbability + '%' + reasonsText + '">' + s.text + '</span> ';
            }).join('');
          }
        }

        if (state.activeTab === 'diff') {
          diffView.innerHTML = computeWordDiff(inputText.value, outputText.value);
        }
      } catch (err) {
        clearInterval(progressTimer);
        document.getElementById('progressWrapper').style.display = 'none';
        errorBanner.innerText = err.message;
        errorBanner.style.display = 'block';
      } finally {
        btnRun.disabled = false;
        btnRun.innerHTML = '<span>HUMANIZE TEXT</span> ↵';
      }
    }
    btnRun.addEventListener('click', runHumanize);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runHumanize();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        openModal();
      }
      if (e.key === 'Escape') {
        settingsModal.classList.remove('open');
      }
    });

    // Settings Modal
    function openModal() {
      settingsModal.classList.add('open');
      document.querySelectorAll('.provider-btn').forEach(b => {
        b.classList.toggle('selected', b.getAttribute('data-prov') === state.provider);
      });
      document.getElementById('cfgModel').value = state.model;
      document.getElementById('cfgApiKey').value = state.apiKey;
      document.getElementById('cfgOllamaUrl').value = state.ollamaUrl;
      document.getElementById('cfgTemp').value = state.temperature;
      document.getElementById('tempVal').innerText = state.temperature;
      toggleKeyInput(state.provider);
    }
    function toggleKeyInput(prov) {
      document.getElementById('cfgKeyGroup').style.display = (prov !== 'cf-ai' && prov !== 'heuristic' && prov !== 'ollama') ? 'block' : 'none';
      document.getElementById('cfgOllamaGroup').style.display = prov === 'ollama' ? 'block' : 'none';
    }

    document.getElementById('pillConfig').addEventListener('click', openModal);
    document.getElementById('btnOpenSettings').addEventListener('click', openModal);
    document.getElementById('btnCloseSettings').addEventListener('click', () => settingsModal.classList.remove('open'));

    document.querySelectorAll('.provider-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.provider-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        const p = b.getAttribute('data-prov');
        toggleKeyInput(p);
        const defaults = {
          'cf-ai': '@cf/mistralai/mistral-small-3.1-24b-instruct',
          'heuristic': 'precision-nlp-engine',
          'groq': 'llama-3.3-70b-versatile',
          'ollama': 'llama3.2',
          'openrouter': 'meta-llama/llama-3.3-70b-instruct',
          'openai': 'gpt-4o-mini',
          'anthropic': 'claude-3-5-haiku-latest',
          'gemini': 'gemini-2.0-flash'
        };
        document.getElementById('cfgModel').value = defaults[p] || 'default';
      });
    });

    document.getElementById('cfgTemp').addEventListener('input', (e) => {
      document.getElementById('tempVal').innerText = e.target.value;
    });

    document.getElementById('btnSaveConfig').addEventListener('click', () => {
      const selectedBtn = document.querySelector('.provider-btn.selected');
      state.provider = selectedBtn ? selectedBtn.getAttribute('data-prov') : 'cf-ai';
      state.model = document.getElementById('cfgModel').value;
      state.apiKey = document.getElementById('cfgApiKey').value;
      state.ollamaUrl = document.getElementById('cfgOllamaUrl').value;
      state.temperature = parseFloat(document.getElementById('cfgTemp').value);
      try {
        localStorage.setItem('desynt_cf_cfg', JSON.stringify(state));
      } catch {}
      updatePill();
      settingsModal.classList.remove('open');
    });
  </script>
</body>
</html>`;
}

