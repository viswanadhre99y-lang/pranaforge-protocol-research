# Context engine

## Job
Fuse slow profile + fast signals into a **current situation object** used by event detection and receptivity.

## Fusion principles
1. **Prefer calendar + clock over physiology** for “what’s happening now.”  
2. **Prefer within-person baselines** over population cutoffs for wearable deltas.  
3. **Missing data ≠ normal** — mark unknown.  
4. **Conflict resolution:** explicit self-report overrides inferred stress; in-meeting flag overrides nudge.  
5. **Decay:** cognitive-load estimates decay with half-life ~2–4h without new meetings.

## Situation object (example)
```json
{
  "local_time": "15:42",
  "tz": "Asia/Kolkata",
  "place_class": "office",
  "activity": "between_meetings",
  "gap_min": 12,
  "next": {"tag":"investor_pitch","in_min":28},
  "load": {"meetings_last_4h": 4, "sleep_h": 5.9, "sleep_vs_baseline": -1.4},
  "travel": {"flight_in_h": null},
  "uncertainty": {"activity": 0.3, "stress": 0.8}
}
```

## Event detectors (examples)
- `PRE_HIGH_STAKES` if next tagged event in 15–45m  
- `MEETING_STREAK` if ≥3 meetings with gaps <5m in 3h  
- `SLEEP_SHORT` if sleep_h < p20 personal  
- `TRAVEL_IMMINENT` if flight 6–36h  
- `LATE_WORK` if productive phone use after personal wind-down cutoff  
- `POST_EVENT` 0–20m after high-stakes end  

## Uncertainty policy
If `uncertainty.stress > 0.6` and intervention depends on stress → ask 1-tap OR silence.
