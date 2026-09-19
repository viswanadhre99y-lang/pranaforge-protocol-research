/**
 * Personal response graph (Phase 2) — file-backed, client-isolated.
 * Structure: { [client_id]: { [protocol_id]: { n, mean_rating, last_contexts[], last_at, last_modality? } } }
 * Learning: simple averages only — NOT bandits / causal claims.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const GRAPH_PATH = path.join(DATA_DIR, 'response_graph.json');
const MAX_CONTEXTS = 8;

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadGraph() {
  try {
    if (!fs.existsSync(GRAPH_PATH)) return {};
    const raw = fs.readFileSync(GRAPH_PATH, 'utf8');
    if (!raw.trim()) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveGraph(graph) {
  ensureDir();
  const tmp = GRAPH_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(graph, null, 2) + '\n');
  fs.renameSync(tmp, GRAPH_PATH);
}

/**
 * Update graph from a stored outcome. Returns the updated protocol node.
 */
function updateFromOutcome({ client_id, protocol_id, rating_1_to_10, context_key, delivery_modality, ts }) {
  if (!client_id || !protocol_id) throw new Error('client_id and protocol_id required');
  const rating = Number(rating_1_to_10);
  if (Number.isNaN(rating)) throw new Error('rating required');

  const graph = loadGraph();
  if (!graph[client_id]) graph[client_id] = {};
  const node = graph[client_id][protocol_id] || {
    n: 0,
    mean_rating: 0,
    last_contexts: [],
    last_at: null,
  };
  const n = node.n + 1;
  const mean_rating = ((node.mean_rating || 0) * node.n + rating) / n;
  const last_contexts = Array.isArray(node.last_contexts) ? [...node.last_contexts] : [];
  if (context_key) {
    last_contexts.push(String(context_key));
    while (last_contexts.length > MAX_CONTEXTS) last_contexts.shift();
  }
  const updated = {
    n,
    mean_rating: Math.round(mean_rating * 1000) / 1000,
    last_contexts,
    last_at: ts || new Date().toISOString(),
  };
  if (delivery_modality) updated.last_modality = delivery_modality;
  graph[client_id][protocol_id] = updated;
  saveGraph(graph);
  return updated;
}

function getClientGraph(clientId) {
  if (!clientId) return {};
  const graph = loadGraph();
  return graph[clientId] || {};
}

/**
 * Stronger than raw outcomes.jsonl: uses response_graph means when present.
 * Boost range −0.25..+0.25 (vs outcomes.jsonl −0.15..+0.15).
 * Still simple average → centered rating; NOT a bandit.
 */
function graphBoostMap(clientId) {
  const map = new Map();
  if (!clientId) return map;
  const client = getClientGraph(clientId);
  for (const [pid, node] of Object.entries(client)) {
    if (!node || node.mean_rating == null || !node.n) continue;
    const avg = Number(node.mean_rating);
    // 1–10 → −0.25..+0.25 around 5.5; n≥2 slightly stronger (cap already applied)
    const strength = node.n >= 2 ? 0.25 : 0.22;
    const boost = Math.max(-strength, Math.min(strength, ((avg - 5.5) / 4.5) * strength));
    map.set(pid, boost);
  }
  return map;
}

/**
 * Summary for history API — historical observations only (no predictions).
 */
function summarizeClient(clientId) {
  const client = getClientGraph(clientId);
  const protocols = Object.entries(client).map(([protocol_id, node]) => ({
    protocol_id,
    n: node.n,
    mean_rating: node.mean_rating,
    last_contexts: node.last_contexts || [],
    last_at: node.last_at || null,
    last_modality: node.last_modality || null,
  }));
  protocols.sort((a, b) => (b.mean_rating || 0) - (a.mean_rating || 0));
  const observations = [];
  for (const p of protocols) {
    if (p.n >= 1 && p.mean_rating >= 7) {
      observations.push(
        `Historical observation: ${p.protocol_id} rated mean ${p.mean_rating}/10 across ${p.n} logged outcome(s).`
      );
    } else if (p.n >= 1 && p.mean_rating <= 4) {
      observations.push(
        `Historical observation: ${p.protocol_id} rated mean ${p.mean_rating}/10 across ${p.n} logged outcome(s) (lower than midpoint).`
      );
    }
  }
  return {
    client_id: clientId,
    protocol_count: protocols.length,
    protocols,
    observations: observations.slice(0, 12),
    disclaimer:
      'Patterns are historical observations from logged outcomes only — not predictions, causal claims, or clinical advice.',
  };
}

module.exports = {
  GRAPH_PATH,
  DATA_DIR,
  loadGraph,
  saveGraph,
  updateFromOutcome,
  getClientGraph,
  graphBoostMap,
  summarizeClient,
};
