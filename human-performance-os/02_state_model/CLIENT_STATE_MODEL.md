# Client State Model

A **belief state**, not a ground-truth dashboard. Every dimension carries: value, confidence, source, freshness, and whether it is measured / estimated / self-reported.

## Tier A — Can be measured reasonably (with caveats)
| Signal | Typical source | Use | Do not overclaim |
|--------|----------------|-----|------------------|
| Clock / timezone | Phone | Circadian timing | — |
| Calendar events | Google/Outlook | Meetings, flights, gaps | Event titles may be wrong/private |
| Sleep *duration* & timing | Wearable vs PSG | Sleep debt proxy | Stages unreliable (≈50–65% agreement) |
| Steps / move minutes | Phone/watch | Sedentary vs active | Not “recovery” |
| HR during rest/sleep | PPG wearable | Trend vs personal baseline | Motion artifact; not diagnosis |
| Night HRV (RMSSD) trends | Oura/WHOOP/etc. | Within-person change | Not acute “stress meter” in meetings |
| Flight itinerary | Calendar / TripIt / manual | Jet-lag risk windows | Need consent |

Sources: Miller et al. Sensors 2022 (six wearables vs PSG); Chinoy et al. Sleep 2021.

## Tier B — Estimated only (always show confidence)
| Construct | How estimated | Required honesty |
|-----------|---------------|------------------|
| Cognitive load | Meeting density + duration + after-hours work | Proxy, not measured cognition |
| Decision fatigue | Long decision blocks + time-of-day | Theoretical construct; contested |
| Stress / anxiety | Self-report > HRV dip | Never diagnose anxiety disorder from wearables |
| Emotional overload | Self-report + optional check-in | Do not infer from location |
| “Recovery readiness” | Vendor composite | Marketing score ≠ validated clinical construct |
| Motivation | Rare self-report | Unstable to infer |

## Tier C — Self-report (gold for subjective state)
Ultra-light prompts (≤3 taps):
- Energy 1–5  
- Stress 1–5  
- Sleep quality 1–5  
- Intent: Recover | Focus | Perform | Rest  
Minimize burden: at most 1–2/day unless client opens app; event-triggered only when receptivity high.

## Tier D — Never infer without strong evidence / consent
- Psychiatric diagnoses  
- Substance use  
- Relationship conflict content from messages  
- Political/religious beliefs  
- Medical conditions from HR/HRV alone  
- “Burnout diagnosis” from calendar  

## State vector (conceptual schema)
```json
{
  "client_id": "...",
  "as_of": "ISO-8601",
  "identity": {"type":"founder","goals":["sleep","pre-pitch"],"prefs":{}},
  "schedule": {"meeting_density_4h": 0.8, "next_event": {"in_min": 25, "tag":"investor"}, "flight_in_h": 18},
  "environment": {"tz":"Asia/Kolkata","place_class":"office","permission":"approx"},
  "activity": {"label":"in_meeting","confidence":0.7},
  "physical": {"sleep_h_last_night": 5.8, "sleep_conf":0.75, "rhr_delta_pct": 4},
  "mental": {"cog_load_est": 0.7, "cog_conf":0.4},
  "emotional": {"stress_self": 3, "stress_age_h": 2},
  "behavioral": {"ignores_last_7d": 4, "preferred_duration_min": 3},
  "receptivity": {"score": 0.2, "reason":"in_meeting"}
}
```

## Update cadence
| Layer | Cadence |
|-------|---------|
| Profile | Weeks / onboarding |
| Calendar context | Every 5–15 min when active |
| Wearable nightly summary | 1–2×/day (vendor delay common) |
| Self-report | Sparse, high value |
| Receptivity | Continuous while app alive |
