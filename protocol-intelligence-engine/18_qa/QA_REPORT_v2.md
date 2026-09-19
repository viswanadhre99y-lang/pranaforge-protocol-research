# PIE MVP — QA Report v2 (post-fix pass)

**Product:** PranaForge Protocol Intelligence Engine — V1.1 Staff Top-3 Picker  
**Date:** 2026-09-19 (Asia/Calcutta)  
**Runtime:** `17_runtime/`  
**Baseline:** `18_qa/QA_REPORT.md`

## Executive one-liner

**Still not production-ready**, but P0/P1 actionable gaps from v1 are landed: staff PIN auth, durable audit log, crisis NLP, public hard-exclude, breath preference as penalty, duration docs aligned, soft golden agreement **78.2%** (was 53.6%), plus MVP slices for outcomes learning, client_id isolation, sequences, richer messages, and CPI priors.

## Soft agreement before → after

| | Exact | Soft |
|--|------:|-----:|
| **Before** | 14.5% (16/110) | **53.6%** (59/110) |
| **After** | 23.6% (26/110) | **78.2%** (86/110) |

## Playwright

**21 passed / 0 failed** (`pie.spec.js` + `golden_mapper.spec.js`), workers=2.  
Auth tests use `PIE_STAFF_PIN=pie-test-pin`. Concierge smoke on :8787 kept (4th nav Claims|Alias; webhooks empty/unconfigured noted).

Screenshots updated under `18_qa/screenshots/` (incl. `12_crisis_nlp.png`, `15_below_tau.png`).

## Changelog — fixes landed

### P0
1. **P0-1 Auth** — `PIE_STAFF_PIN` → require `X-PIE-Staff-Pin`; UI PIN → sessionStorage; unset → `auth: open_dev`; wrong/missing → 401.
2. **P0-2 Audit** — append `/api/recommend` + `/api/batch` to `17_runtime/data/audit.jsonl`; `GET /api/audit?limit=50` auth-gated.
3. **P0-3 Crisis NLP** — scan `history_notes` / `goal` / `notes` for crisis keywords → escalate/SILENCE; false-positive risk documented in README.

### P1
4. **P1-1 Golden soft ≥70%** — goal affinity boosts + mapper fixes + duration shrink-to-min; see `CALIBRATION_NOTES.md`.
5. **P1-2 Breath preference** — `prefers_breath=no` → −0.35 penalty; hard-exclude only with `contra:breath` / medical intolerance.
6. **P1-3 Public place** — hard-exclude `public_discrete===false` when place ∈ {public,airport,plane,open_office} or `privacy=public`.
7. **P1-4 Duration docs** — README + RANKING_ALGORITHM + API comments aligned with recommended/min shrink rule; never exceed gap.

### P2
8. **P2-1 Health** — `intended_port`, `listen_port`, `auth_mode`.
9. **P2-2 Exclusions** — full list + `exclusions_total` + `exclusions_truncated:false` (no silent truncate-to-40).
10. **P2-3 UI** — `.card.below-tau` gray/opacity vs Top-3.
11. **P2-4 Batch mapper** — `golden_mapper.js` + unit assertions.

### P3
12. Rate limit 60 req/min/IP on `/api/recommend`.
13. Playwright workers=2.
14. Basic a11y labels + below-τ contrast.
15. Concierge smoke kept; webhook-empty note in `concierge_smoke.json`.

### Top-10 MVP slices
16. **Learning loop** — `POST /api/outcome` → `data/outcomes.jsonl`; ranker boosts/penalizes by `client_id`+protocol.
17. **Multi-client isolation (minimal)** — outcomes/prefs keyed by `client_id`; never mix.
18. **Sequences (minimal)** — `suggested_sequence` max 3 from simple rules / `follow_up_ids`.
19. **Message engine** — richer templates by event_tag (investor_meeting, sleep, travel, …).
20. **CPI priors** — founder/CEO/athlete/traveler engineering priors documented.

## Residual — still Not implemented / partial

| Area | Status |
|------|--------|
| Full bandits / personal response graph | **Not implemented** (outcomes MVP only) |
| Principal ACLs / multiparty UHNW isolation | **Not implemented** (client_id keying only) |
| Notification intelligence / push caps / WhatsApp | **Not implemented** |
| SSO / staff roles beyond shared PIN | **Not implemented** |
| Calendar ingest / moment detection | **Not implemented** |
| Wearable fusion beyond optional `sleep_h` | **Not implemented** |
| Full sequence scheduler / protocol graph runtime | **Not implemented** (suggested_sequence stub only) |
| Full PIE UI inside Concierge | **Not implemented** (correct for V1) |
| Clinical validation | **Not claimed** |
| Exact golden agreement | Still low (~24%) — soft is the KPI |
| Crisis NLP false positives | Residual risk (documented) |
| Concierge webhook-backed Today/Kitchen | Empty/unconfigured in smoke |

## Artifact index

| Path | Contents |
|------|----------|
| `18_qa/QA_REPORT_v2.md` | This report |
| `18_qa/CALIBRATION_NOTES.md` | Soft agreement before/after |
| `18_qa/BATCH_RESULTS.json` | Golden rates |
| `18_qa/MATRIX_RESULTS.json` | Matrix counts |
| `17_runtime/` | Auth, audit, ranker, UI, tests |

## Final verdict

**Ship class:** Internal staff ranking sandbox with basic auth + audit.  
**Production readiness:** **No** (still missing SSO, real multi-tenant ACLs, notifications, clinical validation).  
**Honesty line:** Soft agreement improved via engineering calibration — **cannot** claim continuous emotional intelligence or clinical validation.
