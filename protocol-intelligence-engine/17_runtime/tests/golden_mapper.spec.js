const { test, expect } = require('@playwright/test');
const { mapGoldenCase, parseContext, softAgree } = require('../golden_mapper');

test.describe('golden_mapper P2-4', () => {
  test('hallway + pitch micro gap → public + live_blank (not investor)', () => {
    const row = mapGoldenCase({
      id: 'TC002',
      client: 'startup_founder',
      state: 'stress=4',
      context: 'hallway; pitch in 8m; gap=60s',
      goal: 'micro_reset',
      constraints: 'public_discrete',
      selected: 'physiological-sigh-acute',
      candidates: ['physiological-sigh-acute', 'tactical-breath-reset'],
      reason: 'only micro fits gap',
    });
    expect(row.input.place_class).toBe('public');
    expect(row.input.available_minutes).toBe(1);
    expect(row.input.upcoming_event_tag).toBe('live_blank');
    expect(row.input.force_silence).toBeFalsy();
    expect(row.input.activity).toBe('');
  });

  test('force_silence / activity only when expected SILENCE', () => {
    const silence = mapGoldenCase({
      id: 'S1',
      context: 'in_meeting; desk',
      selected: 'SILENCE',
      reason: 'activity gate',
      goal: 'pre_performance',
      candidates: [],
    });
    expect(silence.input.force_silence).toBeTruthy();
    expect(silence.input.activity).toBe('in_meeting');

    const queue = mapGoldenCase({
      id: 'TC061',
      context: 'in_meeting; desk',
      selected: 'staff_queue_ppr',
      reason: 'staff τ; queue for after',
      goal: 'pre_performance',
      candidates: ['ppr'],
    });
    expect(queue.input.force_silence).toBeFalsy();
    expect(queue.input.activity).toBe('');
  });

  test('airport / plane / open_office place_class', () => {
    expect(parseContext('airport lounge gap=300s').place_class).toBe('airport');
    expect(parseContext('plane seat gap=120s').place_class).toBe('plane');
    expect(parseContext('open office desk').place_class).toBe('open_office');
  });

  test('softAgree staff_* uses candidates', () => {
    const ok = softAgree(
      { expected: 'staff_education', candidates: ['jetlag-light-melatonin'] },
      { recommendations: [{ protocol_id: 'jetlag-light-melatonin' }], silence: false }
    );
    expect(ok).toBeTruthy();
  });

  test('softAgree SILENCE_or_*', () => {
    expect(
      softAgree({ expected: 'SILENCE_or_staff_confirm', candidates: [] }, { silence: true, action: 'silence' })
    ).toBeTruthy();
  });
});

test.describe('golden_mapper auditor fixes', () => {
  test('crisis_emotion does not set crisis_flag', () => {
    const row = mapGoldenCase({
      id: 'TC099',
      state: 'TIPP request cardiac unknown',
      context: 'private',
      goal: 'crisis_emotion',
      constraints: 'unknown cardiac',
      selected: '54321-grounding',
      reason: 'screen unknown',
      message: 'Grounding first until cardiac cleared',
      candidates: ['54321-grounding'],
    });
    expect(row.input.crisis_flag).toBeFalsy();
  });

  test('SILENCE_or with ambiguous calendar → force_silence', () => {
    const row = mapGoldenCase({
      id: 'TC102',
      context: 'false high stakes tag',
      goal: 'pre_performance',
      selected: 'SILENCE_or_staff_confirm',
      reason: 'ambiguous calendar',
      candidates: ['physiological-sigh-acute'],
    });
    expect(row.input.force_silence).toBeTruthy();
  });

  test('staff_screen / OSA → force_silence', () => {
    const row = mapGoldenCase({
      id: 'TC103',
      state: 'untreated OSA flag',
      context: 'asks long NSDR lying',
      goal: 'recovery',
      constraints: 'OSA',
      selected: 'staff_screen',
      reason: 'OSA caution',
      candidates: ['staff_screen'],
    });
    expect(row.input.force_silence).toBeTruthy();
  });

  test('prior_negative from state prose', () => {
    const row = mapGoldenCase({
      id: 'TC108',
      state: 'prior_negative on box-breathing',
      context: 'T-20 pitch',
      goal: 'pre_performance',
      selected: 'physiological-sigh-acute',
      candidates: ['physiological-sigh-acute'],
      reason: 'history penalty',
    });
    expect(row.input.history_notes).toMatch(/prior_negative:box-breathing/);
  });

  test('softAgree staff_* accepts silence', () => {
    expect(
      softAgree({ expected: 'staff_screen', candidates: ['staff_screen'] }, { silence: true, action: 'silence', recommendations: [] })
    ).toBeTruthy();
  });
});
