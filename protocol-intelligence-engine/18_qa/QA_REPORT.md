# PIE MVP — Brutal Honest QA Report

**Product:** PranaForge Protocol Intelligence Engine — V1 Staff Top-3 Picker  
**Date:** 2026-09-19 (Asia/Calcutta)  
**Runtime:** `/workspace/pranaforge-protocol-research/protocol-intelligence-engine/17_runtime/`  
**Tester:** Automated Playwright + API matrix (executor agent)  
**Catalog:** 50 public protocols (`02_protocol_catalog/catalog.jsonl`)  
**Score spec:** `05_ranking/score_spec.json` v1.0.0  

## Executive one-liner

**Not production-ready** — a local, explainable Top-3 staff picker MVP works with hard safety gates and Playwright-green tests, but golden agreement is only ~15% exact / ~54% soft, learning/auth/notifications/multi-client isolation are absent, and ranking remains an untuned engineering heuristic.

---

## Verdict legend

| Label | Meaning |
|-------|---------|
| **Working** | Behaves as designed in this MVP under test |
| **Partially** | Present but incomplete, brittle, or weakly calibrated |
| **Unreliable** | Runs but often wrong / inconsistent vs intent |
| **Not implemented** | Explicitly out of V1 / missing |
| **Unable to verify** | No harness, no environment, or insufficient evidence |

---

## Playwright summary

| Suite | Result |
|-------|--------|
| PIE UI + API (`17_runtime/tests/pie.spec.js`) | **10 passed / 0 failed** |
| Concierge smoke (`localhost:8787`) | **Pass** (included in above) |

**Golden JSONL (`13_test_cases/test_cases.jsonl`, n=110):**

| Metric | Value |
|--------|-------|
| Exact match on `selected` | **16/110 (14.5%)** |
| Soft agreement (exact OR top∈candidates OR expected∈top-3 OR silence-agree) | **59/110 (53.6%)** |
| Expected ID appears in Top-3 | **47.3%** |
| Silence/escalate agreement (subset) | recorded in `BATCH_RESULTS.json` |

**Synthetic matrix:** 120 combos → 114 suggest / 6 silence / **0 infeasible** (min/recommended dose ≤ gap).

**Runtime port note:** Intended `0.0.0.0:8790`; sandbox `sand-egress-tun` holds 8790/8791, so process listened on **8792** (`intended_port` still 8790 in `/api/health`).

Screenshots: `18_qa/screenshots/`.

---

## Decision scorecard (evidence-backed)

| Capability | Verdict | Evidence |
|------------|---------|----------|
| Load catalog + score_spec | Working | `/api/health` → catalog_size=50, τ_select=0.42 |
| Hard filters (duration, clinician, evidence E, arousal, crisis) | Partially | Crisis + clinician gates work; duration uses recommended/min (not raw max) — intentional vs golden |
| Weighted ranking | Partially | Weights applied; founder priors hand-tuned; not validated |
| Top-3 / SILENCE UI | Working | UI + API; screenshots 01–06 |
| Message engine formula | Partially | Context+why+action+duration+skip present; templates not fully CPI-coded |
| Batch / matrix harness | Working | `/api/batch`; `BATCH_RESULTS.json` |
| Golden fidelity | Unreliable | 14.5% exact — heuristic ≠ author labels |
| Concierge ops UI | Working (smoke) | Today/Kitchen/Floor/Claims; **no PIE picker** |
| Learning / bandits | Not implemented | — |
| Auth / login | Not implemented | — |
| Push / notification intelligence | Not implemented | — |
| Multi-client isolation | Not implemented | — |

---

## 32 QA sections (founder ask)

### 1. Protocol catalog ingestion
**Working.** 50 JSONL cards loaded at process start. Public IDs only exposed in UI/API. Vault IP never expanded into steps (purpose/name/id only).

### 2. Score spec fidelity
**Partially.** Weights, penalties, evidence_map, τ_select=0.42, and listed hard_exclude rules are coded. Cooldown / daily push caps / autopush automation gates are **not** fully enforced (staff channel MVP).

### 3. Hard exclude — duration vs gap
**Partially.** Uses recommended (or min under micro/acute gaps) rather than always `max_duration_sec`. Matches staff “dose fits gap” intent and golden notes; differs from literal RANKING_ALGORITHM max wording. Matrix found **0** min-dose>gap bugs.

### 4. Hard exclude — contraindications
**Partially.** Parses `contra:` / breath-intolerance hints from `history_notes`. No full safety_profile object from HPOS yet.

### 5. Hard exclude — clinician_only
**Working.** `sleep-restriction` excluded without `clinician_mode` (conflict signal C).

