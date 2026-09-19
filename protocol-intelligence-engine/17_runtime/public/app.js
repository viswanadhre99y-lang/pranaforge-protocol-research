const PIN_KEY = 'pie_staff_pin';

function getPin() {
  return sessionStorage.getItem(PIN_KEY) || document.getElementById('staff_pin').value || '';
}

function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const pin = getPin();
  if (pin) h['X-PIE-Staff-Pin'] = pin;
  return h;
}

async function health() {
  try {
    const r = await fetch('/api/health');
    const j = await r.json();
    document.getElementById('health-tag').textContent = j.ok
      ? `catalog ${j.catalog_size} · τ=${j.tau_select} · listen ${j.listen_port}`
      : 'unhealthy';
    document.getElementById('auth-tag').textContent = `auth: ${j.auth_mode || j.auth || '?'}`;
  } catch {
    document.getElementById('health-tag').textContent = 'offline';
  }
}

function readForm() {
  const sleepRaw = document.getElementById('sleep_h').value;
  const privacy = document.getElementById('privacy').value;
  return {
    client_id: document.getElementById('client_id').value || null,
    client_type: document.getElementById('client_type').value,
    available_minutes: Number(document.getElementById('available_minutes').value),
    place_class: document.getElementById('place_class').value,
    privacy: privacy || null,
    upcoming_event_tag: document.getElementById('upcoming_event_tag').value,
    stress: Number(document.getElementById('stress').value),
    energy: Number(document.getElementById('energy').value),
    sleep_h: sleepRaw === '' ? null : Number(sleepRaw),
    prefers_breath: document.getElementById('prefers_breath').value,
    goal: document.getElementById('goal').value,
    history_notes: document.getElementById('history_notes').value,
    notes: document.getElementById('notes').value,
    clinician_mode: document.getElementById('clinician_mode').checked,
    crisis_flag: document.getElementById('crisis_flag').checked,
  };
}

function dimVal(d) {
  if (d == null) return '—';
  if (typeof d === 'object' && 'value' in d) {
    const v = d.value == null || d.value === '' ? '—' : d.value;
    return `${v} (${d.source || 'unknown'})`;
  }
  return String(d);
}

function renderCurrentState(result) {
  const el = document.getElementById('current-state');
  const cs = result.client_state || (result.input && result.input.client_state);
  const ctx = result.context || (result.input && result.input.context);
  const inp = result.input || {};
  if (!cs && !ctx) {
    el.textContent =
      `stress ${inp.stress}/5 · energy ${inp.energy}/5 · place ${inp.place_class || '—'} · event ${inp.upcoming_event_tag || '—'} · gap ${inp.available_minutes}m`;
    return;
  }
  const stress = cs && cs.emotional ? dimVal(cs.emotional.stress) : inp.stress;
  const energy = cs && cs.physical ? dimVal(cs.physical.energy) : inp.energy;
  const sleep = cs && cs.physical ? dimVal(cs.physical.sleep_h) : inp.sleep_h;
  const place = (ctx && ctx.where && ctx.where.place_class) || inp.place_class;
  const event = (ctx && ctx.event && ctx.event.upcoming_tag) || inp.upcoming_event_tag;
  const phase = ctx && ctx.event && ctx.event.phase ? ` · phase ${ctx.event.phase}` : '';
  const mins = (ctx && ctx.time_available && ctx.time_available.minutes) || inp.available_minutes;
  el.textContent = `stress ${stress} · energy ${energy} · sleep_h ${sleep} · place ${place} · event ${event}${phase} · gap ${mins}m · type ${inp.client_type || (cs && cs.client_type) || '—'}`;
}

