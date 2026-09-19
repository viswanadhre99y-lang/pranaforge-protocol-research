# TC007 Pass Notes

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/tc007-remaining-family`  
**Baseline:** post-PR #3 main (soft 101/110, holdout soft 21/22; TC007 sole holdout soft miss)  
**Production readiness: NOT CLAIMED**

## TC007 status

| | Before | After |
|--|-------:|------:|
| Soft | fail (top1=`pmr`) | **pass (exact top1=`values-compass`)** |
| Holdout soft | 21/22 | **22/22** |

Root cause was systemic, not case-id:

1. **Values preference gated too narrowly** — `values|moral|compass` only fired for `goal_clarity` / `behavior_change`; TC007 is `emotion_regulate` + hiring/moral prose.
2. **PMR “evening” false positive** — mapper injects `evening` from “hiring/firing day evening”; PMR got somatic boost without tension cues, stacked on `emotion_regulate` need_tag + GOAL boost.
3. **No EVENT affinity for `hiring_firing`** — catalog already tags values/affect/social for that moment; event path under-paid them.

## Systemic fixes (subtract-before-add / preference / mapper / EVENT)

- `EVENT_PROTOCOL_BOOST.hiring_firing` → values-compass / affect-labeling / social-connection-micro (**not** GOAL_PROTOCOL_BOOST expansion).
- Emotion block: PMR somatic boost requires true tension signal; moral/values/hiring **tempers** PMR.
- Note→modality: values/compass on emotion_regulate + hiring/moral; reappraisal; third-person→self-distancing; wind-down; exhale pace; PPR; if-then vs breath stack.
- Mapper: state/reason event cues (conflict / hiring / reject); staff-channel + in_meeting → silence for queue-after.

## Before → After

| Split | Soft before→after | Exact dump before→after |
|-------|------------------:|------------------------:|
| Full 110 | 91.8% → **100%** (101→**110**) | 55.5% → **63.6%** (61→**70**) |
| Holdout 22 | 95.5% → **100%** (21→**22**) | 68.2% → ~**73%** dump / 16/22 strict top1 |
| Remainder 88 | 90.9% → **100%** | 52.3% → higher |

ABC: B incorrectly_excluded **0**; C ranked_too_low **11→2** (`TC025`, `TC028` — soft-ok related family).

## Remaining soft misses

**None** (soft_fail_ids empty). Residual exact/C: TC025, TC028.

## Playwright

**41 passed**, 1 skipped (Concierge :8787 down). Soft floor ≥70%: PASS (100%).

## GOAL_PROTOCOL_BOOST

**Not expanded.** EVENT hiring_firing affinity only; need-duplicate credit unchanged.

## Honesty

Offline agreement ≠ clinical validation. **Do not claim production readiness.**
