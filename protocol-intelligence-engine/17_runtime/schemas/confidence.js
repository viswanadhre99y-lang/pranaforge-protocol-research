'use strict';

/**
 * Confidence — engineering heuristic 0–1 (NOT a clinical instrument).
 *
 * Factors:
 * - history depth (outcome rows for client)
 * - feature strength (need_match, evidence, etc.)
 * - state unknown count (more unknowns → lower)
 * - evidence_class of selected protocol
 *
 * Documented as engineering heuristic only.
 */

const EVIDENCE_CLASS_WEIGHT = {
  evidence_supported: 1.0,
  practitioner_derived: 0.85,
  client_observed: 0.7,
  experimental: 0.45,
  unknown: 0.5,
};

function computeConfidence({
  historyDepth = 0,
  features = {},
  unknownCount = 0,
  evidenceClass = 'unknown',
  topScore = null,
  tau = 0.42,
} = {}) {
  // History: 0 rows → 0.35 contribution scale; 5+ → full
  const histFactor = Math.min(1, 0.35 + 0.13 * Math.min(5, Number(historyDepth) || 0));

  const need = Number(features.need_match) || 0;
  const ev = Number(features.evidence) || 0;
  const ctx = Number(features.context_match) || 0;
  const featStrength = Math.min(1, 0.35 * need + 0.35 * ev + 0.3 * ctx);

  // Unknown dimensions dampen (cap damp at 0.35)
  const unk = Math.max(0, Number(unknownCount) || 0);
  const unknownDamp = Math.min(0.35, unk * 0.03);

  const evW = EVIDENCE_CLASS_WEIGHT[evidenceClass] != null ? EVIDENCE_CLASS_WEIGHT[evidenceClass] : 0.5;

  let scoreMargin = 0.5;
  if (topScore != null && tau != null) {
    const margin = Number(topScore) - Number(tau);
    scoreMargin = Math.max(0, Math.min(1, 0.4 + margin));
  }

  let c =
    0.28 * histFactor +
    0.32 * featStrength +
    0.2 * evW +
    0.2 * scoreMargin -
    unknownDamp;

  c = Math.max(0.05, Math.min(0.95, c));
  return Math.round(c * 1000) / 1000;
}

module.exports = { computeConfidence, EVIDENCE_CLASS_WEIGHT };
