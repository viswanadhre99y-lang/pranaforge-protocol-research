# GOLDEN_FAILURE_REPORT

**Generated:** 2026-09-19T09:43:33.830Z (convert to Asia/Calcutta for display)
**Suite:** `13_test_cases/test_cases.jsonl` (110 cases)

## Live metrics (re-measured)

| Metric | Count | Rate |
|--------|------:|-----:|
| Exact (pie.spec) | 58/110 | 52.7% |
| Soft agreement | 110/110 | 100.0% |

Baseline claimed (QA_REPORT_v2): exact 23.6% (26/110), soft 78.2% (86/110).

## A / B / C (expected protocol not in Top-3)

| Class | Meaning | Count |
|-------|---------|------:|
| A | Never generated (not in catalog / cannot produce) | 0 |
| B | Incorrectly hard-excluded | 0 |
| C | Ranked too low (survived filters, outside Top-3) | 2 |
| (null) | PASS / soft Top-3 / silence-like / meta | 108 |

## Classification counts

- **PASS**: 58
- **soft-pass**: 52

## Taxonomy 1–12 (counts on failing / tagged cases)

| # | Name | Layer | Count |
|---|------|-------|------:|
| 1 | duration_hard_exclude | candidate_gen | 0 |
| 2 | micro_gap_catalog_min | candidate_gen | 0 |
| 3 | public_context_exclude | candidate_gen | 0 |
| 4 | preference_breath | candidate_gen_or_rank | 0 |
| 5 | crisis_safety_false_positive | safety | 0 |
| 6 | silence_policy_gate | safety_or_mapper | 0 |
| 7 | non_catalog_meta_selected | golden_data | 5 |
| 8 | ambiguous_silence_or_label | golden_data | 2 |
| 9 | goal_need_inference_mismatch | candidate_gen | 0 |
| 10 | context_event_mapper | mapper | 0 |
| 11 | ranked_too_low_wrong_family | ranking | 0 |
| 12 | impossible_or_stale_golden | golden_data | 0 |

## Top systemic patterns (examples)

## Soft fail IDs

(none)

## Honesty

Rates are offline agreement with author labels — **not** clinical validation or production readiness.
