'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const {
  recommend,
  batchRecommend,
  CATALOG,
  SPEC,
  inputSummary,
  DATA_DIR,
  OUTCOMES_PATH,
  loadOutcomes,
  responseGraph,
} = require('./ranker');

const INTENDED_PORT = Number(process.env.PORT || 8790);
let LISTEN_PORT = INTENDED_PORT;
const HOST = process.env.HOST || '0.0.0.0';
const STAFF_PIN = process.env.PIE_STAFF_PIN ? String(process.env.PIE_STAFF_PIN) : '';
const AUTH_MODE = STAFF_PIN ? 'staff_pin' : 'open_dev';

const AUDIT_PATH = path.join(DATA_DIR, 'audit.jsonl');

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/** Simple in-memory rate limit: PIE_RATE_LIMIT_PER_MIN (default 60) req/min per IP on /api/recommend */
const RATE_LIMIT_PER_MIN = Math.max(1, Number(process.env.PIE_RATE_LIMIT_PER_MIN || 60));
const rateBuckets = new Map();
function rateLimitRecommend(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'local';
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > 60000) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count++;
  if (bucket.count > RATE_LIMIT_PER_MIN) {
    return res.status(429).json({ error: 'rate_limit', message: RATE_LIMIT_PER_MIN + ' requests per minute per IP' });
  }
  next();
}

function requireStaffPin(req, res, next) {
  if (!STAFF_PIN) return next();
  const pin = req.get('X-PIE-Staff-Pin') || (req.query && req.query.pin) || '';
  if (pin !== STAFF_PIN) {
    return res.status(401).json({ error: 'unauthorized', message: 'Missing or invalid X-PIE-Staff-Pin' });
  }
  next();
}

function appendAudit(entry) {
  try {
    fs.appendFileSync(AUDIT_PATH, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('audit write failed', err);
  }
}

function auditDecision(kind, req, result) {
  const input = (result && result.input) || req.body || {};
  const { hash, summary } = inputSummary(input);
  const top3 = (result.recommendations || []).slice(0, 3).map((r) => ({
    protocol_id: r.protocol_id,
    score: r.score,
    protocol_version: r.protocol_version || null,
    evidence_class: r.evidence_class || null,
  }));
  appendAudit({
    ts: new Date().toISOString(),
    kind,
    inputs_hash: hash,
    inputs_summary: summary,
    client_id: input.client_id || null,
    action: result.action,
    silence: !!result.silence,
    top3,
    exclusions_count: result.exclusions_total != null ? result.exclusions_total : (result.exclusions || []).length,
    suggested_sequence: result.suggested_sequence || null,
    confidence: result.confidence != null ? result.confidence : null,
    decision_record: result.decision_record || null,
  });
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'pranaforge-pie-runtime',
    version: '1.3.0-phase2',
    catalog_size: CATALOG.length,
    tau_select: SPEC.thresholds.tau_select,
    intended_port: INTENDED_PORT,
    listen_port: LISTEN_PORT,
    auth_mode: AUTH_MODE,
    auth: AUTH_MODE === 'open_dev' ? 'open_dev' : 'staff_pin',
    port: LISTEN_PORT,
  });
});

