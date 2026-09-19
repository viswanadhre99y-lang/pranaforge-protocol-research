'use strict';

/**
 * Safety gateway — centralized crisis NLP + hard exclusions.
 * Pipeline order: Input → Safety → Hard exclude → Candidates → Rank
 *
 * Ranker MUST call runSafety() before ranking. Hard-exclude helpers
 * preserve V1.1 semantics (public, clinician, duration, contra, evidence E).
 */

const PUBLIC_PLACE_CLASSES = new Set(['public', 'airport', 'plane', 'open_office']);

const CRISIS_PATTERNS = [
  /\bsuicid/i,
  /\bkill\s+myself\b/i,
  /\bself[-\s]?harm\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bend\s+my\s+life\b/i,
  /\bhurt\s+myself\b/i,
  /\bnot\s+worth\s+living\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\btake\s+my\s+(own\s+)?life\b/i,
];

function detectCrisisText(input) {
  const fields = [input.history_notes, input.goal, input.notes, input.free_text]
    .filter(Boolean)
    .map(String)
    .join('\n');
  if (!fields) return false;
  return CRISIS_PATTERNS.some((re) => re.test(fields));
}

/**
 * Crisis assessment → severity / confidence / escalate.
 * Keyword NLP only — not a clinical instrument; false-positive risk documented in README.
 */
function assessCrisis(input) {
  const flag = !!(input && input.crisis_flag);
  const nlp = detectCrisisText(input || {});
  if (!flag && !nlp) {
    return {
      escalate: false,
      severity: 'none',
      confidence: 0,
      reason: null,
      crisis_nlp: false,
    };
  }
  if (flag) {
    return {
      escalate: true,
      severity: 'high',
      confidence: 0.95,
      reason: 'crisis_flag → no protocol ranking',
      crisis_nlp: false,
    };
  }
  return {
    escalate: true,
    severity: 'high',
    confidence: 0.8,
    reason: 'crisis_nlp_keyword',
    crisis_nlp: true,
  };
}

function runSafety(input) {
  const crisis = assessCrisis(input);
  return {
    ok: !crisis.escalate,
    crisis,
    pipeline_stage: 'safety',
  };
}

function isPublicContext(input) {
  const place = (input.place_class || '').toLowerCase();
  const privacy = (input.privacy || '').toLowerCase();
  return PUBLIC_PLACE_CLASSES.has(place) || privacy === 'public';
}

function parseHistoryNotes(notes) {
  const out = { prior_negative: [], prior_positive: [], disliked_modalities: [], contra: [] };
  if (!notes || typeof notes !== 'string') return out;
  const parts = notes.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const mNeg = part.match(/prior_negative\s*:\s*([\w-]+)/i);
    const mPos = part.match(/prior_positive\s*:\s*([\w-]+)/i);
    const mDis = part.match(/dislike\s*:\s*([\w-]+)/i);
    const mContra = part.match(/contra(?:indication)?s?\s*:\s*([\w-]+)/i);
    if (mNeg) out.prior_negative.push(mNeg[1].toLowerCase());
    if (mPos) out.prior_positive.push(mPos[1].toLowerCase());
    if (mDis) out.disliked_modalities.push(mDis[1].toLowerCase());
    if (mContra) out.contra.push(mContra[1].toLowerCase());
  }
  return out;
}

function hasBreathMedicalContra(input) {
  const history = parseHistoryNotes(input.history_notes);
  if (history.contra.includes('breath') || history.contra.includes('breathing')) return true;
  const notes = String(input.history_notes || '');
  if (/contra(?:indication)?s?\s*:\s*breath/i.test(notes)) return true;
  if (/medical\s+contra.*breath|breath.*medical\s+contra/i.test(notes)) return true;
  if (/panic.?breath.?intoler|breath.?intolerance/i.test(notes)) return true;
  return false;
}

/**
 * Hard exclusion reasons for one protocol (same semantics as V1.1 hardExclude).
 * deps: { doseSecForGap, primaryNeed, BREATH_IDS }
 */