### 6. Hard exclude — evidence E
**Working** (vacuously). No E-grade cards in current 50; rule present.

### 7. Hard exclude — arousal_up when sleep_prep
**Working.** Conflict A asserts no pure arousal-up primary under T_sleep.

### 8. Crisis path → SILENCE + escalate
**Working.** `crisis_flag` → action=escalate, empty recommendations, escalate copy. Screenshot: `06_crisis_escalate.png`.

### 9. Need inference
**Partially.** Rules from stress/energy/sleep_h/event/goal/client_type. No confidence-aware SILENCE beyond τ_select. Compound goals (`fatigue+perform`) split naively.

### 10. Urgency / receptivity gates
**Partially.** Activity/policy silence via `force_silence` / notes (DND, orthosomnia, in_meeting) for golden mapping. Full HPOS receptivity model **Not implemented**.

### 11. Soft ranking features
**Partially.** All nine positive features + penalties computed and returned in `features`. Calibration is hand-wavy; founder/CEO imagery prior is an engineering hack.

### 12. τ_select silence
**Working.** Below 0.42 → SILENCE with reason; staff still sees below-threshold list when present.

### 13. Top-3 picker UI
**Working.** All required inputs present; outputs decision badge, inferred need, message, why, cards, exclusions. Screenshot: `01_ui_controls.png`, `02_founder_happy.png`.

### 14. Personalized message engine
**Partially.** Formula `[context]+[why now]+[one action]+[duration]+[skip]` implemented. No LLM wording layer; no per-CPI template library.

### 15. Personalization (prefs + history)
**Partially.** `prefers_breath` hard-excludes breath when `no`; history `prior_positive/negative` shifts scores. Test 5: topYes=`box-breathing` vs topNo=`process-visualization` (**different**). Level-3 response graph / learning **Not implemented**.

### 16. Client-type priors (CPI)
**Partially.** Light founder/CEO pre-performance boost only. Full CPI moment tables not wired as data.

### 17. Context / place / public_discrete
**Partially.** Place tag Jaccard + public friction penalty. Extreme public+1min can still surface non-ideal cards (e.g. `ppr` with `public_discrete=false`) when breath is banned — ranking quality gap.

### 18. Timing / moments
**Partially.** Event→moment map hits `moment_tags`. Calendar ingest **Not implemented**.

### 19. Sequences / protocol graph
**Not implemented.** Single-shot top-3 only; no chain / follow-up scheduler.

### 20. Closed-loop learning
**Not implemented.** No outcome store, no rating ingestion, no weight updates. (Founder-critical honesty.)

### 21. Multi-client isolation
**Not implemented.** Stateless request body; no tenant/principal ACLs, no data partitioning.

### 22. Notification intelligence / push caps
**Not implemented.** Staff console only; no push channel, no daily cap enforcement beyond golden `force_silence` stubs.

### 23. Login / authentication / staff PIN
**Not implemented** on PIE runtime (open local HTTP). Concierge has optional staff PIN path — **Unable to verify** end-to-end auth UX in this pass (PIN unset → “dev open”).

### 24. API surface (`/health`, `/recommend`, `/batch`)
**Working.** Invalid inputs → 400 + errors. Health OK.

### 25. Vault IP / step leakage
**Working** under review. Responses expose `protocol_id`, `name`, `purpose` — not vault step bodies. `is_vault_ip` flagged when present.

### 26. Founder happy-path (investor meeting)
**Working** under test constraints. Stress mapped 8→5; energy=3; sleep=5.5; office; 10 min → recommendation with dose ≤10 min; primary ≠ yoga-nidra/NSDR. Screenshot: `02_founder_happy.png`.

### 27. Conflicting signals A–D
**Partially.** A sleep_prep arousal; B debt+pitch avoids NSDR primary; C clinician gate; D public+no-breath micro/SILENCE. Artifacts: `conflict_signals_AD.json`, `03_conflict_D_public.png`.

### 28. Extreme constraints
**Partially.** 1 min + public + no breath → suggest with min-dose ≤60s **or** silence. Quality of *which* card is weak (see §17). Screenshot: `04_extreme_1min.png`.

### 29. Golden test-case agreement
**Unreliable** as an oracle match. 14.5% exact / 53.6% soft. Many goldens encode author narrative (exact ID + message) that a cold heuristic cannot reproduce without supervised labels. **Do not market “validated on 110 cases.”**

### 30. Synthetic feasibility matrix
**Working** as a safety net. 120 combos; 0 min-dose infeasible. Does **not** prove clinical appropriateness.

