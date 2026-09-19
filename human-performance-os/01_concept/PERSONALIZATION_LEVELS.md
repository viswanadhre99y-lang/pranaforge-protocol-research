# Personalization levels (1→8)

| Level | What it uses | Example | Tech needed | Evidence maturity |
|-------|----------------|---------|-------------|-------------------|
| L1 Generic | Population defaults | “Try box breathing” | Static content | High for some protocols; low personalization value |
| L2 Client-type | Occupation priors | Founder pre-pitch pack | Taxonomy + playbooks | Medium — occupational psych |
| L3 Situation | Event type | Pre-board-meeting reset | Calendar event tags | Medium |
| L4 Schedule-aware | Density, gaps, lookahead | “10 min until next call — 3-min reset” | Calendar API | High feasibility |
| L5 Behavior-aware | Adherence, ignore patterns | Stop pinging after 3 ignores | Event logs | Medium |
| L6 Physiology-informed | Sleep duration, RHR/HRV vs *personal* baseline | Soften load day after short sleep | Wearable APIs + baselines | Mixed — sleep duration stronger than composite scores |
| L7 Longitudinal | What worked for *this* person | Prefer PMR over breath for user X | Outcome store + simple models | Emerging (JITAI/MRT) |
| L8 Predictive | Forecast need before ask | Pre-empt jet-lag night before flight | Forecasting + robust validation | Research-heavy; easy to overclaim |

**PranaForge Phase-1 target:** solid L2–L5, cautious L6 (sleep timing + duration + calendar), collect data for L7. Treat L8 as R&D.
