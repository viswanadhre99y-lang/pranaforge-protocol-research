# PIE — Founder answers (A–R)

**Product:** Protocol Intelligence & Selection Engine for PranaForge (Viswanadh Reddy).  
**Thesis:** With dozens→thousands of protocols, intelligence = **filter → fit → timing → dose → delivery → measure → learn** — including **silence** as a first-class action. Not a bigger PDF. Not a chatbot.

Relates to: **HPOS** (sense/state/JITAI/privacy) · **CPI** (client-type priors & moments) · **public protocol library** (50 evidence-graded cards). Vault IP = opaque IDs only.

---

## A. Protocol Intelligence Model
A machine-readable catalog of **selection-ready cards** (`01_schema/`, `02_protocol_catalog/`). Each card carries content + selection metadata (`need_tags`, `context_tags`, duration, evidence A–E, automation/privacy flags). Ranking consumes metadata; messaging consumes chosen ID + context. Vault methods never expand into steps.

## B. Client State Model
Belief vector with per-field **value, confidence, source_class ∈ {measured, estimated, self_report}, freshness**. Layers: identity/prefs, schedule, environment, activity, physical, mental (mostly estimated), emotional (mostly self-report), behavioral history, receptivity, safety flags. Reuse HPOS honesty: sleep **duration/timing** > stages; vendor “readiness” is UX hint; never diagnose from PPG. Schema: `03_client_state/`.

## C. Decision Engine (hybrid — rules first)
Pipeline: **Safety → Silence/escalate gate → Need inference → Urgency → Receptivity → Hard filters → Weighted rank → Pick top(+backup) or SILENCE → Message/staff prompt → Follow-up**.  
**Why not pure ML at start:** cold-start, auditability for UHNW/staff, sparse outcome labels, safety requires hard constraints ML may violate, explainability is the product. Bandits only on the **already-safe candidate set** after N outcomes. Details: `04_decision_engine/`.

## D. Ranking Algorithm
Engineering heuristic (explicitly **not** a validated clinical instrument):
`Suitability ≈ w1·need + w2·context + w3·timing + w4·evidence + w5·history + w6·preference + w7·feasibility + w8·expected_benefit + w9·adherence_prob − penalties`.  
Hard exclude on safety/contraindication/clinician_only-without-clinician. Weights in `05_ranking/score_spec.json`. Label evidence-based inputs vs product assumptions in docs.

## E. Personalization
Level 1: client-type priors (CPI). Level 2: stated prefs (breath vs body vs cognitive; duration). Level 3: personal response graph (completion, rating, ignore, proximal outcome). Never confuse population prior with individual posterior.

## F. Context & Moments
Calendar-first situation object + travel/tz + available gap. High-value moments (aligned CPI): pre-pitch/T-30/T-10, live blank, post-rejection, post-conflict, hiring/firing day, meeting-streak gap, T-sleep / 1am spiral, pre-flight, post-landing, midday crash, demo day, runway scare (supportive micro only). Maps: `06_scenarios/`.

## G. Sequences / Protocol graph
State → intervention → expected next state → follow-up or next card. Prefer short chains (e.g., affect-label → exhale sigh → if–then). Avoid stacking into sessions that recreate “full workout.” See `07_sequences/`.

## H. Message Engine
`[Observed context] + [Why now] + [One action] + [Duration] + [Skip]`. Cap unsolicited pushes. Silence policy = default when receptivity low or score below threshold. No guilt, no fake HRV-anxiety claims, no LoA metaphysics as science. `08_messaging/`.

## I. Closed loop & personal graph
Sense → interpret (uncertain) → decide (incl. silence) → intervene → measure proximal → learn. Log decision_id, candidates, exclusions, selected, completion, rating, optional wearable deltas **with source_class**. Personal response profile feeds w5/w6/w9. `09_learning/`.

## J. Safety layer
Hard excludes; crisis language → escalation resources (not breath playbooks); CBT-I sleep restriction clinician-only; NSDR ≠ sleep; caution protocols screened; safety-critical roles (pilot/surgeon) → no “hack through deprivation.” `10_safety/`.

## K. System architecture
Ingest → state fusion → decision service → ranker → message/staff console → outcome store → (later) bandit. Mermaid + components: `11_architecture/`. LLM optional for **wording only** after ID chosen.

## L. MVP roadmap
V1 staff top-3 picker → V2 calendar+silence policy → V3 sleep/travel modules → V4 outcome learning → V5 cautious bandits/predictive. `12_mvp/`.

## M. Test cases
≥100 realistic cases across founder/CEO/traveler/athlete/consultant/physician/lawyer/etc. Ambiguous cases marked. `13_test_cases/`.

## N. Landscape
JITAI/MRT lineage; wearables; Calm/Headspace; AMS; gaps = UHNW staff-in-loop + protocol selection graph + honest uncertainty. `14_landscape/`.

## O. Novelty & IP (non-legal)
Commodity: meditation content, generic HRV biofeedback UX.  
Defensible angles: decision graphs for UHNW moments + staff console workflow + privacy multiparty access + MRT harness + travel-circuit priors + hybrid explainable ranker tied to evidence-graded catalog. Hard problems ranked in `15_ip_novelty/`.

## P. Sources
`16_sources/SOURCES.md` + parent library `15_SOURCES.md` + HPOS/CPI source packs.

## Q. Honesty line (product copy)
Useful closeness on schedule/travel/sleep-timing/pre-stakes micro-protocols. **Cannot** claim continuous emotional omniscience or medical treatment. Win = right small help, often silence, trusted brand.

## R. Build first (single slice)
**Staff console: Top-3 protocol picker** given `(client_type, available_minutes, place_class, upcoming_event_tag, stress_1to5, energy_1to5, sleep_h_last_night?)` → ranked IDs + one-line rationale + SILENCE option → log outcomes. No autonomous spam. Reuses catalog + score_spec + decision filters.

---

*Ranking score = engineering heuristic. Not peer-reviewed as a composite clinical instrument.*
