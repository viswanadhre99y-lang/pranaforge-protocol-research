# Ranking algorithm

**Status:** Engineering heuristic for product selection. **Not** a validated clinical instrument. **Not** peer-reviewed as a composite score. Do not market Suitability Score as science.

## Formula
After hard excludes:

```
raw = w1*need_match + w2*context_match + w3*timing + w4*evidence
    + w5*history + w6*preference + w7*feasibility
    + w8*expected_benefit + w9*adherence_prob

score = raw − (p_contra + p_complexity + p_friction + p_prior_negative + p_repeat)

# then min-max or sigmoid to 0–1 within candidate set (optional)
```

Default weights (`score_spec.json`): sum of positive w ≈ 1.0 before penalties.

## Feature definitions

| Feature | Range | How computed | Epistemic label |
|---------|-------|--------------|-----------------|
| need_match | 0–1 | Jaccard(need_tags, inferred_needs) × urgency weight | **Engineering** (tags are labels) |
| context_match | 0–1 | place/privacy/equipment tag overlap | Engineering |
| timing | 0–1 | moment_tags hit + circadian appropriateness | Engineering; light/jetlag timing informed by **chronobiology literature** |
| evidence | 0–1 | A=1.0, B=0.8, C=0.55, D=0.35, E=0 (excluded) | **Evidence-based ordinal** from library grading — not a meta-analytic effect size |
| history | −1–1 | prior helpfulness for this protocol/need | Engineering from logs |
| preference | 0–1 | modality prefs match | Self-report |
| feasibility | 0–1 | duration fit, complexity vs gap, public_discrete | Engineering |
| expected_benefit | 0–1 | prior by evidence×need urgency×intensity fit | **Assumption** — not RCT-derived per client |
| adherence_prob | 0–1 | duration↑ → down; personal completion rate | Engineering |

## Penalties (subtract)
| Penalty | When |
|---------|------|
| p_contra | Soft residual after hard exclude (should be ~0 if filters work) |
| p_complexity | high complexity when receptivity mid |
| p_friction | equipment missing, not discrete in public |
| p_prior_negative | client rated ≤2 previously |
| p_repeat | same protocol delivered < cooldown |

## Hard exclusions (score irrelevant)
- contraindication_tags ∩ safety_profile.tags
- clinician_only without clinician_mode
- automation_ok=false on fully-auto channel
- arousal incompatible (activation when sleep_prep)
- evidence E on evidence-claiming path
- duration / dose vs gap (runtime product rule): prefer `recommended_duration_sec`; if it exceeds gap but `min_duration_sec` ≤ gap, shrink dose to ≤ `available_minutes*60` (never below min). Micro/acute gaps (≤120s) prefer min when need is micro/stress/pre-performance. Do **not** use raw `max_duration_sec` as the staff default dose.
- public_discrete===false when place_class ∈ {public,airport,plane,open_office} or privacy=public
- crisis path (no protocol ranking)

## Thresholds
- `τ_select` default 0.42 — below → SILENCE
- Staff console may show below-threshold options grayed with reasons

## What is evidence-based vs assumption

**Evidence-informed inputs**
- Protocol-level A–E grades and citations from parent library
- Chronobiology for light timing (jet lag) — cite CDC Yellow Book / jet-lag literature
- CBT-I components as clinician-domain (A-grade protocols)

**Engineering assumptions (tunable, not “validated PIE score”)**
- Weight vector w1…w9
- Tag ontology and Jaccard need match
- Composite expected_benefit
- Adherence_prob functional form
- τ thresholds

## Later: bandits
Only among safe candidates; reward = completed + rated helpful (not opens). Log propensity for offline eval / MRT-style analysis.
