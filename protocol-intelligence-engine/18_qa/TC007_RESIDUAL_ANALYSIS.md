# TC007 Residual Analysis (before fix)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc007-residual-c`  
**Baseline:** post-PR #3 main — full soft 101/110 (91.8%), holdout soft 21/22 (95.5%); **TC007** sole holdout soft miss.  
**Constraint:** No `GOAL_PROTOCOL_BOOST` expansion; no case-id hacks; no silent golden edits.

## 1. Golden expectation

| Field | Value |
|-------|-------|
| id | TC007 (holdout) |
| client | startup_founder |
| state | moral_load |
| context | hiring/firing day evening |
| goal | emotion_regulate |
| candidates | values-compass, affect-labeling, social-connection-micro |
| selected | **values-compass** |
| reason | CPI hiring/firing moment |
| message | Before email: 10 min values compass — one action that fits. |
| ambiguous | false |

## 2. Mapped input (cold)

```
goal=emotion_regulate
upcoming_event_tag=hiring_firing
place_class=office
available_minutes=10 / raw_gap_sec=600
history_notes="evening; moral_load cpi hiring/firing moment Before email: 10 min values compass — one action that fits."
notes="Before email: 10 min values compass — one action that fits."
```

Mapper correctly maps hiring/firing → `hiring_firing` and forwards values/moral prose into `history_notes`.

## 3. Actual ranking (post-PR #3)

| Rank | protocol_id | score | notable features |
|-----:|-------------|------:|------------------|
| 1 | **pmr** | 0.967 | need/goal emotion_regulate; event_fit **0.35** (no hiring moment); duration 12m |
| 2 | affect-labeling | 0.900 | moment:hiring_firing; event_fit 0.95; duration 2m |
| 3 | act-defusion | 0.813 | need emotion_regulate; no hiring moment |
| 4 | cognitive-reappraisal | 0.787 | |
| 5 | if-then-gollwitzer | 0.785 | |
| 6 | **values-compass** | 0.773 | moment:hiring_firing; event_fit 0.95; evidence C; **no GOAL boost** |
| 8 | social-connection-micro | 0.679 | |

**Exclusions:** none of the golden trio; sleep/equipment cards only.

## 4. Why soft fails

`softAgree` = top1===selected OR top1∈golden.candidates OR selected∈top3 (recommendations).

- top1 `pmr` ∉ golden candidates  
- `values-compass` not in top-3 recommendations  
- Soft **false** even though golden-candidate `affect-labeling` is rank-2 (definition does not credit “any candidate in top3”).

Exact fails: top1 ≠ values-compass.

## 5. Root-cause classes (systemic — not TC007-only)

### A. Values / moral vocabulary preference gated too narrowly

Staff-note modality preference for `values|moral|boundary|compass` only fires when `goal ∈ {goal_clarity, behavior_change}`.  
TC007 goal is `emotion_regulate` with explicit “values compass” + `moral_load` / `hiring_firing` — preference **never applies**. Same gap for any moral-load emotion case.

### B. PMR “evening” somatic boost false positive

Emotion block boosts `pmr` when `emoBlob` matches `/evening|alcohol|tension|muscle|somatic|\bpmr\b/`.  
Mapper injects literal `evening` from context “hiring/firing day evening” even when the need is moral/values, not muscle tension. PMR also carries `emotion_regulate` need_tag + GOAL boost (post-PR #3) and wins despite **no** hiring/moral moment tag.

### C. EVENT affinity missing for hiring_firing

`EVENT_PROTOCOL_BOOST` has post_rejection / post_conflict / T_sleep — **no** `hiring_firing` row. Catalog already tags `values-compass` and `affect-labeling` with `hiring_firing` moments; event path under-pays them vs GOAL-boosted somatic cards.

### D. softAgree / single-candidate brittleness (family of residuals)

Residual soft fails share “named modality in notes, cold top1 is related sibling”:

| Case | Goal | Golden | Top1 | Shared pattern |
|------|------|--------|------|----------------|
| TC007 | emotion_regulate | values-compass | pmr | values vocab ignored; PMR evening FP |
| TC059 | emotion_regulate | cognitive-reappraisal | pmr | “Reappraisal” vocab unused; PMR dominates |
| TC023 / TC088 | rumination | self-distancing | act-defusion | “third-person” vocab unused |
| TC042 | pre_performance | if-then-gollwitzer | box-breathing | if-then present but breath stack wins |
| TC067 | pre_performance | ppr | process-visualization | “PPR” vocab weaker than imagery prior |
| TC066 | stress_acute | exhale-emphasized | physiological-sigh-acute | “exhale pace” under-paid |
| TC050 | sleep_prep | wind-down | mbsr-breath-anchor | “wind-down” named; dose/window vs breath |
| TC061 | pre_performance | staff_queue_ppr | process-visualization | meta staff_* (soft needs candidate hit) |

C ranked_too_low count post-PR #3: **11**.

## 6. Golden-data check

- Selected `values-compass` for CPI hiring/firing + moral_load is **catalog-aligned** (`moment_tags`: hiring_firing, moral_load; `need_tags`: emotion_regulate).  
- Message dose 10m vs catalog rec 720s is a known duration-window tension (see GOLDEN_DATA_ISSUES §1) affecting PMR equally — not unique to golden wrongness.  
- **Not** a silent-edit candidate. If ranking still cannot soft-pass after systemic preference/event/duration fixes, document proposed human review — do not edit `test_cases.jsonl`.

## 7. Chosen fix strategy (systemic only)

1. **Catalog:** optional moment coverage only if missing (prefer existing tags).  
2. **EVENT_PROTOCOL_BOOST.hiring_firing** affinity for values-compass / affect-labeling (not GOAL table).  
3. **Preference vocabulary → modality** (extend existing note→id routing):
   - values/moral/compass on emotion_regulate + hiring_firing/moral_load events  
   - temper PMR when moral/values/hiring signal without somatic tension  
   - reappraisal / third-person / exhale-pace / wind-down / PPR note routing for residual family  
4. **Reject:** GOAL_PROTOCOL_BOOST expansion; `if (case_id==='TC007')`; golden edits; softAgree redefinition solely to pass TC007.

## 8. Success criteria

- TC007 soft-pass via ranking (values in top3 or top1 ∈ golden candidates) without case-id.  
- Residual C / soft family improved where same mechanisms apply.  
- Full 110 + holdout re-run; unit + playwright; docs before→after.
