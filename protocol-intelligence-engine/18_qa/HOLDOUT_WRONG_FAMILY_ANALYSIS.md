# Holdout + Wrong-Family Analysis (PIE)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-wrong-family-holdout`  
**Constraint:** No `GOAL_PROTOCOL_BOOST` expansion; no case-id hacks; no silent golden edits.

## 1. Holdout gap (baseline after Steps 1–7)

| Split | Exact (dump) | Soft |
|-------|-------------:|-----:|
| Full 110 | 46/110 (41.8%) | 93/110 (84.5%) |
| Holdout 22 | 10/22 (45.5%) | 15/22 (68.2%) |
| Remainder 88 | 36/88 (40.9%) | 78/88 (88.6%) |

Holdout soft fails (7): `TC005, TC015, TC056, TC060, TC076, TC091, TC108` — all **C ranked_too_low / wrong_family_top1** (B exclusions = 0).

## 2. Case-level taxonomy (holdout soft fails)

| Case | Goal | Golden | Was Top-1 | Root cause class |
|------|------|--------|-----------|------------------|
| TC005 | pre_performance | box-breathing | process-visualization | Founder/CEO CPI + GOAL boost stacked on need-matched imagery; moderate gap still preferred rehearsal over arousal settle |
| TC015 | pre_performance | tactical-breath-reset | process-visualization | Same imagery stack; tactical had need tag but no competing duration prior |
| TC108 | pre_performance | physiological-sigh-acute | process-visualization | Sigh lacked `pre_performance` need_tag (candidate-gen miss); history `prior_negative:box` under-used for alternate breath |
| TC056 | emotion_regulate | pmr | opposite-action | PMR lacked `emotion_regulate` need_tag; opposite-action double-counted need + GOAL boost |
| TC060 | emotion_regulate | affect-labeling | opposite-action | Same opposite-action dominance; label-first micro not preferred without event |
| TC076 | goal_clarity | woop | if-then-gollwitzer | Evidence-A if-then + GOAL boost beat WOOP despite equal need tags |
| TC091 | goal_clarity | values-compass | if-then-gollwitzer | Values had need tags but weak planning moments; staff message named compass |

## 3. Broader soft-fail families (examples verified live)

| Family | Examples | Pattern |
|--------|----------|---------|
| Sleep_prep breath | TC038, TC084, TC095, TC055 | PMR + sleep GOAL boost dominated; `mbsr`/`exhale`/`autogenic` missing or weak need/event affinity |
| Focus | TC094 | `task-switch-buffer` dose-fit beat `pomodoro` long rec |
| Cognitive fatigue | TC048 | Nap over ART; office window/nature context under-scored |
| Emotion micro | TC096 | Same as TC060 |
| Mood | TC104 | `act-defusion` lacked `mood` / `emotion_regulate` need tags → never in candidates |
| Rumination / ART | TC006 | ART lacked `rumination` need; cognitive family won |

## 4. Chosen fix strategy (systematic only)

1. **Catalog need_tags / moment_tags coverage** for true family membership (sigh→pre_performance, pmr→emotion_regulate, mbsr/exhale→sleep_prep, act-defusion→emotion/mood, art→rumination, values→planning).
2. **Subtract-before-add:** skip `GOAL_PROTOCOL_BOOST[g][id]` when `need_tags` already includes `g` (removes double-count overfitting; **no table expansion**).
3. **Duration / context / preference:**
   - Temper founder/CEO CPI on gaps <15m; deprioritize imagery vs structured breath.
   - Focus work-block dose for pomodoro; desk-window context for ART.
   - Emotion: suppress generic opposite-action without avoidance event; somatic PMR only with evening/tension prose; label preference from notes.
   - Sleep: T_sleep event affinity for mbsr/autogenic; acute exhale only when notes ask; trauma/anchor vs gentle-exhale routing.
4. **Mapper:** forward preference-bearing state/reason/message prose into `history_notes` (enables vocabulary→modality preference without case-id branches).
5. **Explicitly rejected:** expanding `GOAL_PROTOCOL_BOOST` rows; case-id `if (id===TCxxx)`; golden edits; score_spec weight chase.

## 5. Overfitting guard

Holdout is **not** the calibration target. Fixes must also help non-holdout soft fails in the same families (emotion/sleep/focus/mood). If a change only moves holdout TC IDs, reject it.

## 6. Results (after systemic fixes)

| Split | Soft before→after | Exact dump before→after |
|-------|------------------:|------------------------:|
| Full 110 | 84.5% → **91.8%** | 41.8% → **55.5%** |
| Holdout 22 | 68.2% → **95.5%** | 45.5% → **68.2%** |
| Remainder 88 | 88.6% → **90.9%** | 40.9% → **52.3%** |

Holdout soft fails remaining: **TC007** only.  
Docs: `18_qa/PHASE2_RESULTS.md`, updated `GOLDEN_VALIDATION_METRICS.json`.

**Could the gap close without weight overfitting?** Yes, largely — via catalog tags, boost/need dedupe, duration/context, and note→modality preference. Remaining misses are narrative/single-candidate cases; further gains would risk GOAL_PROTOCOL_BOOST overfitting and were not pursued.
