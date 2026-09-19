/**
 * PIE ranker — hard filters + weighted score from score_spec.json
 * Catalog: public protocol IDs only. Never expands vault IP steps.
 *
 * Duration (product decision, P1-4 / Phase 2):
 *   Dose for gap-fit = recommended_duration_sec, with fallback to min_duration_sec
 *   under micro/acute gaps (≤120s). Never recommend a dose > available_minutes*60.
 *   Recommendations expose dose {micro,minimum,recommended,extended}; prefer micro when gap is tight.
 *
 * Phase 2 learning: personal response_graph averages boost stronger than raw outcomes.jsonl.
 * Still simple averages — NOT bandits. No ranker rewrite.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const safety = require('./safety_gateway');
const {
  fromFlatInput: clientStateFromFlat,
  countUnknown,
  buildClientState,
} = require('./schemas/client_state');
const { fromFlatInput: contextFromFlat, buildContext } = require('./schemas/context');
const { fromFlatInput: momentFromFlat } = require('./schemas/moment');
const { upgradeCatalog, mapEvidenceClass } = require('./schemas/protocol_card');
const { buildExplanation } = require('./schemas/explanation');
const { computeConfidence } = require('./schemas/confidence');
const { buildDecisionRecord } = require('./schemas/decision_record');
const responseGraph = require('./response_graph');

const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, '02_protocol_catalog', 'catalog.jsonl');
const SPEC_PATH = path.join(ROOT, '05_ranking', 'score_spec.json');
const DATA_DIR = path.join(__dirname, 'data');
const OUTCOMES_PATH = path.join(DATA_DIR, 'outcomes.jsonl');

function loadCatalog() {
  const lines = fs.readFileSync(CATALOG_PATH, 'utf8').split('\n').filter(Boolean);
  const raw = lines.map((l) => JSON.parse(l));
  // Protocol versioning: default 1.0.0 if missing; attach upgrade fields
  return upgradeCatalog(raw.map((p) => ({ ...p, version: p.version || '1.0.0' })));
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

const PUBLIC_PLACE_CLASSES = safety.PUBLIC_PLACE_CLASSES;

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
    '54321-grounding': 0.36,
    tipp: 0.12,
    'affect-labeling': 0.14,
    'exhale-emphasized': 0.1,
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

/** Event → protocol affinity (candidate-gen; not SPEC.weights) */
const EVENT_PROTOCOL_BOOST = {
  post_rejection: {
    'act-defusion': 0.22,
    'affect-labeling': 0.1,
    'behavioral-activation-tiny': 0.12,
  },
  post_conflict: {
    'affect-labeling': 0.14,
    'cognitive-reappraisal': 0.1,
    'self-distancing': 0.1,
  },
  hiring_firing: {
    'values-compass': 0.2,
    'affect-labeling': 0.12,
    'social-connection-micro': 0.08,
  },
  '1am_spiral': {
    'stimulus-control': 0.2,
    'worry-postpone': 0.12,
  },
  T_sleep: {
    'wind-down': 0.28,
    'evening-light-hygiene': 0.12,
    'mbsr-breath-anchor': 0.14,
    'autogenic': 0.08,
  },
};

const BREATH_IDS = new Set(
  CATALOG.filter(
    (p) =>
      (p.categories || []).includes('breathing') ||
      /breath|sigh|exhale|nadi|box|coherent|diaphragm|478|hyperventil/i.test(p.protocol_id)
  ).map((p) => p.protocol_id)
);

const CRISIS_PATTERNS = safety.CRISIS_PATTERNS;

function detectCrisisText(input) {
  return safety.detectCrisisText(input);
}

function parseHistoryNotes(notes) {
  return safety.parseHistoryNotes(notes);
}

