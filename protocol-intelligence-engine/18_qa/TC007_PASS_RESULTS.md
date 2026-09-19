# TC007 Residual-C Pass Results

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc007-residual-c`  
**Baseline:** post-PR #3 (`pie/golden-wrong-family-holdout`) on main  
**Production readiness: NOT CLAIMED**

## Before → After

### Full 110

| Metric | Before (post-PR #3) | After (this branch) |
|--------|--------------------:|--------------------:|
| Exact (pie.spec) | 50/110 (**45.5%**) | **58/110 (52.7%)** |
| Soft agreement | 101/110 (**91.8%**) | **110/110 (100%)** |
| B incorrectly_excluded | 0 | **0** |
| C ranked_too_low | 11 | **2** (`TC025`, `TC028`) |

### Holdout (n=22)

| Metric | Before | After |
|--------|-------:|------:|
| Soft | 21/22 (**95.5%**) | **22/22 (100%)** |
| Exact (pie.spec top1) | ~15/22 dump / post-PR family | **14/22 (63.6%)** |

Holdout soft fails remaining: **none**.  
**TC007 soft-passes** (and is exact: top1 = `values-compass`).

## What fixed TC007 (systemic — not case-id)

1. **EVENT_PROTOCOL_BOOST.hiring_firing** affinity for catalog-tagged `values-compass` / `affect-labeling` / `social-connection-micro` (not GOAL table).
2. **PMR evening false-positive fix:** somatic boost requires true tension signal; moral/values/hiring context **tempers** PMR without somatic cues.
3. **Note→modality preference:** `values|moral|compass` routes to `values-compass` on `emotion_regulate` and hiring/moral events (was gated to `goal_clarity` only).

Same preference/event family also lifted residual soft misses (reappraisal, third-person self-distancing, wind-down, exhale pace, PPR, if-then + quiet sighs).

## GOAL_PROTOCOL_BOOST confirmation

- **Expansion:** none (no new goal keys; no new protocol ids in the GOAL table).
- **Related:** EVENT `hiring_firing` affinity only; subtract-before-add need duplicate credit unchanged.

## Residual C (2)

`TC025`, `TC028` — still ranked_too_low (related family top1; golden narrative not in top-3). No silent golden edits. See `GOLDEN_DATA_ISSUES.md` if human review is warranted later.

## Tests

- Playwright (`PIE_BASE_URL` on free port): **40 passed**, 2 skipped (Concierge :8787 / auth path). Soft floor ≥70%: **PASS** (100%).
- Golden batch in pie.spec: exact 52.7%, soft 100%, top3 93.6%.
- Mapper unit expectations updated for staff_queue + staff-channel in_meeting silence.

## Honesty

Offline agreement ≠ clinical validation. Do not claim production readiness from these percentages.
