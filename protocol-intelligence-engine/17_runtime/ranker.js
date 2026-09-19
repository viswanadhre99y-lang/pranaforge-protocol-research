/**
 * PIE ranker — hard filters + weighted score from score_spec.json
 * Catalog: public protocol IDs only. Never expands vault IP steps.
 *
 * Duration (product decision, P1-4):
 *   Dose for gap-fit = recommended_duration_sec, with fallback to min_duration_sec
 *   under micro/acute gaps (≤120s). Never recommend a dose > available_minutes*60.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, '02_protocol_catalog', 'catalog.jsonl');
const SPEC_PATH = path.join(ROOT, '05_ranking', 'score_spec.json');
const DATA_DIR = path.join(__dirname, 'data');
const OUTCOMES_PATH = path.join(DATA_DIR, 'outcomes.jsonl');

function loadCatalog() {
  const lines = fs.readFileSync(CATALOG_PATH, 'utf8').split('\n').filter(Boolean);
  return lines.map((l) => JSON.parse(l));
}

function loadSpec() {
  return JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
}

const CATALOG = loadCatalog();
const SPEC = loadSpec();

/** Engineering CPI priors (not clinical) — documented in CALIBRATION_NOTES */
const CPI_PRIORS = {
  founder: { pre_performance_boost_ids: ['process-visualization', 'ppr', 'pettlep', 'centering-ravizza'], boost: 0.14 },
  ceo: { pre_performance_boost_ids: ['process-visualization', 'ppr', 'box-breathing', 'centering-ravizza'], boost: 0.12 },
  athlete: { pre_performance_boost_ids: ['centering-ravizza', 'ppr', 'pettlep', 'tactical-breath-reset'], boost: 0.14 },
  traveler: { travel_boost_ids: ['jetlag-light-melatonin', 'morning-light', 'caffeine-cutoff', 'nap-protocol'], boost: 0.12 },
};

const PLACE_MAP = {
  office: ['desk', 'office', 'quiet_ok', 'private', 'pre_meeting', 'between_meetings', 'deep_work'],
  desk: ['desk', 'office', 'quiet_ok', 'private', 'pre_meeting'],
  home: ['home', 'private', 'quiet_ok', 'lying_ok', 'bedroom', 'evening', 'morning'],
  hotel: ['hotel', 'private', 'quiet_ok', 'lying_ok', 'travel', 'hotel_gym'],
  public: ['public_ok', 'public_discrete', 'anywhere', 'anywhere_standing', 'in_transit'],
  transit: ['in_transit', 'public_discrete', 'anywhere_standing', 'travel'],
  airport: ['public_ok', 'public_discrete', 'anywhere', 'in_transit', 'travel'],
  plane: ['public_discrete', 'in_transit', 'travel', 'anywhere_standing'],
  open_office: ['desk', 'office', 'public_discrete', 'quiet_ok'],
  bedroom: ['bedroom', 'home', 'private', 'lying_ok', 'bedtime', 'evening'],
  outdoors: ['outdoors', 'morning', 'nature_access', 'daytime'],
  gym: ['gym', 'hotel_gym', 'outdoors', 'space_to_move'],
  bathroom: ['bathroom', 'bathroom_ok', 'private', 'water_access'],
  backstage: ['backstage', 'green_room', 'locker', 'pre_performance', 'private'],
  private: ['private', 'quiet_ok', 'home', 'desk'],
  anywhere: ['anywhere', 'anywhere_standing', 'public_discrete'],
};

const PUBLIC_PLACE_CLASSES = new Set(['public', 'airport', 'plane', 'open_office']);

const EVENT_NEED = {
  investor_meeting: ['pre_performance', 'stress_acute'],
  pitch: ['pre_performance', 'stress_acute'],
  demo_day: ['pre_performance'],
  board_meeting: ['pre_performance', 'stress_acute'],
  hiring_firing: ['emotion_regulate', 'affect_label'],
  post_conflict: ['emotion_regulate', 'stress_acute'],
  post_rejection: ['emotion_regulate', 'mood_lift', 'rumination'],
  meeting_streak: ['cognitive_reset', 'focus'],
  T_sleep: ['sleep_prep', 'rumination'],
  '1am_spiral': ['rumination', 'sleep_prep', 'insomnia_behavior'],
  pre_flight: ['jetlag', 'travel'],
  post_landing: ['jetlag', 'recovery_rest', 'circadian_align'],
  midday_crash: ['cognitive_fatigue', 'sleep_debt', 'energy_up', 'recovery_rest'],
  runway_scare: ['stress_chronic', 'emotion_regulate'],
  live_blank: ['micro_reset', 'pre_performance', 'stress_acute'],
  deep_work: ['focus'],
  none: [],
  '': [],
};

