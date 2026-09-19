# PIE Runtime V1.1 — Staff Top-3 Picker

Local MVP implementing the founder “build first” slice from `12_mvp/` + `05_ranking/score_spec.json` + `02_protocol_catalog/catalog.jsonl`.

## Run

```bash
npm install
npx playwright install chromium   # once
PORT=8790 node server.js          # falls back to 8791+ if busy
# UI: http://127.0.0.1:<port>/
PIE_BASE_URL=http://127.0.0.1:<port> npx playwright test
```

Optional staff PIN:

```bash
PIE_STAFF_PIN=secret PORT=8790 node server.js
# Clients must send header X-PIE-Staff-Pin: secret (UI stores PIN in sessionStorage)
# If unset, /api/health reports auth: open_dev
```

## API

- `GET /api/health` — `{intended_port, listen_port, auth_mode, auth, catalog_size, tau_select}`
- `POST /api/recommend` — single scenario → top-3 or SILENCE/escalate (rate-limited 60/min/IP; audited)
- `POST /api/batch` — array of scenarios (audited)
- `GET /api/audit?limit=50` — decision audit log (auth-gated when PIN set)
- `POST /api/outcome` — `{client_id, protocol_id, rating_1_to_10, context_key}` → `data/outcomes.jsonl` (client-isolated learning MVP)
- `GET /api/catalog` — public IDs only

### Duration / dose (P1-4)

Gap-fit uses **`recommended_duration_sec`** as the preferred dose. If recommended exceeds the available gap but **`min_duration_sec` ≤ gap**, dose **shrinks to fit** `available_minutes*60` (never below catalog min). Under micro/acute gaps (≤120s) the ranker prefers `min_duration_sec` when the need is micro/stress/pre-performance. **Never** recommend a dose above `available_minutes*60`.

### Crisis NLP (P0-3)

Free-text fields `history_notes`, `goal`, and `notes` are scanned for crisis keywords (`suicid*`, `kill myself`, `self-harm`, `want to die`, etc.). Matches force the same escalate/SILENCE path as `crisis_flag`.

**False-positive risk:** metaphorical or clinical-discussion language (e.g. quoting a patient, song lyrics, research notes) can trigger escalate. Staff should treat NLP escalate as a safety interrupt, confirm context, and clear the free-text or use an explicit non-crisis note if it was a false positive. Keyword lists are not a clinical instrument.

### Auth (P0-1)

When `PIE_STAFF_PIN` is set, protected routes require header `X-PIE-Staff-Pin`. Wrong/missing → **401**. When unset, health reports `auth: open_dev` / `auth_mode: open_dev`.

### Preferences (P1-2)

`prefers_breath=no` applies a **strong penalty (−0.35)** to breathing protocols rather than hard-excluding the whole breath set (avoids empty candidate sets). Hard-exclude only when history has explicit `contra:breath` / breath medical intolerance.

### Public place (P1-3)

If `place_class` ∈ {public, airport, plane, open_office} **or** `privacy=public`, protocols with `public_discrete===false` are **hard-excluded**.

## Honesty

Ranking score is an **engineering heuristic**, not a clinical instrument. Vault IP is never expanded into steps. CPI priors (founder/CEO/athlete/traveler) are engineering priors, not validated Client Protocol Intelligence.
