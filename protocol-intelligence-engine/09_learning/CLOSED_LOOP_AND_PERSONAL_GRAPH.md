# Closed loop & personal response graph

## Loop
```
sense → interpret(uncertain) → decide(incl. silence) → intervene → measure → learn
```

## Logging schema (minimum)
```json
{
  "decision_id": "uuid",
  "as_of": "ISO",
  "client_id": "...",
  "state_snapshot_id": "...",
  "inferred_needs": [],
  "candidates": [],
  "excluded": [{"id":"", "reason":""}],
  "scores": {},
  "action": "suggest|silence|escalate",
  "selected": [],
  "channel": "push|staff|pull",
  "message_id": "...",
  "outcomes": {
    "opened": null,
    "started": null,
    "completed": null,
    "rating_1to5": null,
    "ignore": null,
    "proximal_self_report": null,
    "proximal_measured": null,
    "source_class_notes": "rating=self_report; sleep_delta=measured"
  }
}
```

## Personal response profile
Per client aggregates:
- protocol_id → {n, completion_rate, mean_rating, last_negative}
- need_tag → preferred modality (breath/body/cognitive)
- moment_tag → response rates
- ignore_streak, best_duration_sec, quiet_hours

Feeds ranking features `history`, `preference`, `adherence_prob`.

## Learning stages
| Stage | Method | When |
|-------|--------|------|
| L0 | Rules + CPI priors | Day 0 |
| L1 | Heuristic weight tweaks from ratings | >50 rated decisions |
| L2 | Contextual bandit on **safe candidate set** | >200–500 / segment |
| L3 | Receptivity model on-device | rich phone features + consent |
| L4 | MRT / offline policy eval | research partnership |

## Reward design
Optimize **completed + rated helpful** and **staff-accepted suggestions**, not raw opens. Penalize ignores after push. Never reward longer engagement for its own sake (annoyance).

## Honesty
Causal claims need experimental design (MRT). Observational “this protocol works for you” = personalized prior, not proof.
