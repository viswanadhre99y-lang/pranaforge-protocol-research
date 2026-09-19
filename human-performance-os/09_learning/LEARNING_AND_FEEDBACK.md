# Learning system

## Event log (minimum)
`decision_id, client_id, context_hash, action_id|SILENCE, delivered_at, opened, started, completed, rating, time_to_open, ignore`

## Prefer rules until N grows
- Per-client: after ~20–50 rated interventions, allow simple preference weights  
- Population: pool for cold start (IntelligentPooling-style ideas — Liao/Tewari/Murphy line of work)

## Contextual bandits
Useful for **which protocol among safe candidates** and **whether to message**.  
Not useful as a black-box “life coach.”  
Reward = completed + helpful rating − annoyance (ignores, disables).

## What not to do
- Optimize for DAU/notifications  
- Learn to diagnose depression from HRV  
- Auto-escalate intensity of breath holds  

## Human-in-the-loop learning (PranaForge)
Staff marks: helpful / wrong time / wrong protocol / do-not-suggest-again.
