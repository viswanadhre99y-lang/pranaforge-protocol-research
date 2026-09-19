# Protocol graph & sequences

Nodes = protocol_ids or SILENCE/ESCALATE. Edges = typical “then” under conditions.

## Graph principles
1. Prefer **2–3 step** chains max for real-time.
2. Each step must still pass duration/receptivity filters independently.
3. Measure proximal outcome before automatic step-2 when stakes high.
4. Never chain into vault method steps.

## Example edges (public)

```
stress_acute_high ──► physiological-sigh-acute ──► (if still high) brief-pmr-acute
                 └─► 54321-grounding (if breath intolerance)

pre_performance ──► process-visualization ──► ppr ──► tactical-breath-reset (T-2)

post_conflict ──► affect-labeling ──► cognitive-reappraisal|act-defusion ──► behavioral-activation-tiny?

T_sleep_rumination ──► worry-postpone ──► wind-down ──► pmr|body-scan
                   └─► stimulus-control (if bed≠sleep)

post_landing_morning ──► morning-light ──► (optional) nap-protocol|yoga-nidra-nsdr ──► evening-light-hygiene

mood_low ──► behavioral-activation-tiny ──► social-connection-micro (safe)
        └─► aerobic-exercise-stress (if time/cleared)

goal_sunday ──► woop ──► if-then-gollwitzer ──► habit-stacking
```

## Sequences (packaged)

### S1 Pitch-Week Micro
1. T-30: process-visualization (5–8m)  
2. T-10: physiological-sigh-acute  
3. T-1: ppr cue (30–60s)  
4. Post: affect-label if reject; SILENCE if success rush (avoid forced gratitude)

### S2 Landing Day
1. Timed outdoor light (direction-dependent — use jetlag card)  
2. Protect sleep opportunity  
3. Optional NSDR **adjunct** if wired but can't sleep yet  
4. Evening dim light hygiene  
Message must state NSDR ≠ sleep.

### S3 Conflict Aftermath (private)
1. affect-labeling (2m)  
2. cognitive-reappraisal OR self-distancing (5–8m)  
3. Optional walk / tiny BA  
Stop if escalation to safety issues.

### S4 Insomnia Night (educational)
1. Leave bed if not sleepy (stimulus-control principle)  
2. worry-postpone note  
3. Dim wind-down activity  
**Do not** auto-start sleep-restriction.

### S5 Meeting-Streak Reset
1. task-switch-buffer (60–90s)  
2. exhale-emphasized or sigh  
3. SILENCE until next gap

## State machine sketch
`Idle → DetectMoment → FilteredCandidates → Rank → (Silence|Suggest) → Deliver → AwaitOutcome → UpdateHistory → Idle`