app.post('/api/recommend', rateLimitRecommend, requireStaffPin, (req, res) => {
  try {
    const result = recommend(req.body || {});
    auditDecision('recommend', req, result);
    res.status(result.action === 'error' ? 400 : 200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

app.post('/api/batch', requireStaffPin, (req, res) => {
  try {
    const body = req.body;
    const scenarios = Array.isArray(body) ? body : body && body.scenarios;
    if (!Array.isArray(scenarios)) {
      return res.status(400).json({ error: 'body must be array or {scenarios:[]}' });
    }
    const results = batchRecommend(scenarios);
    for (const r of results) auditDecision('batch', req, r);
    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

app.get('/api/audit', requireStaffPin, (req, res) => {
  if (!STAFF_PIN) {
    // still allow in open_dev but document — gated when PIN set; open when unset for local QA
  }
  const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 50));
  try {
    if (!fs.existsSync(AUDIT_PATH)) return res.json({ count: 0, entries: [] });
    const lines = fs.readFileSync(AUDIT_PATH, 'utf8').split('\n').filter(Boolean);
    const slice = lines.slice(-limit).map((l) => JSON.parse(l));
    res.json({ count: slice.length, entries: slice.reverse() });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

/** Learning loop MVP: store outcome keyed by client_id (never mix clients) */
function normalizeSubjective(block) {
  if (!block || typeof block !== 'object') return undefined;
  const out = {};
  for (const key of ['stress', 'energy', 'focus', 'adherence', 'satisfaction']) {
    if (block[key] == null) continue;
    if (typeof block[key] === 'object' && 'value' in block[key]) {
      out[key] = {
        value: block[key].value,
        source: block[key].source || 'self_reported',
      };
    } else {
      out[key] = { value: block[key], source: block.source || 'self_reported' };
    }
  }
  return Object.keys(out).length ? out : undefined;
}

app.post('/api/outcome', requireStaffPin, (req, res) => {
  try {
    const body = req.body || {};
    const client_id = body.client_id;
    const protocol_id = body.protocol_id;
    const rating = Number(body.rating_1_to_10);
    const context_key = body.context_key || '';
    const delivery_modality = body.delivery_modality || null;
    const ALLOWED_MODALITIES = new Set(['staff_led', 'audio', 'text', 'self_guided']);
    if (!client_id || typeof client_id !== 'string') {
      return res.status(400).json({ error: 'client_id required' });
    }
    if (!protocol_id) return res.status(400).json({ error: 'protocol_id required' });
    if (Number.isNaN(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'rating_1_to_10 must be 1–10' });
    }
    if (delivery_modality && !ALLOWED_MODALITIES.has(delivery_modality)) {
      return res.status(400).json({
        error: 'delivery_modality must be staff_led|audio|text|self_guided',
      });
    }
    const entry = {
      ts: new Date().toISOString(),
      client_id,
      protocol_id,
      rating_1_to_10: rating,
      context_key,
    };
    if (delivery_modality) entry.delivery_modality = delivery_modality;
    const before = normalizeSubjective(body.before);
    const after = normalizeSubjective(body.after);
    if (before) entry.before = before;
    if (after) entry.after = after;
    // Learning: append outcomes.jsonl AND update personal response_graph (Phase 2)
    fs.appendFileSync(OUTCOMES_PATH, JSON.stringify(entry) + '\n');
    const graph_node = responseGraph.updateFromOutcome({
      client_id,
      protocol_id,
      rating_1_to_10: rating,
      context_key,
      delivery_modality,
      ts: entry.ts,
    });
    res.json({ ok: true, stored: entry, graph_node });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});


/** Phase 2: longitudinal history — historical observations only (no predictions). */
app.get('/api/client/:client_id/history', requireStaffPin, (req, res) => {
  try {
    const client_id = req.params.client_id;
    if (!client_id) return res.status(400).json({ error: 'client_id required' });
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    let decisions = [];
    if (fs.existsSync(AUDIT_PATH)) {
      const lines = fs.readFileSync(AUDIT_PATH, 'utf8').split('\n').filter(Boolean);
      for (let i = lines.length - 1; i >= 0 && decisions.length < limit; i--) {
        try {
          const e = JSON.parse(lines[i]);
          if (e.client_id === client_id && (e.kind === 'recommend' || e.kind === 'batch')) {
            decisions.push({
              ts: e.ts,
              kind: e.kind,
              action: e.action,
              silence: e.silence,
              top3: e.top3 || [],
              confidence: e.confidence,
              inputs_summary: e.inputs_summary || null,
              decision_id:
                e.decision_record && e.decision_record.decision_id
                  ? e.decision_record.decision_id
                  : null,
            });
          }
        } catch {
          /* skip bad line */
        }
      }
    }

    const outcomes = loadOutcomes(5000)
      .filter((o) => o.client_id === client_id)
      .slice(-limit)
      .reverse();

    const response_graph = responseGraph.summarizeClient(client_id);

    res.json({
      client_id,
      decisions,
      outcomes,
      response_graph,
      phrasing: 'historical_observations_only',
      disclaimer:
        'Patterns below are historical observations from logged decisions/outcomes only — not predictions or clinical advice.',
    });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.get('/api/catalog', requireStaffPin, (_req, res) => {
  res.json({
    count: CATALOG.length,
    protocols: CATALOG.map((p) => ({
      protocol_id: p.protocol_id,
      name: p.name,
      evidence: p.evidence_A_to_E,
      max_duration_sec: p.max_duration_sec,
      recommended_duration_sec: p.recommended_duration_sec,
      min_duration_sec: p.min_duration_sec,
      need_tags: p.need_tags,
      clinician_only: p.clinician_only,
      categories: p.categories,
      public_discrete: p.public_discrete,
      version: p.version || '1.0.0',
      evidence_class: p.evidence_class || null,
      modality: p.modality || null,
      duration: p.duration || null,
      dose: {
        micro: (p.duration && p.duration.micro_sec) || Math.min(p.min_duration_sec || 60, 120),
        minimum: p.min_duration_sec,
        recommended: p.recommended_duration_sec,
        extended: p.max_duration_sec,
      },
      delivery_channels: p.delivery_channels || [],
    })),
  });
});

function tryListen(port, attemptsLeft) {
  const server = app.listen(port, HOST, () => {
    LISTEN_PORT = port;
    fs.writeFileSync(path.join(__dirname, '.runtime-port'), String(port));
    console.log(`PIE runtime listening on http://${HOST}:${port} auth=${AUTH_MODE}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const next = port + 1;
      console.warn(`Port ${port} in use, trying ${next}...`);
      tryListen(next, attemptsLeft - 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

tryListen(LISTEN_PORT, 5);
