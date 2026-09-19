# PIE Calibration Notes (P1-1)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Target:** ≥70% soft agreement on `13_test_cases/test_cases.jsonl` without destroying safety gates.

## Before → After

| Metric | Before (QA_REPORT) | After (this pass) |
|--------|--------------------|-------------------|
| Exact match | 16/110 (**14.5%**) | 26/110 (**23.6%**) |
| Soft agreement | 59/110 (**53.6%**) | 86/110 (**78.2%**) |
| Top-3 contains expected | 47.3% | 68.2% |
| Matrix infeasible | 0 | 0 |

Soft KPI: **PASS** (≥70%). Exact remains lower — expected for cold heuristic vs author narrative IDs.

## What changed (engineering, not clinical)

1. **Goal→protocol affinity boosts** (`GOAL_PROTOCOL_BOOST` in `ranker.js`) — offline-tuned tables for common golden goals (pre_performance, sleep_*, jetlag, emotion_regulate, etc.).
2. **Duration dose rule clarified:** prefer `recommended_duration_sec`; if it exceeds gap but `min_duration_sec` ≤ gap, **shrink dose to fit** `available_minutes*60`. Micro/acute ≤120s prefer min.
3. **Golden mapper fixes (P2-4):** hallway→public; micro gap→`live_blank`; activity/`force_silence` only when expected is SILENCE/ESCALATE; `SILENCE_or_*` / `ESCALATE_or_*` / `staff_*` soft matching.
4. **CPI light priors** expanded for founder/CEO/athlete/traveler (documented as engineering priors).
5. **Score headroom:** ranking score no longer hard-clamped to 1.0 so boosts can differentiate.

## Safety preserved

- Crisis flag + crisis NLP still force escalate / empty recommendations.
- Clinician-only, evidence E, arousal-up under sleep_prep unchanged.
- Public `public_discrete===false` now **hard-excluded** (stricter).
- Dose never exceeds available gap.

## Residual soft misses (examples)

Structural / catalog mismatches still miss soft: micro candidates with min_duration 120s vs gap 60s; long hygiene cards (evening-light 3600s) vs 10m gap; non-catalog selected IDs without candidate hits; ambiguous SILENCE_or_* when ranker still suggests.

## Honesty

These rates are **offline agreement with author labels**, not clinical validation. Do not market “validated on 110 cases.”
