# System overview — Personal Human-Performance OS

## One-sentence definition
A **consent-based, context-aware decision system** that selects the smallest useful protocol for a specific client at a specific moment — or stays silent — then learns from outcomes.

## The question chain (product truth)
1. Who is this person? (stable profile + client-type priors)  
2. Where are they? (opt-in location / calendar / travel)  
3. What are they doing? (activity + calendar + wearable)  
4. What have they been doing? (rolling load: sleep, meetings, travel, training)  
5. What is about to happen? (calendar lookahead 15–120 min)  
6. What state are they *likely* in? (**probabilistic**, never certain)  
7. What do they need right now? (goal × state × upcoming event)  
8. Smallest useful intervention? (duration-capped protocol)  
9. When follow up? (outcome check or quiet)  

## Closed loop
```
Data sources (consented)
        ↓
Client Profile (slow) + Real-time Context (fast)
        ↓
Client State Model (beliefs + confidence)
        ↓
Event Detector (threshold / pattern / calendar)
        ↓
Receptivity Gate ──no──→ SILENCE
        ↓ yes
Intervention Decision Engine (rules first; bandits later)
        ↓
Protocol Library (metadata-tagged)
        ↓
Message Generator (context-specific copy)
        ↓
Delivery channel (app / WhatsApp staff / hotel tablet)
        ↓
Outcome capture (open / start / complete / rating / ignore)
        ↓
Learning Engine → update preferences, timing, protocol fit
```

## Design principles
1. **Silence is a feature** — optimize usefulness, not message count.  
2. **Uncertainty-aware** — every state has confidence; low confidence → ask or abstain.  
3. **Smallest dose first** — 30s–5 min before 20 min.  
4. **Separate wellness from clinical care** — escalate, don’t diagnose.  
5. **Client-type priors, individual posteriors** — start with founder/CEO/athlete playbooks; personalize from feedback.  
6. **No secret surveillance** — explicit consent per data class.  
7. **Do not overclaim wearables** — sleep duration OK-ish; sleep stages and “recovery scores” are weak/unproven as action oracles.

## Relationship to PranaForge delivery
| Layer | Role |
|-------|------|
| HPOS | When/whether to nudge; which public wrapper; staff cue |
| Daily Forge / emotional-load IP | Vault-only method content when a session is scheduled |
| Concierge UI | Operator console for hotel/staff |
| Human facilitator | High-stakes moments; never fully automated for UHNW Phase-1 |

Phase-1 recommendation: **human-in-the-loop HPOS** (system proposes; staff/principal confirms) before fully automatic client push.
