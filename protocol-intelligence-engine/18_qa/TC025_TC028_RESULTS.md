# TC025 / TC028 Residual C — Results

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc025-tc028-residual-c`  
**Constraint check:** `GOAL_PROTOCOL_BOOST.activation_up` unchanged (`morning-light` 0.16, `behavioral-activation-tiny` 0.12). No case-id hacks. No silent golden edits. No Concierge UI changes. Production readiness **not** claimed.

## Before → after (live main baseline → this branch)

| Metric | Before (main / PR#4+#5) | After |
|--------|-------------------------|-------|
| Full soft | **110/110** (100%) | **110/110** (100%) |
| Full exact (dump / silence-agree) | **69/110** (62.7%) | **74/110** (67.3%) |
| Full exact (pie.spec protocol-ID) | **58/110** (52.7%) | **63/110** (57.3%) |
| Holdout soft | **22/22** | **22/22** |
| Holdout exact | **14/22** | **15/22** |
| ABC C ranked_too_low | **2** (TC025, TC028) | **1** (TC004 only; out of this pass scope) |
| TC025 | C; top1=`cyclic-hyperventilation-caution`; selected rank 4 | **exact**; top1=`cyclic-sighing` |
| TC028 | C; top1=`affect-labeling`; selected rank 5 | **exact**; top1=`if-then-gollwitzer` |
| Playwright | 41 passed / 1 skipped | **41 passed / 1 skipped** |

## What fixed them (systemic mechanisms)

### TC025 family — caution vs safer substitute
1. **Subtractive `automation_ok===false` penalty** when `!clinician_mode` (−0.18): caution cards are not cold defaults.
2. **activation_up safer-substitute preference** (vocabulary → modality): safety screen / prefer safer / cyclic sigh / hyperventilation+screen notes boost `cyclic-sighing` and further demote `cyclic-hyperventilation-caution`.
3. Catalog `selection_notes` on HV caution clarified (prefer cyclic sighing; not automation_ok default without clinician/safety screen).

### TC028 family — delay-send implementation intention
1. **Mapper event `impulse_send`** from blast-email / urge-to-send / delay-send prose (context + state + message).
2. **`EVENT_PROTOCOL_BOOST.impulse_send`** → `if-then-gollwitzer` affinity (not GOAL table).
3. **Emotion delay-send preference**: boost if-then; temper `affect-labeling` when delay-send coexists with secondary “label” wording so the label step does not beat the primary plan.
4. Catalog `moment_tags` on if-then: `anger`, `impulse_control`.

## Residual
- **TC004** still C (`stimulus-control` outside top-3; soft-ok via candidate/top family). Sleep/stimulus family — deferred; not chased with GOAL boosts.
- Soft already 100%; this pass improved **exact** (+5 dump / +5 pie.spec) without soft weight chase or GOAL expansion.

## Production readiness
**Not claimed.**
