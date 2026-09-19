# TC025 / TC028 Residual C Analysis (before fix)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc025-tc028-residual-c`  
**Baseline (live main / post PR #4+#5):** full soft **110/110**, dump exact **69/110** (62.7%), pie.spec exact **~58/110**, holdout soft **22/22**, exact **14/22**. Residual **C ranked_too_low: TC025, TC028** only.  
**Constraint:** No `GOAL_PROTOCOL_BOOST` expansion; no case-id hacks; no silent golden edits; prefer catalog / event / preference / subtract-before-add.

---

## 1. TC025 — safer substitute vs caution card

| Field | Value |
|-------|-------|
| client | musicians_dancers |
| state | asks hyperventilation energy |
| context | private |
| goal | activation_up |
| constraints | safety screen |
| candidates | cyclic-sighing, cyclic-hyperventilation-caution |
| excluded_by_author | cyclic-hyperventilation-caution |
| selected | **cyclic-sighing** |
| reason | prefer safer; caution not automation_ok |

### Mapped input (cold)
```
goal=activation_up
upcoming_event_tag=none
place_class=office  privacy=private  raw_gap_sec=600
clinician_mode=false
history_notes="safety screen; asks hyperventilation energy prefer safer; caution not automation_ok … Prefer cyclic sighing…"
```

### Actual ranking (baseline)

| Rank | protocol_id | score | notable |
|-----:|-------------|------:|---------|
| 1 | **cyclic-hyperventilation-caution** | 0.705 | need_match **0.99** (sole `activation_up` need tag); automation_ok=**false** unpaid |
| 2 | brief-pmr-acute | 0.572 | |
| 3 | exhale-emphasized | 0.568 | |
| 4 | **cyclic-sighing** | 0.566 | need_tags stress_acute/arousal_down; **not** in top-3 → **C** |

**Soft:** true because top1 ∈ golden.candidates (the *excluded* caution card).  
**Exact:** false. **ABC:** C ranked_too_low (selected outside top-3 recommendations).

### Root cause (systemic family)
1. **Catalog need monopoly:** only `cyclic-hyperventilation-caution` carries `activation_up`, so need path dominates despite `automation_ok=false` and author exclusion.
2. **automation_ok unused in ranker:** caution cards are not demoted when `clinician_mode` is false — contradicts catalog `selection_notes` (“prefer cyclic sighing”) and golden safety-screen policy.
3. **Safer-substitute vocabulary unpaid:** notes already say prefer safer / cyclic sighing / caution not automation_ok, but no preference→modality route exists for activation_up (only pre_performance/emotion/sleep families today).
4. **Not a golden-data bug:** selecting safer automation_ok breath when HV is requested under safety screen is intentional product policy. Documented in GOLDEN_DATA_ISSUES for human visibility; **do not silent-edit**.

### Soft-risk note
Demoting HV alone can make top1=`brief-pmr-acute` (∉ candidates) and drop soft unless `cyclic-sighing` simultaneously enters top-3. Fix must be **paired** demote-caution + boost-safer-substitute.

---

## 2. TC028 — implementation intention vs affect label on delay-send

| Field | Value |
|-------|-------|
| client | lawyers |
| state | anger |
| context | urge to send blast email |
| goal | emotion_regulate |
| candidates | affect-labeling, if-then-gollwitzer, opposite-action |
| selected | **if-then-gollwitzer** |
| reason | behavior delay send |

### Mapped input (cold)
```
goal=emotion_regulate
upcoming_event_tag=none   # blast-email / urge-to-send not mapped to an event
history_notes="anger behavior delay send If urge to send angry email → wait 30 min + label feeling first."
```

### Actual ranking (baseline)

| Rank | protocol_id | score | notable |
|-----:|-------------|------:|---------|
| 1 | **affect-labeling** | 0.937 | need emotion_regulate; timing 0.7 via moment∩need; **+0.16** from `/\blabel\b/` in notes |
| 2 | pmr | 0.865 | |
| 3 | act-defusion | 0.838 | |
| 4 | cognitive-reappraisal | 0.823 | |
| 5 | **if-then-gollwitzer** | 0.803 | need_match **0** (behavior_change/goal_clarity only); GOAL boost 0.28 unpaid by need; no delay-send preference |

**Soft:** true (top1 ∈ candidates). **Exact:** false. **ABC:** C (selected outside top-3).

### Root cause (systemic family)
1. **Need-tag gap:** if-then lacks `emotion_regulate` / impulse moments; emotion stack (label/PMR/defusion) crowds it out despite narrative “If urge → wait”.
2. **Label vocabulary false friend:** golden message includes “label feeling first” as a *secondary* step; existing emotion preference boosts affect-labeling +0.16 and overpowers the primary delay-send plan.
3. **If-then preference gated to pre_performance only:** delay-send / blast-email / urge-to-send on emotion_regulate never fires.
4. **Event mapper gap:** context “urge to send blast email” stays `none` — no EVENT affinity path.
5. **Golden check:** selecting if-then for impulsive send-delay is catalog-aligned (implementation intentions). Secondary “label first” is sequencing, not top-1. **Not** silent-edit; optional human note that message mentions both modalities.

---

## 3. Chosen fix strategy (systemic only)

1. **Safety / automation (TC025 family):** subtractive penalty when `automation_ok===false` && `!clinician_mode` (catalog field → rank), so caution cards are not cold defaults.
2. **Safer-substitute preference (activation_up):** when notes indicate safety screen / prefer safer / cyclic sigh / caution not automation_ok / hyperventilation ask → boost `cyclic-sighing`, demote hyperventilation-caution (vocabulary→modality; not case-id).
3. **Impulse delay-send (emotion_regulate):**
   - Mapper: blast email / urge to send / delay send → event tag `impulse_send` (or equivalent).
   - `EVENT_PROTOCOL_BOOST.impulse_send` → if-then affinity (not GOAL table).
   - Preference: delay-send / if-urge-to-send / blast-email / wait-before-send → boost if-then; when delay-send coexists with bare “label”, temper affect-labeling so secondary label step does not beat primary plan.
4. **Catalog (minimal):** add impulse/anger-adjacent `moment_tags` on if-then if missing; do **not** force `activation_up` onto cyclic-sighing (physiologically arousal_down — preference handles safer substitute).
5. **Reject:** GOAL_PROTOCOL_BOOST expansion; `if (id===TC025|TC028)`; golden edits; softAgree redefinition to hide C.

## 4. Success criteria
- TC025 & TC028 leave C (selected in top-3 at minimum; exact if honest).
- Soft stays 110/110 (or honest report if tradeoff); holdout soft not regressed.
- Full 110 + holdout + unit + playwright; docs before→after; no GOAL boost expansion.
