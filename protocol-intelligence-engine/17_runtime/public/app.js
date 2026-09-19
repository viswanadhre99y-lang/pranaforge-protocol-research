async function health() {
  try {
    const r = await fetch('/api/health');
    const j = await r.json();
    document.getElementById('health-tag').textContent = j.ok
      ? `catalog ${j.catalog_size} · τ=${j.tau_select}`
      : 'unhealthy';
  } catch {
    document.getElementById('health-tag').textContent = 'offline';
  }
}

function readForm() {
  const sleepRaw = document.getElementById('sleep_h').value;
  return {
    client_type: document.getElementById('client_type').value,
    available_minutes: Number(document.getElementById('available_minutes').value),
    place_class: document.getElementById('place_class').value,
    upcoming_event_tag: document.getElementById('upcoming_event_tag').value,
    stress: Number(document.getElementById('stress').value),
    energy: Number(document.getElementById('energy').value),
    sleep_h: sleepRaw === '' ? null : Number(sleepRaw),
    prefers_breath: document.getElementById('prefers_breath').value,
    history_notes: document.getElementById('history_notes').value,
    clinician_mode: document.getElementById('clinician_mode').checked,
    crisis_flag: document.getElementById('crisis_flag').checked,
  };
}

function render(result) {
  const badge = document.getElementById('decision-badge');
  const action = result.action || result.decision;
  badge.textContent = result.silence ? (action === 'escalate' ? 'ESCALATE / SILENCE' : 'SILENCE') : 'TOP-3';
  badge.className = 'badge ' + (action === 'escalate' ? 'escalate' : result.silence ? 'silence' : 'ok');

  document.getElementById('inferred').textContent = result.inferred_need
    ? `inferred_need: ${result.inferred_need}` + (result.inferred_needs ? ' · ' + result.inferred_needs.map((n) => n.need).join(', ') : '')
    : (result.errors ? 'errors: ' + result.errors.join(', ') : '');

  const msg = document.getElementById('message');
  if (result.personalized_message) {
    msg.hidden = false;
    msg.textContent = result.personalized_message;
  } else {
    msg.hidden = true;
  }

  document.getElementById('why').textContent = result.why_selected
    ? 'why: ' + (Array.isArray(result.why_selected) ? result.why_selected.join(' · ') : result.why_selected)
    : '';

  const recs = document.getElementById('recs');
  recs.innerHTML = '';
  const list = result.recommendations || [];
  if (!list.length) {
    recs.innerHTML = '<p class="meta">No recommendations.</p>';
  } else {
    list.forEach((r, i) => {
      const el = document.createElement('div');
      el.className = 'card' + (i === 0 && !result.silence ? ' rank-1' : '');
      el.innerHTML = `<h3>#${i + 1} ${r.name}</h3>
        <div class="meta">${r.protocol_id} · score ${r.score} · evidence ${r.evidence} · ≤${Math.round((r.recommended_duration_sec || r.max_duration_sec) / 60)}m</div>
        <div class="meta">${(r.why || []).join(' · ')}</div>
        <div class="meta" style="margin-top:6px">${r.purpose || ''}</div>`;
      recs.appendChild(el);
    });
  }

  const ex = document.getElementById('exclusions');
  const excl = result.exclusions || [];
  ex.innerHTML = excl.length
    ? excl
        .slice(0, 25)
        .map((e) => `<div>${e.protocol_id}: ${(e.reasons || []).join(', ')}</div>`)
        .join('')
    : '<div>none</div>';
  if (result.exclusion_count) {
    ex.innerHTML += `<div>… total exclusions: ${result.exclusion_count}</div>`;
  }
}

async function recommend() {
  const status = document.getElementById('status');
  status.textContent = 'ranking…';
  try {
    const r = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(readForm()),
    });
    const j = await r.json();
    render(j);
    status.textContent = r.ok ? 'ok' : 'error ' + r.status;
  } catch (e) {
    status.textContent = String(e);
  }
}

document.getElementById('btn-recommend').addEventListener('click', recommend);
document.getElementById('btn-reset').addEventListener('click', () => {
  document.getElementById('client_type').value = 'startup_founder';
  document.getElementById('available_minutes').value = 10;
  document.getElementById('place_class').value = 'office';
  document.getElementById('upcoming_event_tag').value = 'investor_meeting';
  document.getElementById('stress').value = 5;
  document.getElementById('energy').value = 3;
  document.getElementById('sleep_h').value = 5.5;
  document.getElementById('prefers_breath').value = 'neutral';
  document.getElementById('history_notes').value = '';
  document.getElementById('clinician_mode').checked = false;
  document.getElementById('crisis_flag').checked = false;
});

health();
