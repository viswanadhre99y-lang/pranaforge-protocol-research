# Real-time decision tree

```
WHAT IS HAPPENING NOW?
│
├─ Crisis language / safety risk?
│  └─ YES → ESCALATE (resources ± consented human). Do NOT suggest breath/TIPP as therapy.
│
├─ Activity = driving OR sleeping OR (in_meeting & not user-pull)?
│  └─ YES → SILENCE
│
├─ Receptivity < τ (push path)?
│  └─ YES → SILENCE (log). Staff console may still show soft suggestion.
│
├─ User-initiated pull? ──────────────────────────────┐
│                                                     │
├─ HIGH-STAKES EVENT in 5–45 min?                     │
│  ├─ gap < 45s → physiological-sigh-acute | affect-label | SILENCE
│  ├─ gap 45–180s → tactical-breath-reset | ppr | centering | sigh
│  └─ gap >180s → ppr + process-visualization | box/sigh | pettlep(if trained)
│
├─ JUST LANDED / jet-lag window (0–48h, tz change)?
│  └─ morning-light (timed) | sleep opportunity protect | NSDR adjunct (NOT sleep) | caffeine policy
│     melatonin only with timing plan + clinician_guided flag
│
├─ T-SLEEP / wind-down window?
│  ├─ rumination → worry-postpone + wind-down; avoid activation protocols
│  ├─ insomnia pattern → stimulus-control education; sleep-restriction ONLY clinician
│  └─ tension → brief-pmr | body-scan | 478 (no long holds if contra)
│
├─ POST-CONFLICT / post-rejection?
│  └─ affect-label → reappraisal|defusion → tiny BA or social-micro (if safe)
│
├─ MEETING STREAK ≥3 & gap ≥2 min?
│  └─ task-switch-buffer | exhale-emphasized | art-brief | sigh
│
├─ MIDDAY CRASH (sleep debt + energy low)?
│  ├─ nap opportunity & not insomnia-protocol night → nap-protocol
│  └─ else → NSDR 10–20m OR walk/aerobic if time & cleared
│
├─ CHRONIC STRESS / low urgency afternoon?
│  └─ Prefer SILENCE for pushes; offer coherent breathing / MBSR breath if user pull
│
├─ MOOD LOW / inertia (self-report)?
│  └─ behavioral-activation-tiny (not if crisis) | opposite-action(careful) | social-micro
│
├─ DEEP WORK block declared?
│  └─ pomodoro-ultradian OR SILENCE (don't interrupt flow)
│
└─ DEFAULT
   └─ SILENCE
```

## Moments that matter (CPI-aligned)

| Moment | Typical need | First-line public protocols | Usually exclude |
|--------|--------------|----------------------------|-----------------|
| Pre-pitch T-30 | pre_performance | process-visualization, ppr, sigh | hyperventilation, long NSDR |
| Pre-pitch T-10 | micro_reset | physiological-sigh-acute, tactical-breath-reset, centering | WOOP (too late) |
| Live blank | micro_reset | sigh ×1–3, if-then restart cue | body-scan |
| Post-rejection | emotion_regulate | act-defusion, affect-labeling, tiny BA | gratitude-forced |
| Post-conflict | emotion_regulate | affect-label, reappraisal, exhale | cold-face if cardiac |
| Hiring/firing day | moral_load | values-compass, affect-label, sigh | pep-talk spam |
| Meeting streak gap | cognitive_reset | task-switch-buffer, sigh, art-brief | 20m yoga nidra |
| T-sleep | sleep_prep | wind-down, worry-postpone, PMR | exercise bout, hyperventilation |
| 1am spiral | rumination | stimulus-control leave-bed, worry-postpone | more dashboards |
| Pre-flight | travel | caffeine plan, sleep opportunity, packing if-then | mega melatonin DIY |
| Post-landing | jetlag | morning-light timed, hydrate/move, NSDR adjunct | NSDR-as-sleep claim |
| Demo day AM | pre_performance | PPR + process imagery | values essay |
| Runway scare Sunday | dread | worry-postpone slot, values+tiny action, nature ART | manifestation LoA |
| Midday crash | fatigue | nap 10–20 OR NSDR; protect caffeine | sleep restriction DIY |

Silence beats a wrong intervention in all rows when receptivity is low.
