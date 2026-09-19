# PIE Runtime — Staff Top-3 Picker (V1.1 + Client State Intelligence Phase 1)

Local MVP implementing the founder “build first” slice from `12_mvp/` + `05_ranking/score_spec.json` + `02_protocol_catalog/catalog.jsonl`, extended with nested ClientState/Context, safety gateway, decision records, and structured explanations.

## Run

```bash
npm install
npx playwright install chromium   # once
PIE_STAFF_PIN=pie-test-pin PORT=8790 node server.js
# UI: http://127.0.0.1:<port>/
PIE_BASE_URL=http://127.0.0.1:<port> PIE_STAFF_PIN=pie-test-pin npx playwright test
```

## API

- `GET /api/health` — `{version, intended_port, listen_port, auth_mode, catalog_size, tau_select}`
- `POST /api/recommend` — **legacy flat** body **or** nested `{client_state, context, goal, constraints}`
- `POST /api/batch` — array of scenarios
- `GET /api/audit?limit=50` — audit log (includes `decision_record` when present)
- `POST /api/outcome` — rating (+ optional `before`/`after` subjective fields); learning still uses rating
- `GET /api/catalog` — public IDs + version / evidence_class / modality / duration bands

### Nested recommend body (Phase 1)

```json
{
  "client_state": {
    "client_id": "c1",
    "client_type": "startup_founder",
    "emotional": { "stress": { "value": 5, "source": "self_reported", "confidence": 0.8 } },
    "physical": { "energy": { "value": 3, "source": "self_reported" } },
    "temporal": { "available_minutes": { "value": 10, "source": "observed" } }
  },
  "context": {
    "where": { "place_class": "office" },
    "event": { "upcoming_tag": "investor_meeting", "phase": "before_event" },
    "time_available": { "minutes": 10 }
  },
  "goal": "pre_performance"
}
```

Sources: `observed | self_reported | inferred | unknown`. **Never invent medical diagnoses.**

### Response additions (non-breaking)

Each recommendation may include: `explanation`, `confidence`, `protocol_version`, `evidence_class`.  
Top-level: `client_state`, `context`, `moment`, `decision_record`, `confidence`, `explanation`.

### Safety gateway

`safety_gateway.js` centralizes crisis NLP → severity/confidence/escalate and hard exclusions.  
Pipeline: **Input → Safety → Hard exclude → Candidates → Rank**.

### Duration / dose (P1-4)

Gap-fit uses **`recommended_duration_sec`**. If recommended exceeds gap but **`min_duration_sec` ≤ gap**, dose shrinks to fit. Never recommend above `available_minutes*60`.

### Crisis NLP

Free-text `history_notes` / `goal` / `notes` scanned for crisis keywords. False-positive risk remains — not a clinical instrument.

### Auth

When `PIE_STAFF_PIN` set → `X-PIE-Staff-Pin` required (wrong/missing → **401**). Unset → `auth: open_dev`.

### Integrations

`integrations/` stubs (`calendar`, `travel`, `wearable`, `messaging`, `concierge`) export `status: 'not_connected'` only — **no fake data**.

### Schemas

Builders in `schemas/`; docs in `../19_architecture/schemas/`.

## Honesty

Ranking score and confidence are **engineering heuristics**, not clinical instruments. Vault IP never expands into steps. CPI priors are engineering priors. Phase 1 is **not** production-ready / clinically validated.
