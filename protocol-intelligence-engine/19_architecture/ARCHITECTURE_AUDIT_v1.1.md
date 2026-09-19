# Architecture Audit — PIE V1.1 (pre–Client State Intelligence Phase 1)

**Date:** 2026-09-19 Asia/Calcutta  
**Scope:** `17_runtime/` + research packs that the runtime consumes  
**Goal of audit:** land Phase 1 without breaking the working Staff Top-3 MVP

---

## 1. Existing components

| Component | Location | Role |
|-----------|----------|------|
| **Auth** | `server.js` `requireStaffPin` | Optional `PIE_STAFF_PIN` → header `X-PIE-Staff-Pin`; unset = `open_dev` |
| **Audit** | `server.js` `appendAudit` → `data/audit.jsonl` | Hash + summary + top3 + exclusions_count; `GET /api/audit` |
| **Crisis NLP** | `ranker.js` `CRISIS_PATTERNS` / `detectCrisisText` | Scans `history_notes`, `goal`, `notes`, `free_text` → escalate/SILENCE |
| **Hard excludes** | `ranker.js` `hardExclude` | Duration, contra, clinician_only, evidence E, arousal×sleep, public_discrete, equipment, breath medical |
| **Ranking** | `ranker.js` `scoreProtocol` + `05_ranking/score_spec.json` | Weighted heuristic + goal boosts + CPI priors + outcome boost |
| **Outcomes / learning** | `POST /api/outcome` → `data/outcomes.jsonl`; `outcomeBoostMap` | Client-isolated mean rating → ±0.15 score nudge |
| **Sequences** | `suggestSequence` | Max 3 IDs from `follow_up_ids` or simple need/event rules |
| **Messages** | `buildMessage` | Context + why + action + duration + skip |
| **CPI priors** | `CPI_PRIORS` in ranker | founder/ceo/athlete/traveler engineering boosts |
| **UI** | `public/index.html`, `app.js`, `styles.css` | Staff form → Top-3 / SILENCE / escalate + outcome log |
| **Playwright** | `tests/pie.spec.js`, `golden_mapper.spec.js` | ~21 tests; soft golden ≥70% gate |
| **Catalog** | `02_protocol_catalog/catalog.jsonl` (50 cards) | Public IDs only; vault never expanded |
| **Golden mapper** | `golden_mapper.js` | Maps research test cases → ranker input |

---

## 2. Schemas / APIs currently in use

### Runtime API (flat body — de facto schema)
`POST /api/recommend` accepts:
```
client_type, client_id?, available_minutes, place_class, privacy?,
upcoming_event_tag, stress, energy, sleep_h?, prefers_breath,
history_notes?, notes?, goal?, activity?, clinician_mode?,
crisis_flag?, hard_exclude_prior_negative?, force_silence?
```

Response:
```
action, decision, silence, inferred_need, inferred_needs?,
recommendations[{protocol_id,name,score,evidence,why,features,…}],
exclusions[], exclusions_total, personalized_message, why_selected,
tau_select, scores, input, suggested_sequence?
```

Also: `/api/batch`, `/api/health`, `/api/audit`, `/api/outcome`, `/api/catalog`.

### Research schemas (not wired into runtime)
- `01_schema/PROTOCOL_SCHEMA.json` — catalog card shape
- `03_client_state/client_state_schema.json` — full belief vector (richer than MVP inputs)
- No runtime `DecisionRecord` / structured `Explanation` / nested `ClientState` today

---

## 3. Safety logic location (debt)

**Scattered inside `ranker.js`:**
1. Crisis NLP at top of `recommend()` (before validate)
2. Activity/policy silence gate (still in `recommend`)
3. Hard excludes in `hardExclude()` (duration, contra, clinician, evidence E, public, equipment, breath medical)
4. Soft breath penalty in `scoreProtocol` (−0.35)

**Debt:** Safety is not a named gateway; crisis and hard-exclude live next to ranking; future callers can accidentally skip NLP. Phase 1 extracts `safety_gateway.js` and makes `recommend()` call it first.

**Pipeline (target):** Input → Safety (crisis) → Hard exclude → Candidates → Rank → Explain/Confidence → DecisionRecord

---

## 4. Learning (outcomes.jsonl MVP)

- Append-only JSONL: `{ts, client_id, protocol_id, rating_1_to_10, context_key}`
- Ranker reads last ~500 rows, filters by `client_id`, mean-centers ratings
- **No** before/after subjective fields yet; **no** bandits; **no** personal response graph

---

## 5. Missing vs founder Phase 1–5 wishlist

From `00_FOUNDER_ANSWER.md` + `12_mvp/MVP_ROADMAP.md`:

| Wishlist | V1.1 status |
|----------|-------------|
| Staff Top-3 picker | **Done** |
| Nested ClientState / Context belief objects | Missing (flat only) |
| Structured explanation + confidence | Partial (`why` string tags only) |
| Auditable DecisionRecord | Partial (thin audit.jsonl) |
| Safety gateway module | Missing (inlined) |
| Calendar / moment detection | Missing |
| Wearable fusion | Missing (optional `sleep_h` only) |
| Travel/jetlag modules beyond tags | Partial (tags + CPI traveler) |
| Full sequence graph / scheduler | Stub only |
| Messaging / push / WhatsApp | Missing |
| Concierge deep integration | Smoke only |
| Bandits / predictive (V5) | Missing — **out of Phase 1** |
| Clinical validation | Not claimed |

---

## 6. Tech debt / risks of change

| Risk | Mitigation |
|------|------------|
| Soft golden dips below ~70% if ranking changes | Do **not** rewrite ranker; additive fields only |
| Extracting crisis NLP breaks escalate path | Keep same patterns + escalateResult; tests 6 & 12 |
| Nested input breaks flat clients / Playwright | `normalizeInput` builds flat from nested; accept both |
| UI selector churn | Additive DOM ids; keep existing `#btn-recommend`, `#decision-badge`, etc. |
| Protocol version missing on some cards | Default `version: "1.0.0"` at load |
| Fake integrations tempt test gaming | Stubs return `not_connected` / `available:false` only |
| DecisionRecord bloat audit.jsonl | Append structured record; keep legacy summary fields |

---

## 7. Implementation plan for Phase 1 only (smallest coherent layer)

1. **Schemas + builders** under `17_runtime/schemas/` (+ docs in `19_architecture/schemas/`)
2. **`safety_gateway.js`** — crisis → severity; hardExclude delegated; pipeline order enforced
3. **Wire `recommend()`** — nested+flat input; explanation/confidence/protocol_version/evidence_class; `decision_record`
4. **Staff UI copilot panel** — state summary, WHY, AVOID, NEXT outcome reminder
5. **Outcome expansion** — optional subjective before/after fields; rating still primary for learning
6. **Protocol versioning** — default at catalog load; store in decision_record
7. **Integration stubs** — calendar/travel/wearable/messaging/concierge interfaces only
8. **Tests** — existing green + new Phase 1 coverage
9. **Docs** — README + PHASE1_DELIVERY honesty

**Explicitly not in Phase 1:** ranker rewrite, bandits, fake calendar data, microservices, consumer app, clinical claims.
