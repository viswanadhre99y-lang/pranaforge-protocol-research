# Phase 2 Delivery — Personal Response Graph & Delivery Variants

**Date:** 2026-09-19 Asia/Calcutta  
**Runtime version:** `1.3.0-phase2`  
**Baseline:** PIE V1.1 + Phase 1 Client State Intelligence

## What landed

| Item | Status |
|------|--------|
| Personal response graph (file-backed) | Done — `17_runtime/data/response_graph.json` via `response_graph.js` |
| Graph update on `/api/outcome` | Done — appends `outcomes.jsonl` **and** updates per-client graph |
| Ranker uses graph more strongly than raw outcomes | Done — graph boost −0.25..+0.25; outcomes.jsonl fallback −0.15..+0.15 (simple averages only) |
| Duration / dose variants on recommendations | Done — `dose: {micro, minimum, recommended, extended}`; `preferred_dose` prefers **micro** when gap is tight |
| Delivery modality on recommendations | Done — `delivery_modality: staff_led\|audio\|text\|self_guided` with simple context rules |
| Store modality with outcomes | Done — optional `delivery_modality` on `POST /api/outcome` |
| Longitudinal history API | Done — `GET /api/client/:client_id/history` (decisions + outcomes + response_graph summary) |
| Staff UI: dose, modality, Client history panel | Done — `public/index.html`, `app.js`, `styles.css` |
| Docs | This file |
| Tests | `17_runtime/tests/phase2.spec.js` (+ existing suite) |

## Response graph schema

```json
{
  "<client_id>": {
    "<protocol_id>": {
      "n": 3,
      "mean_rating": 8.333,
      "last_contexts": ["investor_meeting", "desk"],
      "last_at": "2026-09-19T…Z",
      "last_modality": "text"
    }
  }
}
```

Clients are never mixed. Learning remains **rating-primary simple averages** — not bandits.

## Delivery modality rules (heuristic)

1. Public context → `text` if `public_discrete`, else `self_guided`
2. Short gap (≤3 min) → `text`
3. Private + `staff_id` present → `staff_led`
4. Else prefer channel `audio` if listed, else `self_guided`

## History API phrasing

Responses include `phrasing: "historical_observations_only"` and a disclaimer. Observation strings are framed as **historical observations** only — no predictions or clinical claims.

## What did **not** land (honest residual)

| Area | Status |
|------|--------|
| Bandits / contextual policies | **Not implemented** (explicitly out of scope) |
| Fake calendar / wearables | **Not implemented** |
| Clinical claims / validation | **Not claimed** |
| Ranker rewrite | **Intentionally not done** |
| Vault IP expansion | **Never** |
| Full sequence scheduler | **Not implemented** (suggested_sequence stub remains) |
| Consumer app / SSO / UHNW ACLs | **Not implemented** |

## Honesty line

Scores, confidence, dose preference, and modality selection are **engineering heuristics**. The response graph is an observational personalization prior, not causal proof that a protocol “works” for a client.
