# JITAI research spine

## Definition
**Just-in-Time Adaptive Intervention (JITAI):** support adapted to an individual’s changing internal state and context, delivered when needed — and withheld when not (Nahum-Shani et al., *Ann Behav Med* 2018; PMC5364076).

## Six components (map to HPOS)
| JITAI element | HPOS mapping |
|---------------|--------------|
| Distal outcome | Better sleep adherence, lower acute arousal before pitches, travel adaptation |
| Proximal outcome | Immediate stress↓, protocol completion, next-meeting calm |
| Decision points | Pre-event T-30/T-10; post-meeting gap; wind-down; post-flight |
| Intervention options | Protocol library cards (30s–20m) + SILENCE |
| Tailoring variables | Sleep debt, meeting density, receptivity, client type, preferences |
| Decision rules | If-then + uncertainty thresholds; later contextual bandits |

## Micro-randomized trials (MRT)
Randomize intervention options at many decision points to estimate **causal proximal effects** and time-varying moderation (Klasnja et al. 2015; Walton/Qian/Murphy methods).  
**Product implication:** don’t ship opaque “AI coach”; run MRT-like logging from day one even if Phase-1 is rule-based.

## Receptivity ≠ interruptibility
- Interruptibility: will they *open* the notification?  
- Receptivity: can they *process and use* the support? (Mishra et al.; Künzler et al. on state-of-receptivity)  
Deployed models improved receptivity vs random timing materially in studies (~up to ~36% in Ally+ style deployments) but absolute prediction remains imperfect (AUC often modest).

## Decision policy — Phase-1 (rules)
```
IF receptivity < threshold → SILENCE
ELSE IF safety_flag → escalate_human
ELSE IF upcoming_high_stakes in [15,45] min AND cog_load_est high → pre_performance_short
ELSE IF meeting_gap >= 3 min AND meeting_streak >= 3 → transition_reset
ELSE IF sleep_duration < personal_p20 AND morning → protect_load_day
ELSE IF flight within 24h → travel_prep_card
ELSE default → SILENCE
```

## When ML adds value
| Approach | Use when | Avoid when |
|----------|----------|------------|
| Rules + thresholds | Sparse data, need auditability (UHNW) | — default start |
| Contextual bandits | Enough outcome labels; stable rewards | Cold start; unclear reward |
| Deep RL | Almost never for wellness v1 | Overkill, unexplainable |
| Supervised receptivity model | Rich phone context on-device | Inferring emotions |

Reward design tip: optimize **completed useful micro-protocols** and **client-rated helpfulness**, not opens.