function hardExcludeReasons(protocol, input, inferredNeeds, deps) {
  const { doseSecForGap, primaryNeed, BREATH_IDS } = deps;
  const reasons = [];
  const needNames = new Set(inferredNeeds.map((n) => n.need));
  const history = parseHistoryNotes(input.history_notes);
  const place = (input.place_class || 'office').toLowerCase();

  const { doseSec, gapSec } = doseSecForGap(protocol, input, inferredNeeds);
  if (doseSec > gapSec) {
    reasons.push(`duration_exceeds_gap:${doseSec}s>${gapSec}s`);
  }

  const clientContra = new Set(history.contra);
  if (input.history_notes) {
    for (const m of String(input.history_notes).matchAll(/contra(?:indication)?s?\s*:\s*([\w-]+)/gi)) {
      clientContra.add(m[1].toLowerCase());
    }
    if (/panic.?breath|breath.?intoler/i.test(input.history_notes)) {
      clientContra.add('panic_breath_intolerance');
    }
  }
  const pContra = protocol.contraindication_tags || [];
  const hit = pContra.filter((t) => clientContra.has(String(t).toLowerCase()));
  if (hit.length) reasons.push(`contraindication:${hit.join(',')}`);

  if (protocol.clinician_only && !input.clinician_mode) {
    reasons.push('clinician_only_without_clinician_mode');
  }

  if (String(protocol.evidence_A_to_E).toUpperCase() === 'E') {
    reasons.push('evidence_E');
  }

  const arousal = protocol.arousal_direction || '';
  if (needNames.has('sleep_prep') && /^(up|activate|activation_up|focus)$/i.test(arousal)) {
    reasons.push('arousal_up_when_need_sleep_prep');
  }
  if (needNames.has('sleep_prep') && /up_then_down|activate/i.test(arousal) && primaryNeed(inferredNeeds) === 'sleep_prep') {
    if (!reasons.includes('arousal_up_when_need_sleep_prep')) reasons.push('arousal_up_when_need_sleep_prep');
  }

  if (isPublicContext(input) && protocol.public_discrete === false) {
    reasons.push(`public_discrete_false:${place || input.privacy || 'public'}`);
  }

  const equip = protocol.equipment || [];
  const needsEquip = equip.filter((e) => e && e !== 'none');
  if (needsEquip.length) {
    const goal = String(input.goal || '').toLowerCase();
    const lightGoal =
      /jetlag|circadian|sleep_debt|travel|recovery/.test(goal) ||
      /landing|flight|travel/i.test(String(input.upcoming_event_tag || ''));
    const placeOk =
      (needsEquip.includes('cold_water') && (place === 'bathroom' || place === 'home' || place === 'hotel')) ||
      (needsEquip.some((e) => /outdoors|bright_light|light|melatonin/i.test(e)) &&
        (place === 'outdoors' || place === 'home' || place === 'hotel' || lightGoal)) ||
      (needsEquip.some((e) => /space_to_move|gym/i.test(e)) && (place === 'gym' || place === 'outdoors'));
    if (!placeOk) {
      reasons.push(`equipment_missing:${needsEquip.join(',')}`);
    }
  }

  if (input.prefers_breath === 'no' && BREATH_IDS.has(protocol.protocol_id) && hasBreathMedicalContra(input)) {
    reasons.push('prefers_breath_no_medical_contra');
  }

  if (history.prior_negative.includes(protocol.protocol_id) && input.hard_exclude_prior_negative) {
    reasons.push('prior_negative_hard');
  }

  // Unknown / flagged cardiac: exclude high-intensity cold / TIPP temperature pathways
  const notesBlob = [input.history_notes, input.notes, input.constraints_text, input.goal]
    .filter(Boolean)
    .map(String)
    .join(' ');
  if (/unknown\s+cardiac|cardiac\s+unknown|\bcardiac\b.*\buncleared|uncleared\s+cardiac/i.test(notesBlob)) {
    if (
      protocol.protocol_id === 'tipp' ||
      protocol.protocol_id === 'cold-face' ||
      (protocol.contraindication_tags || []).includes('cardiovascular_disease')
    ) {
      reasons.push('cardiac_uncleared_exclude');
    }
  }

  // Untreated OSA: exclude long lying NSDR / sleep-restriction style cards without staff screen
  if (/\bOSA\b|untreated\s+OSA|untreated_osa/i.test(notesBlob)) {
    if (
      protocol.protocol_id === 'yoga-nidra-nsdr' ||
      protocol.protocol_id === 'sleep-restriction' ||
      (protocol.contraindication_tags || []).includes('untreated_osa')
    ) {
      reasons.push('osa_caution_exclude');
    }
  }

  return reasons;
}

module.exports = {
  CRISIS_PATTERNS,
  PUBLIC_PLACE_CLASSES,
  detectCrisisText,
  assessCrisis,
  runSafety,
  isPublicContext,
  parseHistoryNotes,
  hasBreathMedicalContra,
  hardExcludeReasons,
};