function hasBreathMedicalContra(input) {
  return safety.hasBreathMedicalContra(input);
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

/** Per client_id → protocol_id → mean centered rating boost.
 * Phase 2: prefer response_graph (stronger −0.25..+0.25); fall back to outcomes.jsonl (−0.15..+0.15).
 * Simple averages only — NOT bandits.
 */
function outcomeBoostMap(clientId) {
  const map = new Map();
  if (!clientId) return map;
  // Stronger path: file-backed personal response graph
  const fromGraph = responseGraph.graphBoostMap(clientId);
  for (const [pid, boost] of fromGraph) map.set(pid, boost);
  // Fill gaps from raw outcomes.jsonl (weaker) if graph missing that protocol
  const rows = loadOutcomes().filter((o) => o.client_id === clientId);
  const byProto = new Map();
  for (const o of rows) {
    if (!o.protocol_id || o.rating_1_to_10 == null) continue;
    if (!byProto.has(o.protocol_id)) byProto.set(o.protocol_id, []);
    byProto.get(o.protocol_id).push(Number(o.rating_1_to_10));
  }
  for (const [pid, ratings] of byProto) {
    if (map.has(pid)) continue; // graph wins
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
    // crisis_emotion is regulation (not escalate); bridge to acute/panic needs only
    if (goal === 'crisis_emotion') {
      add('stress_acute', 0.85);
      add('panic_spike', 0.7);
      add('emotion_regulate', 0.6);
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
  return safety.isPublicContext(input);
}

function doseSecForGap(protocol, input, inferredNeeds) {
  const gapSec = Math.max(0, Number(input.available_minutes) || 0) * 60;
  const needNames = new Set(inferredNeeds.map((n) => n.need));
  const goal = String(input.goal || '').toLowerCase();
  // P1-4 product rule:
  //   Preferred dose = recommended_duration_sec.
  //   If recommended > gap but min_duration_sec <= gap, shrink dose to fit gap
  //   (never below catalog min; never exceed available_minutes*60).
  //   Micro/acute gaps (≤120s) prefer min when tagged micro/acute.
  //   Behavior-prescription cards (multi-hour sleep/hygiene windows) use a short
  //   staff briefing dose when goal/need overlaps — not hard-excluded as in-session.
  const doseBands = doseVariants(protocol);
  const recSec = doseBands.recommended || protocol.recommended_duration_sec || protocol.max_duration_sec || 99999;
  const minSec = doseBands.minimum || protocol.min_duration_sec || Math.min(60, recSec);
  const microSec = doseBands.micro != null ? doseBands.micro : Math.min(minSec, 120);
  const tightGap = gapSec > 0 && gapSec < recSec && gapSec <= 180;
  const microPrefer =
    (gapSec <= 120 || tightGap) &&
    (needNames.has('micro_reset') ||
      needNames.has('stress_acute') ||
      needNames.has('pre_performance') ||
      tightGap ||
      (protocol.need_tags || []).includes('micro_reset'));
  const pNeeds = protocol.need_tags || [];
  const focusWorkBlock =
    (goal === 'focus' || needNames.has('focus')) &&
    protocol.protocol_id === 'pomodoro-ultradian' &&
    gapSec >= 600;
  const prescriptionLike =
    (minSec >= 900 &&
      ((protocol.categories || []).some((c) => /sleep|goals|circadian/i.test(c)) ||
        pNeeds.some((n) =>
          /sleep|circadian|insomnia|hygiene|jetlag|goal_clarity/i.test(String(n))
        ))) ||
    focusWorkBlock;
  const goalOverlaps =
    pNeeds.some((n) => needNames.has(n) || (goal && goal.includes(String(n)))) ||
    (goal && pNeeds.some((n) => String(n).includes(goal.split(/[+|,/]/)[0])));
  let doseSec;
  if (prescriptionLike && goalOverlaps && gapSec > 0) {
    // Briefing / education dose fits the available staff gap
    doseSec = Math.min(gapSec, Math.max(60, Math.min(300, gapSec)));
  } else if (microPrefer) {
    // Phase 2: prefer micro band when available_minutes is tight.
    // Ultra-micro: if catalog min still exceeds tiny gap but protocol is micro-tagged,
    // shrink to gap when gap >= 30s (physiological sighs / tactical breaths).
    if (minSec > gapSec && gapSec >= 30 && pNeeds.includes('micro_reset')) {
      // Only true micro-tagged protocols may shrink below catalog min
      doseSec = gapSec;
    } else if (microSec <= gapSec) {
      doseSec = microSec;
    } else {
      doseSec = minSec;
    }
  } else if (recSec <= gapSec) {
    doseSec = recSec;
  } else if (minSec <= gapSec) {
    doseSec = Math.min(recSec, gapSec); // shrink toward min, still <= gap
  } else {
    doseSec = recSec; // will hard-exclude
  }
  return {
    doseSec,
    gapSec,
    recSec,
    minSec,
    allowMin: microPrefer || (recSec > gapSec && minSec <= gapSec) || (prescriptionLike && goalOverlaps),
    prescription_briefing: !!(prescriptionLike && goalOverlaps),
  };
}

function hardExclude(protocol, input, inferredNeeds) {
  // Centralized in safety_gateway — keep thin wrapper for ranker call sites
  return safety.hardExcludeReasons(protocol, input, inferredNeeds, {
    doseSecForGap,
    primaryNeed,
    BREATH_IDS,
  });
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
    // Desk-window / soft-fascination is available in most offices without leaving floor
    if (ctx.includes('window') || ctx.includes('nature_access')) {
      contextScore = Math.min(1, contextScore + 0.22);
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

  // Duration fit uses effective dose (incl. prescription briefing / micro shrink), not raw catalog rec alone
  const doseInfo = doseSecForGap(protocol, input, inferredNeeds);
  const doseForFit = doseInfo.doseSec;
  const fit = doseForFit <= gapSec ? 1 - 0.4 * (doseForFit / gapSec) : 0;
  let feasibility = Math.max(0, Math.min(1, fit));
  if (protocol.complexity === 'high' && gapSec < 600 && !doseInfo.prescription_briefing) feasibility *= 0.7;
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

  // Goal affinity boosts (calibration) — subtract duplicate need_tag match
  // before add (no double-count). Keep specialty headroom when boost >> need.
  // Prefer catalog coverage; do NOT expand GOAL_PROTOCOL_BOOST tables.
  const goals = goal ? goal.split(/[+|,/]/).map((g) => g.trim()).filter(Boolean) : [];
  if (!goals.length && needNames[0]) goals.push(needNames[0]);
  const pNeedTags = protocol.need_tags || [];
  const NEED_DUPLICATE_CREDIT = 0.15; // portion already paid by need_tag path
  for (const g of goals) {
    const table = GOAL_PROTOCOL_BOOST[g];
    if (table && table[protocol.protocol_id] != null) {
      let b = table[protocol.protocol_id];
      if (pNeedTags.includes(g)) b = Math.max(0, b - NEED_DUPLICATE_CREDIT);
      if (b > 0) raw += b;
    }
  }

  const evTable = EVENT_PROTOCOL_BOOST[event];
  if (evTable && evTable[protocol.protocol_id] != null) raw += evTable[protocol.protocol_id];

  // Evening circadian: prefer evening-light hygiene over morning light
  if (
    (goal === 'circadian_align' || goal === 'sleep_hygiene' || goal === 'sleep_prep') &&
    /evening|night|T_sleep|landed evening/i.test(String(input.upcoming_event_tag || '') + ' ' + String(input.history_notes || '') + ' ' + String(input.notes || ''))
  ) {
    if (protocol.protocol_id === 'evening-light-hygiene') raw += 0.28;
    if (protocol.protocol_id === 'morning-light') raw -= 0.22;
  }

  // Shift / day-sleep: protect sleep opportunity — wind-down over morning light
  if (
    goal === 'sleep_prep' &&
    /day sleep|post night|night shift|blackout|shift_adjacent|irregular_schedule/i.test(
      String(input.notes || '') + ' ' + String(input.history_notes || '') + ' ' + String(input.client_type || '')
    )
  ) {
    if (protocol.protocol_id === 'wind-down') raw += 0.35;
    if (protocol.protocol_id === 'morning-light') raw -= 0.3;
    if (protocol.protocol_id === 'stimulus-control') raw += 0.08;
  }
  // Trauma / long-hold avoid: route to the matching breath family from staff notes
  if (goal === 'sleep_prep') {
    const noteBlob = String(input.notes || '') + ' ' + String(input.history_notes || '');
    const wantsExhale = /gentle exhale|exhale-emphasized|pregnancy|avoid long holds|skip long holds/i.test(noteBlob);
    const wantsAnchor = /trauma|seated breath|breath anchor|supine scan|skip forced/i.test(noteBlob);
    if (wantsExhale && protocol.protocol_id === 'exhale-emphasized') raw += 0.18;
    if (wantsAnchor && !wantsExhale && protocol.protocol_id === 'mbsr-breath-anchor') raw += 0.18;
    if ((wantsExhale || wantsAnchor) && protocol.protocol_id === 'pmr') raw -= 0.1;
    if ((wantsExhale || wantsAnchor) && protocol.protocol_id === 'body-scan') raw -= 0.12;
  }

  // History alternative: after prior_negative, boost siblings sharing a need tag
  for (const negId of history.prior_negative) {
    if (protocol.protocol_id === negId) continue;
    const negP = CATALOG.find((p) => p.protocol_id === negId);
    if (!negP) continue;
    const shared = (protocol.need_tags || []).filter((t) => (negP.need_tags || []).includes(t));
    if (shared.length) raw += Math.min(0.18, 0.06 * shared.length);
  }

  // CPI priors (engineering) — temper on moderate gaps so arousal-settle
  // breath/micro cards are not buried under stacked imagery priors.
  const ct = (input.client_type || '').toLowerCase();
  if ((ct.includes('founder') || ct.includes('ceo')) && needSet.has('pre_performance') && gapSec >= 180) {
    const ids = ct.includes('ceo') ? CPI_PRIORS.ceo.pre_performance_boost_ids : CPI_PRIORS.founder.pre_performance_boost_ids;
    let boost = ct.includes('ceo') ? CPI_PRIORS.ceo.boost : CPI_PRIORS.founder.boost;
    if (gapSec < 900) boost *= 0.4; // <15m: lighter CPI; settle first
    if (ids.includes(protocol.protocol_id)) raw += boost;
    // Prefer imagery over generic box only when gap is long enough for rehearsal
    if (gapSec >= 900 && protocol.protocol_id === 'box-breathing' && !ct.includes('ceo')) raw -= 0.08;
    if (gapSec >= 900 && protocol.protocol_id === 'process-visualization') raw += 0.08;
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

  // Micro / moderate-gap prior — prefer true micro protocols that fit
  if (gapSec <= 120 && (protocol.need_tags || []).includes('micro_reset')) raw += 0.12;
  if (gapSec <= 90) {
    // Deprioritize longer pre-performance cards that squeeze in via low min
    if (['process-visualization', 'pettlep', 'woop'].includes(protocol.protocol_id)) raw -= 0.2;
    if (protocol.protocol_id === 'ppr' && needSet.has('micro_reset')) raw -= 0.08;
  }
  // Moderate pre-performance gaps: prefer breath only when staff notes ask for
  // arousal-settle breath; otherwise keep imagery/centering viable.
  if (goal === 'pre_performance' && gapSec < 900) {
    const breathAsk = /breath|box|tactical|sigh|arousal|holds if uncomfortable|settle/i.test(
      String(input.notes || '') + ' ' + String(input.history_notes || '')
    );
    if (breathAsk) {
      if (['process-visualization', 'pettlep'].includes(protocol.protocol_id)) raw -= 0.16;
      if (
        ['box-breathing', 'tactical-breath-reset', 'coherent-resonance'].includes(protocol.protocol_id) &&
        gapSec >= 300
      ) {
        raw += 0.14;
      }
      // Ultra-micro sigh only when gap short or prior breath failed
      if (protocol.protocol_id === 'physiological-sigh-acute' && gapSec >= 300) {
        if (!history.prior_negative.some((id) => BREATH_IDS.has(id))) raw -= 0.18;
      }
    } else if (gapSec < 480) {
      // Very short gaps without breath ask: light temper on long imagery
      if (['process-visualization', 'pettlep'].includes(protocol.protocol_id)) raw -= 0.08;
    }
  }
  // Micro-reset / live_blank: keep physiological sigh as default acute card
  if ((goal === 'micro_reset' || needNames[0] === 'micro_reset') && protocol.protocol_id === 'physiological-sigh-acute') {
    raw += 0.16;
  }
  // Emotion: micro labeling on short slots; somatic PMR when true tension signal
  // (not bare "evening" from hiring/moral contexts). Moral/values → temper PMR.
  if (needNames[0] === 'emotion_regulate' || goal === 'emotion_regulate') {
    const emoBlob = String(input.notes || '') + ' ' + String(input.history_notes || '');
    const moralValues =
      /values|moral|boundary|compass|hiring|firing|shame|guilt/i.test(emoBlob) ||
      event === 'hiring_firing' ||
      (want || []).some((m) => ['hiring_firing', 'moral_load', 'shame'].includes(m));
    const somaticSignal = /alcohol|tension|muscle|somatic|\bpmr\b|progressive muscle/i.test(emoBlob);
    const eveningSomatic =
      /\bevening\b/i.test(emoBlob) && somaticSignal && !moralValues;
    if (gapSec <= 180 && pNeedTags.includes('micro_reset') && pNeedTags.includes('emotion_regulate')) {
      raw += 0.12;
    }
    if (/\blabel\b|affect-label/i.test(emoBlob) && protocol.protocol_id === 'affect-labeling') raw += 0.16;
    if (gapSec >= 600 && protocol.protocol_id === 'pmr' && (somaticSignal || eveningSomatic)) {
      raw += 0.12;
    }
    if (protocol.protocol_id === 'pmr' && moralValues && !somaticSignal) {
      raw -= 0.16; // moral/values load is not a somatic-tension default
    }
    if (
      gapSec <= 600 &&
      protocol.protocol_id === 'opposite-action' &&
      !(want || []).some((m) => ['avoidance', 'mood_low', 'post_conflict', 'post_rejection'].includes(m)) &&
      (/\blabel\b|affect-label|\bpmr\b|alcohol|tension|muscle/i.test(emoBlob) || moralValues)
    ) {
      // Competing label/PMR/values notes → do not let generic opposite-action dominate
      raw -= 0.14;
    }
  }
  // Sleep_prep: acute exhale is not the default T_sleep card unless notes ask for it
  if (goal === 'sleep_prep' && /T_sleep|evening|1am/i.test(event + ' ' + String(input.history_notes || ''))) {
    const sleepBlob = String(input.notes || '') + ' ' + String(input.history_notes || '');
    const wantsExhale = /gentle exhale|exhale-emphasized|pregnancy|avoid long holds|skip long holds/i.test(sleepBlob);
    if (protocol.protocol_id === 'exhale-emphasized' && !wantsExhale) raw -= 0.22;
  }
  // Focus work-block: when gap ≥10m, do not let ultra-short task-switch beat pomodoro solely on dose fit
  if ((goal === 'focus' || needSet.has('focus')) && gapSec >= 600) {
    if (protocol.protocol_id === 'pomodoro-ultradian') raw += 0.16;
    if (protocol.protocol_id === 'task-switch-buffer' && !/meeting_streak|context_switch/i.test(event)) raw -= 0.1;
  }
  // Nap is a poor office-floor default when lying/private recovery context is absent
  if (
    protocol.protocol_id === 'nap-protocol' &&
    ['office', 'desk', 'open_office'].includes(place) &&
    !(ctx.includes('office') || ctx.includes('desk'))
  ) {
    raw -= 0.12;
  }
  // Goal clarity with no event: lean on planning/goal_set moments
  if ((goal === 'goal_clarity' || goal === 'behavior_change') && !event) {
    if ((moments || []).some((m) => ['planning', 'goal_set', 'habit'].includes(m))) raw += 0.06;
  }
  // Staff-note modality preference (vocabulary → catalog id; not case-id)
  {
    const prefBlob =
      String(input.notes || '') + ' ' + String(input.history_notes || '') + ' ' + String(input.goal || '');
    if ((goal === 'goal_clarity' || goal === 'behavior_change')) {
      if (/values|moral|boundary|compass|values conflict/i.test(prefBlob) && protocol.protocol_id === 'values-compass') {
        raw += 0.22;
      }
      if (/\bwoop\b|mental contrasting|wish.*outcome|one wish/i.test(prefBlob) && protocol.protocol_id === 'woop') {
        raw += 0.16;
      }
      if (/smart.?caveat|caveats|implementation intention caveats/i.test(prefBlob) && protocol.protocol_id === 'smart-caveats') {
        raw += 0.2;
      }
      if (
        /values|moral|boundary|compass/i.test(prefBlob) &&
        protocol.protocol_id === 'if-then-gollwitzer'
      ) {
        raw -= 0.12;
      }
    }
    if (
      (goal === 'rumination' || needSet.has('rumination')) &&
      /soft-fascination|nature|trees|sky|window walk|art-brief|outdoors walk/i.test(prefBlob) &&
      protocol.protocol_id === 'art-brief'
    ) {
      raw += 0.2;
    }
    if (
      (goal === 'stress_acute' || needSet.has('stress_acute')) &&
      /54321|grounding|five senses|name 5/i.test(prefBlob) &&
      protocol.protocol_id === '54321-grounding'
    ) {
      raw += 0.2;
    }
    if (
      (goal === 'sleep_hygiene' || goal === 'circadian_align') &&
      /caffeine|cutoff|no coffee|coffee after/i.test(prefBlob) &&
      protocol.protocol_id === 'caffeine-cutoff'
    ) {
      raw += 0.18;
    }
    if (
      (goal === 'sleep_hygiene' || goal === 'circadian_align') &&
      /sleep.?consist|same wake|regular schedule/i.test(prefBlob) &&
      protocol.protocol_id === 'sleep-consistency'
    ) {
      raw += 0.18;
    }
    if (
      (goal === 'recovery_rest' || goal === 'recovery') &&
      /yoga.?nidra|nsdr|nidra/i.test(prefBlob) &&
      protocol.protocol_id === 'yoga-nidra-nsdr'
    ) {
      raw += 0.18;
    }
    if (
      goal === 'pre_performance' &&
      /process.?viz|visualization|imagery|rehearse|mental rehearsal/i.test(prefBlob) &&
      protocol.protocol_id === 'process-visualization'
    ) {
      raw += 0.16;
    }
    if (
      goal === 'pre_performance' &&
      /centering|ravizza/i.test(prefBlob) &&
      protocol.protocol_id === 'centering-ravizza'
    ) {
      raw += 0.16;
    }
    if (
      goal === 'pre_performance' &&
      /if-?then|implementation intention|discovery\s*q|open question/i.test(prefBlob) &&
      protocol.protocol_id === 'if-then-gollwitzer'
    ) {
      raw += 0.28;
    }
    if (
      goal === 'rumination' &&
      /defusion|act-defusion|leaves on (a )?stream/i.test(prefBlob) &&
      protocol.protocol_id === 'act-defusion'
    ) {
      raw += 0.16;
    }
    // Third-person / self-distancing writeup (rumination family)
    if (
      (goal === 'rumination' || needSet.has('rumination')) &&
      /third-?person|self-?distanc|fly.?on.?the.?wall|distanced writeup/i.test(prefBlob) &&
      protocol.protocol_id === 'self-distancing'
    ) {
      raw += 0.2;
    }
    if (
      (goal === 'rumination' || needSet.has('rumination')) &&
      /third-?person|self-?distanc/i.test(prefBlob) &&
      !/defusion|leaves on (a )?stream/i.test(prefBlob) &&
      protocol.protocol_id === 'act-defusion'
    ) {
      raw -= 0.12;
    }
    if (
      goal === 'emotion_regulate' &&
      /opposite.?action/i.test(prefBlob) &&
      protocol.protocol_id === 'opposite-action'
    ) {
      raw += 0.16;
    }
    // Values/moral/compass on emotion_regulate + hiring/moral events (not only goal_clarity)
    if (
      (goal === 'emotion_regulate' ||
        event === 'hiring_firing' ||
        /moral_load|hiring_firing/i.test(prefBlob)) &&
      /values|moral|boundary|compass|values conflict/i.test(prefBlob) &&
      protocol.protocol_id === 'values-compass'
    ) {
      raw += 0.22;
    }
    // Named cognitive reappraisal
    if (
      (goal === 'emotion_regulate' || needSet.has('emotion_regulate')) &&
      /reapprais/i.test(prefBlob) &&
      protocol.protocol_id === 'cognitive-reappraisal'
    ) {
      raw += 0.2;
    }
    if (
      (goal === 'emotion_regulate' || needSet.has('emotion_regulate')) &&
      /reapprais/i.test(prefBlob) &&
      protocol.protocol_id === 'pmr' &&
      !/tension|muscle|somatic|\bpmr\b/i.test(prefBlob)
    ) {
      raw -= 0.1;
    }
    // Named PPR ritual (pre_performance)
    if (
      goal === 'pre_performance' &&
      /\bppr\b|performance.?ready|90-?s(?:ec)?\s+ppr|90.?sec ppr/i.test(prefBlob) &&
      protocol.protocol_id === 'ppr'
    ) {
      raw += 0.18;
    }
    if (
      goal === 'pre_performance' &&
      /\bppr\b|performance.?ready|90-?s(?:ec)?\s+ppr/i.test(prefBlob) &&
      !/process.?viz|visualization|imagery|rehearse/i.test(prefBlob) &&
      protocol.protocol_id === 'process-visualization'
    ) {
      raw -= 0.12;
    }
    // If-then / discovery cue as primary ask: prefer plan over generic breath/imagery stack
    if (
      goal === 'pre_performance' &&
      /if-?then|implementation intention|discovery\s*q|open question/i.test(prefBlob) &&
      !/box breath|box-breathing|4.?4.?4.?4|tactical breath|prefer breath/i.test(prefBlob)
    ) {
      if (protocol.protocol_id === 'box-breathing') raw -= 0.16;
      if (protocol.protocol_id === 'tactical-breath-reset') raw -= 0.14;
      if (protocol.protocol_id === 'centering-ravizza') raw -= 0.1;
      if (protocol.protocol_id === 'ppr' && !/\bppr\b|performance.?ready/i.test(prefBlob)) raw -= 0.12;
      if (
        protocol.protocol_id === 'process-visualization' &&
        !/process.?viz|visualization|imagery|rehearse/i.test(prefBlob)
      ) {
        raw -= 0.1;
      }
    }
    // Quiet sighs named alongside planning → physiological sigh (candidate-family)
    if (
      goal === 'pre_performance' &&
      /quiet sighs|two sighs|\bsighs\b first|physiological sigh/i.test(prefBlob) &&
      protocol.protocol_id === 'physiological-sigh-acute'
    ) {
      raw += 0.18;
    }
    // Named exhale pace (stress_acute)
    if (
      (goal === 'stress_acute' || needSet.has('stress_acute')) &&
      /exhale|exhale-emphasized|exhale pace|gentle exhale/i.test(prefBlob) &&
      protocol.protocol_id === 'exhale-emphasized'
    ) {
      raw += 0.18;
    }
    if (
      (goal === 'stress_acute' || needSet.has('stress_acute')) &&
      /exhale pace|exhale-emphasized|gentle exhale/i.test(prefBlob) &&
      !/sigh|physiological/i.test(prefBlob) &&
      protocol.protocol_id === 'physiological-sigh-acute'
    ) {
      raw -= 0.12;
    }
    if (goal === 'sleep_prep' || needSet.has('sleep_prep')) {
      if (/autogenic|heaviness|warmth/i.test(prefBlob) && protocol.protocol_id === 'autogenic') raw += 0.2;
      if (/park.*worry|worry slot|postpone|worry-postpone/i.test(prefBlob) && protocol.protocol_id === 'worry-postpone') {
        raw += 0.16;
      }
      if (/wind-?down|wind down/i.test(prefBlob) && protocol.protocol_id === 'wind-down') {
        raw += 0.2;
      }
      if (
        /wind-?down|wind down/i.test(prefBlob) &&
        !/breath anchor|mbsr|trauma|seated breath/i.test(prefBlob) &&
        protocol.protocol_id === 'mbsr-breath-anchor'
      ) {
        raw -= 0.12;
      }
    }
  }

  // After a failed breath trial, prefer alternate breath micros for same performance need
  if (
    history.prior_negative.some((id) => BREATH_IDS.has(id)) &&
    BREATH_IDS.has(protocol.protocol_id) &&
    !history.prior_negative.includes(protocol.protocol_id) &&
    (needSet.has('pre_performance') || needSet.has('stress_acute') || needSet.has('micro_reset'))
  ) {
    raw += 0.14;
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

  const features = {
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
  };
  const finalScore = Math.round(score * 1000) / 1000;
  // Interpretable breakdown (Step 4) — systemic mapping from score features
  const score_breakdown = {
    goal_fit: features.need_match,
    state_fit: features.expected_benefit,
    context_fit: features.context_match,
    duration_fit: features.feasibility,
    preference_fit: features.preference,
    historical_response: features.history,
    event_fit: features.timing,
    sequence_fit: null, // sequence is post-rank suggestSequence; not in score
    safety_status: 'ok',
    final_score: finalScore,
  };
  return {
    score: finalScore,
    features,
    score_breakdown,
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

function historyDepthForClient(clientId) {
  if (!clientId) return 0;
  const fromOutcomes = loadOutcomes().filter((o) => o.client_id === clientId).length;
  const graph = responseGraph.getClientGraph(clientId);
  const fromGraph = Object.values(graph).reduce((s, n) => s + (n && n.n ? n.n : 0), 0);
  return Math.max(fromOutcomes, fromGraph);
}


/** Phase 2 dose bands from protocol duration fields (synthesize micro/extended if absent). */
function doseVariants(protocol) {
  const d = protocol.duration || {};
  const minSec = protocol.min_duration_sec != null ? protocol.min_duration_sec : (d.min_sec != null ? d.min_sec : 60);
  const recSec = protocol.recommended_duration_sec != null
    ? protocol.recommended_duration_sec
    : (d.optimal_sec != null ? d.optimal_sec : minSec);
  const maxSec = protocol.max_duration_sec != null ? protocol.max_duration_sec : (d.extended_sec != null ? d.extended_sec : recSec);
  const microSec = d.micro_sec != null ? d.micro_sec : Math.min(minSec, 120);
  return {
    micro: microSec,
    minimum: minSec,
    recommended: recSec,
    extended: maxSec,
  };
}

/**
 * Phase 2 delivery modality rules (engineering heuristic):
 *   public → text if public_discrete else self_guided
 *   private + staff_id → staff_led
 *   short gap (≤3 min) → text
 *   else prefer protocol.delivery_channels audio if present, else self_guided
 */
function chooseDeliveryModality(protocol, input) {
  const minutes = Number(input.available_minutes) || 0;
  const publicCtx = isPublicContext(input);
  const channels = protocol.delivery_channels || [];
  if (publicCtx) {
    if (protocol.public_discrete) return 'text';
    return 'self_guided';
  }
  if (minutes > 0 && minutes <= 3) return 'text';
  if ((input.privacy === 'private' || !publicCtx) && input.staff_id) return 'staff_led';
  if (channels.includes('audio')) return 'audio';
  if (channels.includes('staff_prompt') && input.staff_id) return 'staff_led';
  if (channels.includes('text')) return 'text';
  return 'self_guided';
}

/** Prefer micro dose label when available_minutes is tight relative to recommended. */
function preferredDoseKey(dose, availableMinutes) {
  const gapSec = Math.max(0, Number(availableMinutes) || 0) * 60;
  if (gapSec <= 0) return 'recommended';
  // Phase 2: when available_minutes is tight, prefer micro (then minimum).
  const tight = gapSec <= 180 || gapSec < dose.recommended;
  if (tight) {
    if (dose.micro <= gapSec) return 'micro';
    if (dose.minimum <= gapSec) return 'minimum';
    return 'micro';
  }
  if (gapSec >= dose.extended && dose.extended > dose.recommended) return 'extended';
  if (gapSec >= dose.recommended) return 'recommended';
  if (gapSec >= dose.minimum) return 'minimum';
  return 'micro';
}

function enrichRecommendation(rec, input, opts = {}) {
  const protocol = CATALOG.find((p) => p.protocol_id === rec.protocol_id) || {};
  const evidence_class = rec.evidence_class || protocol.evidence_class || mapEvidenceClass(rec.evidence || protocol.evidence_A_to_E);
  const protocol_version = rec.protocol_version || protocol.version || '1.0.0';
  const unknownCount = opts.unknownCount != null ? opts.unknownCount : 0;
  const histDepth = opts.historyDepth != null ? opts.historyDepth : historyDepthForClient(input.client_id);
  const confidence = computeConfidence({
    historyDepth: histDepth,
    features: rec.features || {},
    unknownCount,
    evidenceClass: evidence_class,
    topScore: rec.score,
    tau: SPEC.thresholds.tau_select,
  });
  const explanation = buildExplanation({
    selected_id: rec.protocol_id,
    features: rec.features || {},
    why: rec.why || [],
    confidence,
  });
  const score_breakdown = rec.score_breakdown || {
    goal_fit: (rec.features && rec.features.need_match) != null ? rec.features.need_match : null,
    state_fit: (rec.features && rec.features.expected_benefit) != null ? rec.features.expected_benefit : null,
    context_fit: (rec.features && rec.features.context_match) != null ? rec.features.context_match : null,
    duration_fit: (rec.features && rec.features.feasibility) != null ? rec.features.feasibility : null,
    preference_fit: (rec.features && rec.features.preference) != null ? rec.features.preference : null,
    historical_response: (rec.features && rec.features.history) != null ? rec.features.history : null,
    event_fit: (rec.features && rec.features.timing) != null ? rec.features.timing : null,
    sequence_fit: null,
    safety_status: 'ok',
    final_score: rec.score != null ? rec.score : null,
  };
  const dose = doseVariants(protocol);
  const preferred_dose = preferredDoseKey(dose, input.available_minutes);
  const delivery_modality = chooseDeliveryModality(protocol, input);
  let dose_for_gap_sec = rec.dose_for_gap_sec;
  try {
    const inferred = opts.inferredNeeds || [];
    const di = doseSecForGap(protocol, input, inferred);
    dose_for_gap_sec = di.doseSec;
  } catch (_e) {
    /* keep prior */
  }
  return {
    ...rec,
    protocol_version,
    evidence_class,
    confidence,
    explanation,
    score_breakdown,
    modality: protocol.modality || rec.modality,
    duration: protocol.duration || rec.duration,
    dose,
    preferred_dose,
    delivery_modality,
    dose_for_gap_sec,
  };
}

function attachPhase1Meta(result, input, extras = {}) {
  const client_state = input.client_state || clientStateFromFlat(input);
  const context = input.context || contextFromFlat(input);
  const moment = input.moment || momentFromFlat(input);
  const top = result.recommendations || [];
  const protocol_versions = {};
  for (const p of CATALOG) protocol_versions[p.protocol_id] = p.version || '1.0.0';
  for (const r of top) {
    if (r.protocol_version) protocol_versions[r.protocol_id] = r.protocol_version;
  }
  const primary = top[0];
  const confidence = primary && primary.confidence != null ? primary.confidence : extras.confidence;
  const explanation = primary && primary.explanation ? primary.explanation : extras.explanation || null;
  const { hash } = inputSummary(input);
  const decision_record = buildDecisionRecord({
    client_id: input.client_id || null,
    staff_id: input.staff_id || null,
    state: client_state,
    context,
    goal: input.goal || null,
    duration: { available_minutes: input.available_minutes },
    candidates: extras.candidates || top,
    exclusions: result.exclusions || [],
    ranking_features: primary && primary.features,
    top,
    confidence: confidence != null ? confidence : null,
    explanation,
    protocol_versions,
    action: result.action,
    silence: !!result.silence,
    inferred_need: result.inferred_need,
    input_hash: hash,
  });
  return {
    ...result,
    client_state,
    context,
    moment,
    decision_record,
    confidence: confidence != null ? confidence : null,
    explanation,
    input: { ...input, client_state, context, moment },
  };
}

function escalateResult(input, reason, crisisMeta = {}) {
  const base = {
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
    crisis_nlp: reason === 'crisis_nlp_keyword' || !!crisisMeta.crisis_nlp,
    safety: {
      severity: crisisMeta.severity || 'high',
      confidence: crisisMeta.confidence != null ? crisisMeta.confidence : 0.9,
      escalate: true,
    },
  };
  return attachPhase1Meta(base, input, {
    confidence: crisisMeta.confidence != null ? crisisMeta.confidence : 0.9,
    explanation: {
      selected_id: null,
      positives: [],
      penalties: [reason],
      confidence: crisisMeta.confidence != null ? crisisMeta.confidence : 0.9,
    },
  });
}

function recommend(rawInput) {
  const input = normalizeInput(rawInput);
  const unknownCount = countUnknown(input.client_state || clientStateFromFlat(input));
  const histDepth = historyDepthForClient(input.client_id);

  // Pipeline: Input → Safety (crisis) → … Hard exclude → Candidates → Rank
  const safetyResult = safety.runSafety(input);
  if (!safetyResult.ok) {
    return escalateResult(input, safetyResult.crisis.reason, safetyResult.crisis);
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
    return attachPhase1Meta(
      {
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
      },
      input
    );
  }

  const errors = validateInput(input);
  if (errors.length) {
    return attachPhase1Meta(
      {
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
      },
      input
    );
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
      evidence_class: p.evidence_class || mapEvidenceClass(p.evidence_A_to_E),
      protocol_version: p.version || '1.0.0',
      max_duration_sec: p.max_duration_sec,
      recommended_duration_sec: p.recommended_duration_sec,
      min_duration_sec: p.min_duration_sec,
      duration: p.duration,
      modality: p.modality,
      arousal_direction: p.arousal_direction,
      need_tags: p.need_tags,
      categories: p.categories,
      public_discrete: p.public_discrete,
      clinician_only: p.clinician_only,
      follow_up_ids: (p.follow_up_ids && p.follow_up_ids.length) ? p.follow_up_ids : undefined,
      compatible_ids: p.compatible_ids || [],
      incompatible_ids: p.incompatible_ids || [],
      score: s.score,
      features: s.features,
      score_breakdown: s.score_breakdown,
      dose_for_gap_sec: doseSecForGap(p, input, inferred).doseSec,
      why: s.why,
      purpose: p.purpose,
      is_vault_ip: !!p.is_vault_ip,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const tau = SPEC.thresholds.tau_select;
  const topRaw = scored.slice(0, 3);
  const top = topRaw.map((r) => enrichRecommendation(r, input, { unknownCount, historyDepth: histDepth, inferredNeeds: inferred }));

  const exclPayload = {
    exclusions,
    exclusions_total: exclusions.length,
    exclusions_truncated: false,
  };

  if (!top.length || top[0].score < tau) {
    return attachPhase1Meta(
      {
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
      },
      input,
      { candidates: scored.slice(0, 10).map((r) => enrichRecommendation(r, input, { unknownCount, historyDepth: histDepth, inferredNeeds: inferred })) }
    );
  }

  const primary = top[0];
  const full = CATALOG.find((p) => p.protocol_id === primary.protocol_id);
  const suggested_sequence = suggestSequence(full || primary, input, inferred);

  return attachPhase1Meta(
    {
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
    },
    input,
    { candidates: scored.slice(0, 10).map((r) => enrichRecommendation(r, input, { unknownCount, historyDepth: histDepth, inferredNeeds: inferred })) }
  );
}

function flattenNested(raw) {
  const r = raw || {};
  const cs = r.client_state || {};
  const ctx = r.context || {};
  const constraints = r.constraints || cs.constraints || {};
  const val = (dim, fallback) => {
    if (dim && typeof dim === 'object' && 'value' in dim) return dim.value;
    if (dim != null && typeof dim !== 'object') return dim;
    return fallback;
  };
  const nestedPresent = !!(r.client_state || r.context);
  if (!nestedPresent) return null;

  const stress = val(cs.emotional && cs.emotional.stress, r.stress);
  const energy = val(cs.physical && cs.physical.energy, r.energy);
  const sleep_h = val(cs.physical && cs.physical.sleep_h, r.sleep_h);
  const prefers_breath = val(cs.behavioral && cs.behavioral.prefers_breath, r.prefers_breath);
  const history_notes = val(cs.behavioral && cs.behavioral.history_notes, r.history_notes);
  const available_minutes = val(
    (ctx.time_available && ctx.time_available.minutes) != null
      ? { value: ctx.time_available.minutes }
      : cs.temporal && cs.temporal.available_minutes,
    r.available_minutes
  );
  const place_class = (ctx.where && ctx.where.place_class) || r.place_class;
  const privacy = (ctx.where && ctx.where.privacy) || ctx.privacy || r.privacy;
  const upcoming_event_tag =
    (ctx.event && ctx.event.upcoming_tag) || (ctx.upcoming && ctx.upcoming.tag) || r.upcoming_event_tag;
  const activity =
    (ctx.activity && ctx.activity.label) || (typeof r.activity === 'string' ? r.activity : '') || '';
  const clinician_mode = val(constraints.clinician_mode, r.clinician_mode);
  const crisis_flag = val(constraints.crisis_flag, r.crisis_flag);
  const force_silence = val(constraints.force_silence, r.force_silence);
  const goal = r.goal != null ? r.goal : (typeof constraints.goal === 'string' ? constraints.goal : '');

  return {
    client_type: cs.client_type || (ctx.who && ctx.who.client_type) || r.client_type,
    client_id: cs.client_id || r.client_id || null,
    staff_id: (ctx.who && ctx.who.staff_id) || r.staff_id || null,
    available_minutes,
    place_class,
    privacy,
    upcoming_event_tag,
    stress,
    energy,
    sleep_h,
    prefers_breath,
    history_notes,
    notes: r.notes || '',
    clinician_mode: !!clinician_mode,
    crisis_flag: !!crisis_flag,
    hard_exclude_prior_negative: !!r.hard_exclude_prior_negative,
    goal: goal || '',
    activity,
    force_silence: !!force_silence,
    timezone: ctx.timezone || (ctx.when && ctx.when.timezone) || r.timezone || null,
    moment_phase: (ctx.event && ctx.event.phase) || r.moment_phase || null,
    _from_nested: true,
    _raw_client_state: cs,
    _raw_context: ctx,
  };
}

function normalizeInput(raw) {
  const nestedFlat = flattenNested(raw);
  const r = nestedFlat || raw || {};
  const flat = {
    client_type: r.client_type || 'startup_founder',
    client_id: r.client_id || null,
    staff_id: r.staff_id || null,
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
    timezone: r.timezone || null,
    moment_phase: r.moment_phase || null,
  };
  // Prefer provided nested objects when present; else build from flat
  const client_state = raw && raw.client_state
    ? buildClientState({ ...raw.client_state, client_id: flat.client_id, client_type: flat.client_type })
    : clientStateFromFlat(flat);
  const context = raw && raw.context
    ? buildContext({ ...raw.context, client_type: flat.client_type, place_class: flat.place_class, privacy: flat.privacy, available_minutes: flat.available_minutes, upcoming_event_tag: flat.upcoming_event_tag, activity: flat.activity, staff_id: flat.staff_id, timezone: flat.timezone })
    : contextFromFlat(flat);
  const moment = momentFromFlat({ ...flat, ...(raw && raw.moment ? raw.moment : {}) });
  return { ...flat, client_state, context, moment };
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
  normalizeInput,
  hardExclude,
  safety,
  enrichRecommendation,
  attachPhase1Meta,
  doseVariants,
  chooseDeliveryModality,
  preferredDoseKey,
  responseGraph,
};
