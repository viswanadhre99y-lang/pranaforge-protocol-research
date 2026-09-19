# Protocol library metadata schema

Every selectable intervention (public wrappers OR staff-triggered session reminders — **not** vault IP steps) carries:

```yaml
id: physio_sigh_x3
name: Physiological sigh ×3
purpose: acute_downregulation
target_states: [high_arousal, post_meeting]
client_types: [founder, ceo, consultant, lawyer, athlete, traveler]
situations: [pre_meeting, post_conflict, travel_security]
duration_sec: 60
intensity: low
prerequisites: [safe_to_breathe_slowly]
contraindications: [acute_respiratory_distress, panic_if_breath_focus_worsens]
evidence_grade: B  # from public protocol library
expected_effect: lower_subjective_arousal_minutes
best_times: [meeting_gap, T-10_pre_event]
poor_times: [during_sleep, while_driving]
equipment: none
delivery: [audio, text, staff_prompt]
min_receptivity: 0.4
followup_min: 30
personalization_keys: [prefers_breath, avoids_breath]
```

## Selection algorithm (v1)
1. Filter by contraindications + safety  
2. Filter by duration ≤ available gap  
3. Filter by client_type allowlist  
4. Score = situation_match + state_match + preference_prior − recent_repeat_penalty  
5. If top score < threshold → SILENCE  
6. Else pick top; log decision for MRT/bandit later  

Vault IP (Daily Forge): only selectable as `session_reminder` / `check_in` — never auto-emit method steps.