/** Goal → protocol affinity boosts (engineering; offline-tuned for soft agreement) */
const GOAL_PROTOCOL_BOOST = {
  pre_performance: {
    'process-visualization': 0.32,
    ppr: 0.18,
    pettlep: 0.16,
    'centering-ravizza': 0.26,
    'box-breathing': 0.1,
    'if-then-gollwitzer': 0.12,
  },
  micro_reset: {
    'physiological-sigh-acute': 0.28,
    'tactical-breath-reset': 0.24,
    'affect-labeling': 0.2,
    'centering-ravizza': 0.12,
    tipp: 0.08,
  },
  emotion_regulate: {
    'act-defusion': 0.36,
    'affect-labeling': 0.18,
    'cognitive-reappraisal': 0.08,
    'self-distancing': 0.14,
    'if-then-gollwitzer': 0.28,
    pmr: 0.28,
    tipp: 0.1,
    'opposite-action': 0.32,
  },
  sleep_prep: {
    'wind-down': 0.30,
    'stimulus-control': 0.18,
    'worry-postpone': 0.1,
    '478-breathing': 0.08,
    pmr: 0.28,
    'evening-light-hygiene': 0.12,
    'mbsr-breath-anchor': 0.3,
  },
  rumination: {
    'act-defusion': 0.36,
    'worry-postpone': 0.18,
    'self-distancing': 0.14,
    'stimulus-control': 0.1,
    'art-brief': 0.3,
  },
  cognitive_reset: {
    'task-switch-buffer': 0.2,
    'exhale-emphasized': 0.28,
    'nadi-shodhana': 0.12,
    'art-brief': 0.1,
  },
  stress_acute: {
    'cyclic-sighing': 0.16,
    'physiological-sigh-acute': 0.2,
    'exhale-emphasized': 0.14,
    'tactical-breath-reset': 0.14,
    'box-breathing': 0.1,
    '54321-grounding': 0.34,
  },
  jetlag: {
    'jetlag-light-melatonin': 0.36,
    'morning-light': 0.3,
    'caffeine-cutoff': 0.12,
  },
  'jetlag+perform': {
    'morning-light': 0.22,
    'jetlag-light-melatonin': 0.18,
    ppr: 0.12,
    'nap-protocol': 0.1,
  },
  recovery_rest: {
    'nap-protocol': 0.34,
    'yoga-nidra-nsdr': 0.32,
    'body-scan': 0.12,
    'art-brief': 0.28,
    pmr: 0.26,
  },
  recovery: {
    'yoga-nidra-nsdr': 0.2,
    'nap-protocol': 0.18,
  },
  circadian_align: {
    'evening-light-hygiene': 0.34,
    'morning-light': 0.22,
    'sleep-consistency': 0.14,
    'jetlag-light-melatonin': 0.12,
  },
  sleep_debt: {
    'morning-light': 0.34,
    'nap-protocol': 0.22,
    'yoga-nidra-nsdr': 0.12,
  },
  sleep_hygiene: {
    'caffeine-cutoff': 0.28,
    'evening-light-hygiene': 0.2,
    'sleep-consistency': 0.18,
  },
  travel: {
    'caffeine-cutoff': 0.22,
    'jetlag-light-melatonin': 0.18,
    'morning-light': 0.14,
  },
  insomnia_behavior: {
    'stimulus-control': 0.28,
    'sleep-restriction': 0.2,
    'worry-postpone': 0.12,
  },
  focus: {
    'task-switch-buffer': 0.18,
    'box-breathing': 0.12,
    'nadi-shodhana': 0.1,
  },
  goal_clarity: {
    'if-then-gollwitzer': 0.22,
    'process-visualization': 0.16,
    woop: 0.14,
    'smart-caveats': 0.34,
  },
  mood_low: {
    'behavioral-activation-tiny': 0.22,
    'social-connection-micro': 0.16,
    'gratitude-brief': 0.1,
  },
  mood: {
    'behavioral-activation-tiny': 0.18,
    'gratitude-brief': 0.12,
  },
  mood_lift: {
    'gratitude-brief': 0.18,
    'behavioral-activation-tiny': 0.14,
  },
  muscle_tension: {
    pmr: 0.24,
    'brief-pmr-acute': 0.2,
  },
  inertia: {
    'behavioral-activation-tiny': 0.22,
  },
  behavior_change: {
    'if-then-gollwitzer': 0.24,
    woop: 0.18,
  },
  stress_chronic: {
    'mbsr-breath-anchor': 0.16,
    'cyclic-sighing': 0.12,
    'coherent-resonance': 0.12,
  },
  cognitive_fatigue: {
    'task-switch-buffer': 0.16,
    'nap-protocol': 0.14,
    'yoga-nidra-nsdr': 0.12,
  },
  arousal_down: {
    'exhale-emphasized': 0.16,
    'physiological-sigh-acute': 0.14,
    '478-breathing': 0.12,
  },
  activation_up: {
    'morning-light': 0.16,
    'behavioral-activation-tiny': 0.12,
  },
  skill_rehearsal: {
    pettlep: 0.22,
    'process-visualization': 0.16,
  },
  emotion: {
    'affect-labeling': 0.16,
    'act-defusion': 0.14,
  },
  emotion_dysregulate: {
    tipp: 0.22,
    'cold-face': 0.18,
  },
  crisis_emotion: {
    tipp: 0.2,
  },
  'fatigue+perform': {
    ppr: 0.14,
    'physiological-sigh-acute': 0.12,
    'morning-light': 0.1,
  },
  stress: {
    'cyclic-sighing': 0.14,
    'exhale-emphasized': 0.12,
  },
};

const BREATH_IDS = new Set(
  CATALOG.filter(
    (p) =>
      (p.categories || []).includes('breathing') ||
      /breath|sigh|exhale|nadi|box|coherent|diaphragm|478|hyperventil/i.test(p.protocol_id)
  ).map((p) => p.protocol_id)
);

