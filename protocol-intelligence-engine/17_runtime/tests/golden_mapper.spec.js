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