function render(result) {
  const badge = document.getElementById('decision-badge');
  const action = result.action || result.decision;
  badge.textContent = result.silence ? (action === 'escalate' ? 'ESCALATE / SILENCE' : 'SILENCE') : 'TOP-3';
  badge.className = 'badge ' + (action === 'escalate' ? 'escalate' : result.silence ? 'silence' : 'ok');

  document.getElementById('inferred').textContent = result.inferred_need
    ? `inferred_need: ${result.inferred_need}` +
      (result.inferred_needs ? ' · ' + result.inferred_needs.map((n) => n.need).join(', ') : '')
    : result.errors
      ? 'errors: ' + result.errors.join(', ')
      : '';

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

  const seqEl = document.getElementById('sequence');
  if (result.suggested_sequence && result.suggested_sequence.length) {
    seqEl.textContent = 'suggested_sequence: ' + result.suggested_sequence.join(' → ');
  } else {
    seqEl.textContent = '';
  }

  renderCurrentState(result);
  const confEl = document.getElementById('confidence-summary');
  const conf = result.confidence != null ? result.confidence : (result.recommendations && result.recommendations[0] && result.recommendations[0].confidence);
  confEl.textContent = conf != null ? `decision confidence ${conf} (engineering heuristic)` : '—';

  const recs = document.getElementById('recs');
  recs.innerHTML = '';
  const list = result.recommendations || [];
  const tau = result.tau_select != null ? result.tau_select : 0.42;
  const belowTau = !!result.below_threshold || !!result.silence;
  if (!list.length) {
    recs.innerHTML = '<p class="meta">No recommendations.</p>';
  } else {
    list.forEach((r, i) => {
      const el = document.createElement('div');
      const isBelow = belowTau || (r.score != null && r.score < tau);
      const isTop = !result.silence && !isBelow && i < 3;
      el.className = 'card' + (i === 0 && isTop ? ' rank-1' : '') + (isBelow ? ' below-tau' : '');
      el.setAttribute('data-below-tau', isBelow ? 'true' : 'false');
      const expl = r.explanation || {};
      const positives = (expl.positives || []).slice(0, 6).join(' · ') || (r.why || []).join(' · ');
      const penalties = (expl.penalties || []).length ? (expl.penalties || []).join(' · ') : '';
      const dose = r.dose || {};
      const pref = r.preferred_dose || '';
      const doseLine = dose.micro != null
        ? `dose micro=${dose.micro}s · min=${dose.minimum}s · rec=${dose.recommended}s · ext=${dose.extended}s`
        : '';
      const prefLine = pref ? `preferred_dose=<span class="dose-preferred">${pref}</span>` : '';
      const modLine = r.delivery_modality ? `delivery_modality=<strong>${r.delivery_modality}</strong>` : '';
      el.innerHTML = `<h3>#${i + 1} ${r.name}${isBelow ? ' <span class="below-label">(below τ)</span>' : ''}</h3>
        <div class="meta">${r.protocol_id} · score ${r.score} · conf ${r.confidence != null ? r.confidence : '—'} · evidence ${r.evidence} (${r.evidence_class || '—'}) · v${r.protocol_version || '1.0.0'} · ≤${Math.round((r.recommended_duration_sec || r.max_duration_sec) / 60)}m · public_discrete=${r.public_discrete}</div>
        <div class="meta dose-row">${doseLine}${prefLine ? ' · ' + prefLine : ''}</div>
        <div class="meta modality-row">${modLine || ''}</div>
        <div class="meta why-pos"><strong>WHY+</strong> ${positives || '—'}</div>
        <div class="meta why-pen">${penalties ? '<strong>WHY−</strong> ' + penalties : ''}</div>
        <div class="meta" style="margin-top:6px">${r.purpose || ''}</div>`;
      recs.appendChild(el);
      if (i === 0) document.getElementById('outcome_protocol').value = r.protocol_id;
    });
  }

  // AVOID — top hard-exclusion reasons (summarized)
  const avoidEl = document.getElementById('avoid-list');
  const excl = result.exclusions || [];
  const reasonCounts = new Map();
  for (const e of excl) {
    for (const reason of e.reasons || []) {
      const key = String(reason).split(':')[0];
      reasonCounts.set(key, (reasonCounts.get(key) || 0) + 1);
    }
  }
  const topReasons = [...reasonCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (!topReasons.length) {
    avoidEl.innerHTML = '<div>none (or escalate/silence gate)</div>';
  } else {
    avoidEl.innerHTML = topReasons
      .map(([r, n]) => `<div>${r} ×${n}</div>`)
      .join('');
  }

  const nextEl = document.getElementById('next-reminder');
  if (result.action === 'escalate') {
    nextEl.textContent = 'NEXT: human support / emergency resources — do not log protocol outcomes for crisis escalate.';
  } else if (result.silence) {
    nextEl.textContent = 'NEXT: prefer silence; if staff still coaches manually, optional outcome log is fine.';
  } else {
    nextEl.textContent = 'NEXT: deliver top card → collect outcome (rating required; optional after.* subjective fields).';
  }

  const ex = document.getElementById('exclusions');
  const total = result.exclusions_total != null ? result.exclusions_total : excl.length;
  ex.innerHTML = excl.length
    ? excl.map((e) => `<div>${e.protocol_id}: ${(e.reasons || []).join(', ')}</div>`).join('')
    : '<div>none</div>';
  ex.innerHTML += `<div>total exclusions: ${total}${result.exclusions_truncated ? ' (truncated)' : ''}</div>`;
}

async function recommend() {
  const status = document.getElementById('status');
  status.textContent = 'ranking…';
  try {
    const r = await fetch('/api/recommend', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(readForm()),
    });
    const j = await r.json();
    if (r.status === 401) {
      status.textContent = '401 unauthorized — set Staff PIN';
      return;
    }
    render(j);
    status.textContent = r.ok ? 'ok' : 'error ' + r.status;
    await loadClientHistory();
  } catch (e) {
    status.textContent = String(e);
  }
}

