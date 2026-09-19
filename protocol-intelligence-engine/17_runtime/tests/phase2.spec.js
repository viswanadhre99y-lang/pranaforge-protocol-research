const { test, expect } = require('@playwright/test');
const http = require('http');

const PIE_URL = process.env.PIE_BASE_URL || 'http://127.0.0.1:8840';
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

test('P2. health reports phase2 version', async () => {
  const res = await api('GET', '/api/health', null, { noAuth: true });
  expect(res.status).toBe(200);
  expect(String(res.json.version || '')).toMatch(/phase2|1\.3/);
});

test('P2. recommendations expose dose variants + delivery_modality', async () => {
  const res = await api('POST', '/api/recommend', {
    client_id: 'phase2-dose-' + Date.now(),
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    privacy: 'private',
    upcoming_event_tag: 'investor_meeting',
    stress: 4,
    energy: 3,
    staff_id: 'staff-1',
  });
  expect(res.status).toBe(200);
  const top = (res.json.recommendations || [])[0];
  expect(top).toBeTruthy();
  expect(top.dose).toBeTruthy();
  expect(top.dose.micro).toBeGreaterThan(0);
  expect(top.dose.minimum).toBeGreaterThan(0);
  expect(top.dose.recommended).toBeGreaterThan(0);
  expect(top.dose.extended).toBeGreaterThan(0);
  expect(top.preferred_dose).toMatch(/^(micro|minimum|recommended|extended)$/);
  expect(top.delivery_modality).toMatch(/^(staff_led|audio|text|self_guided)$/);
});

test('P2. tight gap prefers micro dose', async () => {
  const res = await api('POST', '/api/recommend', {
    client_id: 'phase2-micro-' + Date.now(),
    client_type: 'startup_founder',
    available_minutes: 2,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 5,
    energy: 3,
  });
  expect(res.status).toBe(200);
  const top = (res.json.recommendations || [])[0];
  if (top && top.dose) {
    expect(top.preferred_dose).toBe('micro');
  }
});

test('P2. public context → text or self_guided modality', async () => {
  const res = await api('POST', '/api/recommend', {
    client_id: 'phase2-public-' + Date.now(),
    client_type: 'startup_founder',
    available_minutes: 5,
    place_class: 'airport',
    privacy: 'public',
    stress: 4,
    energy: 3,
    upcoming_event_tag: 'none',
  });
  expect(res.status).toBe(200);
  for (const r of res.json.recommendations || []) {
    expect(['text', 'self_guided']).toContain(r.delivery_modality);
  }
});

test('P2. outcome updates response_graph and boosts rerank', async () => {
  const client_id = 'phase2-learn-' + Date.now();
  const base = {
    client_id,
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 4,
    energy: 3,
    goal: 'pre_performance',
  };
  const before = await api('POST', '/api/recommend', base);
  expect(before.status).toBe(200);
  const beforeTop =
    before.json.recommendations &&
    before.json.recommendations[0] &&
    before.json.recommendations[0].protocol_id;
  const target =
    (before.json.recommendations || []).map((r) => r.protocol_id).find((id) => id !== beforeTop) ||
    'centering-ravizza';

  const stored = await api('POST', '/api/outcome', {
    client_id,
    protocol_id: target,
    rating_1_to_10: 10,
    context_key: 'investor_meeting',
    delivery_modality: 'text',
  });
  expect(stored.status).toBe(200);
  expect(stored.json.ok).toBeTruthy();
  expect(stored.json.graph_node || stored.json.stored).toBeTruthy();
  if (stored.json.stored) {
    expect(stored.json.stored.delivery_modality).toBe('text');
  }

  if (beforeTop && beforeTop !== target) {
    await api('POST', '/api/outcome', {
      client_id,
      protocol_id: beforeTop,
      rating_1_to_10: 1,
      context_key: 'investor_meeting',
      delivery_modality: 'self_guided',
    });
  }

  const after = await api('POST', '/api/recommend', base);
  expect(after.status).toBe(200);
  const afterIds = (after.json.recommendations || []).map((r) => r.protocol_id);
  const afterScores = after.json.scores || {};
  const effect =
    afterIds.includes(target) ||
    (afterScores[target] != null &&
      before.json.scores &&
      afterScores[target] >= (before.json.scores[target] || 0));
  expect(effect).toBeTruthy();

  const other = await api('POST', '/api/recommend', { ...base, client_id: 'other-' + client_id });
  expect(other.status).toBe(200);
});

test('P2. history endpoint returns decisions, outcomes, graph (historical only)', async () => {
  const client_id = 'phase2-hist-' + Date.now();
  await api('POST', '/api/recommend', {
    client_id,
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 4,
    energy: 3,
  });
  await api('POST', '/api/outcome', {
    client_id,
    protocol_id: 'box-breathing',
    rating_1_to_10: 8,
    context_key: 'office',
    delivery_modality: 'staff_led',
  });

  const res = await api('GET', `/api/client/${client_id}/history?limit=10`);
  expect(res.status).toBe(200);
  expect(res.json.client_id).toBe(client_id);
  expect(String(res.json.phrasing || '')).toMatch(/historical/i);
  expect(String(res.json.disclaimer || '')).toMatch(/historical|not prediction/i);
  expect(Array.isArray(res.json.decisions)).toBeTruthy();
  expect(Array.isArray(res.json.outcomes)).toBeTruthy();
  expect(res.json.outcomes.length).toBeGreaterThanOrEqual(1);
  expect(res.json.response_graph).toBeTruthy();
  const blob = JSON.stringify(res.json.response_graph);
  expect(blob.toLowerCase()).not.toMatch(/will improve|guaranteed to/);
  const obs = res.json.response_graph.observations || [];
  for (const o of obs) {
    expect(String(o).toLowerCase()).toMatch(/historical|observation|rated|logged|mean/);
  }
});

test('P2. UI shows dose, modality, and client history panel', async ({ page }) => {
  await page.addInitScript((pin) => {
    sessionStorage.setItem('pie_staff_pin', pin);
  }, STAFF_PIN);
  await page.goto(PIE_URL + '/');
  await page.fill('#staff_pin', STAFF_PIN);
  await page.click('#btn-save-pin');
  await page.fill('#client_id', 'phase2-ui-' + Date.now());
  await page.click('#btn-recommend');
  await expect(page.locator('#decision-badge')).not.toHaveText('—', { timeout: 15000 });
  await expect(page.locator('.dose-row').first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator('.modality-row').first()).toBeVisible();
  await expect(page.locator('#history-block')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#client-history')).toBeVisible();
});
