'use strict';

const crypto = require('crypto');

/**
 * DecisionRecord — full auditable snapshot of one recommend() call.
 */

function buildDecisionRecord({
  client_id = null,
  staff_id = null,
  timestamps = {},
  state = null,
  context = null,
  goal = null,
  duration = null,
  candidates = [],
  exclusions = [],
  ranking_features = null,
  top = [],
  confidence = null,
  explanation = null,
  protocol_versions = {},
  action = null,
  silence = false,
  inferred_need = null,
  input_hash = null,
} = {}) {
  const ts = timestamps.decided_at || new Date().toISOString();
  const idSeed = JSON.stringify({ client_id, ts, top: (top || []).map((t) => t.protocol_id) });
  const decision_id = 'dr_' + crypto.createHash('sha256').update(idSeed).digest('hex').slice(0, 12);

  return {
    decision_id,
    client_id,
    staff_id,
    timestamps: {
      decided_at: ts,
      ...timestamps,
    },
    state,
    context,
    goal,
    duration,
    candidates: (candidates || []).map((c) => ({
      protocol_id: c.protocol_id,
      score: c.score,
      protocol_version: c.protocol_version || (protocol_versions && protocol_versions[c.protocol_id]) || null,
      evidence_class: c.evidence_class || null,
      features: c.features || null,
      score_breakdown: c.score_breakdown || null,
      why: c.why || undefined,
      min_duration_sec: c.min_duration_sec,
      recommended_duration_sec: c.recommended_duration_sec,
      max_duration_sec: c.max_duration_sec,
      public_discrete: c.public_discrete,
      clinician_only: c.clinician_only,
    })),
    exclusions: (exclusions || []).map((e) => ({
      protocol_id: e.protocol_id,
      reasons: e.reasons || [],
    })),
    ranking_features: ranking_features || (top[0] && top[0].features) || null,
    top: (top || []).slice(0, 3).map((t) => ({
      protocol_id: t.protocol_id,
      score: t.score,
      protocol_version: t.protocol_version || null,
      evidence_class: t.evidence_class || null,
      features: t.features || null,
      score_breakdown: t.score_breakdown || null,
    })),
    confidence,
    explanation,
    protocol_versions: protocol_versions || {},
    action,
    silence: !!silence,
    inferred_need,
    input_hash,
    schema_version: '1.0.0',
  };
}

module.exports = { buildDecisionRecord };
