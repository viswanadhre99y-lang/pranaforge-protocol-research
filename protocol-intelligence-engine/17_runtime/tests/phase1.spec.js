const { test, expect } = require('@playwright/test');
const http = require('http');

const PIE_URL = process.env.PIE_BASE_URL || 'http://127.0.0.1:8790';
const STAFF_PIN = process.env.PIE_STAFF_PIN || 'pie-test-pin';

function api(method, urlPath, body, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlPath, PIE_URL);
    const data = body != null ? JSON.stringify(body) : null;
    const headers = {};
    if (data) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    if (!opts.noAuth) headers['X-PIE-Staff-Pin'] = opts.pin != null ? opts.pin : STAFF_PIN;
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + (u.search || ''),
        method,
        headers,
        timeout: 30000,
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(buf);
          } catch {
            json = { raw: buf };
          }
          resolve({ status: res.statusCode, json });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

test.describe.configure({ mode: 'serial' });

test('P1. nested ClientState API works', async () => {
  const res = await api('POST', '/api/recommend', {
    client_state: {
      client_id: 'phase1-nested',
      client_type: 'startup_founder',
      emotional: { stress: { value: 5, source: 'self_reported', confidence: 0.8 } },
      physical: {
        energy: { value: 3, source: 'self_reported' },
        sleep_h: { value: 5.5, source: 'self_reported' },
      },
      behavioral: { prefers_breath: { value: 'neutral', source: 'self_reported' } },
      temporal: { available_minutes: { value: 10, source: 'observed' } },
    },
    context: {
      where: { place_class: 'office' },
      event: { upcoming_tag: 'investor_meeting', phase: 'before_event' },
      time_available: { minutes: 10 },
    },
    goal: 'pre_performance',
  });
  expect(res.status).toBe(200);
  expect(res.json.client_state).toBeTruthy();
  expect(res.json.context).toBeTruthy();
  expect(res.json.action === 'suggest' || res.json.action === 'silence').toBeTruthy();
});

test('P1. explanation and confidence present on recommendations', async () => {
  const res = await api('POST', '/api/recommend', {
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 5,
    energy: 3,
    sleep_h: 5.5,
  });
  expect(res.status).toBe(200);
  expect(res.json.confidence).not.toBeNull();
  if (res.json.recommendations && res.json.recommendations[0]) {
    const top = res.json.recommendations[0];
    expect(top.explanation).toBeTruthy();
    expect(Array.isArray(top.explanation.positives)).toBeTruthy();
    expect(Array.isArray(top.explanation.penalties)).toBeTruthy();
    expect(top.confidence).toBeGreaterThan(0);
    expect(top.protocol_version).toBeTruthy();
    expect(top.evidence_class).toBeTruthy();
  }
});

test('P1. decision_record fields', async () => {
  const res = await api('POST', '/api/recommend', {
    client_id: 'dr-client',
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 4,
    energy: 3,
  });
  expect(res.status).toBe(200);
  const dr = res.json.decision_record;
  expect(dr).toBeTruthy();
  expect(dr.decision_id).toMatch(/^dr_/);
  expect(dr.client_id).toBe('dr-client');
  expect(dr.timestamps && dr.timestamps.decided_at).toBeTruthy();
  expect(dr.state).toBeTruthy();
  expect(dr.context).toBeTruthy();
  expect(Array.isArray(dr.exclusions)).toBeTruthy();
  expect(Array.isArray(dr.top)).toBeTruthy();
  expect(dr.protocol_versions).toBeTruthy();
  expect(dr.schema_version).toBe('1.0.0');
});

test('P1. safety gateway: crisis before rank (escalate, empty recs)', async () => {
  const res = await api('POST', '/api/recommend', {
    available_minutes: 10,
    place_class: 'office',
    stress: 3,
    energy: 3,
    notes: 'principal said want to die',
  });
  expect(res.status).toBe(200);
  expect(res.json.action).toBe('escalate');
  expect(res.json.recommendations).toEqual([]);
  expect(res.json.safety && res.json.safety.escalate).toBeTruthy();
  expect(res.json.decision_record).toBeTruthy();
});

test('P1. public hard-exclude still works', async () => {
  const res = await api('POST', '/api/recommend', {
    available_minutes: 5,
    place_class: 'airport',
    privacy: 'public',
    stress: 4,
    energy: 3,
    upcoming_event_tag: 'none',
  });
  expect(res.status).toBe(200);
  const hasPublic = (res.json.exclusions || []).some((e) =>
    (e.reasons || []).some((x) => /public_discrete_false/i.test(x))
  );
  expect(hasPublic).toBeTruthy();
  for (const rec of res.json.recommendations || []) {
    expect(rec.public_discrete).not.toBe(false);
  }
});

test('P1. outcome expanded before/after fields', async () => {
  const client_id = 'outcome-expand-' + Date.now();
  const res = await api('POST', '/api/outcome', {
    client_id,
    protocol_id: 'box-breathing',
    rating_1_to_10: 7,
    context_key: 'test',
    before: { stress: { value: 5, source: 'self_reported' } },
    after: {
      stress: { value: 3, source: 'self_reported' },
      energy: { value: 4, source: 'self_reported' },
      focus: { value: 4, source: 'self_reported' },
      adherence: { value: 5, source: 'self_reported' },
      satisfaction: { value: 8, source: 'self_reported' },
    },
  });
  expect(res.status).toBe(200);
  expect(res.json.stored.after.stress.value).toBe(3);
  expect(res.json.stored.before.stress.value).toBe(5);
  expect(res.json.stored.rating_1_to_10).toBe(7);
});

test('P1. legacy flat input still works', async () => {
  const res = await api('POST', '/api/recommend', {
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 5,
    energy: 3,
    sleep_h: 5.5,
    prefers_breath: 'neutral',
  });
  expect(res.status).toBe(200);
  expect(['suggest', 'silence', 'escalate']).toContain(res.json.action);
  expect(res.json.input.stress).toBe(5);
  expect(res.json.decision_record).toBeTruthy();
});

test('P1. wrong PIN → 401', async () => {
  const health = await api('GET', '/api/health', null, { noAuth: true });
  if (health.json.auth_mode === 'open_dev' || health.json.auth === 'open_dev') {
    test.skip();
    return;
  }
  const missing = await api('POST', '/api/recommend', { stress: 3, energy: 3, available_minutes: 5 }, { noAuth: true });
  expect(missing.status).toBe(401);
  const wrong = await api('POST', '/api/recommend', { stress: 3, energy: 3, available_minutes: 5 }, { pin: 'wrong-pin' });
  expect(wrong.status).toBe(401);
});

test('P1. UI shows CURRENT STATE and AVOID', async ({ page }) => {
  await page.addInitScript((pin) => {
    sessionStorage.setItem('pie_staff_pin', pin);
  }, STAFF_PIN);
  await page.goto(PIE_URL + '/');
  await page.fill('#staff_pin', STAFF_PIN);
  await page.click('#btn-save-pin');
  await page.click('#btn-recommend');
  await expect(page.locator('#decision-badge')).not.toHaveText('—', { timeout: 10000 });
  await expect(page.locator('#current-state')).toBeVisible();
  await expect(page.locator('#avoid-list')).toBeVisible();
  await expect(page.locator('#next-reminder')).toBeVisible();
  await expect(page.locator('#copilot-panel')).toBeVisible();
});
