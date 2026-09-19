/**
 * PIE ranker — hard filters + weighted score from score_spec.json
 * Catalog: public protocol IDs only. Never expands vault IP steps.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, '02_protocol_catalog', 'catalog.jsonl');
const SPEC_PATH = path.join(ROOT, '05_ranking', 'score_spec.json');

function loadCatalog() {
  const lines = fs.readFileSync(CATALOG_PATH, 'utf8').split('\n').filter(Boolean);
  return lines.map((l) => JSON.parse(l));
}

function loadSpec() {
  return JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
}

const CATALOG = loadCatalog();
const SPEC = loadSpec();

const PLACE_MAP = {
  office: ['desk', 'office', 'quiet_ok', 'private', 'pre_meeting', 'between_meetings', 'deep_work'],
  desk: ['desk', 'office', 'quiet_ok', 'private', 'pre_meeting'],
  home: ['home', 'private', 'quiet_ok', 'lying_ok', 'bedroom', 'evening', 'morning'],
  hotel: ['hotel', 'private', 'quiet_ok', 'lying_ok', 'travel', 'hotel_gym'],
  public: ['public_ok', 'public_discrete', 'anywhere', 'anywhere_standing', 'in_transit'],
  transit: ['in_transit', 'public_discrete', 'anywhere_standing', 'travel'],
  bedroom: ['bedroom', 'home', 'private', 'lying_ok', 'bedtime', 'evening'],
  outdoors: ['outdoors', 'morning', 'nature_access', 'daytime'],
  gym: ['gym', 'hotel_gym', 'outdoors', 'space_to_move'],
  bathroom: ['bathroom', 'bathroom_ok', 'private', 'water_access'],
  backstage: ['backstage', 'green_room', 'locker', 'pre_performance', 'private'],
  private: ['private', 'quiet_ok', 'home', 'desk'],
  anywhere: ['anywhere', 'anywhere_standing', 'public_discrete'],
};

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
  midday_crash: ['cognitive_fatigue', 'sleep_debt', 'energy_up'],
  runway_scare: ['stress_chronic', 'emotion_regulate'],
  live_blank: ['micro_reset', 'pre_performance', 'stress_acute'],
  deep_work: ['focus'],
  none: [],
  '': [],
};

const BREATH_IDS = new Set(
  CATALOG.filter((p) => (p.categories || []).includes('breathing') || /breath|sigh|exhale|nadi|box|coherent|diaphragm|478|hyperventil/i.test(p.protocol_id)).map(
    (p) => p.protocol_id
  )
);

function parseHistoryNotes(notes) {
  const out = { prior_negative: [], prior_positive: [], disliked_modalities: [] };
  if (!notes || typeof notes !== 'string') return out;
  const parts = notes.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const mNeg = part.match(/prior_negative\s*:\s*([\w-]+)/i);
    const mPos = part.match(/prior_positive\s*:\s*([\w-]+)/i);
    const mDis = part.match(/dislike\s*:\s*([\w-]+)/i);
    if (mNeg) out.prior_negative.push(mNeg[1].toLowerCase());
    if (mPos) out.prior_positive.push(mPos[1].toLowerCase());
    if (mDis) out.disliked_modalities.push(mDis[1].toLowerCase());
  }
  return out;
}

function inferNeeds(input) {
  const needs = new Map(); // need -> urgency weight
  const add = (n, w) => needs.set(n, Math.max(needs.get(n) || 0, w));

  const stress = Number(input.stress) || 0;
  const energy = Number(input.energy) || 3;
  const sleepH = input.sleep_h != null && input.sleep_h !== '' ? Number(input.sleep_h) : null;
  const event = (input.upcoming_event_tag || 'none').toLowerCase();
  const minutes = Number(input.available_minutes) || 0;
  const goal = (input.goal || '').toLowerCase().trim();
  if (goal && goal !== 'any' && goal !== 'unknown') {
    // Split compound goals like fatigue+perform
    for (const g of goal.split(/[+|,/]/)) {
      const gg = g.trim();
      if (gg) add(gg, 0.95);
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
  // alias tags
  if ((EVENT_NEED[event] || []).includes('pre_performance')) add('pre_performance', 0.9);

  if (/sleep|T_sleep|1am|bed/i.test(event)) add('sleep_prep', 0.85);
  if (/jetlag|landing|flight/i.test(event)) add('jetlag', 0.85);

  // short gap → micro
  if (minutes > 0 && minutes <= 3) add('micro_reset', 0.7);

  // founder / CEO priors lightly boost pre_performance when event stakes
  const ct = (input.client_type || '').toLowerCase();
  if ((ct.includes('founder') || ct.includes('ceo')) && (EVENT_NEED[event] || []).includes('pre_performance')) {
    add('pre_performance', 0.95);
  }

  if (needs.size === 0) {
    if (stress >= 3) add('arousal_down', 0.5);
    else add('cognitive_reset', 0.35);
  }

  // always allow arousal_down companion when stress high
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

function hardExclude(protocol, input, inferredNeeds) {
  const reasons = [];
  const gapSec = Math.max(0, Number(input.available_minutes) || 0) * 60;
  const needNames = new Set(inferredNeeds.map((n) => n.need));
  const history = parseHistoryNotes(input.history_notes);

  // Gap fit uses recommended dose (fallback min, then max). Catalog max is an upper bound
  // for longer optional runs, not the staff-facing default card length.
  const recSec = protocol.recommended_duration_sec || protocol.max_duration_sec || 99999;
  const minSec = protocol.min_duration_sec || Math.min(60, recSec);
  // Micro / acute moments may use min dose when gap is tighter than recommended.
  const allowMin =
    gapSec <= 120 &&
    (needNames.has('micro_reset') ||
      needNames.has('stress_acute') ||
      needNames.has('pre_performance') ||
      (protocol.need_tags || []).includes('micro_reset'));
  const doseSec = allowMin ? minSec : recSec;
  if (doseSec > gapSec) {
    reasons.push(`duration_exceeds_gap:${doseSec}s>${gapSec}s`);
  }

  // contraindications from history notes like contra:pregnancy or safety tags
  const clientContra = new Set();
  if (input.history_notes) {
    for (const m of String(input.history_notes).matchAll(/contra(?:indication)?s?\s*:\s*([\w-]+)/gi)) {
      clientContra.add(m[1].toLowerCase());
    }
    if (/panic.?breath|dislikes?\s+breath|breath.?intoler/i.test(input.history_notes)) {
      clientContra.add('panic_breath_intolerance');
    }
  }
  if (input.prefers_breath === 'no') {
    // soft via preference; hard only if protocol is breath-only AND contra listed — use soft exclude for breath dislike via score
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
  // also block strong activation when sleep_prep primary
  if (needNames.has('sleep_prep') && /up_then_down|activate/i.test(arousal) && primaryNeed(inferredNeeds) === 'sleep_prep') {
    if (!reasons.includes('arousal_up_when_need_sleep_prep')) reasons.push('arousal_up_when_need_sleep_prep');
  }

  // place class public: exclude non-discrete private-only long protocols with equipment
  const place = (input.place_class || 'office').toLowerCase();
  if ((place === 'public' || place === 'transit') && protocol.public_discrete === false && protocol.privacy_ok !== true) {
    // keep soft; hard exclude if needs lying / audio / water
    const ctx = protocol.context_tags || [];
    if (ctx.includes('lying_ok') || ctx.includes('audio_ok') || (protocol.equipment || []).some((e) => e !== 'none')) {
      reasons.push(`context_infeasible:${place}`);
    }
  }

  // equipment hard check for public / office without gym
  const equip = protocol.equipment || [];
  const needsEquip = equip.filter((e) => e && e !== 'none');
  if (needsEquip.length) {
    const placeOk =
      (needsEquip.includes('cold_water') && (place === 'bathroom' || place === 'home' || place === 'hotel')) ||
      (needsEquip.some((e) => /outdoors|bright_light|light/i.test(e)) && (place === 'outdoors' || place === 'home')) ||
      (needsEquip.some((e) => /space_to_move|gym/i.test(e)) && (place === 'gym' || place === 'outdoors'));
    if (!placeOk && place !== 'home' && place !== 'hotel') {
      reasons.push(`equipment_missing:${needsEquip.join(',')}`);
    }
  }

  // prefers_breath=no → hard-exclude breathing category protocols for extreme constraint scenarios
  if (input.prefers_breath === 'no' && BREATH_IDS.has(protocol.protocol_id)) {
    reasons.push('prefers_breath_no');
  }

  // prior_negative hard? No — soft penalty. But if marked exclude:id
  if (history.prior_negative.includes(protocol.protocol_id) && input.hard_exclude_prior_negative) {
    reasons.push('prior_negative_hard');
  }

  return reasons;
}

function scoreProtocol(protocol, input, inferredNeeds) {
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

  // need_match
  const needMatch = jaccard(protocol.need_tags || [], needNames);
  // boost if primary need in tags
  let needScore = needMatch;
  if ((protocol.need_tags || []).includes(needNames[0])) needScore = Math.min(1, needScore + 0.35);
  // urgency weight
  const urg = inferredNeeds[0] ? inferredNeeds[0].urgency : 0.5;
  needScore = Math.min(1, needScore * (0.7 + 0.3 * urg));

  // context_match
  const ctx = protocol.context_tags || [];
  let contextScore = jaccard(ctx, placeTags);
  if (place === 'public' || place === 'transit') {
    if (protocol.public_discrete) contextScore = Math.min(1, contextScore + 0.4);
    else contextScore *= 0.4;
  }
  if (place === 'office' || place === 'desk') {
    if (ctx.includes('desk') || ctx.includes('pre_meeting') || ctx.includes('office')) contextScore = Math.min(1, contextScore + 0.25);
  }

  // timing — moment tags
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

  // evidence
  const ev = evidenceMap[String(protocol.evidence_A_to_E || 'D').toUpperCase()] ?? 0.35;

  // history −1..1 mapped to 0..1 for weight (store signed separately)
  let historyFeat = 0.5;
  let histPenalty = 0;
  if (history.prior_positive.includes(protocol.protocol_id)) historyFeat = 1.0;
  if (history.prior_negative.includes(protocol.protocol_id)) {
    historyFeat = 0.0;
    histPenalty = pen.prior_negative;
  }
  // modality-level history
  if (history.prior_positive.some((id) => BREATH_IDS.has(id)) && BREATH_IDS.has(protocol.protocol_id)) {
    historyFeat = Math.max(historyFeat, 0.85);
  }
  if (history.prior_negative.some((id) => BREATH_IDS.has(id)) && BREATH_IDS.has(protocol.protocol_id)) {
    histPenalty = Math.max(histPenalty, pen.prior_negative * 0.8);
    historyFeat = Math.min(historyFeat, 0.2);
  }

  // preference
  let pref = 0.5;
  if (input.prefers_breath === 'yes') {
    pref = BREATH_IDS.has(protocol.protocol_id) ? 1.0 : 0.35;
  } else if (input.prefers_breath === 'no') {
    pref = BREATH_IDS.has(protocol.protocol_id) ? 0.0 : 0.75;
  } else {
    pref = 0.55;
  }

  // feasibility
  const fit = dur <= gapSec ? 1 - 0.4 * (dur / gapSec) : 0;
  let feasibility = Math.max(0, Math.min(1, fit));
  if (protocol.complexity === 'high' && gapSec < 600) feasibility *= 0.7;
  if ((place === 'public' || place === 'transit') && !protocol.public_discrete) feasibility *= 0.5;

  // expected_benefit — evidence × urgency × intensity fit
  const intensity = protocol.intensity || 'moderate';
  let intensityFit = 0.7;
  const stress = Number(input.stress) || 3;
  if (stress >= 4 && /high|moderate/i.test(String(intensity))) intensityFit = 0.85;
  if (stress <= 2 && /low|micro/i.test(String(intensity))) intensityFit = 0.8;
  const expected_benefit = Math.min(1, ev * urg * intensityFit + 0.15);

  // adherence_prob — shorter better
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

  // Exact primary-need hit + moment hit bonuses (engineering priors)
  if ((protocol.need_tags || []).includes(needNames[0])) raw += 0.06;
  if (want.length && moments.some((m) => want.includes(m))) raw += 0.05;
  if (protocol.staff_preferred) raw += 0.03;
  // Founder/CEO pre-performance prior: imagery / PPR over generic breath when gap >= 3m
  const ct = (input.client_type || '').toLowerCase();
  if (
    (ct.includes('founder') || ct.includes('ceo')) &&
    needSet.has('pre_performance') &&
    gapSec >= 180 &&
    ['process-visualization', 'ppr', 'pettlep', 'centering-ravizza'].includes(protocol.protocol_id)
  ) {
    raw += 0.14;
  }
  // Micro gap prior
  if (gapSec <= 120 && (protocol.need_tags || []).includes('micro_reset')) raw += 0.07;
  // Deprioritize hygiene/policy cards during acute performance/stress moments
  if (
    (needSet.has('micro_reset') || needSet.has('pre_performance') || needSet.has('stress_acute')) &&
    ['caffeine-cutoff', 'sleep-consistency', 'evening-light-hygiene', 'wind-down'].includes(protocol.protocol_id)
  ) {
    raw -= 0.25;
  }

  let penalties = histPenalty;
  if (protocol.complexity === 'high' && (Number(input.energy) || 3) <= 3) penalties += pen.complexity_high;
  if ((place === 'public' || place === 'transit') && !protocol.public_discrete) penalties += pen.friction_public;
  // soft contra residual unused

  const score = Math.max(0, Math.min(1, raw - penalties));

  const why = [];
  if ((protocol.need_tags || []).includes(needNames[0])) why.push(`need:${needNames[0]}`);
  if (want.length && moments.some((m) => want.includes(m))) why.push(`moment:${event}`);
  why.push(`evidence:${protocol.evidence_A_to_E}`);
  why.push(`duration:${Math.round(dur / 60)}m`);
  if (input.prefers_breath === 'yes' && BREATH_IDS.has(protocol.protocol_id)) why.push('pref:breath');
  if (input.prefers_breath === 'no' && !BREATH_IDS.has(protocol.protocol_id)) why.push('pref:non-breath');
  if (history.prior_positive.includes(protocol.protocol_id)) why.push('history:positive');
  if (protocol.public_discrete && (place === 'public' || place === 'office')) why.push('public_discrete');

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
  const event = input.upcoming_event_tag || 'this moment';
  const minutes = Math.max(1, Math.round((selected.recommended_duration_sec || selected.max_duration_sec) / 60));
  const need = primaryNeed(inferred);
  const context =
    event && event !== 'none'
      ? `Context: ${String(event).replace(/_/g, ' ')} · ${input.place_class || 'here'}.`
      : `Context: ${input.place_class || 'current setting'}.`;
  const whyNow = `Why now: inferred need “${need.replace(/_/g, ' ')}” (stress ${input.stress}/5, energy ${input.energy}/5).`;
  const action = `Action: run “${selected.name}” (${selected.protocol_id}).`;
  const dur = `Duration: ~${minutes} min (fits ${input.available_minutes} min gap).`;
  const skip = 'Skip/SILENCE is always OK.';
  return `${context} ${whyNow} ${action} ${dur} ${skip}`;
}

function recommend(rawInput) {
  const input = normalizeInput(rawInput);

  if (input.crisis_flag) {
    return {
      action: 'escalate',
      decision: 'SILENCE',
      silence: true,
      inferred_need: 'crisis',
      recommendations: [],
      exclusions: [{ protocol_id: '*', reasons: ['crisis_path_no_protocol'] }],
      personalized_message:
        'ESCALATE: Crisis flag set. Do not run breath/performance protocols. Connect principal to consented human support / emergency resources immediately. Staff: stay with them; do not leave protocol cards.',
      why_selected: ['crisis_flag → no protocol ranking'],
      tau_select: SPEC.thresholds.tau_select,
      scores: {},
      input,
    };
  }

  // Activity / policy silence gates (staff may still override outside this MVP)
  const activity = String(input.activity || input.upcoming_event_tag || '').toLowerCase();
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
      personalized_message: 'SILENCE: activity/receptivity/policy gate. No protocol push.',
      why_selected: ['activity_or_policy_gate'],
      tau_select: SPEC.thresholds.tau_select,
      scores: {},
      input,
    };
  }

  // basic validation
  const errors = validateInput(input);
  if (errors.length) {
    return {
      action: 'error',
      decision: 'INVALID',
      silence: true,
      errors,
      recommendations: [],
      exclusions: [],
      personalized_message: 'Invalid input: ' + errors.join('; '),
      why_selected: ['validation_failed'],
      input,
    };
  }

  const inferred = inferNeeds(input);
  const exclusions = [];
  const scored = [];

  for (const p of CATALOG) {
    const reasons = hardExclude(p, input, inferred);
    if (reasons.length) {
      exclusions.push({ protocol_id: p.protocol_id, name: p.name, reasons });
      continue;
    }
    const s = scoreProtocol(p, input, inferred);
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
      score: s.score,
      features: s.features,
      why: s.why,
      // never invent vault steps — only expose public ID + name + short purpose
      purpose: p.purpose,
      is_vault_ip: !!p.is_vault_ip,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const tau = SPEC.thresholds.tau_select;
  const top = scored.slice(0, 3);

  if (!top.length || top[0].score < tau) {
    return {
      action: 'silence',
      decision: 'SILENCE',
      silence: true,
      inferred_need: primaryNeed(inferred),
      inferred_needs: inferred,
      recommendations: top, // may be below threshold — staff can still see grayed
      below_threshold: true,
      exclusions: exclusions.slice(0, 40),
      exclusion_count: exclusions.length,
      personalized_message: `SILENCE: best score ${top[0] ? top[0].score : 0} < τ_select ${tau}. Prefer no protocol push; staff may still coach manually.`,
      why_selected: top[0]
        ? [`best:${top[0].protocol_id}@${top[0].score}<tau`, ...((top[0] && top[0].why) || [])]
        : ['no_candidates_after_filters'],
      tau_select: tau,
      scores: Object.fromEntries(scored.slice(0, 10).map((x) => [x.protocol_id, x.score])),
      input,
    };
  }

  const primary = top[0];
  // Prefer catalog object for message duration fields
  const full = CATALOG.find((p) => p.protocol_id === primary.protocol_id);

  return {
    action: 'suggest',
    decision: 'RECOMMEND',
    silence: false,
    inferred_need: primaryNeed(inferred),
    inferred_needs: inferred,
    recommendations: top,
    exclusions: exclusions.slice(0, 40),
    exclusion_count: exclusions.length,
    personalized_message: buildMessage(input, full || primary, inferred),
    why_selected: primary.why,
    tau_select: tau,
    scores: Object.fromEntries(scored.slice(0, 10).map((x) => [x.protocol_id, x.score])),
    input,
  };
}

function normalizeInput(raw) {
  const r = raw || {};
  return {
    client_type: r.client_type || 'startup_founder',
    available_minutes: r.available_minutes != null ? Number(r.available_minutes) : 10,
    place_class: r.place_class || 'office',
    upcoming_event_tag: r.upcoming_event_tag || 'none',
    stress: r.stress != null ? Number(r.stress) : 3,
    energy: r.energy != null ? Number(r.energy) : 3,
    sleep_h: r.sleep_h === '' || r.sleep_h == null ? null : Number(r.sleep_h),
    prefers_breath: r.prefers_breath || 'neutral',
    history_notes: r.history_notes || '',
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
};