### 31. Concierge UI smoke (8787)
**Working (smoke only).** Panels: Today / Kitchen / Floor / Claims. Floor accepts a protocol_id for run-of-show — **not** a PIE decision engine. Asserted **no** Top-3 / τ_select / Recommend UI. Screenshots: `10_concierge_smoke.png`, `10_concierge_floor.png`.

### 32. Production readiness / overall product honesty
**Not production-ready.** Suitable as an **internal staff training / ranking sandbox**. Missing: auth, audit log durability, learning loop, calendar, multiparty privacy, notification policy, clinical validation, monitoring, deployment hardening, UHNW isolation. Ranking must not be sold as science.

---

## Top 10 problems

1. **Golden exact agreement 14.5%** — heuristic ≠ labeled `selected`; soft 54% still mediocre for staff trust.
2. **No learning / outcome loop** — personalization is form fields only.
3. **No auth / multi-tenant isolation** — anyone who can hit the port can query.
4. **Public+no-breath micro ranking quality** — can recommend non-discrete or odd policy-adjacent fits when catalog micro options are breath-heavy.
5. **Duration semantics drift** — code uses recommended/min; docs say max — needs explicit product decision.
6. **CPI priors barely wired** — one founder boost ≠ Client Protocol Intelligence.
7. **Silence/receptivity incomplete** — activity gates stubbed for tests, not a real interruptibility model.
8. **Message engine is template-string only** — no CPI moment copy deck, no LLM-after-ID.
9. **Port 8790 unavailable in this sandbox** — ops friction; health reports intended vs actual.
10. **Concierge ≠ PIE** — risk of stakeholders assuming Floor protocol_id field *is* intelligence.

---

## Bugs by priority

### P0 — must fix before any external staff pilot
| ID | Bug |
|----|-----|
| P0-1 | No authentication on PIE runtime |
| P0-2 | No durable decision audit log (in-memory request/response only) |
| P0-3 | Crisis path is checkbox-only — no NLP crisis detection from free text |

### P1 — fix before serious internal use
| ID | Bug |
|----|-----|
| P1-1 | Low golden/top-3 agreement; needs labeled offline eval + weight search |
| P1-2 | `prefers_breath=no` hard-excludes entire breath set — may over-empty candidate set |
| P1-3 | Public place still allows `public_discrete=false` protocols via soft penalty only in some paths |
| P1-4 | Duration rule documentation mismatch (max vs recommended) |

### P2 — polish
| ID | Bug |
|----|-----|
| P2-1 | Health `port` vs bind fallback confusing |
| P2-2 | Exclusion list truncated to 40 in API |
| P2-3 | UI does not gray below-τ cards distinctly from Top-3 |
| P2-4 | Batch golden mapper heuristics can mis-set `force_silence` / event tags |

### P3 — later
| ID | Bug |
|----|-----|
| P3-1 | No dark/light a11y audit |
| P3-2 | No rate limiting |
| P3-3 | Playwright config workers=1 only |
| P3-4 | Concierge smoke does not exercise webhook-backed Today/Kitchen paths |

---

## What is explicitly Not implemented (call out)

| Area | Status |
|------|--------|
| Learning / personal response graph / bandits | **Not implemented** |
| Multi-client isolation / principal ACLs | **Not implemented** |
| Notification intelligence / push caps / WhatsApp | **Not implemented** |
| Login / SSO / staff roles on PIE | **Not implemented** |
| Calendar ingest / moment detection | **Not implemented** |
| Wearable fusion beyond optional `sleep_h` | **Not implemented** |
| Sequence / follow-up graph | **Not implemented** |
| Full PIE UI inside Concierge | **Not implemented** (correct for V1) |

---

## Artifact index

| Path | Contents |
|------|----------|
| `17_runtime/` | Express app, ranker, UI, Playwright tests |
| `18_qa/QA_REPORT.md` | This report |
| `18_qa/BATCH_RESULTS.json` | Golden + matrix summary |
| `18_qa/MATRIX_RESULTS.json` | Matrix counts |
| `18_qa/personalization_breath.json` | Pref A/B |
| `18_qa/conflict_signals_AD.json` | Signals A–D payloads |
| `18_qa/concierge_smoke.json` | Concierge notes |
| `18_qa/playwright-results.json` | Raw Playwright JSON |
| `18_qa/screenshots/*.png` | UI evidence |

---

## Final verdict

**Ship class:** Internal demo / ranking lab only.  
**Production readiness:** **No.**  
**Honesty line:** Useful closeness on explainable staff selection among 50 public cards — **cannot** claim continuous emotional intelligence, clinical validation, or autonomous UHNW coaching.
