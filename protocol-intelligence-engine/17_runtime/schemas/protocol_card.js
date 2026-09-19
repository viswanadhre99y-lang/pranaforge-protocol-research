'use strict';

/**
 * ProtocolCard upgrade helpers (non-breaking).
 * Adds version default, duration bands, evidence_class, modality, graph ids.
 */

const EVIDENCE_CLASS_MAP = {
  A: 'evidence_supported',
  B: 'evidence_supported',
  C: 'practitioner_derived',
  D: 'client_observed',
  E: 'experimental',
};

function mapEvidenceClass(letter) {
  const L = String(letter || '').toUpperCase();
  return EVIDENCE_CLASS_MAP[L] || 'unknown';
}

function inferModality(protocol) {
  if (protocol.modality) return protocol.modality;
  const cats = (protocol.categories || []).map((c) => String(c).toLowerCase());
  if (cats.includes('breathing') || cats.includes('breath')) return 'breath';
  if (cats.includes('cognitive') || cats.includes('mental')) return 'cognitive';
  if (cats.includes('body') || cats.includes('somatic') || cats.includes('movement')) return 'body';
  if (cats.includes('sleep') || cats.includes('circadian')) return 'sleep_circadian';
  if (cats.includes('behavioral')) return 'behavioral';
  if (cats.includes('performance') || cats.includes('imagery')) return 'performance';
  return cats[0] || 'unknown';
}

function catalogIds(catalog) {
  return new Set((catalog || []).map((p) => p.protocol_id));
}

function filterExistingIds(ids, idSet) {
  if (!Array.isArray(ids)) return [];
  return ids.filter((id) => idSet.has(id));
}

/**
 * Enrich a catalog protocol in-place / return upgraded view.
 * compatible/incompatible/follow_up ids empty unless present in catalog.
 */
function upgradeProtocol(protocol, catalog) {
  const idSet = catalogIds(catalog);
  const version = protocol.version || '1.0.0';
  const min = protocol.min_duration_sec != null ? protocol.min_duration_sec : 60;
  const rec = protocol.recommended_duration_sec != null ? protocol.recommended_duration_sec : min;
  const max = protocol.max_duration_sec != null ? protocol.max_duration_sec : rec;
  const micro = Math.min(min, 120);

  const follow_up_ids = filterExistingIds(protocol.follow_up_ids || protocol.followup_ids || [], idSet);
  const compatible_ids = filterExistingIds(protocol.compatible_ids || [], idSet);
  const incompatible_ids = filterExistingIds(protocol.incompatible_ids || [], idSet);

  return {
    ...protocol,
    version,
    duration: {
      micro_sec: micro,
      min_sec: min,
      optimal_sec: rec,
      extended_sec: max,
    },
    public_discrete: protocol.public_discrete === true,
    modality: inferModality(protocol),
    evidence_class: mapEvidenceClass(protocol.evidence_A_to_E),
    compatible_ids,
    incompatible_ids,
    follow_up_ids,
  };
}

function upgradeCatalog(list) {
  const base = list || [];
  return base.map((p) => upgradeProtocol({ ...p, version: p.version || '1.0.0' }, base));
}

module.exports = {
  EVIDENCE_CLASS_MAP,
  mapEvidenceClass,
  inferModality,
  upgradeProtocol,
  upgradeCatalog,
};
