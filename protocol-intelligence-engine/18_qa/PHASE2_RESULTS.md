# PHASE2_RESULTS — Wrong-family / holdout pass

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-wrong-family-holdout`  
**Production readiness: NOT CLAIMED**

## Before → After

### Full 110

| Metric | Before (Steps 1–7) | After (this branch) |
|--------|-------------------:|--------------------:|
| Exact (pie.spec; non-silence top1) | 35/110 (**31.8%**) | **50/110 (45.5%)** |
| Exact (dump; silence agrees) | 46/110 (**41.8%**) | **61/110 (55.5%)** |
| Soft agreement | 93/110 (**84.5%**) | **101/110 (91.8%)** |
| Top-3 contains expected | 74.5% | **85.5%** |
| B incorrectly_excluded | 0 | **0** |
| C ranked_too_low | 23 | **11** |

### Holdout (n=22) vs remainder (n=88)

| Split | Exact dump before→after | Soft before→after |
|-------|------------------------:|------------------:|
| Holdout | 10/22 (45.5%) → **15/22 (68.2%)** | 15/22 (68.2%) → **21/22 (95.5%)** |
| Remainder | 36/88 (40.9%) → **46/88 (52.3%)** | 78/88 (88.6%) → **80/88 (90.9%)** |

Holdout soft fails remaining: `TC007` only.  
Holdout was **not** used as a weight-calibration target; fixes were family-level and also lifted remainder soft.

## Systemic changes landed

- **Catalog need_tags / moment_tags:** `physiological-sigh-acute`(+pre_performance), `pmr`(+emotion_regulate), `mbsr-breath-anchor`/`exhale-emphasized`(+sleep_prep), `act-defusion`(+emotion_regulate, mood), `art-brief`(+rumination), `values-compass`/`affect-labeling` moment coverage.
- **GOAL_PROTOCOL_BOOST:** **not expanded**. Runtime subtract-before-add: when `need_tags` already includes goal, subtract `NEED_DUPLICATE_CREDIT=0.15` from boost before add (anti double-count).
- **EVENT_PROTOCOL_BOOST (candidate-gen affinity):** `T_sleep` += `mbsr-breath-anchor`, `autogenic` (not GOAL table).
- **Duration/context/preference:** temper founder/CEO CPI on gaps <15m; breath-vs-imagery only when staff notes ask for breath; focus/pomodoro work-block dose; desk-window context for ART; nap deprioritized on office floor; micro_reset keeps acute sigh.
- **Mapper:** forward preference-bearing state/reason/message prose into `history_notes`.
- **Note→modality preference:** vocabulary routing (values/WOOP/label/autogenic/caffeine/nidra/54321/…) — no case-id branches.

## GOAL_PROTOCOL_BOOST confirmation

- **Expansion:** none (no new goal keys; no new protocol ids added to the table).
- **Removals:** none from the table literal; effective duplicate mass reduced via runtime credit subtract.
- **Related:** EVENT `T_sleep` affinity additions listed above.

## Residual soft misses (9)

`TC007, TC023, TC042, TC050, TC059, TC061, TC066, TC067, TC088` — mostly single-candidate narrative IDs or meta `staff_*` where cold rank still picks a related family.

## Tests

- Playwright (+ mapper/phase1/phase2), Concierge excluded (:8787 down): **41 passed**
- Soft floor ≥70%: **PASS** (91.8%)
- Unit-equivalent mapper/phase specs: **pass**

## Honesty

Offline agreement ≠ clinical validation. Do not claim production readiness from these percentages.
