'use strict';

/**
 * Structured Explanation from ranking features / why tags.
 * { selected_id, positives[], penalties[], confidence }
 */

function buildExplanation({ selected_id, features, why, confidence }) {
  const feats = features || {};
  const whyTags = Array.isArray(why) ? why : [];
  const positives = [];
  const penalties = [];

  const pushPos = (label, strength) => {
    if (strength == null || strength >= 0.45) positives.push(label);
  };

  if (feats.need_match != null) pushPos(`need_match=${feats.need_match}`, feats.need_match);
  if (feats.context_match != null) pushPos(`context_match=${feats.context_match}`, feats.context_match);
  if (feats.timing != null) pushPos(`timing=${feats.timing}`, feats.timing);
  if (feats.evidence != null) pushPos(`evidence=${feats.evidence}`, feats.evidence);
  if (feats.history != null && feats.history >= 0.7) positives.push(`history=${feats.history}`);
  if (feats.preference != null && feats.preference >= 0.7) positives.push(`preference=${feats.preference}`);
  if (feats.feasibility != null) pushPos(`feasibility=${feats.feasibility}`, feats.feasibility);

  for (const t of whyTags) {
    if (/penalty|prior_negative|breath_penalty|friction/i.test(t)) penalties.push(t);
    else if (!positives.includes(t)) positives.push(t);
  }

  if (feats.penalties != null && feats.penalties > 0) {
    penalties.push(`feature_penalties=${feats.penalties}`);
  }

  return {
    selected_id: selected_id || null,
    positives,
    penalties,
    confidence: confidence != null ? confidence : null,
  };
}

module.exports = { buildExplanation };
