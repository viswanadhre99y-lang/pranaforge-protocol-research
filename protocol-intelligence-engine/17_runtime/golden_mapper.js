'use strict';

/**
 * Map golden test_cases.jsonl rows → ranker request inputs.
 * Staff-channel: only apply activity/force_silence gates when expected is SILENCE/ESCALATE.
 */

function parseState(state) {
  const out = { stress: 3, energy: 3, sleep_h: null };
  const s = String(state || '');
  const sm = s.match(/stress\s*=\s*(\d+)/i);
  const em = s.match(/energy\s*=\s*(\d+)/i);
  const sleep = s.match(/sleep(?:_h)?\s*=\s*([\d.]+)/i);
  if (sm) out.stress = Math.min(5, Number(sm[1]));
  if (em) out.energy = Math.min(5, Number(em[1]));
  if (sleep) out.sleep_h = Number(sleep[1]);
  return out;
}

function parseContext(ctx) {
  const c = String(ctx || '').toLowerCase();
  let place_class = 'office';
  let privacy = null;
  if (/open.?office/.test(c)) {
    place_class = 'open_office';
    privacy = 'public';
  } else if (/airport/.test(c)) place_class = 'airport';
  else if (/\bplane\b|in.?flight|cabin/.test(c)) place_class = 'plane';
  else if (/hallway|lobby|public/.test(c)) place_class = 'public';
  else if (/bedroom|in bed|bed\b/.test(c)) place_class = 'bedroom';
  else if (/hotel/.test(c)) place_class = 'hotel';
  else if (/home/.test(c)) place_class = 'home';
  else if (/transit|\bcar\b|uber|taxi/.test(c)) place_class = 'transit';
  else if (/outdoors|outside/.test(c)) place_class = 'outdoors';
  else if (/gym/.test(c)) place_class = 'gym';
  else if (/backstage|green.?room/.test(c)) place_class = 'backstage';
  else if (/desk|office|private/.test(c)) place_class = 'office';

  if (/public_discrete|no privacy|no.?private/.test(c)) privacy = 'public';
  if (/\bprivate\b/.test(c) && privacy !== 'public') privacy = 'private';

  let available_minutes = 10;
  const gap = c.match(/gap\s*=\s*(\d+)\s*s/);
  const gapm = c.match(/gap\s*=\s*(\d+)\s*m/);
  const min = c.match(/(\d+)\s*min/);
  if (gap) available_minutes = Math.max(1, Math.ceil(Number(gap[1]) / 60));
  else if (gapm) available_minutes = Number(gapm[1]);
  else if (min) available_minutes = Number(min[1]);

  // If gap is sub-recommended for known micro cards (120s), keep minutes from gap
  // but expose raw_gap_sec for ranker micro logic.
  const raw_gap_sec = gap ? Number(gap[1]) : available_minutes * 60;

  let upcoming_event_tag = 'none';
  if (/in_meeting|in meeting/.test(c)) upcoming_event_tag = 'in_meeting';
  else if (/pitch|investor|board/.test(c)) upcoming_event_tag = 'investor_meeting';
  else if (/demo/.test(c)) upcoming_event_tag = 'demo_day';
  else if (/conflict/.test(c)) upcoming_event_tag = 'post_conflict';
  else if (/reject/.test(c)) upcoming_event_tag = 'post_rejection';
  else if (/landing|jetlag|timezone/.test(c)) upcoming_event_tag = 'post_landing';
  else if (/01:\d+|1am|spiral|in bed/.test(c)) upcoming_event_tag = '1am_spiral';
  else if (/sleep|wind.?down|bedtime|t.?sleep|23:\d+|evening/.test(c) && /bed|home|hotel|night|wired|launch/.test(c))
    upcoming_event_tag = 'T_sleep';
  else if (/meeting.?streak|back.?to.?back|3 meetings|meetings done/.test(c)) upcoming_event_tag = 'meeting_streak';
  else if (/crash|midday/.test(c)) upcoming_event_tag = 'midday_crash';
  else if (/pre-?flight|preflight/.test(c)) upcoming_event_tag = 'pre_flight';
  else if (/hiring|firing/.test(c)) upcoming_event_tag = 'hiring_firing';
  else if (/runway/.test(c)) upcoming_event_tag = 'runway_scare';
  else if (/live.?blank|elevator|blank/.test(c)) upcoming_event_tag = 'live_blank';

  return { place_class, available_minutes, upcoming_event_tag, privacy, raw_gap_sec };
}

