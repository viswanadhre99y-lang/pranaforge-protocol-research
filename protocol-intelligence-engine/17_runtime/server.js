'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const { recommend, batchRecommend, CATALOG, SPEC } = require('./ranker');

let LISTEN_PORT = Number(process.env.PORT || 8790);
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'pranaforge-pie-runtime',
    version: '1.0.0',
    catalog_size: CATALOG.length,
    tau_select: SPEC.thresholds.tau_select,
    port: LISTEN_PORT,
    intended_port: Number(process.env.PORT || 8790),
  });
});

app.post('/api/recommend', (req, res) => {
  try {
    const result = recommend(req.body || {});
    res.status(result.action === 'error' ? 400 : 200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

app.post('/api/batch', (req, res) => {
  try {
    const body = req.body;
    const scenarios = Array.isArray(body) ? body : body && body.scenarios;
    if (!Array.isArray(scenarios)) {
      return res.status(400).json({ error: 'body must be array or {scenarios:[]}' });
    }
    const results = batchRecommend(scenarios);
    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

app.get('/api/catalog', (_req, res) => {
  res.json({
    count: CATALOG.length,
    protocols: CATALOG.map((p) => ({
      protocol_id: p.protocol_id,
      name: p.name,
      evidence: p.evidence_A_to_E,
      max_duration_sec: p.max_duration_sec,
      need_tags: p.need_tags,
      clinician_only: p.clinician_only,
      categories: p.categories,
    })),
  });
});

function tryListen(port, attemptsLeft) {
  const server = app.listen(port, HOST, () => {
    LISTEN_PORT = port;
    fs.writeFileSync(path.join(__dirname, '.runtime-port'), String(port));
    console.log(`PIE runtime listening on http://${HOST}:${port}`);
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
