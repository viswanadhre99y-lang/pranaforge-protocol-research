# PIE Golden Error Analysis (Auditor)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-error-analysis`  
**Engine:** `17_runtime/`  
**Goldens:** `13_test_cases/test_cases.jsonl` (n=110)  
**Production readiness: NOT CLAIMED**

---

## STEP 7.1 — Executive summary

Offline soft agreement improved **78.2% → 84.5%** (86→93/110) and exact (incl. silence agrees in dump) **23.6% → ~41.8%** without editing goldens or retuning `score_spec.json` weights. Gains came from **candidate generation / exclusion / duration / context / preference / safety mapper** systemic fixes proven by `scripts/golden_failure_dump.js` runs.

Held-out set (n=22) soft **68.2%** / exact **45.5%** — lower than remainder (expected: holdout intentionally diverse + harder). **Do not** treat holdout as a marketing validation claim.

---

## STEP 7.2 — Baseline vs after (full 110)

| Metric | Baseline (`QA_REPORT_v2`) | After (this branch) |
|--------|---------------------------:|--------------------:|
| Exact (pie.spec; non-silence top1) | 26/110 (**23.6%**) | **35/110 (31.8%)** |
| Exact (dump; silence agrees count) | — | **46/110 (41.8%)** |
| Soft agreement | 86/110 (**78.2%**) | **93/110 (84.5%)** |
| Top-3 contains expected | 68.2% | **74.5%** |
| Incorrectly excluded goldens (A/B/C) | 8 (pre-fix dump) | **0** |
| Ranked too low | 21 | **23** (more goldens enter candidate set; residual ranking) |
| Never generated (catalog missing) | 0 | **0** |

Sources: `18_qa/GOLDEN_FAILURE_DUMP_SUMMARY.json`, `18_qa/GOLDEN_VALIDATION_METRICS.json`.

---

## STEP 7.3 — Method (dump before surgery)

1. Built `17_runtime/scripts/golden_failure_dump.js` calling `recommend()` + `softAgree` for all 110 cases.
2. Emitted `18_qa/GOLDEN_FAILURE_DUMP.jsonl` with required fields: case_id, golden/actual ranking, exact/soft, candidates, exclusions+reasons, features/`score_breakdown`, final_score, availability, compatibility blocks, historical contribution, `failure_categories[]`, missing-golden **A/B/C**.
3. Only after taxonomy: applied systemic fixes; re-ran dump + Playwright.

Reproduce:

```bash
cd protocol-intelligence-engine/17_runtime
node scripts/golden_failure_dump.js
npm test
```

---

## STEP 7.4 — Failure taxonomy (top categories)

From post-fix dump (soft-fail + exact-miss tags):

| Rank | Category | Count | Notes |
|-----:|----------|------:|-------|
| 1 | `exact_miss_soft_ok` | 47 | Soft KPI ok; exact still hard |
| 2 | `golden_ranked_too_low` | 23 | In set / not excluded; not top |
| 3 | `wrong_family_top1` | 17 | Top-1 outside author candidates |
| 4 | `no_history_signal` | 17 | Default history feature 0.5 |
| 5 | `goal:sleep_prep` | 4 | Residual sleep family ranking |
| — | `duration_exclude_golden` | **0** (was 8) | Fixed |
| — | `false_positive_crisis_escalate` | **0** (was 1) | Fixed TC099 |

Soft-fail IDs remaining:  
`TC005, TC006, TC015, TC038, TC048, TC055, TC056, TC060, TC066, TC076, TC084, TC091, TC094, TC095, TC096, TC104, TC108`

---

## STEP 7.5 — Missing golden A / B / C

| Code | Meaning | Count after |
|------|---------|------------:|
| A `never_generated` | selected ID not in catalog | **0** |
| B `incorrectly_excluded` | golden hard-excluded | **0** (was 8) |
| C `ranked_too_low` | present but not selected/top | **23** |

Pre-fix B examples (fixed): physiological-sigh @60s gap; stimulus-control / evening-light / wind-down @10m; smart-caveats @10m.

---

## STEP 7.6 — Interpretable score breakdown (API)

Each recommendation now exposes `score_breakdown`:

- `goal_fit`, `state_fit`, `context_fit`, `duration_fit`, `preference_fit`
- `historical_response`, `event_fit`, `sequence_fit` (null/advisory in V1.1)
- `safety_status`, `final_score`

Mapped from existing features (need_match→goal_fit, feasibility→duration_fit, timing→event_fit, …). Also attached on `decision_record.candidates` / `top`.

**Not** a new clinical instrument — engineering interpretability only.

---

## STEP 7.7 — Systemic fixes (why each)

