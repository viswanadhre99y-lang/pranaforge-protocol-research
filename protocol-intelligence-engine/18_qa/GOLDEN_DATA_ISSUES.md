# PIE Golden Data Issues

**Date:** 2026-09-19 (Asia/Calcutta)  
**Scope:** `13_test_cases/test_cases.jsonl` (n=110) vs `02_protocol_catalog/catalog.jsonl` + mapper/ranker semantics  
**Policy:** Goldens in `test_cases.jsonl` were **not** silently edited. Issues below are catalog/engine/data-contract findings.

## 1. Duration semantics mismatch (behavioral windows)

Several catalog cards encode **multi-hour behavioral windows** (overnight / evening hygiene) as `min_duration_sec` / `recommended_duration_sec`, while golden contexts supply **staff coaching gaps** of ~10 minutes.

| protocol_id | catalog min/rec | typical golden gap | Issue |
|---|---:|---:|---|
| `stimulus-control` | 3600 / 3600 | 600s | Window ≠ in-session dose; was hard-excluded |
| `evening-light-hygiene` | 3600 / 3600 | 600s | Same |
| `wind-down` | 1200 / 1200 | 600s | Same |
| `smart-caveats` | was 720 | 600s | Barely over gap; min lowered to 600 |

**Engine fix (not golden edit):** prescription / behavioral-window briefing dose in `doseSecForGap` when tags ∩ sleep/circadian/insomnia/hygiene and min≥900s.

## 2. Micro protocol mins too long for acute practice

| protocol_id | was | fixed to | Rationale |
|---|---:|---:|---|
| `physiological-sigh-acute` | min/rec 120 | min 30 / rec 60 | 1–3 sighs ≈ 30–60s |
| `tactical-breath-reset` | min 120 | min 45 | Short box-like reset |
| `affect-labeling` | min 120 | min 60 | Micro utterance |

Without this, gap=45–60s goldens (`TC002`, `TC051`) incorrectly excluded the golden via `duration_exceeds_gap`.

## 3. Need-tag / goal alignment gaps

- `stimulus-control` lacked `sleep_prep` while many sleep_prep goldens select it → added `sleep_prep` need tag.
- `act-defusion` is the post_rejection specialist (`moment_tags`) but need tags are rumination/cognitive_reset only — emotion_regulate goldens under-ranked it vs evidence-A reappraisal. Addressed via **event affinity** (`EVENT_PROTOCOL_BOOST.post_rejection`), not silent golden rewrites.
- `54321-grounding` appropriately carries `crisis_emotion`; mapper previously treated goal `crisis_emotion` as crisis escalate (false positive).

## 4. Mapper / label contract issues (goldens OK, mapping was wrong)

| Pattern | Example | Issue |
|---|---|---|
| `goal: crisis_emotion` | TC099 | Regex `/crisis/` on goal → `crisis_flag` → escalate |
| `SILENCE_or_*` + ambiguous calendar | TC102 | `force_silence` only for exact `SILENCE` |
| `staff_screen` + OSA | TC103 | Meta label not a catalog ID; softAgree required candidate hit |
| `prior_negative on X` in **state** | TC108 | Only `history_notes` `prior_negative:id` was parsed |
| `hallway` / `elevator` | TC002/TC051 | Place mapping (elevator→public) needed for public_discrete |

## 5. Meta / non-catalog selected labels

Author `selected` values that are **not** catalog protocol IDs (by design):

- `SILENCE`, `ESCALATE`, `SILENCE_or_*`, `ESCALATE_or_*`
- `staff_*`, `SEQUENCE_*`, `clinician_*`

These cannot be “exact” protocol matches. Soft agreement must treat silence/staff gates specially. **A/B/C:** `never_generated` count is 0 for true catalog IDs; meta labels are N/A for A/B/C.

## 6. Author candidate sets vs cold ranker

Many soft-ok / exact-miss rows have top-1 in a **related family** but not the author `selected` ID (imagery vs box, if-then vs WOOP, sigh vs exhale). This is expected for cold heuristics vs narrative goldens — not automatically a catalog bug.

## 7. What we did **not** change

- No edits to `13_test_cases/test_cases.jsonl` golden answers.
- No blind `score_spec.json` weight chasing to force exact agreement.
- No case-id `if (id===TC0xx)` hacks in ranker.

## 8. Residual data risks

- Shift / day-sleep contexts (`home morning` + sleep_prep) are easy to confuse with morning-light circadian cards.
- Single-candidate goldens (`candidates: [only-one]`) make soft agreement brittle when founder CPI imagery priors dominate.
- Historical response is sparse in goldens → `historical_response` feature often default 0.5.

## 9. Residual C after TC007 residual-C pass (2026-09-19)

After systemic EVENT/preference fixes on `pie/golden-tc007-residual-c`, soft = 110/110 and holdout soft = 22/22. Remaining **C ranked_too_low**: `TC025`, `TC028` only.

- Not silent-edited.
- Further gains would require either catalog/moment coverage for those narrative IDs or human golden review — not GOAL_PROTOCOL_BOOST expansion.

## 10. TC025 / TC028 residual C review (2026-09-19) — human_review, not silent edit

### TC025 — cyclic-sighing vs cyclic-hyperventilation-caution
- **Author intent:** under `safety screen` + “prefer safer; caution not automation_ok”, default to safer automation_ok breath rather than caution HV card.
- **Engine gap:** `automation_ok=false` was unpaid in ranking; only HV carries `activation_up` need tag.
- **Proposed correction (human):** none to golden selected. Optional future note clarifying safer-substitute policy when users *ask* for HV. Catalog already says prefer cyclic sighing in HV `selection_notes`.
- **Status:** human_review = optional prose clarification only; **no silent golden edit**.

### TC028 — if-then-gollwitzer vs affect-labeling
- **Author intent:** primary = implementation intention to **delay send**; label is secondary sequencing in the message (“wait 30 min + label feeling first”).
- **Engine gap:** emotion need stack + `/\blabel\b/` preference overweighted secondary step; delay-send / blast-email not mapped to event/preference for if-then.
- **Proposed correction (human):** optional message split “primary: if-then delay; optional: label” — **not required** if engine pays delay-send vocabulary.
- **Status:** human_review = optional; **no silent golden edit**.
