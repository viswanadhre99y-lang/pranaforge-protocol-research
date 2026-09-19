# Client state vector

Belief state for PIE. Every dimension: `{value, confidence:0-1, source_class, as_of, notes?}`.

`source_class ∈ {measured, estimated, self_report, staff_observed, unknown}`

## Layers

### 1. Identity & preferences (slow)
- `client_type` (CPI slug): founder, ceo, consultant, traveler, athlete, …
- `goals[]`: sleep, pre_performance, stress, focus, travel_adapt, …
- `prefs`: `{prefer_breath, avoid_breath, prefer_body, prefer_cognitive, max_unsolicited_per_day, preferred_duration_sec, tone}`
- `safety_profile.tags[]`: pregnancy, cardiovascular_disease, panic_breath_intolerance, bipolar_spectrum, trauma_sensitive, high_risk_occupation, …

### 2. Schedule / temporal (fast)
- timezone, local_time_bucket (morning/afternoon/evening/night)
- `next_event{in_min, tag, stakes:low|med|high}`
- `meeting_density_4h`, `meeting_streak`, `available_gap_sec`
- `flight_in_h`, `hours_since_landing`, `tz_offset_change`

### 3. Environment
- `place_class`: home, office, hotel, airport, car, gym, outdoors, unknown
- `privacy_level`: private | public_discrete | public_exposed
- `equipment_ok[]`

### 4. Activity
- `label`: sleeping, driving, in_meeting, deep_work, exercising, leisure, unknown
- Gate: driving/sleeping/in_meeting → usually SILENCE

### 5. Physical
| Field | Typical source_class | Honesty |
|-------|---------------------|---------|
| sleep_h_last_night | measured (wearable) / self_report | Duration OK; stages weak |
| sleep_efficiency_est | estimated | Low confidence |
| rhr_delta_pct | measured trend | Not diagnosis |
| hrv_night_rmssd_delta | measured trend | Not acute stress meter |
| readiness_vendor | estimated | Marketing composite |

### 6. Mental (mostly estimated)
- cog_load_est from meeting density — **proxy**
- rumination_flag from self-report / time-of-night pattern — cautious

### 7. Emotional (prefer self-report)
- stress_1to5, energy_1to5, mood_1to5, affect_label_optional
- Never infer anxiety disorder from HRV

### 8. Behavioral
- ignores_last_7d, completions_last_7d, last_protocol_ids[], last_negative_ids[], adherence_prob_prior

### 9. Receptivity (gate)
- score 0–1 + reason: in_meeting | dnd | driving | sleep | ignore_streak | gap_ok | user_opened
- Prefer **false silence** over false interrupt (UHNW)

### 10. Safety / escalation
- crisis_language_detected, drowsy_high_risk_role, orthosomnia_flag

## Need inference (outputs consumed by decision engine)
Derived needs with confidence, e.g.:
- `stress_acute`, `sleep_prep`, `pre_performance`, `cognitive_reset`, `jetlag`, `rumination`, `mood_low`, `recovery_rest`

Rule sketches live in `../04_decision_engine/DECISION_ENGINE.md`.

## Machine schema
See `client_state_schema.json`.
