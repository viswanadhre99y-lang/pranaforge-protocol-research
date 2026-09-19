'use strict';

/**
 * ClientState — belief dimensions with {value, source, confidence?}
 * source ∈ observed | self_reported | inferred | unknown
 * Never invent medical diagnoses.
 */

const SOURCES = new Set(['observed', 'self_reported', 'inferred', 'unknown']);

function dim(value, source = 'unknown', confidence) {
  const src = SOURCES.has(source) ? source : 'unknown';
  const out = { value: value == null ? null : value, source: src };
  if (confidence != null && !Number.isNaN(Number(confidence))) {
    out.confidence = Math.max(0, Math.min(1, Number(confidence)));
  }
  return out;
}

function emptyPhysical() {
  return {
    sleep_h: dim(null, 'unknown'),
    energy: dim(null, 'unknown'),
    // No diagnostic labels — only optional self-reported tags staff enter
    notes_tags: dim([], 'unknown'),
  };
}

function emptyCognitive() {
  return {
    focus: dim(null, 'unknown'),
    load_est: dim(null, 'unknown'),
  };
}

function emptyEmotional() {
  return {
    stress: dim(null, 'unknown'),
    mood: dim(null, 'unknown'),
  };
}

function emptyBehavioral() {
  return {
    prefers_breath: dim('neutral', 'unknown'),
    history_notes: dim('', 'unknown'),
    prior_outcomes_depth: dim(0, 'unknown'),
  };
}

function emptyTemporal() {
  return {
    available_minutes: dim(null, 'unknown'),
    local_time_bucket: dim(null, 'unknown'),
  };
}

function emptyConstraints() {
  return {
    clinician_mode: dim(false, 'unknown'),
    crisis_flag: dim(false, 'unknown'),
    force_silence: dim(false, 'unknown'),
  };
}

function buildClientState(partial = {}) {
  const p = partial || {};
  return {
    client_id: p.client_id || null,
    client_type: p.client_type || null,
    as_of: p.as_of || new Date().toISOString(),
    physical: { ...emptyPhysical(), ...(p.physical || {}) },
    cognitive: { ...emptyCognitive(), ...(p.cognitive || {}) },
    emotional: { ...emptyEmotional(), ...(p.emotional || {}) },
    behavioral: { ...emptyBehavioral(), ...(p.behavioral || {}) },
    temporal: { ...emptyTemporal(), ...(p.temporal || {}) },
    constraints: { ...emptyConstraints(), ...(p.constraints || {}) },
  };
}

/**
 * Build ClientState from legacy flat recommend body.
 */
function fromFlatInput(flat = {}) {
  const f = flat || {};
  const stressSrc = f.stress != null ? 'self_reported' : 'unknown';
  const energySrc = f.energy != null ? 'self_reported' : 'unknown';
  const sleepSrc = f.sleep_h != null && f.sleep_h !== '' ? 'self_reported' : 'unknown';
  return buildClientState({
    client_id: f.client_id || null,
    client_type: f.client_type || null,
    physical: {
      sleep_h: dim(f.sleep_h == null || f.sleep_h === '' ? null : Number(f.sleep_h), sleepSrc, sleepSrc === 'self_reported' ? 0.7 : undefined),
      energy: dim(f.energy != null ? Number(f.energy) : null, energySrc, energySrc === 'self_reported' ? 0.7 : undefined),
      notes_tags: dim([], 'unknown'),
    },
    cognitive: {
      focus: dim(null, 'unknown'),
      load_est: dim(null, 'inferred'),
    },
    emotional: {
      stress: dim(f.stress != null ? Number(f.stress) : null, stressSrc, stressSrc === 'self_reported' ? 0.75 : undefined),
      mood: dim(null, 'unknown'),
    },
    behavioral: {
      prefers_breath: dim(f.prefers_breath || 'neutral', f.prefers_breath ? 'self_reported' : 'unknown', 0.8),
      history_notes: dim(f.history_notes || '', f.history_notes ? 'observed' : 'unknown'),
      prior_outcomes_depth: dim(0, 'unknown'),
    },
    temporal: {
      available_minutes: dim(f.available_minutes != null ? Number(f.available_minutes) : null, 'observed', 0.9),
      local_time_bucket: dim(null, 'unknown'),
    },
    constraints: {
      clinician_mode: dim(!!f.clinician_mode, 'observed'),
      crisis_flag: dim(!!f.crisis_flag, 'observed'),
      force_silence: dim(!!f.force_silence, 'observed'),
    },
  });
}

/** Count dimensions with source === unknown or null value */
function countUnknown(state) {
  let n = 0;
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    if ('value' in obj && 'source' in obj) {
      if (obj.source === 'unknown' || obj.value == null || obj.value === '') n += 1;
      return;
    }
    for (const v of Object.values(obj)) walk(v);
  };
  walk(state.physical);
  walk(state.cognitive);
  walk(state.emotional);
  walk(state.behavioral);
  walk(state.temporal);
  return n;
}

module.exports = {
  SOURCES,
  dim,
  buildClientState,
  fromFlatInput,
  countUnknown,
};
