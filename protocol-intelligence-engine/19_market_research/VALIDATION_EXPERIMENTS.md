# VALIDATION_EXPERIMENTS — PIE

**Date:** 2026-09-19 Asia/Calcutta  
**Purpose:** Replace “this will work” with falsifiable tests for demand, WTP, context value, and workflow fit. India Phase-1 non-medical.

---

## Design rules

1. Prefer **paid** pilots over free forever.  
2. Pre-register success thresholds.  
3. Separate **evidence** collected from **interpretation**.  
4. No fake sensor data.  
5. Stop rules: if falsified, kill or pivot wedge — don’t “add features.”

---

## Exp-A — Problem interview sprint (S1/S2)

| | |
|--|--|
| **Hypothesis** | Staff feel handoff/inconsistency pain ≥ weekly |
| **Method** | 20 interviews (10 retreat, 10 FO/lifestyle); JTBD switch format |
| **Time** | 2 weeks |
| **Success** | ≥12/20 describe a concrete failure in last 30 days they’d pay to avoid |
| **Fail** | Pain is rare or only “nice to have AI” |
| **Cost** | Founder time |

**Script anchors:** last bad protocol choice; WhatsApp notes failure; silence moments; budget owner.

---

## Exp-B — WTP / pricing (Van Westendorp + offer)

| | |
|--|--|
| **Hypothesis** | Property ACV ≥ $18k is acceptable to ≥25% of ICP champions |
| **Method** | After demo, 4-price VW questions; then real offer $999/mo pilot credit |
| **n** | ≥15 champions |
| **Success** | ≥4 paid pilots booked OR ≥5 verbal yes at ≥$1,500/mo with timeline |
| **Fail** | Ceiling price <$400/mo for full Property SKU |
| **Note** | Verbal ≠ WTP; prioritize payment |

---

## Exp-C — Context-awareness demand test

| | |
|--|--|
| **Hypothesis** | Filling event/place/minutes changes staff selection ≥30% vs state-only |
| **Method** | Within-subject: 20 scenarios × 8 staff; A = stress/energy only; B = +context tags |
| **Metric** | % Top-1 change; staff preference Likert; time-to-decide |
| **Success** | ≥30% Top-1 change **and** ≥6/8 staff say B is worth the data entry |
| **Fail** | Changes <10% or staff hate tagging |
| **Implication** | If fail, delay calendar integrations (keep stubs) |

---

## Exp-D — Silence acceptance

| | |
|--|--|
| **Hypothesis** | Staff select SILENCE in ≥10% of live recommendations when appropriate |
| **Method** | 6-week pilot; log silence rate; review with director |
| **Success** | Silence used; director agrees ≥50% of silences were correct in audit sample |
| **Fail** | Silence never used (upsell culture) or overused (tool distrust) |

---

## Exp-E — Outcome logging flywheel

| | |
|--|--|
| **Hypothesis** | Staff will rate ≥40% of delivered protocols for 4 consecutive weeks |
| **Method** | Pilot KPI; daily reminder in UI; no guest spam |
| **Success** | Threshold met; mean rating variance not collapsed to all-5s |
| **Fail** | <20% log rate by week 3 → redesign UX or incentives |

---

## Exp-F — Response graph lift (Phase 2 scientific)

| | |
|--|--|
| **Hypothesis** | After N≥5 outcomes on a client, graph-aware rank yields higher next rating than catalog-only |
| **Method** | A/B or stepped-wedge on clients with enough history; pre-register |
| **Success** | Statistically meaningful lift **or** large practical effect with n caveat |
| **Fail** | No lift → graph is storytelling only; keep as history UX not rank fuel |
| **Honesty** | Not clinical efficacy; proximal satisfaction only |

---

## Exp-G — Substitute teardown

| | |
|--|--|
| **Hypothesis** | PIE beats WhatsApp+notes on handoff task |
| **Method** | Two staff sequential care for same simulated guest; measure info loss |
| **Success** | Receiving staff errors ↓ ≥50% with PIE history vs WhatsApp export |
| **Fail** | No difference → strengthen history UX or kill desk wedge |

---

## Exp-H — Regulatory copy stress test

| | |
|--|--|
| **Hypothesis** | Current UI copy stays non-MDSW under counsel review |
| **Method** | Independent India health-tech counsel review + CDSCO MDSW guidance checklist (2026) |
| **Success** | Written opinion: wellness/fitness decision support for staff, no medical purpose |
| **Fail** | Must rewrite claims / remove crisis “triage” language / add clinician gates |

---

## Exp-I — Brand expansion smoke

| | |
|--|--|
| **Hypothesis** | After 1 property success, 2nd property in brand adopts with <50% sales effort |
| **Method** | Track internal referral |
| **Success** | Second site live in <60 days from intro |
| **Fail** | Every site is full re-sale → brand wedge weak |

---

## Exp-J — UHNW principal tolerance (optional, careful)

| | |
|--|--|
| **Hypothesis** | Principals accept staff using AI assist if human delivers |
| **Method** | 10 principal or EA interviews; no live autonomous messaging |
| **Success** | ≥7/10 OK with staff-copilot framing |
| **Fail** | Majority reject any AI → position as “rules engine / checklist” not AI |

---

## Critical product questions (master list)

1. Who is the economic buyer for wedge A vs B?  
2. Minimum feature set for paid pilot?  
3. Does soft golden correlate with staff trust?  
4. Context worth integration cost? (Exp-C)  
5. Silence compatible with spa upsell culture?  
6. Outcome rating quality usable for learning?  
7. Private catalog or public 50 enough?  
8. On-prem demand frequency?  
9. Hindi/vernacular necessity?  
10. What single metric renews the contract?  

---

## Sequence (recommended)

Week 1–2: Exp-A  
Week 2–3: Exp-B + demos  
Week 3–4: Exp-C lab  
Week 5–10: Paid pilots → Exp-D, E  
Parallel: Exp-H counsel  
Post-pilot: Exp-F, G, I  

---

## Kill criteria (portfolio)

| If this fails… | Then… |
|----------------|-------|
| Exp-A | Revisit ICP; consider Wedge D only |
| Exp-B | Drop Property price or move to services-heavy |
| Exp-C | Do not build calendar; sell manual tags |
| Exp-E | No flywheel story to investors |
| Exp-H | Freeze GTM until copy fixed |
