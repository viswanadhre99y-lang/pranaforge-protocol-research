# Decision engine

Hybrid: **deterministic filters + weighted ranking + optional later bandits**. Silence is a first-class action.

## Why not pure ML at start
1. **Cold start** — UHNW N is small; no reliable offline dataset of “correct protocol.”
2. **Safety** — contraindications and clinician-only must be hard constraints, not soft logits.
3. **Auditability** — staff/principals need “why this / why silence.”
4. **Sparse labels** — opens ≠ helpfulness; need intentional outcome logging first.
5. **Distribution shift** — travel weeks ≠ home weeks; rules encode known structure (CPI moments).
6. ML (contextual bandits) earns a seat **after** safe-set filtering and ≥ hundreds of rated decision points per segment.

## Pipeline (every decision point)

```
0. LOAD state + catalog subset (automation_ok OR staff_override)
1. SAFETY GATE
   - crisis → ESCALATE_HUMAN / emergency resources; candidates=[]
   - hard medical overlap → exclude protocols; maybe SILENCE
2. RECEPTIVITY GATE
   - if score < τ_receptivity → SILENCE (log reason)
   - if activity in {driving, sleeping, in_meeting} → SILENCE unless user-initiated
3. NEED INFERENCE
   - produce need[] with urgency, confidence, source_class
4. URGENCY
   - stakes × time-to-event × severity → urgency 0–1
   - if urgency < τ_urgent AND no user pull → lean SILENCE
5. HARD FILTERS (deterministic)
   - duration: protocol.max_duration_sec ≤ available_gap_sec
   - context_tags ∩ place/privacy
   - arousal_direction compatible with need (no activation_up when sleep_prep)
   - clinician_only ⇒ exclude unless clinician_mode
   - evidence E ⇒ exclude from “evidence path”
   - recent identical protocol spam penalty → filter if repeat < cooldown
6. RANK remaining (see 05_ranking)
7. THRESHOLD
   - if top.score < τ_select → SILENCE
8. SELECT top (+ backup)
9. RENDER message or staff card
10. SCHEDULE follow-up; LOG full decision trace
```

## Need inference (rules sketches)

| Signals | Inferred need | source_class |
|---------|---------------|--------------|
| stress_self ≥4 OR staff marks acute | stress_acute | self_report / staff |
| next_event.stakes=high & in_min∈[5,45] | pre_performance | estimated (calendar) |
| local night + sleep goal + awake | sleep_prep / rumination | estimated |
| hours_since_landing∈[0,48] & tz change | jetlag | measured/estimated |
| meeting_streak≥3 & gap≥120s | cognitive_reset | estimated |
| energy≤2 & mood low self-report | mood_low / inertia | self_report |
| sleep_h < personal_p20 & morning | sleep_debt (protect load) | measured |
| user opens “perform” intent | pre_performance / focus | self_report |

Always keep **confidence**; low confidence → prefer micro protocols or SILENCE.

## Urgency
`urgency = clip(0.4*stakes + 0.3*time_pressure + 0.3*severityity_norm)`  
time_pressure high when event in 5–30 min or crisis emotion.  
Chronic low-grade stress alone rarely warrants push → SILENCE or evening policy card.

## Receptivity
Reuse HPOS: receptivity ≠ interruptibility.  
τ default 0.45 for pushes; 0.25 for staff-console suggestions (human delivers). User-initiated pull bypasses push receptivity but still runs safety filters.

## Fit
After filters, fit = ranking features (need_match, context_match, timing, evidence, history, preference, feasibility, expected_benefit, adherence_prob).

## Outputs
```json
{
  "decision_id": "...",
  "action": "suggest|silence|escalate",
  "selected": ["physiological-sigh-acute"],
  "backup": ["affect-labeling"],
  "excluded": [{"id":"sleep-restriction","reason":"clinician_only"}],
  "scores": {"physiological-sigh-acute": 0.78},
  "rationale_codes": ["need:pre_performance","gap:90s","evidence:B"],
  "message_id": "..."
}
```

## Staff-in-loop (Phase-1 default for UHNW)
Engine proposes; human accepts/edits/silences. Learning still logs the final delivered action.
