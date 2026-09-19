# PIE Runtime V1 — Staff Top-3 Picker

Local MVP implementing the founder “build first” slice from `12_mvp/` + `05_ranking/score_spec.json` + `02_protocol_catalog/catalog.jsonl`.

## Run

```bash
npm install
npx playwright install chromium   # once
PORT=8790 node server.js          # falls back to 8791+ if busy
# UI: http://127.0.0.1:<port>/
PIE_BASE_URL=http://127.0.0.1:<port> npx playwright test
```

## API

- `GET /api/health`
- `POST /api/recommend` — single scenario → top-3 or SILENCE/escalate
- `POST /api/batch` — array of scenarios
- `GET /api/catalog` — public IDs only

## Honesty

Ranking score is an **engineering heuristic**, not a clinical instrument. Vault IP is never expanded into steps.
