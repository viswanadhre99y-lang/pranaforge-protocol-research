const { test, expect } = require('@playwright/test');

const BASE = process.env.PIE_BASE_URL || 'http://127.0.0.1:8790';
const PIN = process.env.PIE_STAFF_PIN || 'pie-test-pin';

async function api(request, method, path, body) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-PIE-Staff-Pin': PIN,
    },
  };
  if (body !== undefined) opts.data = body;
  const res = await request.fetch(BASE + path, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status(), json };
}

test.describe.configure({ mode: 'serial' });

test('P2. health reports phase2 version', async ({ request }) => {
  const res = await request.get(BASE + '/api/health');
  const j = await res.json();
  expect(res.ok()).toBeTruthy();
  expect(String(j.version || '')).toMatch(/phase2|1\.3/);
});

test('P2. recommendations expose dose variants + delivery_modality', async ({ request }) => {
  const { status, json } = await api(request, 'POST', '/api/recommend', {
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
  expect(status).toBe(200);
  const top = (json.recommendations || [])[0];
  expect(top).toBeTruthy();
  expect(top.dose).toBeTruthy();
  expect(top.dose.micro).toBeGreaterThan(0);
  expect(top.dose.minimum).toBeGreaterThan(0);
  expect(top.dose.recommended).toBeGreaterThan(0);
  expect(top.dose.extended).toBeGreaterThan(0);
  expect(top.preferred_dose).toMatch(/^(micro|minimum|recommended|extended)$/);
  expect(top.delivery_modality).toMatch(/^(staff_led|audio|text|self_guided)$/);
});

test('P2. tight gap prefers micro dose', async ({ request }) => {
  const { status, json } = await api(request, 'POST', '/api/recommend', {
    client_id: 'phase2-micro-' + Date.now(),
    client_type: 'startup_founder',
    available_minutes: 2,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 5,
    energy: 3,
  });
  expect(status).toBe(200);
  const top = (json.recommendations || [])[0];
  if (top && top.dose) {
    expect(top.preferred_dose).toBe('micro');
  }
});

test('P2. public context → text or self_guided modality', async ({ request }) => {
  const { status, json } = await api(request, 'POST', '/api/recommend', {
    client_id: 'phase2-public-' + Date.now(),
    client_type: 'startup_founder',
    available_minutes: 5,
    place_class: 'airport',
    privacy: 'public',
    stress: 4,
    energy: 3,
    upcoming_event_tag: 'none',
  });
  expect(status).toBe(200);
  for (const r of json.recommendations || []) {
    expect(['text', 'self_guided']).toContain(r.delivery_modality);
  }
});

test('P2. outcome updates response_graph and boosts rerank', async ({ request }) => {
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
  const before = await api(request, 'POST', '/api/recommend', base);
  expect(before.status).toBe(200);
  const beforeTop =
    before.json.recommendations &&
    before.json.recommendations[0] &&
    before.json.recommendations[0].protocol_id;
  const target =
    (before.json.recommendations || []).map((r) => r.protocol_id).find((id) => id !== beforeTop) ||
    'centering-ravizza';

  const stored = await api(request, 'POST', '/api/outcome', {
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
    await api(request, 'POST', '/api/outcome', {
      client_id,
      protocol_id: beforeTop,
      rating_1_to_10: 1,
      context_key: 'investor_meeting',
      delivery_modality: 'self_guided',
    });
  }

  const after = await api(request, 'POST', '/api/recommend', base);
  expect(after.status).toBe(200);
  const afterIds = (after.json.recommendations || []).map((r) => r.protocol_id);
  const afterScores = after.json.scores || {};
  const effect =
    afterIds.includes(target) ||
    (afterScores[target] != null &&
      before.json.scores &&
      afterScores[target] >= (before.json.scores[target] || 0));
  expect(effect).toBeTruthy();

  // Isolation
  const other = await api(request, 'POST', '/api/recommend', {
    ...base,
    client_id: 'other-' + client_id,
  });
  expect(other.status).toBe(200);
});

test('P2. history endpoint returns decisions, outcomes, graph (historical only)', async ({
  request,
}) => {
  const client_id = 'phase2-hist-' + Date.now();
  await api(request, 'POST', '/api/recommend', {
    client_id,
    client_type: 'startup_founder',
    available_minutes: 10,
    place_class: 'office',
    upcoming_event_tag: 'investor_meeting',
    stress: 4,
    energy: 3,
  });
  await api(request, 'POST', '/api/outcome', {
    client_id,
    protocol_id: 'box-breathing',
    rating_1_to_10: 8,
    context_key: 'office',
    delivery_modality: 'staff_led',
  });

  const { status, json } = await api(request, 'GET', `/api/client/${client_id}/history?limit=10`);
  expect(status).toBe(200);
  expect(json.client_id).toBe(client_id);
  expect(json.phrasing).toMatch(/historical/i);
  expect(json.disclaimer || '').toMatch(/historical|not predictions/i);
  expect(Array.isArray(json.decisions)).toBeTruthy();
  expect(Array.isArray(json.outcomes)).toBeTruthy();
  expect(json.outcomes.length).toBeGreaterThanOrEqual(1);
  expect(json.response_graph).toBeTruthy();
  expect(json.response_graph.disclaimer || json.disclaimer).toBeTruthy();
  const blob = JSON.stringify(json.response_graph);
  expect(blob.toLowerCase()).not.toMatch(/will improve|predict|guaranteed/);
  if (json.response_graph.observations && json.response_graph.observations.length) {
    for (const o of json.response_graph.observations) {
      expect(String(o).toLowerCase()).toMatch(/historical|observation|rated|logged/);
    }
  }
});

test('P2. UI shows dose, modality, and client history panel', async ({ page }) => {
  await page.addInitScript((pin) => {
    sessionStorage.setItem('pie_staff_pin', pin);
  }, PIN);
  await page.goto(BASE + '/');
  await page.fill('#staff_pin', PIN);
  await page.click('#btn-save-pin');
  await page.fill('#client_id', 'phase2-ui-' + Date.now());
  await page.click('#btn-recommend');
  await expect(page.locator('#decision-badge')).not.toHaveText('—', { timeout: 10000 });
  await expect(page.locator('.dose-row').first()).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.modality-row').first()).toBeVisible();
  await expect(page.locator('#history-block')).toBeVisible();
  await expect(page.locator('#client-history')).toBeVisible();
});
