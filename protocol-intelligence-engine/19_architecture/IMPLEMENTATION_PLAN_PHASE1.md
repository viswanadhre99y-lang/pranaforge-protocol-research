# Implementation Plan — Client State Intelligence Phase 1

**Constraint:** Preserve V1.1 MVP behavior (auth, crisis, public hard-exclude, soft golden ≥70%, Playwright green).

## Order of work

### Step 0 — Audit (done first)
- `ARCHITECTURE_AUDIT_v1.1.md`
- This plan

### Step 1 — Schemas
Create under `17_runtime/schemas/`:
- `client_state.js` + JSON schema doc
- `context.js`
- `moment.js`
- `protocol_card.js` (upgrade helpers; non-breaking)
- `decision_record.js`
- `explanation.js`
- `confidence.js`
- `index.js` re-exports

Mirror prose/JSON under `19_architecture/schemas/`.

### Step 2 — Safety gateway
- New `17_runtime/safety_gateway.js`
- Move crisis patterns + `detectCrisisText` + severity/confidence/escalate
- Export `runSafety(input)` and `hardExcludeReasons(protocol, input, inferred)` (same semantics as today)
- `recommend()` calls `runSafety` **before** ranking; silence gates unchanged after safety

### Step 3 — Wire recommend
- `normalizeInput`: if `raw.client_state` / `raw.context` present, flatten to legacy fields; always attach `client_state` + `context` on result input
- Enrich each recommendation with `explanation`, `confidence`, `protocol_version`, `evidence_class`
- Build `decision_record`; server writes it into audit entry
- Keep `suggested_sequence`; prefer catalog `follow_up_ids` when present

### Step 4 — UI
- Copilot panel sections: CURRENT STATE, Top options + WHY + confidence, AVOID, NEXT
- Preserve PIN, crisis checkbox, all existing fields/selectors

### Step 5 — Outcomes
- Accept optional `before`/`after` subjective objects with source tags
- Learning still uses `rating_1_to_10` only

### Step 6 — Versioning + stubs
- Catalog load: `version ||= "1.0.0"`
- `integrations/*.js` stubs + README

### Step 7 — Tests + docs
- Extend `pie.spec.js` (or add `phase1.spec.js`)
- Update `17_runtime/README.md`, write `PHASE1_DELIVERY.md`
- Run Playwright; confirm soft agreement ≥70%

## Compatibility contract

| Input style | Behavior |
|-------------|----------|
| Legacy flat body | Identical ranking path; new fields added to response |
| Nested `{client_state, context, goal, constraints}` | Normalized → same ranker |

## Definition of done
- [ ] All prior Playwright tests pass
- [ ] New Phase 1 API/UI tests pass
- [ ] Soft golden ≥ ~70%
- [ ] No fake calendar/wearable data
- [ ] Honesty docs updated