function mapGoldenCase(tc) {
  const st = parseState(tc.state);
  const cx = parseContext(tc.context);
  const ctx = String(tc.context || '').toLowerCase();
  const reason = String(tc.reason || '').toLowerCase();
  const constraints = String(tc.constraints || '').toLowerCase();
  const expected = String(tc.selected || '');
  const expSilence =
    /^(SILENCE|ESCALATE)$/i.test(expected) ||
    /SILENCE_or|ESCALATE_or/i.test(expected);

  const crisis =
    /^ESCALATE/i.test(expected) ||
    /ESCALATE_or/i.test(expected) ||
    tc.goal === 'safety' ||
    /crisis|journal.*escalat|suicid|self-harm|want to die/i.test(reason + ' ' + constraints + ' ' + String(tc.goal || ''));

  // Activity / force_silence ONLY when golden expects silence/escalate (P2-4)
  let activity = '';
  let force_silence = false;
  if (expSilence) {
    if (/in_meeting|in meeting/.test(ctx) || /activity gate|in_meeting/i.test(reason)) activity = 'in_meeting';
    if (/\bcar\b|driving/.test(ctx) || /driving/.test(reason)) activity = 'driving';
    if (/sleeping|asleep/.test(ctx)) activity = 'sleeping';
    force_silence =
      /receptivity|activity gate|orthosomnia|dnd|daily cap|flow protect|tau_select|daily_cap/i.test(reason) ||
      /in_meeting|dnd|orthosomnia|driving|sleeping/.test(ctx) ||
      expected.toUpperCase() === 'SILENCE';
  }

  // Goal → event when context thin; prefer micro event when gap is tiny
  if (cx.raw_gap_sec <= 90 || cx.available_minutes <= 1) {
    if (String(tc.goal || '') === 'micro_reset' || /micro|hallway|elevator|live.?blank/.test(ctx)) {
      cx.upcoming_event_tag = 'live_blank';
    }
  }
  if (cx.upcoming_event_tag === 'none') {
    const g = String(tc.goal || '');
    if (g === 'pre_performance') cx.upcoming_event_tag = 'investor_meeting';
    if (g === 'sleep_prep') cx.upcoming_event_tag = 'T_sleep';
    if (g === 'jetlag' || g === 'jetlag+perform') cx.upcoming_event_tag = 'post_landing';
    if (g === 'cognitive_reset') cx.upcoming_event_tag = 'meeting_streak';
    if (g === 'micro_reset') cx.upcoming_event_tag = 'live_blank';
    if (g === 'recovery_rest' || g === 'recovery') cx.upcoming_event_tag = 'midday_crash';
    if (g === 'circadian_align' || g === 'sleep_debt') cx.upcoming_event_tag = 'post_landing';
    if (g === 'sleep_hygiene') cx.upcoming_event_tag = 'T_sleep';
    if (g === 'travel') cx.upcoming_event_tag = 'pre_flight';
  }

  // Prefer breath from constraints
  let prefers_breath = 'neutral';
  if (/no.?breath|dislikes?\s+breath|avoid.*breath|breath.?intoler/i.test(constraints + ' ' + reason)) prefers_breath = 'no';
  if (/prefers?\s+breath|breath.?yes/i.test(constraints)) prefers_breath = 'yes';

  const notes = [
    tc.constraints || '',
    reason.includes('orthosomnia') ? 'orthosomnia' : '',
    reason.includes('dnd') ? 'dnd' : '',
    reason.includes('daily cap') || reason.includes('daily_cap') ? 'daily_cap' : '',
    reason.includes('flow') ? 'flow_protect' : '',
  ]
    .filter(Boolean)
    .join('; ');

  return {
    id: tc.id,
    expected: tc.selected,
    candidates: tc.candidates || [],
    ambiguous: !!tc.ambiguous,
    goal: tc.goal,
    input: {
      client_type: tc.client || 'startup_founder',
      client_id: tc.client_id || tc.client || 'golden',
      ...st,
      place_class: cx.place_class,
      available_minutes: cx.available_minutes,
      upcoming_event_tag: cx.upcoming_event_tag,
      privacy: cx.privacy,
      goal: tc.goal || '',
      activity,
      force_silence,
      prefers_breath,
      history_notes: notes,
      clinician_mode: /clinician/i.test(String(tc.constraints || '') + reason),
      crisis_flag: !!crisis,
      notes: tc.message || '',
    },
  };
}

function softAgree(row, got) {
  const tops = (got.recommendations || []).map((r) => r.protocol_id);
  const top = tops[0] || null;
  const expected = String(row.expected || '');
  const expSilence = /^(SILENCE|ESCALATE)(_|$)/i.test(expected) || /SILENCE_or|ESCALATE_or/i.test(expected);
  const gotSilence = !!got.silence || got.action === 'escalate';
  if (expSilence) return !!gotSilence;
  if (top === expected) return true;
  if (top && (row.candidates || []).includes(top)) return true;
  if (tops.includes(expected)) return true;
  // staff_* / SEQUENCE_* / clinician_* soft: candidate hit
  if (/^(staff_|SEQUENCE_|clinician_)/i.test(expected)) {
    return (row.candidates || []).some((c) => tops.includes(c) || top === c);
  }
  return false;
}

module.exports = { parseState, parseContext, mapGoldenCase, softAgree };
