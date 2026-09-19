# HPOS — Founder executive brief

**Ask:** Research/design a personal human-performance OS (context → state → smallest intervention → follow-up), not a chatbot.  
**Delivered:** Research pack under `human-performance-os/` in private `pranaforge-protocol-research`.

---

## 1) System concept
Consent-based closed loop: sense → interpret (uncertain) → decide (**including silence**) → intervene → measure → learn. Phase-1 for UHNW: **staff console proposes; human delivers**.

## 2) Client state model
Belief vector with confidence: identity, schedule, environment, activity, physical (sleep duration/timing stronger than stages), mental/emotional (**mostly self-report**), behavioral (adherence/ignores). See `02_state_model/`.

## 3) Data-source map
Highest ROI: **calendar + timezone + sleep duration/timing + self-report + travel**. Wearable Recovery/Readiness = UX hints, not oracles. Avoid message-content surveillance. See `03_data_sources/`.

## 4) Context engine
Fuses signals into situation object; calendar-first; unknowns explicit. See `04_context_engine/`.

## 5) Event-trigger system
Detectors: pre-stakes, meeting streak, short sleep, travel imminent, late work, post-event. Rule policy with silence default.

## 6) Message engine
Context + why-now + one action + duration. Cap unsolicited pushes. See `06_messaging/`.

## 7) Protocol DB architecture
Metadata-tagged catalog; filter contraindications → duration → score → else silence. Vault IP never auto-emitted. See `07_protocol_selection/`.

## 8) Client-type logic
Priors for founders, CEOs, consultants, investors, athletes, physicians, lawyers, creators, travelers, UHNW. See `08_client_logic/`.

## 9) JITAI research
Nahum-Shani JITAI components + MRT evaluation; receptivity ≠ interruptibility. See `05_jitai/`.

## 10) Receptivity model
Gate on in-meeting/DND/driving/sleep/ignore streaks; optional later on-device ML. Prefer false silence over false interrupt for UHNW.

## 11) Feedback/learning
Log open/start/complete/rating/ignore; rules until data; contextual bandits for protocol choice among safe set. See `09_learning/`.

## 12) Closed-loop architecture
Diagram + Phase-1 stack in `11_architecture/`. LLM optional for **wording only** after protocol ID chosen.

## 13) Privacy/ethics
Layered consent; DPDP/GDPR awareness; no covert psych inference. See `10_privacy_safety/`.

## 14) Safety/escalation
Wellness ≠ medicine; crisis language → human/emergency paths, not breath protocols.

## 15) Tech architecture
Postgres + rules engine + calendar/wearable sync + staff console; on-device features later.

## 16) Companies/products
WHOOP/Oura/Apple/Calm/Headspace/AMS tools — partial overlaps; none are UHNW staff-in-loop performance OS. See `12_landscape/`.

## 17) Academic lineage
JITAI (Nahum-Shani), MRT (Klasnja/Murphy), HeartSteps, receptivity (Künzler/Mishra), wearable validation (Miller/Chinoy).

## 18) Possible today
L2–L5 personalization: client-type + situation + schedule + behavior; cautious sleep-duration L6; staff-mediated delivery.

## 19) Needs research
Reliable free-living stress inference; L8 prediction without annoyance; causal value of vendor composites.

## 20) Not realistic yet
Mind-reading from PPG; replacing clinicians; perfect receptivity; fully autonomous UHNW coach without human judgment.

## 21) Hard unsolved problems
Construct validity gap; annoyance; cold start; EA calendars; engagement reward hacking.

## 22) Moat angles
UHNW decision graphs + luxury staff workflow + privacy multiparty access + MRT evaluation harness + travel-circuit priors — **not** another meditation content pack.

---

## Recommended build order
1. Staff suggestion console (calendar + manual state)  
2. Protocol metadata + rules + silence policy  
3. Sleep duration + travel modules  
4. Outcome logging  
5. Only then bandits / heavier ML  

## Honesty line for product copy
We can get **usefully close** on schedule/travel/sleep-timing interventions. We cannot honestly claim continuous emotional omniscience. The win is **right small help, often silence, trusted brand**.