document.getElementById('btn-save-pin').addEventListener('click', () => {
  sessionStorage.setItem(PIN_KEY, document.getElementById('staff_pin').value || '');
  document.getElementById('status').textContent = 'PIN saved to sessionStorage';
});

document.getElementById('staff_pin').value = sessionStorage.getItem(PIN_KEY) || '';

document.getElementById('btn-recommend').addEventListener('click', recommend);
document.getElementById('btn-reset').addEventListener('click', () => {
  document.getElementById('client_id').value = 'demo-client';
  document.getElementById('client_type').value = 'startup_founder';
  document.getElementById('available_minutes').value = 10;
  document.getElementById('place_class').value = 'office';
  document.getElementById('privacy').value = '';
  document.getElementById('upcoming_event_tag').value = 'investor_meeting';
  document.getElementById('stress').value = 5;
  document.getElementById('energy').value = 3;
  document.getElementById('sleep_h').value = 5.5;
  document.getElementById('prefers_breath').value = 'neutral';
  document.getElementById('goal').value = '';
  document.getElementById('history_notes').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('clinician_mode').checked = false;
  document.getElementById('crisis_flag').checked = false;
});

document.getElementById('btn-outcome').addEventListener('click', async () => {
  const status = document.getElementById('outcome-status');
  status.textContent = 'saving…';
  try {
    const after = {};
    const map = [
      ['after_stress', 'stress'],
      ['after_energy', 'energy'],
      ['after_focus', 'focus'],
      ['after_adherence', 'adherence'],
      ['after_satisfaction', 'satisfaction'],
    ];
    for (const [id, key] of map) {
      const el = document.getElementById(id);
      if (el && el.value !== '') after[key] = { value: Number(el.value), source: 'self_reported' };
    }
    const body = {
      client_id: document.getElementById('client_id').value || 'demo-client',
      protocol_id: document.getElementById('outcome_protocol').value,
      rating_1_to_10: Number(document.getElementById('outcome_rating').value),
      context_key: document.getElementById('outcome_context').value || '',
    };
    const mod = document.getElementById('outcome_modality');
    if (mod && mod.value) body.delivery_modality = mod.value;
    if (Object.keys(after).length) body.after = after;
    const r = await fetch('/api/outcome', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const j = await r.json();
    status.textContent = r.ok ? 'stored' : JSON.stringify(j);
    if (r.ok) await loadClientHistory();
  } catch (e) {
    status.textContent = String(e);
  }
});

async function loadClientHistory() {
  const block = document.getElementById('history-block');
  const el = document.getElementById('client-history');
  if (!block || !el) return;
  const clientId = document.getElementById('client_id').value;
  if (!clientId) {
    block.hidden = true;
    return;
  }
  block.hidden = false;
  el.textContent = 'loading history…';
  try {
    const r = await fetch('/api/client/' + encodeURIComponent(clientId) + '/history?limit=12', {
      headers: authHeaders(),
    });
    const j = await r.json();
    if (!r.ok) {
      el.textContent = 'history error: ' + (j.error || r.status);
      return;
    }
    const lines = [];
    lines.push(j.disclaimer || 'Historical observations only — not predictions.');
    const rg = j.response_graph || {};
    if (rg.observations && rg.observations.length) {
      lines.push('');
      lines.push('Response graph observations:');
      for (const o of rg.observations.slice(0, 6)) lines.push('• ' + o);
    } else if (rg.protocols && rg.protocols.length) {
      lines.push('');
      lines.push('Logged protocol means:');
      for (const p of rg.protocols.slice(0, 6)) {
        lines.push(`• ${p.protocol_id}: mean ${p.mean_rating}/10 (n=${p.n})`);
      }
    } else {
      lines.push('');
      lines.push('No response-graph entries yet for this client.');
    }
    if (j.outcomes && j.outcomes.length) {
      lines.push('');
      lines.push(`Recent outcomes (${j.outcomes.length}):`);
      for (const o of j.outcomes.slice(0, 5)) {
        lines.push(
          `• ${o.ts || ''} ${o.protocol_id} rating=${o.rating_1_to_10}` +
            (o.delivery_modality ? ` mod=${o.delivery_modality}` : '')
        );
      }
    }
    if (j.decisions && j.decisions.length) {
      lines.push('');
      lines.push(`Recent decisions (${j.decisions.length}):`);
      for (const d of j.decisions.slice(0, 5)) {
        const top = (d.top3 || d.top3 || []).map((x) => x.protocol_id).filter(Boolean).slice(0, 3).join(',');
        lines.push(`• ${d.ts || ''} ${d.action || d.kind}${top ? ' top=' + top : ''}`);
      }
    }
    el.textContent = lines.join('\n');
  } catch (e) {
    el.textContent = String(e);
  }
}

health();
