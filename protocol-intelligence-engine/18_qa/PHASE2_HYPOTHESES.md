# PHASE2_HYPOTHESES (non-binding)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Status:** Notes only — do **not** treat as an approved change list.  
**Constraint inherited:** No blind `GOAL_PROTOCOL_BOOST` expansion; no case-specific hacks.

## Separate candidate-gen vs ranking

| Layer | Symptoms (taxonomy) | Phase-2 candidate work |
|-------|---------------------|------------------------|
| Safety / mapper | 5, 6, 8, 10 | Tighten crisis NLP away from goal-name collisions; richer place/event parse; explicit `expected_action` field on goldens |
| Candidate gen | 1, 2, 3, 4, 9, 12 | Catalog mins for true micros; prescription vs in-session dose semantics; need-tag coverage for emotion/focus families |
| Ranking | 11 | Interpretable score_breakdown already exposed — diagnose feature gaps before touching weights |

## GOAL_PROTOCOL_BOOST overfitting risk (from CALIBRATION_NOTES.md)

- Soft KPI was lifted to ≥70% largely via offline-tuned `GOAL_PROTOCOL_BOOST` tables + CPI priors.
- **Risk:** tables memorize golden goal→id pairs; held-out structural set does not have author labels, so boost overfitting will not show as soft% — it shows as brittle Top-1 swaps when goals are paraphrased.
- **Phase-2 guardrails:**
  1. Freeze boost table size; prefer catalog `need_tags` / `moment_tags` coverage.
  2. Any boost change must improve held-out structural stability (score_breakdown present, no crash, public/micro gates hold) without targeting individual TC IDs.
  3. Prefer removing boost entries that duplicate need_tag matches.

## Residual soft misses (examples)

See `GOLDEN_FAILURE_REPORT.json` `soft_fail_ids`. Dominant pattern: **C ranked_too_low** (wrong family Top-1) under emotion/sleep/pre_performance goals — not missing candidates after duration/prescription fixes.

## What Phase-1 already fixed (systematic, non-weight)

- Micro catalog mins for acute sigh / tactical breath (gap-fit).
- Behavior-prescription briefing dose (sleep/hygiene multi-hour cards).
- Mapper: elevator→public; crisis_emotion ≠ escalate; SILENCE_or ambiguous→silence; circadian evening→T_sleep; staff_screen→silence soft.
- Interpretable `score_breakdown` on every recommendation.