const CRISIS_PATTERNS = [
  /\bsuicid/i,
  /\bkill\s+my\s*self\b/i,
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
  if (history.disliked_modalities.includes('breath') || history.disliked_modalities.includes('breathing')) {
    // dislike alone is NOT medical — only explicit contra:breath
  }
  const notes = String(input.history_notes || '');
  if (/contra(?:indication)?s?\s*:\s*breath/i.test(notes)) return true;
  if (/medical\s+contra.*breath|breath.*medical\s+contra/i.test(notes)) return true;
  if (/panic.?breath.?intoler|breath.?intolerance/i.test(notes)) return true;
  return false;
}

function loadOutcomes(limit = 500) {
  try {
    if (!fs.existsSync(OUTCOMES_PATH)) return [];
    const lines = fs.readFileSync(OUTCOMES_PATH, 'utf8').split('\n').filter(Boolean);
    return lines
      .slice(-limit)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** Per client_id → protocol_id → mean centered rating boost (−0.15..+0.15) */
function outcomeBoostMap(clientId) {
  const map = new Map();
  if (!clientId) return map;
  const rows = loadOutcomes().filter((o) => o.client_id === clientId);
  const byProto = new Map();
  for (const o of rows) {
    if (!o.protocol_id || o.rating_1_to_10 == null) continue;
    if (!byProto.has(o.protocol_id)) byProto.set(o.protocol_id, []);
    byProto.get(o.protocol_id).push(Number(o.rating_1_to_10));
  }
  for (const [pid, ratings] of byProto) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    // 1–10 → −0.15..+0.15 around 5.5
    const boost = Math.max(-0.15, Math.min(0.15, ((avg - 5.5) / 4.5) * 0.15));
    map.set(pid, boost);
  }
  return map;
}

function inferNeeds(input) {
  const needs = new Map();
  const add = (n, w) => needs.set(n, Math.max(needs.get(n) || 0, w));

  const stress = Number(input.stress) || 0;
  const energy = Number(input.energy) || 3;
  const sleepH = input.sleep_h != null && input.sleep_h !== '' ? Number(input.sleep_h) : null;
  const event = (input.upcoming_event_tag || 'none').toLowerCase();
  const minutes = Number(input.available_minutes) || 0;
  const goal = (input.goal || '').toLowerCase().trim();
  if (goal && goal !== 'any' && goal !== 'unknown') {
    for (const g of goal.split(/[+|,/]/)) {
      const gg = g.trim();
      if (gg) add(gg, 0.98);
    }
  }

  if (stress >= 4) add('stress_acute', 0.9);
  else if (stress >= 3) add('stress_acute', 0.55);
  if (stress >= 4 && energy <= 2) add('stress_chronic', 0.5);

  if (energy <= 2) {
    add('mood_low', 0.6);
    add('inertia', 0.5);
    add('cognitive_fatigue', 0.45);
  }
  if (energy >= 4 && stress <= 2) add('focus', 0.4);

  if (sleepH != null) {
    if (sleepH < 5.5) {
      add('sleep_debt', 0.7);
      add('cognitive_fatigue', 0.5);
    }
    if (sleepH < 6.5 && /T_sleep|1am|sleep|bed/i.test(event)) add('sleep_prep', 0.8);
  }

  for (const n of EVENT_NEED[event] || []) add(n, 0.85);
  if ((EVENT_NEED[event] || []).includes('pre_performance')) add('pre_performance', 0.9);

  if (/sleep|T_sleep|1am|bed/i.test(event)) add('sleep_prep', 0.85);
  if (/jetlag|landing|flight/i.test(event)) add('jetlag', 0.85);

  if (minutes > 0 && minutes <= 3) add('micro_reset', 0.85);

  const ct = (input.client_type || '').toLowerCase();
  if ((ct.includes('founder') || ct.includes('ceo')) && (EVENT_NEED[event] || []).includes('pre_performance')) {
    add('pre_performance', 0.95);
  }
  if ((ct.includes('athlete') || ct.includes('sport')) && (EVENT_NEED[event] || []).includes('pre_performance')) {
    add('pre_performance', 0.95);
  }
  if ((ct.includes('travel') || event.includes('landing') || event.includes('flight')) && !needs.has('jetlag')) {
    add('jetlag', 0.5);
  }

  if (needs.size === 0) {
    if (stress >= 3) add('arousal_down', 0.5);
    else add('cognitive_reset', 0.35);
  }

  if (stress >= 4) add('arousal_down', 0.6);

  return [...needs.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([need, urgency]) => ({ need, urgency, confidence: 0.6, source_class: 'estimated' }));
}

function primaryNeed(inferred) {
  return inferred[0] ? inferred[0].need : 'unknown';
}

function jaccard(a, b) {
  const A = new Set(a || []);
  const B = new Set(b || []);
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function isPublicContext(input) {
  const place = (input.place_class || '').toLowerCase();
  const privacy = (input.privacy || '').toLowerCase();
  return PUBLIC_PLACE_CLASSES.has(place) || privacy === 'public';
}

function doseSecForGap(protocol, input, inferredNeeds) {
  const gapSec = Math.max(0, Number(input.available_minutes) || 0) * 60;
  const needNames = new Set(inferredNeeds.map((n) => n.need));
  // P1-4 product rule:
  //   Preferred dose = recommended_duration_sec.
  //   If recommended > gap but min_duration_sec <= gap, shrink dose to fit gap
  //   (never below catalog min; never exceed available_minutes*60).
  //   Micro/acute gaps (≤120s) prefer min when tagged micro/acute.
  const recSec = protocol.recommended_duration_sec || protocol.max_duration_sec || 99999;
  const minSec = protocol.min_duration_sec || Math.min(60, recSec);
  const microPrefer =
    gapSec <= 120 &&
    (needNames.has('micro_reset') ||
      needNames.has('stress_acute') ||
      needNames.has('pre_performance') ||
      (protocol.need_tags || []).includes('micro_reset'));
  let doseSec;
  if (microPrefer) {
    doseSec = minSec;
  } else if (recSec <= gapSec) {
    doseSec = recSec;
  } else if (minSec <= gapSec) {
    doseSec = Math.min(recSec, gapSec); // shrink toward min, still <= gap
  } else {
    doseSec = recSec; // will hard-exclude
  }
  return { doseSec, gapSec, recSec, minSec, allowMin: microPrefer || (recSec > gapSec && minSec <= gapSec) };
}

function hardExclude(protocol, input, inferredNeeds) {
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

  // P1-3: hard-exclude non-discrete protocols in public contexts
  if (isPublicContext(input) && protocol.public_discrete === false) {
    reasons.push(`public_discrete_false:${place || input.privacy || 'public'}`);
  }

  // equipment hard check (light/jetlag protocols OK when goal implies travel/circadian)
  const equip = protocol.equipment || [];
  const needsEquip = equip.filter((e) => e && e !== 'none');
  if (needsEquip.length) {
    const goal = String(input.goal || '').toLowerCase();
    const lightGoal = /jetlag|circadian|sleep_debt|travel|recovery/.test(goal) ||
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

  // P1-2: prefers_breath=no is strong penalty unless medical contra → hard exclude
  if (input.prefers_breath === 'no' && BREATH_IDS.has(protocol.protocol_id) && hasBreathMedicalContra(input)) {
    reasons.push('prefers_breath_no_medical_contra');
  }

  if (history.prior_negative.includes(protocol.protocol_id) && input.hard_exclude_prior_negative) {
    reasons.push('prior_negative_hard');
  }

  return reasons;
}

function scoreProtocol(protocol, input, inferredNeeds, outcomeBoosts) {
  const w = SPEC.weights;
  const pen = SPEC.penalties;
  const evidenceMap = SPEC.evidence_map;
  const needNames = inferredNeeds.map((n) => n.need);
  const needSet = new Set(needNames);
  const history = parseHistoryNotes(input.history_notes);
  const place = (input.place_class || 'office').toLowerCase();
  const placeTags = PLACE_MAP[place] || PLACE_MAP.office;
  const event = (input.upcoming_event_tag || '').toLowerCase();
  const gapSec = Math.max(1, (Number(input.available_minutes) || 0) * 60);
  const dur = protocol.recommended_duration_sec || protocol.max_duration_sec || 300;
  const goal = (input.goal || '').toLowerCase().trim();

  let needMatch = jaccard(protocol.need_tags || [], needNames);
  let needScore = needMatch;
  if ((protocol.need_tags || []).includes(needNames[0])) needScore = Math.min(1, needScore + 0.35);
  // Exact goal tag in protocol needs
  if (goal && (protocol.need_tags || []).includes(goal)) needScore = Math.min(1, needScore + 0.25);
  const urg = inferredNeeds[0] ? inferredNeeds[0].urgency : 0.5;
  needScore = Math.min(1, needScore * (0.7 + 0.3 * urg));

  const ctx = protocol.context_tags || [];
  let contextScore = jaccard(ctx, placeTags);
  if (isPublicContext(input)) {
    if (protocol.public_discrete) contextScore = Math.min(1, contextScore + 0.4);
    else contextScore *= 0.2;
  }
  if (place === 'office' || place === 'desk') {
    if (ctx.includes('desk') || ctx.includes('pre_meeting') || ctx.includes('office')) {
      contextScore = Math.min(1, contextScore + 0.25);
    }
  }

  let timing = 0.35;
  const moments = protocol.moment_tags || [];
  const eventMoments = {
    investor_meeting: ['pre_pitch', 'pre_meeting', 'pre_performance'],
    pitch: ['pre_pitch', 'pre_performance'],
    demo_day: ['demo_day', 'pre_performance', 'pre_pitch'],
    post_conflict: ['post_conflict'],
    post_rejection: ['post_rejection'],
    meeting_streak: ['meeting_streak', 'context_switch', 'cognitive_fatigue'],
    T_sleep: ['T_sleep', 'evening'],
    '1am_spiral': ['1am_spiral', 'insomnia_night', 'T_sleep'],
    post_landing: ['post_landing', 'travel'],
    pre_flight: ['pre_flight', 'travel'],
    midday_crash: ['midday_crash', 'recovery'],
    live_blank: ['live_blank', 'elevator', 'acute_stress'],
    hiring_firing: ['hiring_firing', 'moral_load', 'shame'],
    deep_work: ['deep_work'],
  };
  const want = eventMoments[event] || [];
  if (want.length && moments.some((m) => want.includes(m))) timing = 0.95;
  else if (moments.some((m) => needSet.has(m.replace(/-/g, '_')))) timing = 0.7;
  else if (want.length === 0) timing = 0.5;

  const ev = evidenceMap[String(protocol.evidence_A_to_E || 'D').toUpperCase()] ?? 0.35;

  let historyFeat = 0.5;
  let histPenalty = 0;
  if (history.prior_positive.includes(protocol.protocol_id)) historyFeat = 1.0;
  if (history.prior_negative.includes(protocol.protocol_id)) {
    historyFeat = 0.0;
    histPenalty = pen.prior_negative;
  }
  if (history.prior_positive.some((id) => BREATH_IDS.has(id)) && BREATH_IDS.has(protocol.protocol_id)) {
    historyFeat = Math.max(historyFeat, 0.85);
  }
  if (history.prior_negative.some((id) => BREATH_IDS.has(id)) && BREATH_IDS.has(protocol.protocol_id)) {
    histPenalty = Math.max(histPenalty, pen.prior_negative * 0.8);
    historyFeat = Math.min(historyFeat, 0.2);
  }

  let pref = 0.5;
  if (input.prefers_breath === 'yes') {
    pref = BREATH_IDS.has(protocol.protocol_id) ? 1.0 : 0.35;
  } else if (input.prefers_breath === 'no') {
    pref = BREATH_IDS.has(protocol.protocol_id) ? 0.0 : 0.75;
  } else {
    pref = 0.55;
  }

  const fit = dur <= gapSec ? 1 - 0.4 * (dur / gapSec) : 0;
  let feasibility = Math.max(0, Math.min(1, fit));
  if (protocol.complexity === 'high' && gapSec < 600) feasibility *= 0.7;
  if (isPublicContext(input) && !protocol.public_discrete) feasibility *= 0.3;

  const intensity = protocol.intensity || 'moderate';
  let intensityFit = 0.7;
  const stress = Number(input.stress) || 3;
  if (stress >= 4 && /high|moderate/i.test(String(intensity))) intensityFit = 0.85;
  if (stress <= 2 && /low|micro/i.test(String(intensity))) intensityFit = 0.8;
  const expected_benefit = Math.min(1, ev * urg * intensityFit + 0.15);

  const adherence_prob = Math.max(0.2, Math.min(1, 1.1 - dur / 1800));

  let raw =
    w.need_match * needScore +
    w.context_match * contextScore +
    w.timing * timing +
    w.evidence * ev +
    w.history * historyFeat +
    w.preference * pref +
    w.feasibility * feasibility +
    w.expected_benefit * expected_benefit +
    w.adherence_prob * adherence_prob;

  if ((protocol.need_tags || []).includes(needNames[0])) raw += 0.08;
  if (want.length && moments.some((m) => want.includes(m))) raw += 0.06;
  if (protocol.staff_preferred) raw += 0.03;

  // Goal affinity boosts (calibration)
  const goals = goal ? goal.split(/[+|,/]/).map((g) => g.trim()).filter(Boolean) : [];
  if (!goals.length && needNames[0]) goals.push(needNames[0]);
  for (const g of goals) {
    const table = GOAL_PROTOCOL_BOOST[g];
    if (table && table[protocol.protocol_id] != null) raw += table[protocol.protocol_id];
  }

  // CPI priors (engineering)
  const ct = (input.client_type || '').toLowerCase();
  if ((ct.includes('founder') || ct.includes('ceo')) && needSet.has('pre_performance') && gapSec >= 180) {
    const ids = ct.includes('ceo') ? CPI_PRIORS.ceo.pre_performance_boost_ids : CPI_PRIORS.founder.pre_performance_boost_ids;
    const boost = ct.includes('ceo') ? CPI_PRIORS.ceo.boost : CPI_PRIORS.founder.boost;
    if (ids.includes(protocol.protocol_id)) raw += boost;
    // Prefer imagery over generic box when gap allows process viz
    if (gapSec >= 300 && protocol.protocol_id === 'box-breathing' && !ct.includes('ceo')) raw -= 0.08;
    if (gapSec >= 300 && protocol.protocol_id === 'process-visualization') raw += 0.08;
  }
  if (ct.includes('athlete') && needSet.has('pre_performance')) {
    if (CPI_PRIORS.athlete.pre_performance_boost_ids.includes(protocol.protocol_id)) raw += CPI_PRIORS.athlete.boost;
  }
  if (
    (ct.includes('travel') || needSet.has('jetlag') || /landing|flight|travel/i.test(event)) &&
    CPI_PRIORS.traveler.travel_boost_ids.includes(protocol.protocol_id)
  ) {
    raw += CPI_PRIORS.traveler.boost;
  }

  // Micro gap prior — prefer true micro protocols that fit
  if (gapSec <= 120 && (protocol.need_tags || []).includes('micro_reset')) raw += 0.12;
  if (gapSec <= 90) {
    // Deprioritize longer pre-performance cards that squeeze in via low min
    if (['process-visualization', 'pettlep', 'woop'].includes(protocol.protocol_id)) raw -= 0.2;
    if (protocol.protocol_id === 'ppr' && needSet.has('micro_reset')) raw -= 0.08;
  }

  if (
    (needSet.has('micro_reset') || needSet.has('pre_performance') || needSet.has('stress_acute')) &&
    ['caffeine-cutoff', 'sleep-consistency', 'evening-light-hygiene', 'wind-down'].includes(protocol.protocol_id)
  ) {
    raw -= 0.28;
  }

  // Sleep / hygiene goals: don't let acute breath dominate
  if (
    (goal === 'sleep_hygiene' || goal === 'circadian_align' || goal === 'sleep_debt' || goal === 'travel') &&
    BREATH_IDS.has(protocol.protocol_id)
  ) {
    raw -= 0.18;
  }
  if ((goal === 'recovery_rest' || goal === 'recovery') && BREATH_IDS.has(protocol.protocol_id)) {
    raw -= 0.15;
  }

  // Learning loop outcome boost (client-isolated)
  if (outcomeBoosts && outcomeBoosts.has(protocol.protocol_id)) {
    raw += outcomeBoosts.get(protocol.protocol_id);
  }

  let penalties = histPenalty;
  if (protocol.complexity === 'high' && (Number(input.energy) || 3) <= 3) penalties += pen.complexity_high;
  if (isPublicContext(input) && !protocol.public_discrete) penalties += pen.friction_public;

  // P1-2: prefers_breath=no → strong penalty (−0.35) unless hard-excluded already
  if (input.prefers_breath === 'no' && BREATH_IDS.has(protocol.protocol_id) && !hasBreathMedicalContra(input)) {
    penalties += 0.35;
  }

  const score = Math.max(0, raw - penalties); // uncapped for ranking headroom; UI may still show 0–1+

  const why = [];
  if ((protocol.need_tags || []).includes(needNames[0])) why.push(`need:${needNames[0]}`);
  if (goal && (protocol.need_tags || []).includes(goal)) why.push(`goal:${goal}`);
  if (want.length && moments.some((m) => want.includes(m))) why.push(`moment:${event}`);
  why.push(`evidence:${protocol.evidence_A_to_E}`);
  why.push(`duration:${Math.round(dur / 60)}m`);
  if (input.prefers_breath === 'yes' && BREATH_IDS.has(protocol.protocol_id)) why.push('pref:breath');
  if (input.prefers_breath === 'no' && !BREATH_IDS.has(protocol.protocol_id)) why.push('pref:non-breath');
  if (input.prefers_breath === 'no' && BREATH_IDS.has(protocol.protocol_id)) why.push('pref:breath_penalty');
  if (history.prior_positive.includes(protocol.protocol_id)) why.push('history:positive');
  if (protocol.public_discrete && isPublicContext(input)) why.push('public_discrete');
  if (outcomeBoosts && outcomeBoosts.has(protocol.protocol_id)) why.push('outcome_boost');

  return {
    score: Math.round(score * 1000) / 1000,
    features: {
      need_match: round2(needScore),
      context_match: round2(contextScore),
      timing: round2(timing),
      evidence: round2(ev),
      history: round2(historyFeat),
      preference: round2(pref),
      feasibility: round2(feasibility),
      expected_benefit: round2(expected_benefit),
      adherence_prob: round2(adherence_prob),
      penalties: round2(penalties),
    },
    why,
  };
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

function buildMessage(input, selected, inferred) {
  if (!selected) return null;
  const event = (input.upcoming_event_tag || 'none').toLowerCase();
  const minutes = Math.max(
    1,
    Math.round((selected.recommended_duration_sec || selected.max_duration_sec) / 60)
  );
  const need = primaryNeed(inferred);
  const place = input.place_class || 'here';

  const templates = {
    investor_meeting: {
      context: `Context: investor / high-stakes meeting soon · ${place}.`,
      why: `Why now: settle arousal and rehearse the open (need “${need.replace(/_/g, ' ')}”; stress ${input.stress}/5).`,
    },
    pitch: {
      context: `Context: pitch window · ${place}.`,
      why: `Why now: sharpen delivery under stress (stress ${input.stress}/5, energy ${input.energy}/5).`,
    },
    T_sleep: {
      context: `Context: sleep-prep window · ${place}.`,
      why: `Why now: protect sleep onset — avoid activation (need “${need.replace(/_/g, ' ')}”).`,
    },
    '1am_spiral': {
      context: `Context: night rumination · ${place}.`,
      why: `Why now: interrupt spiral without screens or protocols that raise arousal.`,
    },
    post_landing: {
      context: `Context: travel / post-landing · ${place}.`,
      why: `Why now: circadian + recovery support after timezone shift.`,
    },
    pre_flight: {
      context: `Context: pre-flight travel hygiene · ${place}.`,
      why: `Why now: set light/caffeine/sleep anchors before wheels-up.`,
    },
    live_blank: {
      context: `Context: acute micro-gap · ${place}.`,
      why: `Why now: 60–120s reset before the next beat (stress ${input.stress}/5).`,
    },
    midday_crash: {
      context: `Context: midday energy dip · ${place}.`,
      why: `Why now: restore without wrecking night sleep.`,
    },
  };

  const t = templates[event] || {
    context:
      event && event !== 'none'
        ? `Context: ${String(event).replace(/_/g, ' ')} · ${place}.`
        : `Context: ${place}.`,
    why: `Why now: inferred need “${need.replace(/_/g, ' ')}” (stress ${input.stress}/5, energy ${input.energy}/5).`,
  };

  const action = `Action: run “${selected.name}” (${selected.protocol_id}).`;
  const dur = `Duration: ~${minutes} min (fits ${input.available_minutes} min gap; dose ≤ gap).`;
  const skip = 'Skip/SILENCE is always OK.';
  return `${t.context} ${t.why} ${action} ${dur} ${skip}`;
}

/** Minimal sequence suggestions (not a scheduler) */
function suggestSequence(primary, input, inferred) {
  if (!primary) return undefined;
  const seq = [];
  const cats = primary.categories || [];
  const need = primaryNeed(inferred);
  const event = (input.upcoming_event_tag || '').toLowerCase();
  const id = primary.protocol_id;

  // Explicit follow_up_ids if catalog ever adds them
  if (Array.isArray(primary.follow_up_ids) && primary.follow_up_ids.length) {
    for (const fid of primary.follow_up_ids.slice(0, 3)) {
      if (CATALOG.some((p) => p.protocol_id === fid)) seq.push(fid);
    }
  }

  // stress → after meeting: settle then optional cognitive reset
  if (cats.includes('stress') || need === 'stress_acute' || need === 'pre_performance') {
    if (event === 'investor_meeting' || event === 'pitch' || event === 'demo_day') {
      if (id !== 'physiological-sigh-acute') seq.push('physiological-sigh-acute');
      if (id !== 'task-switch-buffer') seq.push('task-switch-buffer');
    } else if (!seq.length) {
      if (id !== 'exhale-emphasized') seq.push('exhale-emphasized');
    }
  }

  // jetlag / travel chain
  if (need === 'jetlag' || need === 'circadian_align' || /landing|flight|travel/i.test(event)) {
    if (id !== 'morning-light') seq.push('morning-light');
    if (id !== 'nap-protocol') seq.push('nap-protocol');
  }

  // sleep prep follow-up
  if (need === 'sleep_prep' && id !== 'worry-postpone') {
    seq.push('worry-postpone');
  }

  const out = [...new Set(seq.filter((x) => x !== id))].slice(0, 3);
  return out.length ? out : undefined;
}

function escalateResult(input, reason) {
  return {
    action: 'escalate',
    decision: 'SILENCE',
    silence: true,
    inferred_need: 'crisis',
    recommendations: [],
    exclusions: [{ protocol_id: '*', reasons: [reason] }],
    exclusions_total: 1,
    exclusions_truncated: false,
    personalized_message:
      'ESCALATE: Crisis signal detected. Do not run breath/performance protocols. Connect principal to consented human support / emergency resources immediately. Staff: stay with them; do not leave protocol cards.',
    why_selected: [reason],
    tau_select: SPEC.thresholds.tau_select,
    scores: {},
    input,
    crisis_nlp: reason === 'crisis_nlp_keyword',
  };
}

function recommend(rawInput) {
  const input = normalizeInput(rawInput);

  // P0-3: crisis NLP on free-text (same path as crisis_flag)
  if (input.crisis_flag || detectCrisisText(input)) {
    return escalateResult(input, input.crisis_flag ? 'crisis_flag → no protocol ranking' : 'crisis_nlp_keyword');
  }

  const activity = String(input.activity || '').toLowerCase();
  const notes = String(input.history_notes || '').toLowerCase();
  if (
    input.force_silence ||
    activity === 'in_meeting' ||
    activity === 'driving' ||
    activity === 'sleeping' ||
    /\bdnd\b|do not disturb|orthosomnia|flow_protect|activity_gate|receptivity_gate|daily_cap/i.test(notes)
  ) {
    return {
      action: 'silence',
      decision: 'SILENCE',
      silence: true,
      inferred_need: 'policy_silence',
      recommendations: [],
      exclusions: [{ protocol_id: '*', reasons: ['activity_or_policy_gate'] }],
      exclusions_total: 1,
      exclusions_truncated: false,
      personalized_message: 'SILENCE: activity/receptivity/policy gate. No protocol push.',
      why_selected: ['activity_or_policy_gate'],
      tau_select: SPEC.thresholds.tau_select,
      scores: {},
      input,
    };
  }

  const errors = validateInput(input);
  if (errors.length) {
    return {
      action: 'error',
      decision: 'INVALID',
      silence: true,
      errors,
      recommendations: [],
      exclusions: [],
      exclusions_total: 0,
      exclusions_truncated: false,
      personalized_message: 'Invalid input: ' + errors.join('; '),
      why_selected: ['validation_failed'],
      input,
    };
  }

  const inferred = inferNeeds(input);
  const exclusions = [];
  const scored = [];
  const outcomeBoosts = outcomeBoostMap(input.client_id);

  for (const p of CATALOG) {
    const reasons = hardExclude(p, input, inferred);
    if (reasons.length) {
      exclusions.push({ protocol_id: p.protocol_id, name: p.name, reasons });
      continue;
    }
    const s = scoreProtocol(p, input, inferred, outcomeBoosts);
    scored.push({
      protocol_id: p.protocol_id,
      name: p.name,
      evidence: p.evidence_A_to_E,
      max_duration_sec: p.max_duration_sec,
      recommended_duration_sec: p.recommended_duration_sec,
      min_duration_sec: p.min_duration_sec,
      arousal_direction: p.arousal_direction,
      need_tags: p.need_tags,
      categories: p.categories,
      public_discrete: p.public_discrete,
      clinician_only: p.clinician_only,
      follow_up_ids: p.follow_up_ids || undefined,
      score: s.score,
      features: s.features,
      why: s.why,
      purpose: p.purpose,
      is_vault_ip: !!p.is_vault_ip,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const tau = SPEC.thresholds.tau_select;
  const top = scored.slice(0, 3);

  // P2-2: return full exclusions + totals (no silent truncate)
  const exclPayload = {
    exclusions,
    exclusions_total: exclusions.length,
    exclusions_truncated: false,
  };

  if (!top.length || top[0].score < tau) {
    return {
      action: 'silence',
      decision: 'SILENCE',
      silence: true,
      inferred_need: primaryNeed(inferred),
      inferred_needs: inferred,
      recommendations: top,
      below_threshold: true,
      ...exclPayload,
      personalized_message: `SILENCE: best score ${top[0] ? top[0].score : 0} < τ_select ${tau}. Prefer no protocol push; staff may still coach manually.`,
      why_selected: top[0]
        ? [`best:${top[0].protocol_id}@${top[0].score}<tau`, ...((top[0] && top[0].why) || [])]
        : ['no_candidates_after_filters'],
      tau_select: tau,
      scores: Object.fromEntries(scored.slice(0, 10).map((x) => [x.protocol_id, x.score])),
      input,
      suggested_sequence: undefined,
    };
  }

  const primary = top[0];
  const full = CATALOG.find((p) => p.protocol_id === primary.protocol_id);
  const suggested_sequence = suggestSequence(full || primary, input, inferred);

  return {
    action: 'suggest',
    decision: 'RECOMMEND',
    silence: false,
    inferred_need: primaryNeed(inferred),
    inferred_needs: inferred,
    recommendations: top,
    ...exclPayload,
    personalized_message: buildMessage(input, full || primary, inferred),
    why_selected: primary.why,
    tau_select: tau,
    scores: Object.fromEntries(scored.slice(0, 10).map((x) => [x.protocol_id, x.score])),
    input,
    suggested_sequence,
  };
}

function normalizeInput(raw) {
  const r = raw || {};
  return {
    client_type: r.client_type || 'startup_founder',
    client_id: r.client_id || null,
    available_minutes: r.available_minutes != null ? Number(r.available_minutes) : 10,
    place_class: r.place_class || 'office',
    privacy: r.privacy || null,
    upcoming_event_tag: r.upcoming_event_tag || 'none',
    stress: r.stress != null ? Number(r.stress) : 3,
    energy: r.energy != null ? Number(r.energy) : 3,
    sleep_h: r.sleep_h === '' || r.sleep_h == null ? null : Number(r.sleep_h),
    prefers_breath: r.prefers_breath || 'neutral',
    history_notes: r.history_notes || '',
    notes: r.notes || '',
    clinician_mode: !!r.clinician_mode,
    crisis_flag: !!r.crisis_flag,
    hard_exclude_prior_negative: !!r.hard_exclude_prior_negative,
    goal: r.goal || '',
    activity: r.activity || '',
    force_silence: !!r.force_silence,
  };
}

function validateInput(input) {
  const errors = [];
  if (Number.isNaN(input.available_minutes) || input.available_minutes < 0) errors.push('available_minutes invalid');
  if (input.stress < 1 || input.stress > 5 || Number.isNaN(input.stress)) errors.push('stress must be 1–5');
  if (input.energy < 1 || input.energy > 5 || Number.isNaN(input.energy)) errors.push('energy must be 1–5');
  if (input.sleep_h != null && (Number.isNaN(input.sleep_h) || input.sleep_h < 0 || input.sleep_h > 24)) {
    errors.push('sleep_h must be 0–24');
  }
  if (!['yes', 'no', 'neutral'].includes(input.prefers_breath)) errors.push('prefers_breath must be yes|no|neutral');
  return errors;
}

function batchRecommend(scenarios) {
  if (!Array.isArray(scenarios)) return { error: 'expected array' };
  return scenarios.map((s, i) => {
    const id = s.id || s.case_id || `S${i + 1}`;
    const result = recommend(s.input || s);
    return { id, ...result };
  });
}

function inputSummary(input) {
  const keys = [
    'client_type',
    'client_id',
    'available_minutes',
    'place_class',
    'privacy',
    'upcoming_event_tag',
    'stress',
    'energy',
    'sleep_h',
    'prefers_breath',
    'goal',
    'crisis_flag',
    'force_silence',
  ];
  const obj = {};
  for (const k of keys) if (input && input[k] != null && input[k] !== '') obj[k] = input[k];
  const hash = crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
  return { hash, summary: obj };
}

module.exports = {
  recommend,
  batchRecommend,
  inferNeeds,
  loadCatalog: () => CATALOG,
  loadSpec: () => SPEC,
  CATALOG,
  SPEC,
  BREATH_IDS,
  parseHistoryNotes,
  detectCrisisText,
  hasBreathMedicalContra,
  isPublicContext,
  inputSummary,
  loadOutcomes,
  outcomeBoostMap,
  GOAL_PROTOCOL_BOOST,
  CPI_PRIORS,
  DATA_DIR,
  OUTCOMES_PATH,
};