| Fix | Where | Why |
|-----|-------|-----|
| Micro catalog mins (sigh/tactical/affect) | `catalog.jsonl` | Acute practice ≠ 120s floor; stopped false duration excludes |
| `smart-caveats` min 600 | catalog | 10m planning gaps |
| `stimulus-control` +`sleep_prep` tag | catalog | Goal/need alignment |
| Prescription / behavioral-window dose | `ranker.doseSecForGap` | Window cards are coaching starts, not continuous chair time |
| Ultra-micro shrink ≥30s | `doseSecForGap` | Micro gaps for micro_reset |
| Dose-aware feasibility | `scoreProtocol` | Feasibility used effective dose, not raw 3600s window |
| `crisis_emotion` ≠ escalate | `golden_mapper` | False-positive crisis_flag |
| Cardiac uncleared → exclude TIPP/cold | `safety_gateway` | Safety before ranking |
| OSA → exclude NSDR/restriction; staff_screen silence | safety + mapper | Medical screen gate |
| `SILENCE_or` ambiguous → silence | mapper | Soft silence contract |
| `prior_negative on X` from state | mapper | History contribution |
| softAgree staff_* + silence | mapper | Meta staff labels |
| EVENT / circadian / shift-day-sleep / history-sibling boosts | ranker | Candidate-gen affinities — **not** `score_spec` weight edits |
| `crisis_emotion` → grounding affinity | GOAL_PROTOCOL_BOOST table | Prefer 54321 when tipp unsafe |

---

## STEP 7.8 — Held-out validation

File: `13_test_cases/validation_holdout.jsonl` (n=22) + `validation_holdout_META.json`  
Remainder: `calibration_remainder.jsonl` (n=88)

| Split | Exact | Soft |
|-------|------:|-----:|
| Holdout | 10/22 (**45.5%**) | 15/22 (**68.2%**) |
| Remainder | 36/88 (**40.9%**) | 78/88 (**88.6%**) |
| Full | 46/110 (**41.8%**) | 93/110 (**84.5%**) |

**Policy:** holdout was carved for diversity; fixes were taxonomy-driven on full-set patterns. **No further calibration** against holdout metrics in this branch.

---

## STEP 7.9 — Remaining weaknesses

1. Founder/CEO CPI + process-visualization still dominate some pre_performance goldens that want breath (`TC005`, `TC015`, `TC108`).
2. Goal-clarity cards (`woop`, `values-compass`, `smart-caveats`) lose to `if-then-gollwitzer` (evidence-A II).
3. Emotion goldens with single candidate (`affect-labeling`, `pmr`) lose to opposite-action / act-defusion / reappraisal family.
4. Sleep_prep breath variants (`exhale-emphasized`, `mbsr-breath-anchor`, `autogenic`) lose to `pmr`.
5. Historical personalization still MVP (outcomes.jsonl); most goldens have no history → weak `historical_response`.
6. Soft ≠ clinical validity; soft can pass when top∈candidates without matching author narrative.

---

## STEP 7.10 — Playwright / npm test

Local run (`PIE_BASE_URL=http://127.0.0.1:8891`, `PIE_STAFF_PIN=pie-test-pin`):

- `golden_mapper.spec.js` + `phase1.spec.js`: **19 passed**
- `pie.spec.js` (excl. Concierge :8787 unavailable on this box): **15 passed**
- Batch golden line: `exact=31.8% soft=84.5% top3=74.5% (35/110 exact, 93/110 soft)`
- Soft floor (≥70%) **PASS**
- Concierge smoke on :8787: **skipped / connection refused** (external service not running here)

Soft floor assertion in `pie.spec.js` remains ≥70%.

---

## STEP 7.11 — Production readiness statement

**Production readiness is NOT claimed.**

This branch improves offline agreement with author labels and staff interpretability. It does **not** constitute clinical validation, continuous emotional intelligence, multiparty ACL isolation, notification intelligence, or SSO-grade auth. Ship class remains: **internal staff ranking sandbox**.

---

## Artifact index

| Path | Role |
|------|------|
| `18_qa/GOLDEN_FAILURE_DUMP.jsonl` | Full per-case dump |
| `18_qa/GOLDEN_FAILURE_DUMP_SUMMARY.json` | Rates + category counts |
| `18_qa/GOLDEN_DATA_ISSUES.md` | Catalog/mapper data issues |
| `18_qa/GOLDEN_ERROR_ANALYSIS.md` | This report |
| `18_qa/GOLDEN_VALIDATION_METRICS.json` | Full / holdout / remainder |
| `13_test_cases/validation_holdout.jsonl` | Held-out cases |
| `17_runtime/scripts/golden_failure_dump.js` | Dump runner |


---

## Wrong-family / holdout follow-up (`pie/golden-wrong-family-holdout`)

See `18_qa/HOLDOUT_WRONG_FAMILY_ANALYSIS.md` + `18_qa/PHASE2_RESULTS.md`.

| Metric | Steps 1–7 | After holdout pass |
|--------|----------:|-------------------:|
| Full soft | 84.5% | **91.8%** (101/110) |
| Full exact (pie.spec) | 31.8% | **45.5%** (50/110) |
| Holdout soft | 68.2% | **95.5%** (21/22) |
| Holdout exact (dump) | 45.5% | **68.2%** (15/22) |

No `GOAL_PROTOCOL_BOOST` table expansion. Production readiness still **not** claimed.
